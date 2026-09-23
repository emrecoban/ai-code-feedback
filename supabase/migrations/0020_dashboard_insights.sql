-- Dashboard insights. Everything the dashboard reads now follows one date
-- range -- the filter row at the top of the page -- and several new views
-- are built on data the extension already collects: students who need
-- attention, the full explanation behind a question, the weekly
-- independence trend, the concepts and errors students struggle with most,
-- when they work, system health, whether their confidence holds up, and a
-- multi-sheet export. No new instrumentation; read-only except the export,
-- which is written to the audit log.

-- ============ Range helpers ============

-- The viewer picks whole days in their own time zone; p_from = null means
-- "since the first student joined". Ranges end today at the latest.
-- Buckets: hourly for one or two days, daily up to four months, weekly
-- beyond that, so a chart never has more than ~120 columns.
create or replace function dashboard.resolve_range(
  p_from date, p_to date, p_tz text,
  out tz text, out from_day date, out to_day date,
  out from_ts timestamptz, out to_ts timestamptz, out prev_from_ts timestamptz,
  out bucket text
) language plpgsql stable security definer set search_path = '' as $$
declare
  v_today date;
begin
  tz := dashboard.safe_tz(p_tz);
  v_today := (now() at time zone tz)::date;
  to_day := least(coalesce(p_to, v_today), v_today);
  from_day := coalesce(
    p_from,
    (select min((created_at at time zone tz)::date) from public.profiles),
    to_day
  );
  if from_day > to_day then
    from_day := to_day;
  end if;
  if to_day - from_day > 3660 then
    from_day := to_day - 3660;
  end if;
  from_ts := from_day::timestamp at time zone tz;
  to_ts := (to_day + 1)::timestamp at time zone tz;
  -- The period of the same length just before, for "vs previous" figures.
  prev_from_ts := (from_day - (to_day - from_day + 1))::timestamp at time zone tz;
  bucket := case
    when to_day - from_day < 2 then 'hour'
    when to_day - from_day < 120 then 'day'
    else 'week'
  end;
end;
$$;

-- Every bucket in the range, as the labels dashboard.slot_label produces:
-- 'YYYY-MM-DD"T"HH24:00' for hours, the date for days, and the Monday for weeks.
create or replace function dashboard.slot_labels(p_from date, p_to date, p_bucket text)
returns setof text language sql immutable set search_path = '' as $$
  select to_char(t, case p_bucket when 'hour' then 'YYYY-MM-DD"T"HH24:00' else 'YYYY-MM-DD' end)
  from generate_series(
    case p_bucket when 'week' then date_trunc('week', p_from::timestamp) else p_from::timestamp end,
    case p_bucket when 'hour' then p_to::timestamp + interval '23 hours' else p_to::timestamp end,
    case p_bucket when 'hour' then interval '1 hour' when 'week' then interval '7 days' else interval '1 day' end
  ) as t;
$$;

create or replace function dashboard.slot_label(p_ts timestamptz, p_tz text, p_bucket text)
returns text language sql stable set search_path = '' as $$
  select to_char(
    date_trunc(case p_bucket when 'hour' then 'hour' when 'week' then 'week' else 'day' end, p_ts at time zone p_tz),
    case p_bucket when 'hour' then 'YYYY-MM-DD"T"HH24:00' else 'YYYY-MM-DD' end
  );
$$;

-- Newest trace of a student anywhere: a session heartbeat, a question or
-- a research event.
create or replace function dashboard.last_active(p_user uuid)
returns timestamptz language sql stable security definer set search_path = '' as $$
  select greatest(
    (select max(greatest(started_at, last_seen_at)) from public.coding_sessions where user_id = p_user),
    (select max(created_at) from public.interactions where user_id = p_user),
    (select max(server_ts) from public.events where user_id = p_user)
  );
$$;

-- ============ Building blocks ============

