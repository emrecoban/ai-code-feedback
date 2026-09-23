-- Instructor dashboard (dashboard/): its own username/password login,
-- separate from the students' Supabase Auth accounts, and a small set of
-- RPC functions that are the dashboard's only way into student data.
--
-- Why RPCs and not RLS policies: dashboard users are not Supabase Auth
-- users, so no auth.uid()-based policy can recognise them. Every public
-- function below is SECURITY DEFINER, takes the dashboard session token as
-- its first argument, and refuses to run unless that token maps to a live
-- dashboard.sessions row. The tables themselves live in the `dashboard`
-- schema, which PostgREST does not expose, so password hashes and session
-- rows are not reachable over the REST API at all -- only through these
-- functions.
--
-- No account is created here: the first admin is inserted by hand so a
-- password never lands in version control (see dashboard/README.md).

create schema if not exists dashboard;
revoke all on schema dashboard from public, anon, authenticated;

create table dashboard.admins (
  id              uuid primary key default gen_random_uuid(),
  username        text unique not null
                    check (username ~ '^[a-z0-9][a-z0-9._-]{2,31}$'),
  -- bcrypt, via pgcrypto's crypt()/gen_salt('bf').
  password_hash   text not null,
  failed_attempts int not null default 0,
  locked_until    timestamptz,
  last_login_at   timestamptz,
  created_at      timestamptz not null default now()
);

-- Only a SHA-256 of the bearer token is stored, so a leaked row can't be
-- replayed as a session.
create table dashboard.sessions (
  token_hash  text primary key,
  admin_id    uuid not null references dashboard.admins(id) on delete cascade,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null
);
create index on dashboard.sessions (admin_id);
create index on dashboard.sessions (expires_at);

alter table dashboard.admins   enable row level security;
alter table dashboard.sessions enable row level security;

-- Per-student lookups the dashboard runs on every refresh. interactions
-- and events already have (user_id, ...) indexes from 0001.
create index if not exists coding_sessions_user_started_idx
  on public.coding_sessions (user_id, started_at desc);
create index if not exists interactions_created_idx
  on public.interactions (created_at desc);

-- ============ Internal helpers (not callable from the API) ============

create or replace function dashboard.hash_token(p_token text)
returns text language sql immutable set search_path = '' as $$
  select encode(sha256(convert_to(coalesce(p_token, ''), 'UTF8')), 'hex');
$$;

-- Raises SQLSTATE 28000 (invalid_authorization_specification) for a
-- missing, unknown or expired token; PostgREST turns that into HTTP 403
-- and the dashboard treats it as "signed out".
create or replace function dashboard.require_session(p_token text)
returns uuid language plpgsql stable security definer set search_path = '' as $$
declare
  v_admin uuid;
begin
  select s.admin_id into v_admin
  from dashboard.sessions s
  where s.token_hash = dashboard.hash_token(p_token)
    and s.expires_at > now();
  if v_admin is null then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  return v_admin;
end;
$$;

-- Day buckets follow the viewer's own clock, not UTC; an unrecognised
-- zone name falls back to UTC instead of failing the whole request.
create or replace function dashboard.safe_tz(p_tz text)
returns text language plpgsql stable set search_path = '' as $$
begin
  if coalesce(p_tz, '') = '' then
    return 'UTC';
  end if;
  perform now() at time zone p_tz;
  return p_tz;
exception when others then
  return 'UTC';
end;
$$;

revoke all on all functions in schema dashboard from public, anon, authenticated;

-- ============ Authentication ============

-- Returns {ok:false,error} rather than raising on bad credentials: an
-- exception would roll back the failed-attempt counter it just bumped.
-- Five wrong passwords lock the account for 15 minutes.
create or replace function public.dashboard_login(p_username text, p_password text)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_admin   dashboard.admins%rowtype;
  v_failed  int;
  v_token   text;
  v_expires timestamptz;
