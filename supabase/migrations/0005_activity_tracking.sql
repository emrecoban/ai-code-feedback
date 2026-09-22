-- [STUDENT-ACTIVITY-DATA]: per-session activity metrics, written directly
-- by the client under the existing own_session_update RLS policy -- no
-- Edge Function needed, same as the rest of coding_sessions' bookkeeping
-- (base spec: "client owns its own session bookkeeping, no cost/quota-
-- bearing data"). "Total active time" for a user is SUM(active_seconds)
-- across their coding_sessions rows, not a separate stored total.
alter table coding_sessions add column active_seconds int not null default 0;
alter table coding_sessions add column lines_written int not null default 0;
alter table coding_sessions add column lines_deleted int not null default 0;
alter table coding_sessions add column files_created int not null default 0;
-- Map of VS Code languageId -> count of qualifying edit events in that
-- language this session (e.g. {"python": 42, "markdown": 3}) -- the
-- per-session distribution of which file types the student worked in.
alter table coding_sessions add column language_counts jsonb not null default '{}'::jsonb;
