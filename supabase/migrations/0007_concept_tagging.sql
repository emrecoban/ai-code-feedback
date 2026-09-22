-- [FEEDBACK-EFFECTIVENESS]: a short, model-written name for the general
-- concept behind an interaction (e.g. "list indexing"), separate from the
-- per-interaction `title` (e.g. "Off-by-one in range()"). Nullable, same
-- convention already used for `title` (added in 0003_user_stats.sql
-- without a not-null constraint) rather than a stricter one for a sibling
-- column.
alter table interactions add column concept text;

-- How many prior interactions for this user already carry the same
-- concept (case-insensitive match on the short phrase above) -- the
-- concept-level counterpart to recurring_error_count from migration 0006,
-- catching recurrence across different-looking errors that share one
-- misconception.
alter table interactions add column recurring_concept_count int not null default 0;
