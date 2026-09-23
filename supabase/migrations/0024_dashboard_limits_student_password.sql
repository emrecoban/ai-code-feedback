-- Dashboard, fourth pass: admins set the per-student AI request limits and
-- a student's password from the dashboard.

-- ============ AI request limits ============

-- The limits explain enforces (functions/_shared/rateLimit.ts). At most one
-- row, written only by dashboard_set_rate_limits below; while there is none,
-- the RATE_LIMIT_HOURLY / RATE_LIMIT_DAILY secrets apply, as before. The
-- values live here rather than in the secrets themselves because changing a
-- secret needs a Supabase management token, which would give the dashboard
-- control over the whole project.
create table public.rate_limits (
  id         boolean primary key default true check (id),
  hourly     int not null check (hourly between 1 and 1000),
  daily      int not null check (daily between 1 and 10000),
  updated_at timestamptz not null default now(),
  -- The dashboard account's name, copied like audit_log's.
  updated_by text,
  check (daily >= hourly)
);

-- No policies: the Edge Functions read it with the service role, and only
-- the security definer function below writes it.
alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;

create or replace function public.dashboard_set_rate_limits(p_token text, p_hourly int, p_daily int)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_admin uuid := dashboard.require_admin(p_token);
  v_old public.rate_limits;
begin
  if p_hourly is null or p_hourly not between 1 and 1000 then
    return json_build_object('ok', false, 'error', 'invalid_hourly');
  end if;
  if p_daily is null or p_daily not between 1 and 10000 then
    return json_build_object('ok', false, 'error', 'invalid_daily');
  end if;
  if p_daily < p_hourly then
    return json_build_object('ok', false, 'error', 'daily_below_hourly');
  end if;

  select * into v_old from public.rate_limits;
  insert into public.rate_limits (id, hourly, daily, updated_at, updated_by)
  values (true, p_hourly, p_daily, now(), (select username from dashboard.admins where id = v_admin))
  on conflict (id) do update
    set hourly = excluded.hourly, daily = excluded.daily,
        updated_at = excluded.updated_at, updated_by = excluded.updated_by;

  -- previous_* stay null while the secrets were in force: the database
  -- can't read them.
  perform dashboard.audit(v_admin, 'rate_limits_changed', null, null, null, jsonb_build_object(
    'hourly', p_hourly, 'daily', p_daily,
    'previous_hourly', v_old.hourly, 'previous_daily', v_old.daily
  ));
  return json_build_object('ok', true);
end;
$$;

-- ============ Student passwords ============

-- The extension's sign-in rules (extension/src/constants.ts: at least 8),
-- capped at 72 bytes: bcrypt ignores everything after that.
create or replace function dashboard.student_password_problem(p_password text)
returns text language sql immutable set search_path = '' as $$
  select case
    when length(coalesce(p_password, '')) < 8 then 'student_password_too_short'
    when octet_length(p_password) > 72 then 'student_password_too_long'
  end;
$$;

-- Written straight into auth.users, the way dashboard_delete_student
-- already removes accounts: Supabase Auth stores bcrypt hashes of exactly
-- this form ($2a$10$...), so the student signs in with the new password as
-- usual. Every session is ended with it -- the extension's next token
-- refresh fails and it goes back to the sign-in screen -- so an old
-- password that someone else knew stops working everywhere at once.
create or replace function public.dashboard_student_set_password(p_token text, p_user_id uuid, p_password text)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_admin uuid := dashboard.require_admin(p_token);
  v_username text;
  v_problem text := dashboard.student_password_problem(p_password);
begin
  select username into v_username from public.profiles where id = p_user_id;
  if v_username is null then
    raise exception 'Student not found' using errcode = 'P0002';
  end if;
  if v_problem is not null then
    return json_build_object('ok', false, 'error', v_problem);
  end if;

  update auth.users
  set encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf', 10)),
      updated_at = now()
  where id = p_user_id;
  if not found then
    raise exception 'Student not found' using errcode = 'P0002';
  end if;

  delete from auth.refresh_tokens where user_id = p_user_id::text;
  delete from auth.sessions where user_id = p_user_id;

  -- Never the password itself.
  perform dashboard.audit(v_admin, 'student_password_changed', 'student', p_user_id::text, v_username);
  return json_build_object('ok', true);
end;
$$;

-- ============ Grants ============

revoke all on all functions in schema dashboard from public, anon, authenticated;

-- Both check the admin's token first, so the API roles may call them.
revoke all on function public.dashboard_set_rate_limits(text, int, int) from public;
revoke all on function public.dashboard_student_set_password(text, uuid, text) from public;
grant execute on function public.dashboard_set_rate_limits(text, int, int) to anon, authenticated;
grant execute on function public.dashboard_student_set_password(text, uuid, text) to anon, authenticated;
