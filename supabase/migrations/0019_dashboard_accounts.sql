-- Dashboard accounts, second pass: several accounts, each with a role
-- ('admin' manages data and accounts, 'viewer' only reads), passwords
-- users change themselves, optional two-step verification (TOTP, RFC 6238,
-- the codes any authenticator app shows), and an audit trail of every
-- sign-in and every change to data or accounts.

-- ============ Accounts ============

alter table dashboard.admins
  add column role text not null default 'admin' check (role in ('admin', 'viewer')),
  -- Set for accounts whose password someone else chose (new accounts,
  -- admin resets); the dashboard stays closed until the owner picks one.
  add column must_change_password boolean not null default false,
  -- Base32 TOTP secrets. pending holds a secret between "set up" and the
  -- first correct code; only then does it become the live secret.
  add column totp_secret text,
  add column totp_pending_secret text,
  -- Last accepted 30-second step, so an observed code can't be replayed.
  add column totp_last_step bigint,
  add column created_by uuid references dashboard.admins(id) on delete set null,
  add column updated_at timestamptz not null default now();

-- The accounts that exist so far were created with a password that was
-- shared out-of-band; each one picks its own at next sign-in.
update dashboard.admins set must_change_password = true;

-- ============ Audit log ============

create table dashboard.audit_log (
  id             bigint generated always as identity primary key,
  admin_id       uuid references dashboard.admins(id) on delete set null,
  -- Names are copied, not joined, so entries stay readable after the
  -- account or student they mention is deleted.
  admin_username text,
  action         text not null,
  target_type    text check (target_type in ('student', 'account')),
  target_id      text,
  target_label   text,
  details        jsonb not null default '{}',
  created_at     timestamptz not null default now()
);
create index on dashboard.audit_log (created_at desc);
alter table dashboard.audit_log enable row level security;

create or replace function dashboard.audit(
  p_admin uuid,
  p_action text,
  p_target_type text default null,
  p_target_id text default null,
  p_target_label text default null,
  p_details jsonb default '{}'
) returns void language sql volatile security definer set search_path = '' as $$
  insert into dashboard.audit_log (admin_id, admin_username, action, target_type, target_id, target_label, details)
  values (
    p_admin,
    (select username from dashboard.admins where id = p_admin),
    p_action, p_target_type, p_target_id, p_target_label, coalesce(p_details, '{}')
  );
$$;

-- ============ Session checks ============

-- The account behind a live token, with no further checks. Only the
-- functions a user needs *before* they may see data use this directly
-- (session info, sign-out, choosing a new password).
create or replace function dashboard.session_admin(p_token text)
returns dashboard.admins language plpgsql stable security definer set search_path = '' as $$
declare
  v dashboard.admins;
begin
  select a.* into v
  from dashboard.sessions s
  join dashboard.admins a on a.id = s.admin_id
  where s.token_hash = dashboard.hash_token(p_token) and s.expires_at > now();
  if not found then
    raise exception 'Not signed in' using errcode = '28000';
  end if;
  return v;
end;
$$;

-- Every data function goes through this. 28P01 tells the dashboard to
-- show the "choose a new password" screen instead of signing out.
create or replace function dashboard.require_session(p_token text)
returns uuid language plpgsql stable security definer set search_path = '' as $$
declare
  v dashboard.admins := dashboard.session_admin(p_token);
begin
  if v.must_change_password then
    raise exception 'Password change required' using errcode = '28P01';
  end if;
  return v.id;
end;
$$;

create or replace function dashboard.require_admin(p_token text)
returns uuid language plpgsql stable security definer set search_path = '' as $$
declare
  v_id uuid := dashboard.require_session(p_token);
begin
  if (select role from dashboard.admins where id = v_id) <> 'admin' then
    raise exception 'Only admins can do this' using errcode = '42501';
  end if;
  return v_id;
end;
$$;

create or replace function dashboard.account_json(p_id uuid)
returns json language sql stable security definer set search_path = '' as $$
  select json_build_object(
    'id', id,
    'username', username,
    'role', role,
    'totp_enabled', totp_secret is not null,
    'must_change_password', must_change_password
  )
  from dashboard.admins where id = p_id;
