-- Sessions in which the student never asked for an explanation, and how
-- that share moves over time. No new instrumentation was needed for this:
-- a coding_sessions row is created eagerly at sign-in (not lazily on the
-- first question), so sessions with zero interactions are already fully
-- represented -- they simply have no rows on the other side of the join.
--
-- This is the second denominator the study needs. diagnostics_offered
-- answers "of the errors they saw, how many did they ask about";
-- this answers "of the times they sat down to code, how often did they
-- need us at all".

-- Per-student summary.
select
  s.user_id,
  count(*) as total_sessions,
  count(*) filter (where i.interaction_count = 0) as sessions_without_help,
  round(100.0 * count(*) filter (where i.interaction_count = 0) / count(*), 1) as pct_without_help,
  sum(s.errors_resolved_without_asking) as errors_fixed_unaided,
  sum(s.diagnostics_offered) as help_offers_shown
from coding_sessions s
left join lateral (
  select count(*) as interaction_count
  from interactions
  where interactions.session_id = s.id
) i on true
group by s.user_id
order by total_sessions desc;

-- Weekly trend: is the share of self-sufficient sessions rising as the
-- term goes on? The longitudinal read of the same data -- run it once
-- there are enough weeks to compare.
--
-- select
--   date_trunc('week', s.started_at) as week,
--   count(*) as total_sessions,
--   count(*) filter (where i.interaction_count = 0) as sessions_without_help
-- from coding_sessions s
-- left join lateral (
--   select count(*) as interaction_count
--   from interactions where interactions.session_id = s.id
-- ) i on true
-- group by 1 order by 1;
