-- [FEEDBACK-EFFECTIVENESS]: how many diagnostics DiagnosticTrigger offered
-- "What does this mean?" on that later disappeared without the student
-- ever asking for an explanation -- the only direct evidence this
-- extension can observe of a student resolving something entirely
-- unaided. Written by the same periodic sync (extension.ts's
-- flushActivity) that already updates this table's other activity
-- columns; no RLS change needed since this project's policies are
-- row-level only, already covering any column on a row the owner can
-- update.
alter table coding_sessions add column errors_resolved_without_asking int not null default 0;
