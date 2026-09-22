-- Removes schema declared since the base migration (0001) that no
-- application code has ever written to, confirmed by a repo-wide search
-- immediately before this migration was written. Course context
-- (courses/course_weeks/enrollments/interactions.course_id/etc.) is
-- deliberately NOT touched here -- unlike everything below, it is
-- actively read and written on every /explain request (course.ts,
-- explain/index.ts), just always with a null courseId today because the
-- client never sends a real one yet; that's live, working, intentionally
-- deferred infrastructure, not dead schema.

-- Follow-up thread (base spec §10.2 concept) -- no code ever inserts into
-- this table, and interactions.followup_count/still_confused_count (its
-- two summary counters) are likewise never written.
drop table if exists followup_turns;
alter table interactions drop column if exists followup_count;
alter table interactions drop column if exists still_confused_count;

-- Per-interaction outcome/quality fields nothing ever populates: no
-- helpfulness-rating UI exists, "resolved" is never computed or written,
-- and time-to-first-edit was never instrumented.
alter table interactions drop column if exists helpful_rating;
alter table interactions drop column if exists resolved;
alter table interactions drop column if exists resolved_at;
alter table interactions drop column if exists time_to_first_edit_ms;

-- Superseded in practice by the `concept`/`recurring_concept_count`
-- columns (migration 0007), which the model actually populates --
-- concepts_requested was declared in the base schema but nothing ever
-- wrote to it.
alter table interactions drop column if exists concepts_requested;

-- Student-model fields nothing ever writes to; learner_profiles' actual
-- rolling memory is summary/student_summary/suggested_practice
-- (migrations 0001, 0003), not these.
alter table learner_profiles drop column if exists struggle_concepts;
alter table learner_profiles drop column if exists mastered_concepts;