-- Students worth a closer look in the period. Every reason is a plain,
-- explainable rule rather than a score, so the dashboard can say why.
create or replace function dashboard.attention(p_from timestamptz, p_to timestamptz)
returns json language sql stable security definer set search_path = '' as $$
  select coalesce(json_agg(a order by cardinality(a.reasons) desc, a.last_active desc nulls last), '[]'::json)
  from (
    select p.id as user_id,
           p.username,
           la.at as last_active,
           array_remove(array[
             -- Asked about the same error three times or more.
             case when st.max_repeat >= 2 then 'repeat_error' end,
             -- Said they were still stuck after an explanation.
             case when st.still_stuck > 0 then 'still_stuck' end,
             -- Needed the full fix for most questions (5+ questions, 70%+).
             case when st.questions >= 5 and st.fix >= 0.7 * st.questions then 'needs_fix' end,
             -- Kept trying for a long time before asking (8+ edits on average).
             case when st.with_edits >= 2 and st.avg_edits >= 8 then 'many_attempts' end,
             -- Rated two or more explanations as not helpful.
             case when st.unhelpful >= 2 then 'unhelpful' end,
             -- Has used the extension, but not in the last 7 days.
             case when la.at < now() - interval '7 days' then 'inactive' end
           ], null) as reasons,
           json_build_object(
             'repeat', st.max_repeat + 1,
             'still_stuck', st.still_stuck,
             'fix', st.fix,
             'questions', st.questions,
             'avg_edits', round(st.avg_edits, 1),
             'unhelpful', st.unhelpful,
             'days_inactive', floor(extract(epoch from now() - la.at) / 86400)
           ) as counts
    from public.profiles p
    cross join lateral (select dashboard.last_active(p.id) as at) la
    cross join lateral (
      select count(*) as questions,
             coalesce(max(recurring_error_count), 0) as max_repeat,
             count(*) filter (where self_reported_outcome = 'still_stuck') as still_stuck,
             count(*) filter (where max_level_reached >= 3) as fix,
             count(edits_before_ask) as with_edits,
             coalesce(avg(edits_before_ask), 0) as avg_edits,
             count(*) filter (where helpful_rating = -1) as unhelpful
      from public.interactions i
      where i.user_id = p.id and i.created_at >= p_from and i.created_at < p_to
    ) st
  ) a
  where cardinality(a.reasons) > 0;
$$;

-- Is a student (or, with p_user_id null, the whole class) getting more
-- independent? Twelve weeks ending with the week of p_to. The two rates
-- are the study's own measures (supabase/analytics/dependency_trend.sql):
-- how often an offered error was asked about, and how often the first
-- hint was enough.
create or replace function dashboard.weekly_trend(p_user_id uuid, p_to date, p_tz text)
returns json language sql stable security definer set search_path = '' as $$
  with bounds as (
    select date_trunc('week', p_to::timestamp) - interval '11 weeks' as first_week,
           date_trunc('week', p_to::timestamp) as last_week
  ),
  weeks as (
    select generate_series(b.first_week, b.last_week, interval '7 days')::date as week from bounds b
  ),
  s as (
    select date_trunc('week', started_at at time zone p_tz)::date as week,
           sum(diagnostics_offered) as offers,
           sum(errors_resolved_without_asking) as fixed_unaided
    from public.coding_sessions, bounds b
    where (p_user_id is null or user_id = p_user_id)
      and started_at >= b.first_week at time zone p_tz
      and started_at < (b.last_week + interval '7 days') at time zone p_tz
    group by 1
  ),
  q as (
    select date_trunc('week', created_at at time zone p_tz)::date as week,
           count(*) as questions,
           count(*) filter (where trigger_source = 'diagnostic') as from_errors,
           count(*) filter (where max_level_reached <= 1) as hint_enough
    from public.interactions, bounds b
    where (p_user_id is null or user_id = p_user_id)
      and created_at >= b.first_week at time zone p_tz
      and created_at < (b.last_week + interval '7 days') at time zone p_tz
    group by 1
  )
  select json_agg(json_build_object(
           'week', w.week,
           'questions', coalesce(q.questions, 0),
           'from_errors', coalesce(q.from_errors, 0),
           'help_offers', coalesce(s.offers, 0),
           'fixed_unaided', coalesce(s.fixed_unaided, 0),
           -- Capped: a lightbulb request past the per-file offer limit is a
           -- question without a counted offer. (least() skips nulls, so the
           -- no-offers case needs its own branch.)
           'pct_offers_taken', case when s.offers > 0
                                    then least(100, round(100.0 * coalesce(q.from_errors, 0) / s.offers, 1)) end,
           'pct_hint_enough', round(100.0 * q.hint_enough / nullif(q.questions, 0), 1)
         ) order by w.week)
  from weeks w
  left join s on s.week = w.week
  left join q on q.week = w.week;