begin
  select * into v_admin
  from dashboard.admins
  where username = lower(trim(coalesce(p_username, '')));

  if not found then
    -- Same bcrypt cost as a real check, so response time doesn't reveal
    -- whether the username exists.
    perform extensions.crypt(coalesce(p_password, ''), extensions.gen_salt('bf', 10));
    return json_build_object('ok', false, 'error', 'invalid_credentials');
  end if;

  if v_admin.locked_until is not null and v_admin.locked_until > now() then
    return json_build_object('ok', false, 'error', 'locked', 'locked_until', v_admin.locked_until);
  end if;

  if v_admin.password_hash <> extensions.crypt(coalesce(p_password, ''), v_admin.password_hash) then
    -- A lock that has already run out starts the count again from zero.
    v_failed := case when v_admin.locked_until is not null then 0 else v_admin.failed_attempts end + 1;
    update dashboard.admins
    set failed_attempts = v_failed,
        locked_until = case when v_failed >= 5 then now() + interval '15 minutes' end
    where id = v_admin.id;
    return json_build_object('ok', false, 'error', 'invalid_credentials');
  end if;

  update dashboard.admins
  set failed_attempts = 0, locked_until = null, last_login_at = now()
  where id = v_admin.id;

  delete from dashboard.sessions where expires_at <= now();

  v_token := encode(extensions.gen_random_bytes(32), 'hex');
  v_expires := now() + interval '12 hours';
  insert into dashboard.sessions (token_hash, admin_id, expires_at)
  values (dashboard.hash_token(v_token), v_admin.id, v_expires);

  return json_build_object(
    'ok', true,
    'token', v_token,
    'username', v_admin.username,
    'expires_at', v_expires
  );
end;
$$;

create or replace function public.dashboard_session(p_token text)
returns json language plpgsql stable security definer set search_path = '' as $$
declare
  v_admin uuid := dashboard.require_session(p_token);
begin
  return (
    select json_build_object('username', a.username, 'expires_at', s.expires_at)
    from dashboard.sessions s
    join dashboard.admins a on a.id = s.admin_id
    where s.token_hash = dashboard.hash_token(p_token) and a.id = v_admin
  );
end;
$$;

create or replace function public.dashboard_logout(p_token text)
returns void language sql volatile security definer set search_path = '' as $$
  delete from dashboard.sessions where token_hash = dashboard.hash_token(p_token);
$$;

-- ============ Read: at-a-glance overview ============

-- "Active" means any trace of the student in the window: a coding session
-- heartbeat (the extension bumps last_seen_at every 3 minutes while there
-- is editor activity), a question, or a research event.
create or replace function public.dashboard_overview(p_token text, p_tz text default 'UTC')
returns json language plpgsql stable security definer set search_path = '' as $$
declare
  v_tz        text := dashboard.safe_tz(p_tz);
  v_local     timestamp := date_trunc('day', now() at time zone v_tz);
  v_today     timestamptz := v_local at time zone v_tz;
  v_yesterday timestamptz := (v_local - interval '1 day') at time zone v_tz;
  v_from      timestamptz := (v_local - interval '29 days') at time zone v_tz;
  v_week      timestamptz := now() - interval '7 days';
  v_day       timestamptz := now() - interval '24 hours';
