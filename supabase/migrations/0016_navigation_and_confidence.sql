-- How much the student moved around while working, and whether they came
-- out of an explanation feeling able to do it themselves.

-- Editor switches and how many distinct files were touched in a session.
-- Heavy switching while stuck is the signature of hunting for a problem
-- without knowing where it lives -- the navigation counterpart to
-- selection_line_count, which says the same thing about one question.
-- editor_switch_count accumulates across flushes; files_visited is a
-- distinct count for the whole session and is written absolutely, not
-- added to.
alter table coding_sessions add column editor_switch_count int not null default 0;
alter table coding_sessions add column files_visited int not null default 0;

-- The student's answer to "could you do this yourself now?", from the
-- self-report row under an explanation. Paired with what they actually do
-- next (post_feedback_edit, diagnostic_resolved, the recurrence counts)
-- it measures calibration: whether a student who feels they understood
-- really had, and whether the tool improves that match over time.
--
-- Only the post-explanation side is asked. A matching question *before*
-- the answer arrives would interrupt the exact moment the student is
-- reaching for help, and help_latency_ms / edits_before_ask already
-- describe the state they were in beforehand without costing them
-- anything.
alter table interactions add column post_confidence text
  check (post_confidence in ('yes', 'maybe', 'no'));