$$;

-- One row per student for the list and the export; activity figures cover
-- the period, identity and last activity do not.
create or replace function dashboard.students_json(p_from timestamptz, p_to timestamptz, p_tz text)
returns json language sql stable security definer set search_path = '' as $$
  select coalesce(json_agg(x order by x.last_active desc nulls last, x.username), '[]'::json)
  from (
    select p.id as user_id,
           p.username,
           p.created_at,
           p.consent_status,
           p.feedback_language,
           latest.extension_version,
           dashboard.last_active(p.id) as last_active,
           (select count(*) from public.interactions where user_id = p.id) as questions_total,
           coalesce(s.sessions, 0) as sessions,
           coalesce(s.active_days, 0) as active_days,
           coalesce(s.active_seconds, 0) as active_seconds,
           coalesce(s.lines_written, 0) as lines_written,
           coalesce(s.lines_deleted, 0) as lines_deleted,
           coalesce(s.fixed_unaided, 0) as fixed_unaided,
           coalesce(s.help_offers, 0) as help_offers,
           coalesce(i.questions, 0) as questions,
           coalesce(i.solved_alone, 0) as solved_alone,
           coalesce(i.helpful_up, 0) as helpful_up,
           coalesce(i.helpful_down, 0) as helpful_down
    from public.profiles p
    left join lateral (
      select extension_version from public.coding_sessions
      where user_id = p.id order by started_at desc limit 1
    ) latest on true
    left join lateral (
      select count(*) as sessions,
             count(distinct (started_at at time zone p_tz)::date) as active_days,
             sum(active_seconds) as active_seconds,
             sum(lines_written) as lines_written,
             sum(lines_deleted) as lines_deleted,
             sum(errors_resolved_without_asking) as fixed_unaided,
             sum(diagnostics_offered) as help_offers
      from public.coding_sessions
      where user_id = p.id and started_at >= p_from and started_at < p_to
    ) s on true
    left join lateral (
      select count(*) as questions,
             count(*) filter (where max_level_reached <= 1) as solved_alone,
             count(*) filter (where helpful_rating = 1) as helpful_up,
             count(*) filter (where helpful_rating = -1) as helpful_down
      from public.interactions
      where user_id = p.id and created_at >= p_from and created_at < p_to
    ) i on true
  ) x;
$$;

revoke all on all functions in schema dashboard from public, anon, authenticated;

-- ============ Overview ============

drop function if exists public.dashboard_overview(text, text);

create or replace function public.dashboard_overview(p_token text, p_from date, p_to date, p_tz text)
returns json language plpgsql stable security definer set search_path = '' as $$
declare
  r record;
