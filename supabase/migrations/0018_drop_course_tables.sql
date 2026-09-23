-- Course context (courses / course_weeks / enrollments) was scaffolding for
-- a feature the extension never shipped: every /explain request sends
-- courseId: null (docs/SPEC_ADDENDUM.md §16) and none of the three tables
-- ever held a row. Removed, together with supabase/scripts/import-course.ts
-- and the sample course files it read -- the only code that wrote to them.
-- course_weeks goes too: it is a child table of courses and means nothing
-- without it.
--
-- The nullable course_id columns on coding_sessions, interactions,
-- explanations and learner_profiles stay as plain columns (always null):
-- the deployed Edge Functions still write null to them, and dropping them
-- would need a coordinated redeploy for no benefit.

alter table public.coding_sessions  drop constraint if exists coding_sessions_course_id_fkey;
alter table public.interactions     drop constraint if exists interactions_course_id_fkey;
alter table public.explanations     drop constraint if exists explanations_course_id_fkey;
alter table public.learner_profiles drop constraint if exists learner_profiles_course_id_fkey;

-- explanation_read let enrolled students read course-specific cache rows.
-- Without courses only course-agnostic rows exist, and those were already
-- readable, so the policy keeps exactly the access it granted before.
drop policy if exists explanation_read on public.explanations;
create policy explanation_read on public.explanations
  for select to authenticated using (course_id is null);

-- The course tables' own read policies reference enrollments; they go
-- first so each table can be dropped without CASCADE (which would silently
-- take along anything else that turned out to depend on them).
drop policy if exists enrolled_course_read on public.courses;
drop policy if exists enrolled_week_read on public.course_weeks;

drop table if exists public.enrollments;
drop table if exists public.course_weeks;
drop table if exists public.courses;
