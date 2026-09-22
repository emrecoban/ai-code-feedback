-- concept_vocabulary was missing RLS entirely in 0001. It's a shared
-- reference table (controlled concept vocabulary, base spec §7.2), not
-- per-user data, so any authenticated user may read it; there are no
-- client writes.
alter table concept_vocabulary enable row level security;
create policy concept_vocabulary_read on concept_vocabulary
  for select to authenticated using (true);

-- Pin search_path on the trigger function to avoid search_path hijacking.
create or replace function prevent_username_change()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.username is distinct from old.username then
    raise exception 'username is immutable';
  end if;
  return new;
end;
$$;

-- handle_new_user is a trigger function (return type "trigger"); it must
-- only ever run as part of the on_auth_user_created trigger, never as a
-- direct RPC call. Triggers still fire after this revoke -- trigger
-- execution isn't gated by EXECUTE grants on the invoking role -- so this
-- only closes the direct-call surface, it doesn't touch the trigger.
revoke execute on function handle_new_user() from public, anon, authenticated;
