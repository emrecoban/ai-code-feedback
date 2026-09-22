-- What the student says about an explanation, as opposed to what their
-- behaviour implies. Every other signal in this schema is inferred;
-- these two are asked.

-- -1 or 1, from the one-click "was this helpful?" row under an
-- explanation. A column of this name existed in the base schema and was
-- dropped in 0009 because nothing ever wrote to it -- it comes back here
-- together with the UI that actually collects it.
alter table interactions add column helpful_rating smallint
  check (helpful_rating between -1 and 1);

-- 'solved' or 'still_stuck', from the one-click outcome row. This is the
-- ground truth the behavioural proxies (diagnostic_resolved,
-- post_feedback_edit, feedback_abandoned) get validated against: without
-- it there is no way to tell whether "the diagnostic disappeared" really
-- means "the student understood it".
alter table interactions add column self_reported_outcome text
  check (self_reported_outcome in ('solved', 'still_stuck'));