$$;

-- ============ TOTP (RFC 6238: HMAC-SHA1, 30-second steps, 6 digits) ============

create or replace function dashboard.base32_encode(p bytea)
returns text language plpgsql immutable set search_path = '' as $$
declare
  alphabet constant text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  result text := '';
  buffer bigint := 0;
  bits int := 0;
begin
  for i in 0 .. length(p) - 1 loop
    buffer := (buffer << 8) | get_byte(p, i);
    bits := bits + 8;
    while bits >= 5 loop
      bits := bits - 5;
      result := result || substr(alphabet, ((buffer >> bits) & 31)::int + 1, 1);
    end loop;
    buffer := buffer & ((1::bigint << bits) - 1);
  end loop;
  if bits > 0 then
    result := result || substr(alphabet, ((buffer << (5 - bits)) & 31)::int + 1, 1);
  end if;
  return result;
end;
$$;

create or replace function dashboard.base32_decode(p text)
returns bytea language plpgsql immutable set search_path = '' as $$
declare
  alphabet constant text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  clean text := upper(regexp_replace(coalesce(p, ''), '[\s=-]', '', 'g'));
  result bytea := ''::bytea;
  buffer bigint := 0;
  bits int := 0;
  idx int;
begin
  for i in 1 .. length(clean) loop
    idx := strpos(alphabet, substr(clean, i, 1)) - 1;
    if idx < 0 then
      raise exception 'Invalid base32 input';
    end if;
    buffer := (buffer << 5) | idx;
    bits := bits + 5;
    if bits >= 8 then
      bits := bits - 8;
      result := result || set_byte('\x00'::bytea, 0, ((buffer >> bits) & 255)::int);
      buffer := buffer & ((1::bigint << bits) - 1);
    end if;
  end loop;
  return result;
end;
$$;

create or replace function dashboard.totp_code(p_secret text, p_step bigint)
returns text language plpgsql immutable set search_path = '' as $$
declare
  h bytea := extensions.hmac(int8send(p_step), dashboard.base32_decode(p_secret), 'sha1');
  o int := get_byte(h, 19) & 15;
  bin bigint;
begin
  bin := ((get_byte(h, o) & 127)::bigint << 24)
       | (get_byte(h, o + 1)::bigint << 16)
       | (get_byte(h, o + 2)::bigint << 8)
       | get_byte(h, o + 3);
  return lpad((bin % 1000000)::text, 6, '0');
end;
$$;

-- The step a code matches (one step of clock drift allowed either way),
-- or null. Steps at or before p_after are refused: that code was used.
create or replace function dashboard.totp_match(p_secret text, p_code text, p_after bigint)
returns bigint language plpgsql stable set search_path = '' as $$
declare
  current_step bigint := floor(extract(epoch from now()) / 30);
begin
  if p_secret is null or coalesce(p_code, '') !~ '^[0-9]{6}$' then
    return null;
  end if;
  for offset_steps in -1 .. 1 loop
    if (p_after is null or current_step + offset_steps > p_after)
       and dashboard.totp_code(p_secret, current_step + offset_steps) = p_code then
      return current_step + offset_steps;
    end if;
  end loop;
  return null;
end;
$$;

-- Passwords: 10 to 128 characters.
create or replace function dashboard.password_problem(p_password text)
returns text language sql immutable set search_path = '' as $$
  select case
    when length(coalesce(p_password, '')) < 10 then 'password_too_short'
    when length(p_password) > 128 then 'password_too_long'
  end;
$$;

revoke all on all functions in schema dashboard from public, anon, authenticated;

-- ============ Sign-in ============

drop function if exists public.dashboard_login(text, text);

-- With two-step verification on, a correct password alone returns
-- otp_required (not a failed attempt); the dashboard then asks for the
-- code and sends both again. A wrong code counts as a failed attempt.
create or replace function public.dashboard_login(p_username text, p_password text, p_otp text default null)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v           dashboard.admins;
  v_pass_ok   boolean;
  v_step      bigint;
  v_failed    int;
  v_token     text;
  v_expires   timestamptz;
