-- Live dashboard updates. After any write to the tables the dashboard
-- reads, a Realtime broadcast goes out on the public channel
-- "dashboard-activity", and the dashboard refetches through its usual
-- token-checked functions.
--
-- The message carries only the table name -- never a row, a user id or
-- any other data -- because a public channel can be joined with nothing
-- more than the publishable key. Private channels would need Supabase
-- Auth users, which dashboard accounts are not. The dashboard also
-- rate-limits its own refetches, so a flood of messages costs little.
--
-- Statement-level triggers: one message per statement, not per row.

create or replace function dashboard.broadcast_change()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  begin
    perform realtime.send(jsonb_build_object('table', tg_table_name), 'change', 'dashboard-activity', false);
  exception when others then
    -- A dashboard nudge must never make a student's write fail.
    null;
  end;
  return null;
end;
$$;
revoke all on function dashboard.broadcast_change() from public, anon, authenticated;

create trigger dashboard_broadcast
  after insert or update or delete on public.interactions
  for each statement execute function dashboard.broadcast_change();

create trigger dashboard_broadcast
  after insert or update or delete on public.coding_sessions
  for each statement execute function dashboard.broadcast_change();

create trigger dashboard_broadcast
  after insert or delete on public.events
  for each statement execute function dashboard.broadcast_change();

create trigger dashboard_broadcast
  after insert or update or delete on public.profiles
  for each statement execute function dashboard.broadcast_change();