begin
  perform dashboard.require_session(p_token);
  select * into r from dashboard.resolve_range(p_from, p_to, p_tz);

  return (
    with q as (
      select * from public.interactions where created_at >= r.from_ts and created_at < r.to_ts
    ),
    s as (
      select * from public.coding_sessions where started_at >= r.from_ts and started_at < r.to_ts
    ),
    traces as (
      select user_id, started_at as at from public.coding_sessions
      where started_at >= r.from_ts and started_at < r.to_ts
      union all
      select user_id, last_seen_at from public.coding_sessions
      where last_seen_at >= r.from_ts and last_seen_at < r.to_ts
      union all
      select user_id, created_at from q
      union all
      select user_id, server_ts from public.events
      where server_ts >= r.from_ts and server_ts < r.to_ts
    ),
    -- Always "now", whatever the range: the extension heartbeats every 3
    -- minutes while the editor is in use.
    online as (
      select user_id from public.coding_sessions
      where last_seen_at >= now() - interval '10 minutes' or started_at >= now() - interval '10 minutes'
      union
      select user_id from public.interactions where created_at >= now() - interval '10 minutes'
      union
      select user_id from public.events where server_ts >= now() - interval '10 minutes'
    )
    select json_build_object(
      'generated_at', now(),
      'range', json_build_object('from', r.from_day, 'to', r.to_day, 'bucket', r.bucket),
      'students_total', (select count(*) from public.profiles),
      'online_now', (select count(*) from online),
      'active_students', (select count(distinct user_id) from traces),
      'new_students', (select count(*) from public.profiles where created_at >= r.from_ts and created_at < r.to_ts),
      'questions', (select count(*) from q),
      'questions_previous', (select count(*) from public.interactions
                             where created_at >= r.prev_from_ts and created_at < r.from_ts),
      'active_seconds', (select coalesce(sum(active_seconds), 0) from s),
      'levels', json_build_object(
        'hint', (select count(*) from q where max_level_reached <= 1),
        'rule', (select count(*) from q where max_level_reached = 2),
        'fix',  (select count(*) from q where max_level_reached >= 3)
      ),
      'helpful_up', (select count(*) from q where helpful_rating = 1),
      'helpful_down', (select count(*) from q where helpful_rating = -1),
      'fixed_unaided', (select coalesce(sum(errors_resolved_without_asking), 0) from s),
      'avg_latency_ms', (select round(avg(latency_ms)) from q where latency_ms is not null),
      'failed_requests', (select count(*) from public.events
                          where event_type = 'request_failed' and server_ts >= r.from_ts and server_ts < r.to_ts),
      'series', (
        select json_agg(json_build_object(
                 'slot', l.slot,
                 'questions', coalesce(qc.n, 0),
                 'students', coalesce(tc.n, 0)
               ) order by l.slot)
        from dashboard.slot_labels(r.from_day, r.to_day, r.bucket) as l(slot)
        left join (
          select dashboard.slot_label(created_at, r.tz, r.bucket) as slot, count(*) as n from q group by 1
        ) qc on qc.slot = l.slot
        left join (
          select dashboard.slot_label(at, r.tz, r.bucket) as slot, count(distinct user_id) as n from traces group by 1
        ) tc on tc.slot = l.slot
      ),
      'attention', dashboard.attention(r.from_ts, r.to_ts),
      'recent', coalesce((
        select json_agg(x order by x.created_at desc)
        from (
          select q.id, q.user_id, p.username, q.created_at, q.title, q.trigger_source,
                 q.question_type, q.max_level_reached, q.file_name
          from q join public.profiles p on p.id = q.user_id
          order by q.created_at desc
          limit 8
        ) x
      ), '[]'::json)
    )
  );
end;
$$;

-- ============ Students ============

drop function if exists public.dashboard_students(text, text);

create or replace function public.dashboard_students(p_token text, p_from date, p_to date, p_tz text)
returns json language plpgsql stable security definer set search_path = '' as $$
declare
  r record;
begin
  perform dashboard.require_session(p_token);
  select * into r from dashboard.resolve_range(p_from, p_to, p_tz);
  return dashboard.students_json(r.from_ts, r.to_ts, r.tz);
end;
$$;

drop function if exists public.dashboard_student_detail(text, uuid, text);

create or replace function public.dashboard_student_detail(p_token text, p_user_id uuid, p_from date, p_to date, p_tz text)
returns json language plpgsql stable security definer set search_path = '' as $$
declare
  r record;