begin
  select * into v
  from dashboard.admins
  where username = lower(trim(coalesce(p_username, '')));

  if not found then
    -- Same bcrypt cost as a real check, so response time doesn't reveal
    -- whether the username exists.
    perform extensions.crypt(coalesce(p_password, ''), extensions.gen_salt('bf', 10));
    return json_build_object('ok', false, 'error', 'invalid_credentials');
  end if;

  if v.locked_until is not null and v.locked_until > now() then
    return json_build_object('ok', false, 'error', 'locked', 'locked_until', v.locked_until);
  end if;

  v_pass_ok := v.password_hash = extensions.crypt(coalesce(p_password, ''), v.password_hash);

  if v_pass_ok and v.totp_secret is not null then
    if nullif(trim(coalesce(p_otp, '')), '') is null then
      return json_build_object('ok', false, 'error', 'otp_required');
    end if;
    v_step := dashboard.totp_match(v.totp_secret, trim(p_otp), v.totp_last_step);
  end if;

  if not v_pass_ok or (v.totp_secret is not null and v_step is null) then
    -- A lock that has already run out starts the count again from zero.
    v_failed := case when v.locked_until is not null then 0 else v.failed_attempts end + 1;
    update dashboard.admins
    set failed_attempts = v_failed,
        locked_until = case when v_failed >= 5 then now() + interval '15 minutes' end
    where id = v.id;
    perform dashboard.audit(
      v.id,
      case when v_failed >= 5 then 'login_locked' else 'login_failed' end,
      p_details => jsonb_build_object('reason', case when v_pass_ok then 'code' else 'password' end)
    );
    return json_build_object('ok', false, 'error', case when v_pass_ok then 'invalid_otp' else 'invalid_credentials' end);
  end if;

  update dashboard.admins
  set failed_attempts = 0, locked_until = null, last_login_at = now(),
      totp_last_step = coalesce(v_step, totp_last_step)
  where id = v.id;

  delete from dashboard.sessions where expires_at <= now();

  v_token := encode(extensions.gen_random_bytes(32), 'hex');
  v_expires := now() + interval '12 hours';
  insert into dashboard.sessions (token_hash, admin_id, expires_at)
  values (dashboard.hash_token(v_token), v.id, v_expires);

  perform dashboard.audit(v.id, 'login');

  return json_build_object(
    'ok', true,
    'token', v_token,
    'expires_at', v_expires,
    'account', dashboard.account_json(v.id)
  );
end;
$$;

create or replace function public.dashboard_session(p_token text)
returns json language plpgsql stable security definer set search_path = '' as $$
declare
  v dashboard.admins := dashboard.session_admin(p_token);
begin
  return json_build_object(
    'account', dashboard.account_json(v.id),
    'expires_at', (select expires_at from dashboard.sessions where token_hash = dashboard.hash_token(p_token))
  );
end;
$$;

create or replace function public.dashboard_logout(p_token text)
returns void language plpgsql volatile security definer set search_path = '' as $$
declare
  v_admin uuid;
begin
  delete from dashboard.sessions
  where token_hash = dashboard.hash_token(p_token)
  returning admin_id into v_admin;
  if v_admin is not null then
    perform dashboard.audit(v_admin, 'logout');
  end if;
end;
$$;

-- ============ Own account ============

-- Allowed while a password change is pending -- it is how that ends.
-- Signs the account out everywhere except this session.
create or replace function public.dashboard_change_password(p_token text, p_current text, p_new text)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v dashboard.admins := dashboard.session_admin(p_token);
  v_problem text := dashboard.password_problem(p_new);
begin
  if v.password_hash <> extensions.crypt(coalesce(p_current, ''), v.password_hash) then
    return json_build_object('ok', false, 'error', 'wrong_password');
  end if;
  if v_problem is not null then
    return json_build_object('ok', false, 'error', v_problem);
  end if;
  if p_new = p_current then
    return json_build_object('ok', false, 'error', 'same_password');
  end if;

  update dashboard.admins
  set password_hash = extensions.crypt(p_new, extensions.gen_salt('bf', 10)),
      must_change_password = false,
      updated_at = now()
  where id = v.id;
  delete from dashboard.sessions
  where admin_id = v.id and token_hash <> dashboard.hash_token(p_token);

  perform dashboard.audit(v.id, 'password_changed');
  return json_build_object('ok', true, 'account', dashboard.account_json(v.id));
