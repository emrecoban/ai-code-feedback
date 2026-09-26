// Only the project URL and a publishable/anon key belong here -- both are
// meant to ship in a client bundle (base spec §2.2, §6.2). The AI provider
// key never touches this file or anything the extension ships.
export const SUPABASE_URL = 'https://spmypppuxdtnvelkldya.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_KtX91bV4KxdudHoO-SiFKw_RK-ukcMs';

// Domain used to map course usernames onto Supabase Auth's required email
// identifier (base spec §4.2). Live-tested against this project's GoTrue
// instance: ".local", ".test", AND ".invalid" are all rejected outright
// with email_address_invalid -- GoTrue's validator specifically rejects
// RFC 2606 reserved TLDs, so the "guaranteed non-resolving" domain the
// base spec suggests doesn't actually work here. A real-gTLD-shaped
// domain (".dev") passes the same validator cleanly. This carries a small
// residual risk: IF email confirmation is ever left on by mistake (it
// must be off per §4.2 regardless -- see specs/SPEC_ADDENDUM.md §12),
// GoTrue would attempt to send real mail to this domain. Not a concern
// once confirmation is correctly disabled, since no email is ever sent.
export const AUTH_EMAIL_DOMAIN = 'students.aicodefeedback.dev';

export const SECRET_SESSION_KEY = 'aiFeedback.session';

export const USERNAME_PATTERN = /^[a-z0-9][a-z0-9._-]{2,31}$/;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

export const CONSENT_TEXT_VERSION = '2026-08-v1';
