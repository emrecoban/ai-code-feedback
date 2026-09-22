-- Is the extension making students more self-sufficient over time, or
-- less? The study's central question, and the one measure that can only
-- be read longitudinally.
--
-- No new instrumentation: every column here was collected by the earlier
-- batches. diagnostics_offered is the denominator (errors the student was
-- actually offered help on), interactions the numerator (times they took
-- it), and errors_resolved_without_asking the unaided side of the same
-- ledger.
--
-- Read the trend, not any single week's number: a student working on
-- harder material will ask more without having regressed, so only the
-- direction over several weeks is interpretable.

select
  s.user_id,
  date_trunc('week', s.started_at)::date as week,
  sum(s.diagnostics_offered) as help_offers_shown,
  count(i.id) filter (where i.trigger_source = 'diagnostic') as help_requests,
  sum(s.errors_resolved_without_asking) as fixed_unaided,
  -- Share of offered errors the student asked about. Falling over the
  -- term is growing independence; rising is growing reliance.
  round(
    100.0 * count(i.id) filter (where i.trigger_source = 'diagnostic')
      / nullif(sum(s.diagnostics_offered), 0),
    1
  ) as pct_offers_taken,
  -- Of the questions they did ask, how many they resolved from the
  -- explanation alone rather than needing the rule or the fix.
  round(
    100.0 * count(i.id) filter (where i.max_level_reached <= 1)
      / nullif(count(i.id), 0),
    1
  ) as pct_resolved_at_explanation,
  -- Mean attempts an unaided fix took, for comparison against the
  -- edits_before_ask on interactions where they did ask.
  round(sum(s.silent_resolution_edits)::numeric / nullif(sum(s.errors_resolved_without_asking), 0), 1)
    as mean_edits_per_unaided_fix
from coding_sessions s
left join interactions i on i.session_id = s.id
group by s.user_id, date_trunc('week', s.started_at)
order by s.user_id, week;