end;
$$;

create or replace function public.dashboard_totp_begin(p_token text)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_id uuid := dashboard.require_session(p_token);
  v dashboard.admins;
  v_secret text := dashboard.base32_encode(extensions.gen_random_bytes(20));
begin
  select * into v from dashboard.admins where id = v_id;
  if v.totp_secret is not null then
    return json_build_object('ok', false, 'error', 'already_enabled');
  end if;
  update dashboard.admins set totp_pending_secret = v_secret where id = v_id;
  return json_build_object(
    'ok', true,
    'secret', v_secret,
    'uri', 'otpauth://totp/AI%20Code%20Feedback:' || v.username
           || '?secret=' || v_secret
           || '&issuer=AI%20Code%20Feedback&algorithm=SHA1&digits=6&period=30'
  );
end;
$$;

create or replace function public.dashboard_totp_enable(p_token text, p_code text)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_id uuid := dashboard.require_session(p_token);
  v dashboard.admins;
  v_step bigint;
begin
  select * into v from dashboard.admins where id = v_id;
  if v.totp_pending_secret is null then
    return json_build_object('ok', false, 'error', 'no_pending_setup');
  end if;
  v_step := dashboard.totp_match(v.totp_pending_secret, trim(coalesce(p_code, '')), null);
  if v_step is null then
    return json_build_object('ok', false, 'error', 'invalid_otp');
  end if;
  update dashboard.admins
  set totp_secret = totp_pending_secret, totp_pending_secret = null,
      totp_last_step = v_step, updated_at = now()
  where id = v_id;
  perform dashboard.audit(v_id, 'totp_enabled');
  return json_build_object('ok', true, 'account', dashboard.account_json(v_id));
end;
$$;

create or replace function public.dashboard_totp_disable(p_token text, p_password text)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_id uuid := dashboard.require_session(p_token);
  v dashboard.admins;
begin
  select * into v from dashboard.admins where id = v_id;
  if v.password_hash <> extensions.crypt(coalesce(p_password, ''), v.password_hash) then
    return json_build_object('ok', false, 'error', 'wrong_password');
  end if;
  update dashboard.admins
  set totp_secret = null, totp_pending_secret = null, totp_last_step = null, updated_at = now()
  where id = v_id;
  perform dashboard.audit(v_id, 'totp_disabled');
  return json_build_object('ok', true, 'account', dashboard.account_json(v_id));
end;
$$;

-- ============ Managing accounts (admins only) ============

create or replace function public.dashboard_accounts(p_token text)
returns json language plpgsql stable security definer set search_path = '' as $$
declare
  v_self uuid := dashboard.require_admin(p_token);
begin
  return coalesce((
    select json_agg(json_build_object(
             'id', a.id,
             'username', a.username,
             'role', a.role,
             'totp_enabled', a.totp_secret is not null,
             'must_change_password', a.must_change_password,
             'locked', a.locked_until is not null and a.locked_until > now(),
             'last_login_at', a.last_login_at,
             'created_at', a.created_at,
             'is_self', a.id = v_self
           ) order by a.username)
    from dashboard.admins a
  ), '[]'::json);
end;
$$;

create or replace function public.dashboard_account_create(p_token text, p_username text, p_password text, p_role text)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_self uuid := dashboard.require_admin(p_token);
  v_username text := lower(trim(coalesce(p_username, '')));
  v_problem text := dashboard.password_problem(p_password);
  v_id uuid;
begin
  if v_username !~ '^[a-z0-9][a-z0-9._-]{2,31}$' then
    return json_build_object('ok', false, 'error', 'invalid_username');
  end if;
  if p_role not in ('admin', 'viewer') then
    return json_build_object('ok', false, 'error', 'invalid_role');
  end if;
  if v_problem is not null then
    return json_build_object('ok', false, 'error', v_problem);
  end if;
  if exists (select 1 from dashboard.admins where username = v_username) then
    return json_build_object('ok', false, 'error', 'username_taken');
  end if;

  insert into dashboard.admins (username, password_hash, role, must_change_password, created_by)
  values (v_username, extensions.crypt(p_password, extensions.gen_salt('bf', 10)), p_role, true, v_self)
  returning id into v_id;

  perform dashboard.audit(v_self, 'account_created', 'account', v_id::text, v_username,
                          jsonb_build_object('role', p_role));
  return json_build_object('ok', true);