begin
  perform dashboard.require_session(p_token);
  select * into r from dashboard.resolve_range(p_from, p_to, p_tz);

  if not exists (select 1 from public.profiles where id = p_user_id) then
    raise exception 'Student not found' using errcode = 'P0002';
  end if;

  return (
    with q as (
      select * from public.interactions
      where user_id = p_user_id and created_at >= r.from_ts and created_at < r.to_ts
    ),
    cs as (
      select * from public.coding_sessions
      where user_id = p_user_id and started_at >= r.from_ts and started_at < r.to_ts
    )
    select json_build_object(
      'range', json_build_object('from', r.from_day, 'to', r.to_day, 'bucket', r.bucket),
      'profile', (
        select json_build_object(
          'user_id', p.id,
          'username', p.username,
          'created_at', p.created_at,
          'first_login_at', p.first_login_at,
          'consent_status', p.consent_status,
          'consent_at', p.consent_at,
          'feedback_language', p.feedback_language,
          'ui_language', p.ui_language
        )
        from public.profiles p where p.id = p_user_id
      ),
      'last_active', dashboard.last_active(p_user_id),
      'last_session', (
        select json_build_object(
          'started_at', started_at,
          'last_seen_at', last_seen_at,
          'extension_version', extension_version,
          'vscode_version', vscode_version,
          'os', os
        )
        from public.coding_sessions where user_id = p_user_id
        order by started_at desc limit 1
      ),
      'activity', (
        select json_build_object(
          'sessions', count(*),
          'active_days', count(distinct (started_at at time zone r.tz)::date),
          'active_seconds', coalesce(sum(active_seconds), 0),
          'lines_written', coalesce(sum(lines_written), 0),
          'lines_deleted', coalesce(sum(lines_deleted), 0),
          'files_created', coalesce(sum(files_created), 0),
          'saves', coalesce(sum(save_count), 0),
          'debug_runs', coalesce(sum(debug_session_count), 0),
          'task_runs', coalesce(sum(task_run_count), 0),
          'large_pastes', coalesce(sum(large_paste_count), 0),
          'focus_losses', coalesce(sum(focus_loss_count), 0),
          'help_offers', coalesce(sum(diagnostics_offered), 0),
          'fixed_unaided', coalesce(sum(errors_resolved_without_asking), 0),
          'follow_on_errors', coalesce(sum(follow_on_error_count), 0)
        )
        from cs
      ),
      'help', (
        select json_build_object(
          'questions', count(*),
          'from_errors', count(*) filter (where trigger_source = 'diagnostic'),
          'from_selection', count(*) filter (where trigger_source = 'selection'),
          'hint', count(*) filter (where max_level_reached <= 1),
          'rule', count(*) filter (where max_level_reached = 2),
          'fix',  count(*) filter (where max_level_reached >= 3),
          'repeat_errors', count(*) filter (where recurring_error_count > 0),
          'avg_edits_before_ask', round(avg(edits_before_ask), 1),
          'helpful_up', count(*) filter (where helpful_rating = 1),
          'helpful_down', count(*) filter (where helpful_rating = -1),
          'solved', count(*) filter (where self_reported_outcome = 'solved'),
          'still_stuck', count(*) filter (where self_reported_outcome = 'still_stuck'),
          'confident_yes', count(*) filter (where post_confidence = 'yes'),
          'confident_maybe', count(*) filter (where post_confidence = 'maybe'),
          'confident_no', count(*) filter (where post_confidence = 'no')
        )
        from q
      ),
      'series', (
        select json_agg(json_build_object(
                 'slot', l.slot,
                 'questions', coalesce(qc.n, 0),
                 'minutes', round(coalesce(mc.minutes, 0))
               ) order by l.slot)
        from dashboard.slot_labels(r.from_day, r.to_day, r.bucket) as l(slot)
        left join (
          select dashboard.slot_label(created_at, r.tz, r.bucket) as slot, count(*) as n from q group by 1
        ) qc on qc.slot = l.slot
        left join (
          select dashboard.slot_label(started_at, r.tz, r.bucket) as slot, sum(active_seconds) / 60.0 as minutes
          from cs group by 1
        ) mc on mc.slot = l.slot
      ),
      'languages', coalesce((
        select json_agg(l order by l.edits desc)
        from (
          select lc.key as language, sum(lc.value::numeric) as edits
          from cs, jsonb_each_text(cs.language_counts) lc
          group by lc.key
          order by 2 desc
          limit 6
        ) l
      ), '[]'::json),
      'concepts', coalesce((
        select json_agg(c order by c.count desc)
        from (
          select min(concept) as concept, count(*) as count
          from q
          where nullif(trim(concept), '') is not null
          group by lower(trim(concept))
          order by 2 desc, 1
          limit 5
        ) c
      ), '[]'::json),
      'summary', (
        select json_build_object(
          'student_summary', lp.student_summary,
          'suggested_practice', lp.suggested_practice,
          'generated_at', lp.summary_generated_at
        )
        from public.learner_profiles lp where lp.user_id = p_user_id
      ),
      'trend', dashboard.weekly_trend(p_user_id, r.to_day, r.tz),
      'recent', coalesce((
        select json_agg(x order by x.created_at desc)
        from (
          select id, created_at, title, file_name, trigger_source, question_type,
                 max_level_reached, helpful_rating, self_reported_outcome
          from q
          order by created_at desc
          limit 20
        ) x
      ), '[]'::json)
    )
  );
