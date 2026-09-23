-- explanations.reuse_count never moved: lookupCache() (functions/_shared/
-- cache.ts) fired its update with `void`, and a supabase-js query builder
-- only sends its request once it is awaited or .then()'d -- so nothing was
-- ever sent (20 cache hits, reuse_count 0 on every row). The replacement
-- increments in a single statement, so two simultaneous cache hits both
-- count, which the old read-then-write could not guarantee.
--
-- Only the Edge Functions call this, with the service role; it is not part
-- of the client API, so the API roles get no execute right. Security
-- invoker is enough: the service role can already update explanations.
create or replace function public.increment_explanation_reuse(p_id uuid)
returns void language sql volatile set search_path = '' as $$
  update public.explanations set reuse_count = reuse_count + 1 where id = p_id;
$$;

revoke all on function public.increment_explanation_reuse(uuid) from public, anon, authenticated;
grant execute on function public.increment_explanation_reuse(uuid) to service_role;
