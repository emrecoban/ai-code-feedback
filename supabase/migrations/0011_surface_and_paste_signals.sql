-- Which affordance the student actually reached for, how quickly they
-- came back to the same error, and how often code arrived from outside
-- the editor.

-- The surface the help request came from: the diagnostic CodeLens,
-- lightbulb or gutter hover; the selection CodeLens, lightbulb, status
-- bar item or keybinding; the sidebar button; or the command palette.
-- Several of these previously funnelled into the same command with no way
-- to tell them apart afterwards.
alter table interactions add column trigger_surface text;

-- Milliseconds since this user's previous interaction about the same
-- normalized error signature. Null when this is the first time, or when
-- the interaction carries no diagnostic at all (a selection question).
-- recurring_error_count (0006) already says whether an error came back;
-- this says how fast, which is what separates "didn't understand the
-- explanation just now" from "made the same mistake again next week".
alter table interactions add column ms_since_previous_same_error bigint;

-- Bulk insertions that look like pasted code: a single content change
-- adding more than the per-event line ceiling ActivityTracker already
-- uses, while removing at most one line. That last condition is what
-- separates a paste from a format-on-save or a refactor, which rewrite a
-- large range rather than inserting into a small one. Still a heuristic:
-- VS Code exposes no "this was a paste" flag.
alter table coding_sessions add column large_paste_count int not null default 0;
alter table coding_sessions add column large_paste_lines int not null default 0;