end;
$$;

create or replace function public.dashboard_account_set_role(p_token text, p_id uuid, p_role text)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_self uuid := dashboard.require_admin(p_token);
  v dashboard.admins;
begin
  select * into v from dashboard.admins where id = p_id;
  if not found then
    return json_build_object('ok', false, 'error', 'not_found');
  end if;
  if p_role not in ('admin', 'viewer') then
    return json_build_object('ok', false, 'error', 'invalid_role');
  end if;
  if v.role = 'admin' and p_role <> 'admin'
     and (select count(*) from dashboard.admins where role = 'admin') <= 1 then
    return json_build_object('ok', false, 'error', 'last_admin');
  end if;
  update dashboard.admins set role = p_role, updated_at = now() where id = p_id;
  perform dashboard.audit(v_self, 'account_role_changed', 'account', p_id::text, v.username,
                          jsonb_build_object('from', v.role, 'to', p_role));
  return json_build_object('ok', true);
end;
$$;

-- Sets a temporary password the owner must replace at next sign-in, and
-- unlocks the account. Not for one's own account: use change_password.
create or replace function public.dashboard_account_reset_password(p_token text, p_id uuid, p_password text)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_self uuid := dashboard.require_admin(p_token);
  v dashboard.admins;
  v_problem text := dashboard.password_problem(p_password);
begin
  select * into v from dashboard.admins where id = p_id;
  if not found then
    return json_build_object('ok', false, 'error', 'not_found');
  end if;
  if p_id = v_self then
    return json_build_object('ok', false, 'error', 'use_change_password');
  end if;
  if v_problem is not null then
    return json_build_object('ok', false, 'error', v_problem);
  end if;
  update dashboard.admins
  set password_hash = extensions.crypt(p_password, extensions.gen_salt('bf', 10)),
      must_change_password = true, failed_attempts = 0, locked_until = null, updated_at = now()
  where id = p_id;
  delete from dashboard.sessions where admin_id = p_id;
  perform dashboard.audit(v_self, 'account_password_reset', 'account', p_id::text, v.username);
  return json_build_object('ok', true);
end;
$$;

-- For someone who lost their authenticator: they sign in with the password
-- alone and can set two-step verification up again.
create or replace function public.dashboard_account_reset_totp(p_token text, p_id uuid)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_self uuid := dashboard.require_admin(p_token);
  v dashboard.admins;
begin
  select * into v from dashboard.admins where id = p_id;
  if not found then
    return json_build_object('ok', false, 'error', 'not_found');
  end if;
  update dashboard.admins
  set totp_secret = null, totp_pending_secret = null, totp_last_step = null, updated_at = now()
  where id = p_id;
  delete from dashboard.sessions where admin_id = p_id and p_id <> v_self;
  perform dashboard.audit(v_self, 'account_totp_reset', 'account', p_id::text, v.username);
  return json_build_object('ok', true);
end;
$$;

create or replace function public.dashboard_account_delete(p_token text, p_id uuid)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_self uuid := dashboard.require_admin(p_token);
  v dashboard.admins;
begin
  select * into v from dashboard.admins where id = p_id;
  if not found then
    return json_build_object('ok', false, 'error', 'not_found');
  end if;
  if p_id = v_self then
    return json_build_object('ok', false, 'error', 'cannot_delete_self');
  end if;
  if v.role = 'admin' and (select count(*) from dashboard.admins where role = 'admin') <= 1 then
    return json_build_object('ok', false, 'error', 'last_admin');
  end if;
  perform dashboard.audit(v_self, 'account_deleted', 'account', p_id::text, v.username,
                          jsonb_build_object('role', v.role));
  delete from dashboard.admins where id = p_id;
  return json_build_object('ok', true);
end;
$$;

