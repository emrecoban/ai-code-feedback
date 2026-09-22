-- Signals about what a student did BEFORE asking, and what the question
-- actually was -- the parts of the problem-solving sequence the schema
-- could not previously describe at all.

-- The student's own words when they picked "Something else...". Already
-- sent to the model on every free-text question and then discarded; it is
-- the most direct evidence of their mental model there is, so it is now
-- kept. Length is already capped at 300 characters by explain's request
-- validation.
alter table interactions add column free_text text;

-- Milliseconds between the "What does this mean?" affordance first
-- becoming visible for this diagnostic and the student actually clicking
-- it. Null when the interaction did not start from a visible offer (a
-- selection question, or a lightbulb on a diagnostic past the
-- per-document offer cap).
alter table interactions add column help_latency_ms int;

-- How many separate edits the student made to that document between the
-- offer appearing and asking -- attempts made before reaching for help.
-- Null in the same cases as help_latency_ms.
alter table interactions add column edits_before_ask int;

-- Per-session count of distinct diagnostics that were actually shown an
-- offer. The denominator every "how often did they ask for help"
-- ratio needs: without it, only the moments a student DID ask are
-- visible. Written by the same periodic sync as the other
-- coding_sessions activity columns.
alter table coding_sessions add column diagnostics_offered int not null default 0;
