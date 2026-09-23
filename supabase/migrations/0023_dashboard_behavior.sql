-- Dashboard, third pass: the behavioural data the extension already
-- records but the dashboard did not yet show -- whether errors go away
-- after an explanation, how explanations are read and acted on, what
-- happens before a student asks, how they work, and what the system costs.
-- Read-only; no new instrumentation.

-- Dashboard passwords: 6 characters minimum (was 10).
create or replace function dashboard.password_problem(p_password text)
returns text language sql immutable set search_path = '' as $$
  select case
    when length(coalesce(p_password, '')) < 6 then 'password_too_short'
    when length(p_password) > 128 then 'password_too_long'
  end;
$$;

-- A number from an event payload, or null when the key is missing or not
-- a number (payloads are client-written; a malformed value is skipped,
-- never cast into an error).
create or replace function dashboard.num(p jsonb, k text)
returns numeric language sql immutable set search_path = '' as $$
  select case when jsonb_typeof(p -> k) = 'number' then (p ->> k)::numeric end;
$$;

-- Weekly trend, now with the share of sessions in which the student never
-- asked for help (supabase/analytics/sessions_without_help.sql) -- the
-- other side of the independence question.
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
    select date_trunc('week', cs.started_at at time zone p_tz)::date as week,
           count(*) as sessions,
           count(*) filter (where not exists (select 1 from public.interactions i where i.session_id = cs.id)) as without_help,
           sum(cs.diagnostics_offered) as offers,
           sum(cs.errors_resolved_without_asking) as fixed_unaided
    from public.coding_sessions cs, bounds b
    where (p_user_id is null or cs.user_id = p_user_id)
      and cs.started_at >= b.first_week at time zone p_tz
      and cs.started_at < (b.last_week + interval '7 days') at time zone p_tz
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
           'sessions', coalesce(s.sessions, 0),
           'sessions_without_help', coalesce(s.without_help, 0),
           -- Capped: a lightbulb request past the per-file offer limit is a
           -- question without a counted offer. (least() skips nulls, so the
           -- no-offers case needs its own branch.)
           'pct_offers_taken', case when s.offers > 0
                                    then least(100, round(100.0 * coalesce(q.from_errors, 0) / s.offers, 1)) end,
           'pct_hint_enough', round(100.0 * q.hint_enough / nullif(q.questions, 0), 1),
           'pct_sessions_without_help', round(100.0 * s.without_help / nullif(s.sessions, 0), 1)
         ) order by w.week)
  from weeks w
  left join s on s.week = w.week
  left join q on q.week = w.week;
$$;

revoke all on all functions in schema dashboard from public, anon, authenticated;

