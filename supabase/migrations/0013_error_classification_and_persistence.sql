-- What kind of error the student hit, and what it cost them to get rid of it.

-- The linter/compiler's own classification of the diagnostic, which the
-- client has always collected and sent to the model but never stored:
-- the tool that produced it ("ts", "pylance", "eslint"), its rule code
-- ("TS2532", "E0602"), and whether it was an error or a warning. A
-- machine-assigned code is a precise category, unlike the free-text
-- message in error_signature, so "which classes of problem does this tool
-- actually help with" becomes answerable without parsing prose.
alter table interactions add column error_source text;
alter table interactions add column error_code text;
alter table interactions add column error_severity text;

-- Diagnostics that appeared in a document shortly after another one there
-- was resolved: fixing one thing and immediately breaking (or revealing)
-- another. Distinguishes a change the student understood from one that
-- merely moved the problem.
alter table coding_sessions add column follow_on_error_count int not null default 0;

-- Total edits made while the diagnostics in errors_resolved_without_asking
-- were still present. Divided by that count it gives the mean number of
-- attempts an unaided fix took, which is the natural comparison against
-- the same measure for errors the student did ask about (carried per
-- interaction on the diagnostic_resolved event instead, where the
-- interaction id makes a per-occurrence record cheap).
alter table coding_sessions add column silent_resolution_edits int not null default 0;