end;
$$;

-- ============ One question, in full ============

create or replace function public.dashboard_question(p_token text, p_id uuid)
returns json language plpgsql stable security definer set search_path = '' as $$
declare
  v_result json;
begin
  perform dashboard.require_session(p_token);

  select json_build_object(
           'id', i.id,
           'user_id', i.user_id,
           'username', p.username,
           'created_at', i.created_at,
           'title', i.title,
           'concept', i.concept,
           'trigger_source', i.trigger_source,
           'trigger_surface', i.trigger_surface,
           'question_type', i.question_type,
           'free_text', i.free_text,
           'file_name', i.file_name,
           'error_message', i.error_signature,
           'error_source', i.error_source,
           'error_code', i.error_code,
           'error_severity', i.error_severity,
           'selection_line_count', i.selection_line_count,
           'help_latency_ms', i.help_latency_ms,
           'edits_before_ask', i.edits_before_ask,
           'recurring_error_count', i.recurring_error_count,
           'recurring_concept_count', i.recurring_concept_count,
           'max_level_reached', i.max_level_reached,
           'helpful_rating', i.helpful_rating,
           'self_reported_outcome', i.self_reported_outcome,
           'post_confidence', i.post_confidence,
           'cache_hit', i.cache_hit,
           'model_used', i.model_used,
           'latency_ms', i.latency_ms,
           'prompt_tokens', i.prompt_tokens,
           'completion_tokens', i.completion_tokens,
           'ladder', i.ladder_payload,
           'events', coalesce((
             select json_agg(json_build_object('type', e.event_type, 'at', e.server_ts, 'payload', e.payload)
                             order by e.server_ts)
             from public.events e where e.interaction_id = i.id
           ), '[]'::json)
         )
  into v_result
  from public.interactions i
  join public.profiles p on p.id = i.user_id
  where i.id = p_id;

  if v_result is null then
    raise exception 'Question not found' using errcode = 'P0002';
  end if;
  return v_result;
end;
$$;

-- ============ Insights (class-wide) ============

create or replace function public.dashboard_insights(p_token text, p_from date, p_to date, p_tz text)
returns json language plpgsql stable security definer set search_path = '' as $$
declare
  r record;
