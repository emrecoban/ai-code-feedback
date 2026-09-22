-- [USER-STATS]: history list needs a short, model-generated title per
-- interaction; nullable since existing rows predate this field.
alter table interactions add column title text;

-- [USER-STATS]: the personalized narrative + suggested practice, plus
-- when they were last generated (drives the client's staleness check).
-- learner_profiles.summary already existed (base spec §5.1) but nothing
-- has ever written to it -- these three land together with the same
-- generate-summary function that finally populates it.
alter table learner_profiles add column student_summary text not null default '';
alter table learner_profiles add column suggested_practice text not null default '';
alter table learner_profiles add column summary_generated_at timestamptz;

-- learner_profiles was service-role-only (base spec §5.3 / addendum §1).
-- [USER-STATS] needs the client to read its own rolling summary directly
-- -- it's the student's own non-sensitive text, not cost/quota-bearing,
-- so a read-only own-row policy is safe to add (writes stay service-role
-- only, via generate-summary).
create policy own_learner_profile_select on learner_profiles
  for select to authenticated using (auth.uid() = user_id);
