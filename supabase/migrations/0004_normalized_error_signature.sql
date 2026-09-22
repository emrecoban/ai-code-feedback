-- [PROMPT-AUDIT]: interactions.error_signature stores the raw diagnostic
-- message, so two occurrences of "the same" error (differing only by a
-- line number or a variable name) never match as the same signature.
-- This stores the same normalization already used for the explanation
-- cache key (_shared/cache.ts's normalizeErrorSignature), so
-- generate-summary can detect genuine recurrence. Not backfilled -- rows
-- created before this migration have this column null; recurrence
-- detection only sees interactions from this point forward.
alter table interactions add column error_signature_normalized text;