begin
  perform dashboard.require_session(p_token);
  select * into r from dashboard.resolve_range(p_from, p_to, p_tz);

  return (
    with q as (
      select * from public.interactions where created_at >= r.from_ts and created_at < r.to_ts
    ),
    s as (
      select * from public.coding_sessions where started_at >= r.from_ts and started_at < r.to_ts
    ),
    failures as (
      select * from public.events
      where event_type = 'request_failed' and server_ts >= r.from_ts and server_ts < r.to_ts
    )
    select json_build_object(
      'range', json_build_object('from', r.from_day, 'to', r.to_day, 'bucket', r.bucket),
      'trend', dashboard.weekly_trend(null, r.to_day, r.tz),

      -- Concepts are short model-written phrases; grouped case-insensitively.
      'concepts', coalesce((
        select json_agg(c order by c.questions desc, c.concept)
        from (
          select min(trim(concept)) as concept,
                 count(*) as questions,
                 count(distinct user_id) as students,
                 count(*) filter (where max_level_reached >= 3) as fix
          from q
          where nullif(trim(concept), '') is not null
          group by lower(trim(concept))
          order by 2 desc, 1
          limit 12
        ) c
      ), '[]'::json),

      -- Errors by the linter's own code when there is one, otherwise by the
      -- normalized message (the same key the explanation cache uses).
      'errors', coalesce((
        select json_agg(e order by e.questions desc, e.label)
        from (
          select bool_or(k.has_code) as has_code,
                 left(min(k.label), 160) as label,
                 left(min(k.message), 240) as message,
                 count(*) as questions,
                 count(distinct k.user_id) as students,
                 count(*) filter (where k.max_level_reached >= 3) as fix
          from (
            select coalesce(nullif(concat_ws(' ', error_source, error_code), ''), error_signature_normalized) as key,
                   concat_ws(' ', error_source, error_code) <> '' as has_code,
                   coalesce(nullif(concat_ws(' ', error_source, error_code), ''), error_signature) as label,
                   error_signature as message,
                   user_id,
                   max_level_reached
            from q
          ) k
          where k.key is not null
          group by k.key
          order by count(*) desc
          limit 12
        ) e
      ), '[]'::json),

      -- [ISO weekday 1-7 (Mon-Sun), hour 0-23, count] in the viewer's zone.
      'rhythm', json_build_object(
        'questions', coalesce((
          select json_agg(json_build_array(d, h, n))
          from (
            select extract(isodow from created_at at time zone r.tz)::int as d,
                   extract(hour from created_at at time zone r.tz)::int as h,
                   count(*) as n
            from q group by 1, 2
          ) x
        ), '[]'::json),
        'sessions', coalesce((
          select json_agg(json_build_array(d, h, n))
          from (
            select extract(isodow from started_at at time zone r.tz)::int as d,
                   extract(hour from started_at at time zone r.tz)::int as h,
                   count(*) as n
            from s group by 1, 2
          ) x
        ), '[]'::json)
      ),

      'health', json_build_object(
        'questions', (select count(*) from q),
        'cache_hits', (select count(*) from q where cache_hit),
        'prompt_tokens', (select coalesce(sum(prompt_tokens), 0) from q),
        'completion_tokens', (select coalesce(sum(completion_tokens), 0) from q),
        'failures', (select count(*) from failures),
        'latency_avg', (select round(avg(latency_ms)) from q where latency_ms is not null),
        'latency_p50', (select round(percentile_cont(0.5) within group (order by latency_ms)) from q where latency_ms is not null),
        'latency_p95', (select round(percentile_cont(0.95) within group (order by latency_ms)) from q where latency_ms is not null),
        'models', coalesce((
          select json_agg(m order by m.questions desc)
          from (
            select coalesce(model_used, 'unknown') as model,
                   count(*) as questions,
                   coalesce(sum(prompt_tokens), 0) + coalesce(sum(completion_tokens), 0) as tokens,
                   count(*) filter (where cache_hit) as cache_hits
            from q group by 1
          ) m
        ), '[]'::json),
        'series', (
          select json_agg(json_build_object(
                   'slot', l.slot,
                   'prompt_tokens', coalesce(t.prompt_tokens, 0),
                   'completion_tokens', coalesce(t.completion_tokens, 0),
                   'questions', coalesce(t.questions, 0),
                   'failures', coalesce(f.n, 0)
                 ) order by l.slot)
          from dashboard.slot_labels(r.from_day, r.to_day, r.bucket) as l(slot)
          left join (
            select dashboard.slot_label(created_at, r.tz, r.bucket) as slot,
                   coalesce(sum(prompt_tokens), 0) as prompt_tokens,
                   coalesce(sum(completion_tokens), 0) as completion_tokens,
                   count(*) as questions
            from q group by 1
          ) t on t.slot = l.slot
          left join (
            select dashboard.slot_label(server_ts, r.tz, r.bucket) as slot, count(*) as n
            from failures group by 1
          ) f on f.slot = l.slot
        )
      ),

      -- Calibration: after answering "could you do this yourself now?",
      -- did the student come back with the same error or concept later?
      'calibration', coalesce((
        select json_agg(json_build_object('answer', c.answer, 'total', c.total, 'asked_again', c.asked_again)
                        order by case c.answer when 'yes' then 1 when 'maybe' then 2 else 3 end)
        from (
          select i.post_confidence as answer,
                 count(*) as total,
                 count(*) filter (where exists (
                   select 1 from public.interactions j
                   where j.user_id = i.user_id
                     and j.created_at > i.created_at
                     and (
                       (i.error_signature_normalized is not null
                        and j.error_signature_normalized = i.error_signature_normalized)
                       or (nullif(trim(i.concept), '') is not null
                           and lower(trim(j.concept)) = lower(trim(i.concept)))
                     )
                 )) as asked_again
          from q i
          where i.post_confidence is not null
          group by 1
        ) c
      ), '[]'::json)
    )
  );
