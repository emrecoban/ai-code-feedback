-- When students work, for how long, and how broken up those stretches
-- are. Time of day and session length need no instrumentation -- started_at
-- and last_seen_at have been recorded since the base schema -- so the only
-- column added for this was idle_gap_count, which is the part that can't
-- be derived from the endpoints alone.
--
-- Worth pairing with dependency_trend.sql: a session at 2am, cut into six
-- interrupted stretches, is a very different context for a help request
-- than a steady afternoon hour, and the comparison is only fair once
-- that's visible.

select
  s.user_id,
  date_trunc('week', s.started_at)::date as week,
  count(*) as sessions,
  round(avg(extract(epoch from (s.last_seen_at - s.started_at)) / 60)::numeric, 1) as avg_session_minutes,
  round(avg(s.active_seconds) / 60.0, 1) as avg_active_minutes,
  -- Breaks per session: 1-2 is a normal sitting, 8 is a session the
  -- student kept walking away from.
  round(avg(s.idle_gap_count)::numeric, 1) as avg_breaks_per_session,
  -- Where the work actually happened in the day, in the student's own
  -- clock time rather than UTC.
  count(*) filter (where extract(hour from s.started_at) between 6 and 11) as morning,
  count(*) filter (where extract(hour from s.started_at) between 12 and 17) as afternoon,
  count(*) filter (where extract(hour from s.started_at) between 18 and 23) as evening,
  count(*) filter (where extract(hour from s.started_at) between 0 and 5) as late_night
from coding_sessions s
group by s.user_id, date_trunc('week', s.started_at)
order by s.user_id, week;
