# AI Code Feedback

University research project (URJC) on how on-demand AI help changes the way students work through
programming problems. A VS Code extension gives a four-level hint ladder (L0 Decode → L1 Locate →
L2 Concept → L3 Fix) **only when the student asks**, and records research data about how it is used.
Instructors and researchers read that data in a web dashboard. Both run against one hosted Supabase project.

> `specs/SPEC_ADDENDUM.md` is the only design document in the repo. `docs/` is the public data
> documentation site (VitePress, EN/TR/ES), built on the `docs-site` branch.

## Directory map

| Path | What it is | More |
|---|---|---|
| `extension/` | VS Code extension `ai-code-feedback` (TypeScript, esbuild, pnpm) | `extension/CLAUDE.md` |
| `supabase/` | Postgres migrations, Deno Edge Functions, read-only analytics SQL | `supabase/CLAUDE.md` |
| `dashboard/` | Instructor/research dashboard (React 19, Vite 8, TypeScript 7, pnpm) | `dashboard/CLAUDE.md` |
| `specs/SPEC_ADDENDUM.md` | Corrections to the external "base spec"; wins wherever the two disagree. Comments in migrations 0001 and 0018 still cite its old path `docs/SPEC_ADDENDUM.md` (applied migrations are not edited) | |
| `docs/` | Data documentation site (VitePress 1.6, npm, EN/TR/ES), self-contained, synthetic data only | `docs/CLAUDE.md` |
| `.claude/launch.json` | Preview configs: dashboard dev server (port 5173) and docs dev server (port 5174) | |
| `scripts/` | Empty | |

There is no root `package.json` or workspace. Each component installs and runs from its own folder.
`extension/README.md` is the user-facing README (EN/TR/ES). `dashboard/README.md` covers the dashboard's
features and security model.

## How the components talk

```
extension ─ Supabase Auth (username → email) ─────────► auth.users ─(trigger)─► profiles
extension ─ PostgREST, student JWT, own-row RLS ──────► profiles, consent_log, coding_sessions
                                                         (read-only: interactions, learner_profiles)
extension ─ Edge Functions, student JWT ──────────────► explain, generate-summary, record-level,
                                                         record-self-report, log-event
            Edge Functions ─ service role ────────────► interactions, events, explanations,
                                                         usage_counters, learner_profiles
explain   ─ HTTPS ────────────────────────────────────► LLM provider (+ optional fallback)
dashboard ─ RPC, publishable key + own session token ─► public.dashboard_* (SECURITY DEFINER)
dashboard ─ Edge Function (token in body, no JWT) ────► dashboard-config
DB triggers ─ Realtime broadcast "dashboard-activity" ► dashboard refetches
```

- **Student login.** The username is mapped to `<username>@students.aicodefeedback.dev` in Supabase Auth.
  The first login registers the account automatically: sign-in fails, then sign-up runs. **"Confirm email"
  must stay off** in the Supabase Auth settings, or registration breaks (addendum §12).
- **Dashboard accounts are not Supabase Auth users.** They live in the `dashboard` schema, which PostgREST
  does not expose. Every `dashboard_*` RPC takes the dashboard session token as its first argument and checks it.
- **Public vs. secret keys.** The Supabase URL and the publishable key are hardcoded in
  `extension/src/constants.ts` and `dashboard/src/config.ts`. Both are public by design. The AI provider
  key exists only in Edge Function secrets.
- **Coding sessions.** A `coding_sessions` row is created at sign-in, one per extension host. The extension
  merges activity counters into it every 3 minutes.

## Commands

Run everything from the component folder: pnpm for extension and dashboard, npm for docs.