-- ============ Overview: + resolution after an explanation, sessions without help ============

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
    ),
    -- Error questions in the period, and whether that error later went
    -- away (the extension reports diagnostic_resolved once per question).
    resolution as (
      select q.id,
             (select dashboard.num(e.payload, 'msToResolution')
              from public.events e
              where e.interaction_id = q.id and e.event_type = 'diagnostic_resolved'
              order by e.server_ts limit 1) as ms,
             exists (select 1 from public.events e
                     where e.interaction_id = q.id and e.event_type = 'diagnostic_resolved') as resolved
      from q where q.trigger_source = 'diagnostic'
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
      'resolution', json_build_object(
        'questions', (select count(*) from resolution),
        'resolved', (select count(*) from resolution where resolved),
        'median_ms', (select round(percentile_cont(0.5) within group (order by ms)::numeric) from resolution where ms is not null)
      ),
      'sessions', json_build_object(
        'total', (select count(*) from s),
        'without_help', (select count(*) from s where not exists (select 1 from public.interactions i where i.session_id = s.id))
      ),
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

-- ============ Behaviour: the whole class, or one student ============

-- Everything below reads data the extension already sends:
--   * per question (events.interaction_id): diagnostic_resolved,
--     explanation_visibility, returned_to_code, level_reached,
--     feedback_abandoned, post_feedback_edit, fix_undone,
--     explanation_reopened, explanation_copied -- counted for the
--     questions asked in the period, whenever the event itself arrived;
--   * per session (no interaction): question_picker_abandoned,
--     run_finished, file_cleared, request_failed, feedback_language_changed
--     -- counted when they arrived;
--   * coding_sessions counters for sessions started in the period.
create or replace function public.dashboard_engagement(
  p_token text, p_from date, p_to date, p_tz text, p_user_id uuid default null
) returns json language plpgsql stable security definer set search_path = '' as $$
declare
  r record;
begin
  perform dashboard.require_session(p_token);
  select * into r from dashboard.resolve_range(p_from, p_to, p_tz);

  return (
    with q as (
      select * from public.interactions
      where created_at >= r.from_ts and created_at < r.to_ts
        and (p_user_id is null or user_id = p_user_id)
    ),
    s as (
      select * from public.coding_sessions
      where started_at >= r.from_ts and started_at < r.to_ts
        and (p_user_id is null or user_id = p_user_id)
    ),
    ev as (
      select e.* from public.events e join q on q.id = e.interaction_id
    ),
    sev as (
      select e.* from public.events e
      where e.interaction_id is null
        and e.server_ts >= r.from_ts and e.server_ts < r.to_ts
        and (p_user_id is null or e.user_id = p_user_id)
    ),
    resolved as (
      select distinct on (interaction_id) interaction_id, dashboard.num(payload, 'msToResolution') as ms
      from ev where event_type = 'diagnostic_resolved'
      order by interaction_id, server_ts
    ),
    diag as (
      -- 1 = the first view only (L0-L1), 2 = opened the rule, 3 = the fix.
      select greatest(least(q.max_level_reached, 3), 1) as level, rs.ms, rs.interaction_id is not null as is_resolved
      from q left join resolved rs on rs.interaction_id = q.id
      where q.trigger_source = 'diagnostic'
    ),
    runs as (
      select e.*,
             exists (
               select 1 from public.interactions i
               where i.session_id = e.session_id
                 and i.created_at <= e.server_ts
                 and i.created_at > e.server_ts - interval '15 minutes'
             ) as after_explanation
      from sev e where e.event_type = 'run_finished'
    )
    select json_build_object(
      'range', json_build_object('from', r.from_day, 'to', r.to_day, 'bucket', r.bucket),

      'resolution', json_build_object(
        'questions', (select count(*) from diag),
        'resolved', (select count(*) from diag where is_resolved),
        'median_ms', (select round(percentile_cont(0.5) within group (order by ms)::numeric) from diag where ms is not null),
        'by_level', coalesce((
          select json_agg(x order by x.level)
          from (
            select level,
                   count(*) as questions,
                   count(*) filter (where is_resolved) as resolved,
                   round(percentile_cont(0.5) within group (order by ms)::numeric) as median_ms
            from diag group by level
          ) x
        ), '[]'::json)
      ),

      'reading', json_build_object(
        'explanations', (select count(*) from q),
        'measured', (select count(distinct interaction_id) from ev where event_type = 'explanation_visibility'),
        'visible_at_delivery', (select count(distinct interaction_id) from ev
                                where event_type = 'explanation_visibility' and payload ->> 'visibleAtDelivery' = 'true'),
        'median_visible_ms', (select round(percentile_cont(0.5) within group (order by dashboard.num(payload, 'visibleMs'))::numeric)
                              from ev where event_type = 'explanation_visibility'),
        'median_ms_to_return', (select round(percentile_cont(0.5) within group (order by dashboard.num(payload, 'msToReturn'))::numeric)
                                from ev where event_type = 'returned_to_code'),
        'median_ms_to_rule', (select round(percentile_cont(0.5) within group (order by dashboard.num(payload, 'msSinceCreated'))::numeric)
                              from ev where event_type = 'level_reached' and dashboard.num(payload, 'level') = 2),
        'median_ms_to_fix', (select round(percentile_cont(0.5) within group (order by dashboard.num(payload, 'msSinceCreated'))::numeric)
                             from ev where event_type = 'level_reached' and dashboard.num(payload, 'level') = 3),
        'abandoned', (select count(distinct interaction_id) from ev where event_type = 'feedback_abandoned'),
        'reopened', (select count(distinct interaction_id) from ev where event_type = 'explanation_reopened'),
        'copied', (select count(distinct interaction_id) from ev where event_type = 'explanation_copied'),
        -- The sidebar sends the rung's label ("L0".."L3"); a bare number is
        -- accepted too.
        'copied_by_level', coalesce((
          select json_object_agg(lvl, n)
          from (select case when jsonb_typeof(payload -> 'level') = 'number' then 'L' || (payload ->> 'level')
                            else coalesce(upper(payload ->> 'level'), 'unknown') end as lvl,
                       count(*) as n
                from ev where event_type = 'explanation_copied' group by 1) c
        ), '{}'::json)
      ),

      'after', json_build_object(
        'edited', (select count(distinct interaction_id) from ev where event_type = 'post_feedback_edit'),
        -- "on the line" = within two lines of where the explanation pointed.
        'on_line', (select count(distinct interaction_id) from ev
                    where event_type = 'post_feedback_edit' and dashboard.num(payload, 'editedLineDistance') <= 2),
        'avg_overlap_pct', (select round(100 * avg(dashboard.num(payload, 'overlapRatio'))) from ev where event_type = 'post_feedback_edit'),
        'undone', (select count(distinct interaction_id) from ev where event_type = 'fix_undone')
      ),

      'before', json_build_object(
        'with_latency', (select count(help_latency_ms) from q),
        'median_help_latency_ms', (select round(percentile_cont(0.5) within group (order by help_latency_ms)::numeric) from q),
        'with_edits', (select count(edits_before_ask) from q),
        'median_edits_before_ask', (select percentile_cont(0.5) within group (order by edits_before_ask) from q),
        'repeats', (select count(*) from q where recurring_error_count > 0),
        -- Same error asked about again within 10 minutes: the explanation
        -- just before did not land.
        'quick_repeats', (select count(*) from q where ms_since_previous_same_error <= 600000),
        'picker_abandoned', json_build_object(
          'preset', (select count(*) from sev where event_type = 'question_picker_abandoned' and payload ->> 'stage' = 'preset'),
          'free_text', (select count(*) from sev where event_type = 'question_picker_abandoned' and payload ->> 'stage' = 'free_text')
        )
      ),

      'surfaces', coalesce((
        select json_agg(x order by x.questions desc)
        from (select coalesce(trigger_surface, 'unknown') as surface, count(*) as questions from q group by 1) x
      ), '[]'::json),

      'habits', (
        select json_build_object(
          'sessions', count(*),
          'without_help', count(*) filter (where not exists (select 1 from public.interactions i where i.session_id = s.id)),
          'avg_session_minutes', round((avg(extract(epoch from (last_seen_at - started_at))) / 60)::numeric, 1),
          'avg_breaks', round(avg(idle_gap_count)::numeric, 1),
          'focus_losses', coalesce(sum(focus_loss_count), 0),
          'unfocused_seconds', coalesce(sum(unfocused_seconds), 0),
          'editor_switches', coalesce(sum(editor_switch_count), 0),
          'files_visited', coalesce(sum(files_visited), 0),
          'files_created', coalesce(sum(files_created), 0),
          'saves', coalesce(sum(save_count), 0),
          'debug_runs', coalesce(sum(debug_session_count), 0),
          'task_runs', coalesce(sum(task_run_count), 0),
          'large_pastes', coalesce(sum(large_paste_count), 0),
          'large_paste_lines', coalesce(sum(large_paste_lines), 0),
          'language_changes', (select count(*) from sev where event_type = 'feedback_language_changed')
        )
        from s
      ),

      'runs', json_build_object(
        'total', (select count(*) from runs),
        'success', (select count(*) from runs where payload ->> 'success' = 'true'),
        'after_explanation', (select count(*) from runs where after_explanation),
        'after_explanation_success', (select count(*) from runs where after_explanation and payload ->> 'success' = 'true')
      ),

      'errors', json_build_object(
        'fixed_unaided', (select coalesce(sum(errors_resolved_without_asking), 0) from s),
        'silent_edits', (select coalesce(sum(silent_resolution_edits), 0) from s),
        'follow_on', (select coalesce(sum(follow_on_error_count), 0) from s),
        'severity', coalesce((
          select json_object_agg(sev_name, n)
          from (select coalesce(lower(error_severity), 'unknown') as sev_name, count(*) as n
                from q where trigger_source = 'diagnostic' group by 1) x
        ), '{}'::json)
      ),

      -- A file's error-free moment: time spent with errors, edits made, how
      -- many errors appeared and how many were asked about.
      'files', coalesce((
        select json_agg(f order by f.at desc)
        from (
          select e.server_ts as at,
                 p.username,
                 e.payload ->> 'fileName' as file_name,
                 dashboard.num(e.payload, 'msWithErrors') as ms_with_errors,
                 dashboard.num(e.payload, 'editsWhileErrors') as edits,
                 dashboard.num(e.payload, 'diagnosticsSeen') as seen,
                 dashboard.num(e.payload, 'diagnosticsAsked') as asked
          from sev e join public.profiles p on p.id = e.user_id
          where e.event_type = 'file_cleared'
          order by e.server_ts desc
          limit 25
        ) f
      ), '[]'::json),

      'failures', coalesce((
        select json_agg(x order by x.n desc)
        from (select coalesce(payload ->> 'kind', 'unknown') as kind, payload ->> 'code' as code, count(*) as n
              from sev where event_type = 'request_failed' group by 1, 2) x
      ), '[]'::json),

      -- Quota use right now (usage_counters windows are UTC hours), for the
      -- class view only. Limits live in the Edge Function environment and
      -- come from dashboard-config.
      'quota', case when p_user_id is null then coalesce((
        select json_agg(x order by x.day_requests desc, x.username)
        from (
          select p.username,
                 coalesce(sum(u.requests) filter (where u.window_start >= date_trunc('hour', now())), 0) as hour_requests,
                 sum(u.requests) as day_requests,
                 sum(u.total_tokens) as day_tokens
          from public.usage_counters u
          join public.profiles p on p.id = u.user_id
          where u.window_start >= (date_trunc('day', now() at time zone 'UTC') at time zone 'UTC')
          group by p.username
          order by 3 desc
          limit 10
        ) x
      ), '[]'::json) end
    )
  );
end;
$$;

revoke all on function public.dashboard_engagement(text, date, date, text, uuid) from public;
grant execute on function public.dashboard_engagement(text, date, date, text, uuid) to anon, authenticated;
