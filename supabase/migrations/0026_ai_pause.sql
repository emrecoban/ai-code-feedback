-- [AI-PAUSE]: let an instructor switch the AI help off for every student
-- from the dashboard, without an extension update (addendum §20).
--
-- explain and generate-summary read this one row on every request
-- (functions/_shared/aiPause.ts). While it says paused they answer with a
-- 503 and a message instead of calling the model -- also for questions the
-- cache could answer. The extension shows any refused request as
-- "Request failed: <message>", so students read the reason in their editor.
-- Nothing else stops: sign-in, history, activity counters and research
-- events go on as usual. The extension's buttons stay visible; hiding them
-- would need an extension update.

create table public.ai_pause (
  id         boolean primary key default true check (id),
  paused     boolean not null,
  -- Shown to students instead of the default text, as written (one
  -- language). Null: the default, in each student's language.
  message    text check (char_length(message) between 1 and 300),
  -- The pause ends by itself at this time. Null: until someone resumes it.
  resume_at  timestamptz,
  updated_at timestamptz not null default now(),
  -- The dashboard account's name, copied like audit_log's.
  updated_by text
);

-- No policies: the Edge Functions read it with the service role, and only
-- the definer functions below read or write it otherwise.
alter table public.ai_pause enable row level security;
revoke all on public.ai_pause from anon, authenticated;

-- Every open dashboard learns of a pause or resume at once (0021).
create trigger dashboard_broadcast
  after insert or update or delete on public.ai_pause
  for each statement execute function dashboard.broadcast_change();

-- The pause as the dashboard shows it. paused is the effective state now:
-- a pause whose resume_at has passed is over, which auto_resumed reports,
-- exactly as aiPause.ts decides it for students.
create or replace function dashboard.ai_pause_json()
returns json language sql stable security definer set search_path = '' as $$
  select json_build_object(
    'paused', coalesce(p.paused and (p.resume_at is null or p.resume_at > now()), false),
    'auto_resumed', coalesce(p.paused and p.resume_at <= now(), false),
    'message', case when p.paused then p.message end,
    'resume_at', case when p.paused then p.resume_at end,
    'updated_at', p.updated_at,
    'updated_by', p.updated_by)
  from (select 1) as one
  left join public.ai_pause p on true;
$$;

create or replace function public.dashboard_ai_pause(p_token text)
returns json language plpgsql stable security definer set search_path = '' as $$
begin
  perform dashboard.require_session(p_token);
  return dashboard.ai_pause_json();
end;
$$;

-- Pausing takes an optional message (1-300 characters once trimmed) and an
-- optional resume time, which must be in the future. Resuming clears both.
-- Admin only, audited.
create or replace function public.dashboard_set_ai_pause(
  p_token text, p_paused boolean, p_message text default null, p_resume_at timestamptz default null
) returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_admin uuid := dashboard.require_admin(p_token);
  v_message text := case when p_paused then nullif(btrim(coalesce(p_message, '')), '') end;
  v_resume_at timestamptz := case when p_paused then p_resume_at end;
begin
  if p_paused is null then
    raise exception 'p_paused is required' using errcode = '22023';
  end if;
  if char_length(v_message) > 300 then
    return json_build_object('ok', false, 'error', 'message_too_long');
  end if;
  if v_resume_at <= now() then
    return json_build_object('ok', false, 'error', 'resume_in_past');
  end if;

  insert into public.ai_pause (id, paused, message, resume_at, updated_at, updated_by)
  values (true, p_paused, v_message, v_resume_at, now(), (select username from dashboard.admins where id = v_admin))
  on conflict (id) do update
    set paused = excluded.paused, message = excluded.message, resume_at = excluded.resume_at,
        updated_at = excluded.updated_at, updated_by = excluded.updated_by;

  perform dashboard.audit(v_admin, case when p_paused then 'ai_paused' else 'ai_resumed' end, null, null, null,
    case when p_paused then jsonb_build_object('message', v_message, 'resume_at', v_resume_at) else '{}' end);
  return json_build_object('ok', true, 'status', dashboard.ai_pause_json());
end;
$$;

-- ============ Grants ============

revoke all on all functions in schema dashboard from public, anon, authenticated;

revoke all on function public.dashboard_ai_pause(text) from public;
revoke all on function public.dashboard_set_ai_pause(text, boolean, text, timestamptz) from public;
grant execute on function public.dashboard_ai_pause(text) to anon, authenticated;
grant execute on function public.dashboard_set_ai_pause(text, boolean, text, timestamptz) to anon, authenticated;
