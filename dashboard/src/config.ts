// The same project and publishable key the extension ships with
// (extension/src/constants.ts) -- both are meant to be public. Student data
// is only reachable through the dashboard_* functions, which each check the
// dashboard session token, so this key alone opens nothing.
export const SUPABASE_URL: string =
  import.meta.env.VITE_SUPABASE_URL || 'https://spmypppuxdtnvelkldya.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY: string =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_KtX91bV4KxdudHoO-SiFKw_RK-ukcMs';

/** The data documentation site (dashboard/docs, VitePress). `pnpm build` publishes
 * it with the dashboard under /docs/ (the "build:docs" script), so that is the
 * default. VITE_DOCS_URL points the link somewhere else, for example when the docs
 * are hosted on their own. `pnpm dev` uses the docs dev server (port 5174, the
 * "docs" entry in .claude/launch.json). */
export const DOCS_URL: string =
  import.meta.env.VITE_DOCS_URL || (import.meta.env.DEV ? 'http://localhost:5174/' : '/docs/');

/** Realtime channel the database announces changes on
 * (supabase/migrations/0021_dashboard_realtime.sql). */
export const REALTIME_CHANNEL = 'dashboard-activity';

/** After a change announcement, wait this long for more to arrive... */
export const REALTIME_DEBOUNCE_MS = 1_000;
/** ...and never refetch more often than this, however many arrive. */
export const REALTIME_MIN_GAP_MS = 5_000;

/** Timed refresh while the tab is visible: a safety net when realtime is
 * connected, the main mechanism when it isn't. */
export const POLL_WITH_REALTIME_MS = 60_000;
export const POLL_WITHOUT_REALTIME_MS = 15_000;

/** A student counts as online if any trace of them is newer than this. Must
 * stay above the extension's 3-minute activity flush (extension.ts), and
 * matches the 10-minute window dashboard_overview uses for "Online now". */
export const ONLINE_WINDOW_MS = 10 * 60_000;