end;
$$;

-- ============ Export ============

-- Everything the .xlsx / .csv export writes, for the selected period. The
-- export itself is recorded in the audit log.
create or replace function public.dashboard_export(p_token text, p_from date, p_to date, p_tz text)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_admin uuid := dashboard.require_session(p_token);
  r record;
  v_students json;
  v_questions json;
  v_question_count int;
  v_daily json;
begin
  select * into r from dashboard.resolve_range(p_from, p_to, p_tz);

  v_students := dashboard.students_json(r.from_ts, r.to_ts, r.tz);

  select coalesce(json_agg(x order by x.created_at), '[]'::json), count(*)
  into v_questions, v_question_count
  from (
    select i.created_at,
           p.username,
           i.title,
           i.concept,
           i.question_type,
           i.free_text,
           i.trigger_source,
           i.file_name,
           coalesce(nullif(concat_ws(' ', i.error_source, i.error_code), ''), i.error_signature) as error,
           i.max_level_reached,
           i.helpful_rating,
           i.self_reported_outcome,
           i.post_confidence,
           i.latency_ms,
           i.cache_hit
    from public.interactions i
    join public.profiles p on p.id = i.user_id
    where i.created_at >= r.from_ts and i.created_at < r.to_ts
    order by i.created_at
    limit 50000
  ) x;

  select json_agg(json_build_object(
           'day', d.day,
           'questions', coalesce(q.n, 0),
           'active_students', coalesce(t.n, 0),
           'active_seconds', coalesce(s.seconds, 0)
         ) order by d.day)
  into v_daily
  from (select generate_series(r.from_day, r.to_day, interval '1 day')::date as day) d
  left join (
    select (created_at at time zone r.tz)::date as day, count(*) as n
    from public.interactions where created_at >= r.from_ts and created_at < r.to_ts group by 1
  ) q on q.day = d.day
  left join (
    select (started_at at time zone r.tz)::date as day, sum(active_seconds) as seconds
    from public.coding_sessions where started_at >= r.from_ts and started_at < r.to_ts group by 1
  ) s on s.day = d.day
  left join (
    select (x.at at time zone r.tz)::date as day, count(distinct x.user_id) as n
    from (
      select user_id, started_at as at from public.coding_sessions where started_at >= r.from_ts and started_at < r.to_ts
      union all
      select user_id, last_seen_at from public.coding_sessions where last_seen_at >= r.from_ts and last_seen_at < r.to_ts
      union all
      select user_id, created_at from public.interactions where created_at >= r.from_ts and created_at < r.to_ts
    ) x
    group by 1
  ) t on t.day = d.day;

  perform dashboard.audit(v_admin, 'export', p_details => jsonb_build_object(
    'from', r.from_day, 'to', r.to_day,
    'students', json_array_length(v_students),
    'questions', v_question_count
  ));

  return json_build_object(
    'range', json_build_object('from', r.from_day, 'to', r.to_day),
    'students', v_students,
    'questions', v_questions,
    'daily', coalesce(v_daily, '[]'::json)
  );
end;
$$;

-- ============ Grants ============

revoke all on function public.dashboard_overview(text, date, date, text) from public;
revoke all on function public.dashboard_students(text, date, date, text) from public;
revoke all on function public.dashboard_student_detail(text, uuid, date, date, text) from public;
revoke all on function public.dashboard_question(text, uuid) from public;
revoke all on function public.dashboard_insights(text, date, date, text) from public;
revoke all on function public.dashboard_export(text, date, date, text) from public;

grant execute on function public.dashboard_overview(text, date, date, text) to anon, authenticated;
grant execute on function public.dashboard_students(text, date, date, text) to anon, authenticated;
grant execute on function public.dashboard_student_detail(text, uuid, date, date, text) to anon, authenticated;
grant execute on function public.dashboard_question(text, uuid) to anon, authenticated;
grant execute on function public.dashboard_insights(text, date, date, text) to anon, authenticated;
grant execute on function public.dashboard_export(text, date, date, text) to anon, authenticated;
