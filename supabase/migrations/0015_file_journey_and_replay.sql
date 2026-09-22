-- Following one problem across a whole file, and letting a student read
-- an old explanation again.

-- The file an interaction was about, as a bare filename -- the same
-- basename the client already sends to the model, never a path. Without
-- it, interactions can be ordered in time but not grouped into "the work
-- on this one file", which is the unit a student actually experiences as
-- a problem.
alter table interactions add column file_name text;

-- The generated hint ladder itself. Until now the explanation text lived
-- only in the shared, content-addressed explanations cache, which has no
-- link back to the interaction that produced it -- so a student's own
-- history could list what they asked but never show it again. Storing it
-- per interaction makes the history list re-readable, and makes "which
-- explanations were worth coming back to" answerable.
alter table interactions add column ladder_payload jsonb;

-- Times an activity gap exceeded the idle timeout: how broken up the
-- session was. Session start and end are already recorded, so length and
-- time of day need no new column -- but the shape of the work inside a
-- session (one long stretch, or six interrupted ones) does.
alter table coding_sessions add column idle_gap_count int not null default 0;
