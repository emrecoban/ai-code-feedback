# dashboard/

Single-page app for instructors and researchers, built with React 19, Vite 8 (rolldown) and TypeScript 7
(native `tsc`). There is no router (the active tab lives in the URL hash), no state library and no chart
library: charts are hand-rolled SVG in `components/charts/`, and all styling is in one `src/styles.css`.
`README.md` covers features, roles and the security model; don't repeat it here.

- **Commands:** `pnpm dev` (port 5173; also the "dashboard" entry in the root `.claude/launch.json`),
  `pnpm build`, `pnpm typecheck`, `pnpm preview` ("dashboard-dist" in `.claude/launch.json`).
- **Hosting:** not configured in the repo. `dist/` is a static bundle marked `noindex`.
- **Docs site:** `docs/` is the data documentation site (VitePress, npm, its own `CLAUDE.md`). `pnpm build`
  ends with `build:docs`, which runs `npm ci` in `docs/` and builds it into `dist/docs/`, so one deploy
  publishes both. The dashboard's `tsc` and Vite dev server leave `docs/` alone.
- **Env:** optional, in `.env.local`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`. Both default to the
  extension's project (`src/config.ts`). `VITE_DOCS_URL` is the docs site address for the top bar's Docs link:
  `/docs/` in a build without it, `http://localhost:5174/` in `pnpm dev`.

## Data access

- **All data goes through `src/lib/api.ts`.** `call(fn, args)` wraps `client.rpc('dashboard_*')` and passes:
  - `p_token`: the dashboard session token.
  - `p_tz`: the viewer's IANA time zone, which sets the day buckets.
  - `p_from` / `p_to`: `yyyy-mm-dd`, where a null `p_from` means all time.
- **Auth.** supabase-js auth is switched off. The dashboard's own token is kept in `localStorage`
  (`aicf-dashboard.token`), and `dashboard_session` confirms it before anything renders.
- **SQLSTATE → UI:**
  - `28000` → `SessionExpiredError`: sign out.
  - `28P01` → `PasswordChangeRequiredError`: show the forced password-change screen.
  - `42501` → `ForbiddenError`: a viewer attempted an admin action.
- **One non-RPC call.** The `dashboard-config` Edge Function returns the AI provider, model and limits, which
  live in Edge Function secrets.
- **Admin gating in the UI** (`useSession().isAdmin`) is cosmetic only. The server enforces roles with
  `dashboard.require_admin`.

## Adding or changing a data view

1. Write a migration with the `public.dashboard_*` function, following the conventions in `supabase/CLAUDE.md`.
2. Mirror the returned JSON in `src/lib/types.ts`. The file is hand-written, and nothing checks at compile time
   that it matches the SQL `json_build_object` keys.
3. Add a typed wrapper in `src/lib/api.ts`.
4. Add strings to `src/i18n/en.ts` first. `Dict` is derived from `en`, so `tr.ts` and `es.ts` fail the
   typecheck until they have the same keys. Plurals are `key_one` / `key_other` pairs used through `tp()`.
5. Reloading is automatic. `LiveProvider` (`src/lib/live.tsx`) refetches when:
   - a Realtime message arrives on `dashboard-activity` (1 s debounce, at most every 5 s);
   - the polling timer fires (60 s with Realtime, 15 s without; visible tabs only);
   - the user clicks Refresh.

   Pause stops both Realtime refetches and polling. The tunables are in `src/config.ts`.

## Gotchas

- **Vite 8 uses rolldown.** Bundle splitting is configured under `build.rolldownOptions` in `vite.config.ts`.
- **Strict tsconfig.** `tsconfig.json` enables `noUnusedLocals`, `noUnusedParameters` and `verbatimModuleSyntax`,
  so type-only imports must use `import type`.
- **Excel exports shift dates on purpose.** `lib/exportData.ts` moves dates by the local offset so the sheet
  shows local time.
- **The first admin account is inserted by hand in SQL**, never in a migration, so no password lands in git.
  The lockout-recovery SQL is in `README.md`.