| Component | Commands |
|---|---|
| extension | `pnpm install` · `pnpm compile` / `pnpm watch` (→ `dist/extension.js`) · `pnpm typecheck` · `pnpm package` (minified) · F5 in VS Code with `extension/` as the workspace root |
| dashboard | `pnpm install` · `pnpm dev` (http://localhost:5173) · `pnpm build` (tsc + vite → `dist/`) · `pnpm typecheck` · `pnpm preview` |
| supabase | No CLI project (`config.toml` absent), no local stack, no deploy scripts. See `supabase/CLAUDE.md` |
| docs | `npm install` · `npm run docs:dev` · `docs:build` · `docs:sample` (synthetic data, codebook, downloads) · `docs:check` (coverage, schema, secrets, style) |

**There are no tests, linters, formatters or CI.** To verify a change, run `pnpm typecheck` in every
component you touched, plus `pnpm build` for the dashboard. The Edge Functions have no typecheck setup.
A schema, event or dashboard-metric change also needs `docs/.vitepress/data/inventory.json` updated: `npm run docs:check`
in `docs/` replays the migrations and fails when a column, function or event type is missing.
`extension/dist/` and `dashboard/dist/` are gitignored build output.

## Shared conventions

- **Languages.** `en`, `tr` and `es` are supported everywhere: DB check constraints, the extension, the Edge
  Functions and the dashboard. Adding a language touches all of them.
- **Comments are the design record.** They explain *why*, cite `base spec §x` or `SPEC_ADDENDUM.md §x`, and
  carry feature tags such as `[FEEDBACK-EFFECTIVENESS]`, `[STUDENT-ACTIVITY-DATA]`, `[USER-STATS]`,
  `[PROMPT-AUDIT]`, `[WELCOMEVIEW]` and `[AUTH-TOOLBAR]`. Grep a tag to find every piece of a feature.
  Keep to this style.
- **The spec.** The base spec (*AI Code Feedback — Version 2*) is not in the repo. When a change reverses a
  decision recorded in the addendum, update or add an addendum section.
- **Research data.**
  - Events carry only derived measurements (durations, ratios, counts), never raw code or anything the
    student typed.
  - Code is redacted before it reaches the model (`extension/src/context/redaction.ts`).
  - The one piece of student text that is stored is `interactions.free_text`, capped at 300 characters.
- **Telemetry is best-effort.** Research writes are logged and swallowed, never shown to the student.
- **Counters.** Read-then-write merges are accepted at classroom scale. Use an atomic RPC only when exact
  counts matter (for example `increment_explanation_reuse`).
- **Migrations** are forward-only files named `NNNN_description.sql`. Each opens with a comment explaining why.

## Contracts duplicated across components (change every side together)

| Contract | Where it lives |
|---|---|
| Research event types | `extension/src/backend/researchEvents.ts` ↔ `supabase/functions/log-event/index.ts` (unknown type → 422) |
| Trigger surfaces | `extension/src/backend/types.ts` ↔ `SUPPORTED_TRIGGER_SURFACES` in `supabase/functions/explain/index.ts` |
| Trigger sources | extension types ↔ explain ↔ `interactions.trigger_source` check ↔ `dashboard/src/lib/types.ts` |
| `/explain` request/response | `extension/src/backend/types.ts` ↔ `explain/index.ts` + `functions/_shared/hintLadder.ts` |
| Dashboard RPC JSON shapes | SQL in `supabase/migrations/0017`–`0024` ↔ `dashboard/src/lib/types.ts` (hand-written, no codegen) |
| "Online" window | `ONLINE_WINDOW_MS` in `dashboard/src/config.ts` and `dashboard_overview` (10 min) must stay above the extension's 3-min flush |
| Data inventory and labels | schema, event payloads and dashboard metrics ↔ `docs/.vitepress/data/inventory.json` + `terms.ts` (dashboard labels, EN/TR/ES) |

## Pitfalls and known gaps

- **supabase-js only sends a query once it is awaited or `.then()`-ed.** `void client.from(...).update(...)`
  silently does nothing. Migration 0022 fixed exactly this bug.
- **Two migrations share the prefix `0003`.** Never renumber applied migrations. The next free number is `0025`.
- **Changing a `dashboard_*` RPC's parameters creates a new overload.** Drop the old signature in the same
  migration (0020 shows how), or the RPC call becomes ambiguous.
- **Leftover course scaffolding.** The course tables were dropped (0018, addendum §17), but the `course_id`
  columns remain and are always null. The `course-materials` storage bucket is unused.
- **Consent withdrawal is promised but not implemented.** The consent text (`extension/src/i18n/strings.ts`)
  and the extension README tell students they can withdraw from the sidebar and have their history deleted.
  No command, UI or `withdraw-consent` function exists; addendum §9 describes the intended design. This is an
  open ethics/product item: raise it with the user rather than changing the wording or behaviour silently.
- **The addendum describes things that never shipped or were removed:** `followup_turns` (dropped in 0009),
  and the `admin-reset-password` and `withdraw-consent` functions (never built). Check the code before
  trusting an addendum section.
- **Production data.** The Supabase project referenced in the repo holds real study data. Ask before applying
  migrations, deploying functions or running writes against it.

## Keeping this file up to date

When a task changes architecture, folder structure, commands, environment variable names, the Supabase
schema, or how components communicate, update the relevant CLAUDE.md file as part of the same task. Keep
updates short and do not add routine code-level details.
