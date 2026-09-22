-- How the student works around the editor while solving a problem: when
-- they leave, what they run, and how precisely they can point at the
-- thing they're stuck on.

-- Times the VS Code window lost focus, and how long it was away. A
-- student who leaves the editor right after an error appears is very
-- likely looking the message up somewhere else, which is otherwise
-- completely invisible to this extension. Each absence is counted up to a
-- cap (see ActivityTracker) so an overnight break doesn't swamp the short
-- look-it-up trips this is meant to detect.
alter table coding_sessions add column focus_loss_count int not null default 0;
alter table coding_sessions add column unfocused_seconds int not null default 0;

-- The "run it and see" loop: explicit saves, debug sessions started, and
-- tasks run. Undercounts on purpose -- a program run by typing into the
-- integrated terminal is not observable through any of these APIs, and
-- reading terminal commands would be far more invasive than this study
-- needs.
alter table coding_sessions add column save_count int not null default 0;
alter table coding_sessions add column debug_session_count int not null default 0;
alter table coding_sessions add column task_run_count int not null default 0;

-- How much code the student highlighted when asking about a selection.
-- A two-line selection means they have a specific hypothesis; forty lines
-- means they know something is wrong but not where. Null for
-- diagnostic-triggered interactions, which have no selection.
alter table interactions add column selection_line_count int;
alter table interactions add column selection_char_count int;