begin
  perform dashboard.require_session(p_token);

  return (
    with last_activity as (
      select p.id as user_id,
             greatest(
               (select max(greatest(s.started_at, s.last_seen_at)) from public.coding_sessions s where s.user_id = p.id),
               (select max(i.created_at) from public.interactions i where i.user_id = p.id),
               (select max(e.server_ts) from public.events e where e.user_id = p.id)
             ) as at
      from public.profiles p
    ),
    week_q as (
      select * from public.interactions where created_at >= v_week
    ),
    days as (
      select (v_local - make_interval(days => n))::date as day
      from generate_series(29, 0, -1) as n
    ),
    daily_questions as (
      select (created_at at time zone v_tz)::date as day, count(*) as questions
      from public.interactions
      where created_at >= v_from
      group by 1
    ),
    daily_students as (
      select (x.at at time zone v_tz)::date as day, count(distinct x.user_id) as students
      from (
        select started_at as at, user_id from public.coding_sessions where started_at >= v_from
        union all
        select last_seen_at, user_id from public.coding_sessions where last_seen_at >= v_from
        union all
        select created_at, user_id from public.interactions where created_at >= v_from
      ) x
      group by 1
    )
    select json_build_object(
      'generated_at', now(),
      'students_total', (select count(*) from public.profiles),
      'students_new_7d', (select count(*) from public.profiles where created_at >= v_week),
      'active_now', (select count(*) from last_activity where at >= now() - interval '10 minutes'),
      'active_today', (select count(*) from last_activity where at >= v_today),
      'questions_today', (select count(*) from public.interactions where created_at >= v_today),
      'questions_yesterday', (select count(*) from public.interactions
                              where created_at >= v_yesterday and created_at < v_today),
      'questions_7d', (select count(*) from week_q),
      'solved_alone_7d', (select count(*) from week_q where max_level_reached <= 1),
      'levels_7d', json_build_object(
        'hint', (select count(*) from week_q where max_level_reached <= 1),
        'rule', (select count(*) from week_q where max_level_reached = 2),
        'fix',  (select count(*) from week_q where max_level_reached = 3)
      ),
      'helpful_up_7d', (select count(*) from week_q where helpful_rating = 1),
      'helpful_down_7d', (select count(*) from week_q where helpful_rating = -1),
      'fixed_unaided_7d', (select coalesce(sum(errors_resolved_without_asking), 0)
                           from public.coding_sessions where last_seen_at >= v_week),
      'avg_latency_ms_24h', (select round(avg(latency_ms)) from public.interactions
                             where created_at >= v_day and latency_ms is not null),
      'failed_requests_24h', (select count(*) from public.events
                              where event_type = 'request_failed' and server_ts >= v_day),
      'daily', (
        select json_agg(json_build_object(
                 'day', d.day,
                 'questions', coalesce(q.questions, 0),
                 'students', coalesce(s.students, 0)
               ) order by d.day)
        from days d
        left join daily_questions q on q.day = d.day
        left join daily_students s on s.day = d.day
      ),
      'recent', coalesce((
        select json_agg(r order by r.created_at desc)
        from (
          select i.id, i.user_id, p.username, i.created_at, i.title, i.trigger_source,
                 i.question_type, i.max_level_reached, i.file_name
          from public.interactions i
          join public.profiles p on p.id = i.user_id
          order by i.created_at desc
          limit 8
        ) r
      ), '[]'::json)
    )
  );
end;
$$;

-- ============ Read: student list ============

-- One row per student, with everything the list row and the .xlsx export
-- show. Detail for a single student is fetched separately, on expand.
create or replace function public.dashboard_students(p_token text, p_tz text default 'UTC')
returns json language plpgsql stable security definer set search_path = '' as $$
declare
  v_tz text := dashboard.safe_tz(p_tz);
