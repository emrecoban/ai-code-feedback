-- [FEEDBACK-EFFECTIVENESS] experiment analysis: does the kind of question
-- a student chose to ask (question_type) correlate with resolving from
-- the explanation alone (max_level_reached <= 1) versus needing the rule
-- (2) or the full fix (3+)? Both columns already exist and are fully
-- populated on every interaction -- this is a read-only report, not a
-- schema or application change. Run directly against the project
-- (Supabase SQL editor, or the execute_sql/query tool), no deployment
-- needed.
--
-- Interpretation note: question_type is only meaningful for
-- selection-triggered interactions (what_does_this_do, why_works,
-- whats_wrong, simpler_example, free_text). Diagnostic-triggered
-- interactions are always 'what_does_this_mean' and will dominate this
-- report unless filtered out or read as their own row.

select
  coalesce(question_type, 'unspecified') as question_type,
  count(*) as total_interactions,
  count(*) filter (where max_level_reached <= 1) as resolved_independently,
  count(*) filter (where max_level_reached = 2) as needed_rule,
  count(*) filter (where max_level_reached >= 3) as needed_fix,
  round(100.0 * count(*) filter (where max_level_reached <= 1) / count(*), 1) as pct_resolved_independently
from interactions
group by coalesce(question_type, 'unspecified')
order by total_interactions desc;

-- To see the same breakdown isolated to self-initiated questions only
-- (excluding the always-present 'what_does_this_mean' diagnostic path),
-- add: where trigger_source = 'selection'
--
-- To watch whether resolution depth per question type shifts over the
-- study period, add to the select list and group by:
--   date_trunc('week', created_at) as week