create or replace function public.dashboard_audit_log(p_token text, p_before bigint default null, p_limit int default 50)
returns json language plpgsql stable security definer set search_path = '' as $$
declare
  v_limit int := least(greatest(coalesce(p_limit, 50), 1), 200);
begin
  perform dashboard.require_admin(p_token);
  return (
    with page as (
      select *
      from dashboard.audit_log
      where p_before is null or id < p_before
      order by id desc
      limit v_limit + 1
    )
    select json_build_object(
      'entries', coalesce((
        select json_agg(json_build_object(
                 'id', id,
                 'created_at', created_at,
                 'admin_username', admin_username,
                 'action', action,
                 'target_type', target_type,
                 'target_label', target_label,
                 'details', details
               ) order by id desc)
        from (select * from page order by id desc limit v_limit) e
      ), '[]'::json),
      'has_more', (select count(*) from page) > v_limit
    )
  );
end;
$$;

-- ============ Student data changes: admins only, and audited ============

create or replace function public.dashboard_reset_student(p_token text, p_user_id uuid)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_admin uuid := dashboard.require_admin(p_token);
  v_username text;
  v_keep uuid;
  v_questions int;
begin
  select username into v_username from public.profiles where id = p_user_id;
  if v_username is null then
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

  select count(*) into v_questions from public.interactions where user_id = p_user_id;

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

  perform dashboard.audit(v_admin, 'student_reset', 'student', p_user_id::text, v_username,
                          jsonb_build_object('questions_removed', v_questions));
  return json_build_object('ok', true);
end;
$$;

-- Removes the account itself. Every per-student table references
-- profiles (and profiles references auth.users) with on delete cascade,
-- so deleting the auth user removes everything, consent history included.
create or replace function public.dashboard_delete_student(p_token text, p_user_id uuid)
returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_admin uuid := dashboard.require_admin(p_token);
  v_username text;
begin
  select username into v_username from public.profiles where id = p_user_id;
  if v_username is null then
    raise exception 'Student not found' using errcode = 'P0002';
  end if;

  delete from auth.users where id = p_user_id;
  delete from public.profiles where id = p_user_id;

  perform dashboard.audit(v_admin, 'student_deleted', 'student', p_user_id::text, v_username);
  return json_build_object('ok', true);
end;
$$;

-- ============ Grants ============
-- Every public function checks its own token, so the API roles may call them.

revoke all on function public.dashboard_login(text, text, text) from public;
revoke all on function public.dashboard_change_password(text, text, text) from public;
revoke all on function public.dashboard_totp_begin(text) from public;
revoke all on function public.dashboard_totp_enable(text, text) from public;
revoke all on function public.dashboard_totp_disable(text, text) from public;
revoke all on function public.dashboard_accounts(text) from public;
revoke all on function public.dashboard_account_create(text, text, text, text) from public;
revoke all on function public.dashboard_account_set_role(text, uuid, text) from public;
revoke all on function public.dashboard_account_reset_password(text, uuid, text) from public;
revoke all on function public.dashboard_account_reset_totp(text, uuid) from public;
revoke all on function public.dashboard_account_delete(text, uuid) from public;
revoke all on function public.dashboard_audit_log(text, bigint, int) from public;

grant execute on function public.dashboard_login(text, text, text) to anon, authenticated;
grant execute on function public.dashboard_change_password(text, text, text) to anon, authenticated;
grant execute on function public.dashboard_totp_begin(text) to anon, authenticated;
grant execute on function public.dashboard_totp_enable(text, text) to anon, authenticated;
grant execute on function public.dashboard_totp_disable(text, text) to anon, authenticated;
grant execute on function public.dashboard_accounts(text) to anon, authenticated;
grant execute on function public.dashboard_account_create(text, text, text, text) to anon, authenticated;
grant execute on function public.dashboard_account_set_role(text, uuid, text) to anon, authenticated;
grant execute on function public.dashboard_account_reset_password(text, uuid, text) to anon, authenticated;
grant execute on function public.dashboard_account_reset_totp(text, uuid) to anon, authenticated;
grant execute on function public.dashboard_account_delete(text, uuid) to anon, authenticated;
grant execute on function public.dashboard_audit_log(text, bigint, int) to anon, authenticated;