begin
  perform dashboard.require_session(p_token);

  return coalesce((
    select json_agg(r order by r.last_active desc nulls last, r.username)
    from (
      select p.id as user_id,
             p.username,
             p.created_at,
             p.consent_status,
             p.feedback_language,
             s.extension_version,
             coalesce(s.sessions, 0) as sessions,
             coalesce(s.active_days, 0) as active_days,
             coalesce(s.active_seconds, 0) as active_seconds,
             coalesce(s.lines_written, 0) as lines_written,
             coalesce(s.lines_deleted, 0) as lines_deleted,
             coalesce(s.fixed_unaided, 0) as fixed_unaided,
             coalesce(s.help_offers, 0) as help_offers,
             coalesce(i.questions, 0) as questions,
             coalesce(i.questions_7d, 0) as questions_7d,
             coalesce(i.solved_alone, 0) as solved_alone,
             coalesce(i.helpful_up, 0) as helpful_up,
             coalesce(i.helpful_down, 0) as helpful_down,
             greatest(s.last_seen, i.last_question, e.last_event) as last_active
      from public.profiles p
      left join lateral (
        select count(*) as sessions,
               count(distinct (cs.started_at at time zone v_tz)::date) as active_days,
               sum(cs.active_seconds) as active_seconds,
               sum(cs.lines_written) as lines_written,
               sum(cs.lines_deleted) as lines_deleted,
               sum(cs.errors_resolved_without_asking) as fixed_unaided,
               sum(cs.diagnostics_offered) as help_offers,
               max(greatest(cs.started_at, cs.last_seen_at)) as last_seen,
               (array_agg(cs.extension_version order by cs.started_at desc))[1] as extension_version
        from public.coding_sessions cs
        where cs.user_id = p.id
      ) s on true
      left join lateral (
        select count(*) as questions,
               count(*) filter (where it.created_at >= now() - interval '7 days') as questions_7d,
               count(*) filter (where it.max_level_reached <= 1) as solved_alone,
               count(*) filter (where it.helpful_rating = 1) as helpful_up,
               count(*) filter (where it.helpful_rating = -1) as helpful_down,
               max(it.created_at) as last_question
        from public.interactions it
        where it.user_id = p.id
      ) i on true
      left join lateral (
        select max(ev.server_ts) as last_event
        from public.events ev
        where ev.user_id = p.id
      ) e on true
    ) r
  ), '[]'::json);
end;
$$;

-- ============ Read: one student's detail ============

create or replace function public.dashboard_student_detail(p_token text, p_user_id uuid, p_tz text default 'UTC')
returns json language plpgsql stable security definer set search_path = '' as $$
declare
  v_tz    text := dashboard.safe_tz(p_tz);
  v_local timestamp := date_trunc('day', now() at time zone v_tz);
  v_from  timestamptz := (v_local - interval '29 days') at time zone v_tz;
