-- [FEEDBACK-EFFECTIVENESS] experiment instrumentation: how many times
-- (before this one) this exact normalized error signature already
-- appeared for this user. Computed once at write time in explain's
-- recordInteraction() by reusing normalizeErrorSignature() -- the same
-- function already used for cache-keying and for generate-summary's own
-- ad hoc recurrence detection -- so this needs no new comparison logic,
-- only a place to persist a count that was previously only ever computed
-- transiently and discarded.
alter table interactions add column recurring_error_count int not null default 0;