begin
  perform dashboard.require_session(p_token);

  if not exists (select 1 from public.profiles where id = p_user_id) then
    raise exception 'Student not found' using errcode = 'P0002';
  end if;

  return (
    with q as (
      select * from public.interactions where user_id = p_user_id
    ),
    cs as (
      select * from public.coding_sessions where user_id = p_user_id
    ),
    days as (
      select (v_local - make_interval(days => n))::date as day
      from generate_series(29, 0, -1) as n
    ),
    daily_questions as (
      select (created_at at time zone v_tz)::date as day, count(*) as questions
      from q where created_at >= v_from group by 1
    ),
    daily_minutes as (
      select (started_at at time zone v_tz)::date as day, sum(active_seconds) / 60.0 as minutes
      from cs where started_at >= v_from group by 1
    )
    select json_build_object(
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
      'last_session', (
        select json_build_object(
          'started_at', started_at,
          'last_seen_at', last_seen_at,
          'extension_version', extension_version,
          'vscode_version', vscode_version,
          'os', os
        )
        from cs order by started_at desc limit 1
      ),
      'activity', (
        select json_build_object(
          'sessions', count(*),
          'active_days', count(distinct (started_at at time zone v_tz)::date),
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
          'fix',  count(*) filter (where max_level_reached = 3),
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
      'daily', (
        select json_agg(json_build_object(
                 'day', d.day,
                 'questions', coalesce(dq.questions, 0),
                 'minutes', round(coalesce(dm.minutes, 0))
               ) order by d.day)
        from days d
        left join daily_questions dq on dq.day = d.day
        left join daily_minutes dm on dm.day = d.day
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
          where concept is not null and concept <> ''
          group by lower(concept)
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
      'recent', coalesce((
        select json_agg(r order by r.created_at desc)
        from (
          select id, created_at, title, file_name, trigger_source, question_type,
                 max_level_reached, helpful_rating, self_reported_outcome
          from q
          order by created_at desc
          limit 10
        ) r
      ), '[]'::json)
    )
  );
end;
$$;

-- ============ Write: reset / delete ============

-- Clears a student's collected data but keeps the account, so they can
-- carry on using the extension with a clean slate. Consent history is
-- kept: it is the audit trail, not collected data.
create or replace function public.dashboard_reset_student(p_token text, p_user_id uuid)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_keep uuid;
begin
  perform dashboard.require_session(p_token);

  if not exists (select 1 from public.profiles where id = p_user_id) then
    raise exception 'Student not found' using errcode = 'P0002';
  end if;

  -- The newest session may be the one the student's VS Code is writing to
  -- right now: extension.ts caches its id for the whole sign-in, and every
  -- /explain insert references it. Deleting it would make their next
  -- question fail until they signed in again, so it is emptied instead.
  select id into v_keep
  from public.coding_sessions
  where user_id = p_user_id
  order by started_at desc
  limit 1;

  delete from public.interactions where user_id = p_user_id;
  delete from public.events where user_id = p_user_id;
  delete from public.coding_sessions where user_id = p_user_id and id is distinct from v_keep;
  update public.coding_sessions
  set active_seconds = 0, lines_written = 0, lines_deleted = 0, files_created = 0,
      language_counts = '{}'::jsonb, errors_resolved_without_asking = 0,
      diagnostics_offered = 0, large_paste_count = 0, large_paste_lines = 0,
      focus_loss_count = 0, unfocused_seconds = 0, save_count = 0,
      debug_session_count = 0, task_run_count = 0, follow_on_error_count = 0,
      silent_resolution_edits = 0, idle_gap_count = 0, editor_switch_count = 0,
      files_visited = 0
  where id = v_keep;
  delete from public.usage_counters where user_id = p_user_id;
  update public.learner_profiles
  set summary = '', student_summary = '', suggested_practice = '',
      summary_generated_at = null, interactions_since_update = 0, updated_at = now()
  where user_id = p_user_id;

  return json_build_object('ok', true);
end;
$$;

-- Removes the account itself. Every per-student table references
-- profiles (and profiles references auth.users) with on delete cascade,
-- so deleting the auth user removes everything, consent history included.
create or replace function public.dashboard_delete_student(p_token text, p_user_id uuid)
returns json language plpgsql volatile security definer set search_path = '' as $$
begin
  perform dashboard.require_session(p_token);

  if not exists (select 1 from public.profiles where id = p_user_id) then
    raise exception 'Student not found' using errcode = 'P0002';
  end if;

  delete from auth.users where id = p_user_id;
  delete from public.profiles where id = p_user_id;

  return json_build_object('ok', true);
end;
$$;

-- Every function checks its own token, so the API roles may call them.
revoke all on function public.dashboard_login(text, text) from public;
revoke all on function public.dashboard_session(text) from public;
revoke all on function public.dashboard_logout(text) from public;
revoke all on function public.dashboard_overview(text, text) from public;
revoke all on function public.dashboard_students(text, text) from public;
revoke all on function public.dashboard_student_detail(text, uuid, text) from public;
revoke all on function public.dashboard_reset_student(text, uuid) from public;
revoke all on function public.dashboard_delete_student(text, uuid) from public;

grant execute on function public.dashboard_login(text, text) to anon, authenticated;
grant execute on function public.dashboard_session(text) to anon, authenticated;
grant execute on function public.dashboard_logout(text) to anon, authenticated;
grant execute on function public.dashboard_overview(text, text) to anon, authenticated;
grant execute on function public.dashboard_students(text, text) to anon, authenticated;
grant execute on function public.dashboard_student_detail(text, uuid, text) to anon, authenticated;
grant execute on function public.dashboard_reset_student(text, uuid) to anon, authenticated;
grant execute on function public.dashboard_delete_student(text, uuid) to anon, authenticated;
