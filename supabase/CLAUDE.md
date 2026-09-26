# supabase/

Backend for the extension and the dashboard, running on one hosted Supabase project (its URL is in
`extension/src/constants.ts`). There is no `config.toml`, local stack, seed data, schema dump or test suite.
To know the current schema, read the migrations in order.

- `migrations/`: `0001` is the base schema. `0002`–`0016` add research signals. `0017`+ are the dashboard.
- `functions/<name>/index.ts`: Deno Edge Functions (`Deno.serve`, `jsr:@supabase/supabase-js@2`). Shared code
  lives in `functions/_shared/`.
- `analytics/*.sql`: read-only research reports, run by hand in the SQL editor. They are not migrations; never
  apply them.

## Deploying

The repo does not record how migrations are applied. The addendum mentions the Supabase MCP tools, and the
SQL editor also works. With the Supabase CLI, functions deploy like this:

```bash
supabase functions deploy <name> --project-ref <ref>
```

`dashboard-config` is the one exception. Deploy it with `--no-verify-jwt`, because dashboard accounts have no
Supabase JWT. Every other function keeps JWT verification on. **The project holds real study data. Confirm
with the user before applying a migration or deploying.**

## Access models

1. **Student direct access, own-row RLS (`auth.uid() = user_id`):**
   - `profiles`: select, insert and update. The `handle_new_user` trigger on `auth.users` creates the row;
     the `profiles_lock_username` trigger makes the username immutable.
   - `coding_sessions`: select, insert and update. The client owns its session bookkeeping and activity counters.
   - `consent_log`: select and insert.
   - `interactions` and `learner_profiles`: select only.
   - `explanations` rows where `course_id is null`, and all of `concept_vocabulary` (unused by the code): select.
2. **Service role inside Edge Functions.** Every write that costs money, consumes quota or affects research
   integrity goes this way (addendum §1). `_shared/authClient.ts` `verifyUser()` takes the user id from the
   JWT; never trust a `userId` sent in the body.
3. **Dashboard RPCs.** Each `public.dashboard_*` function is `SECURITY DEFINER` with `set search_path = ''`,
   takes `p_token` first, and is granted to `anon, authenticated`. The guards raise SQLSTATEs that the
   dashboard maps to UI states:
   - `dashboard.session_admin`: 28000, not signed in.
   - `dashboard.require_session`: also 28P01, the user must change their password first.
   - `dashboard.require_admin`: also 42501, a viewer tried an admin action.

`events`, `usage_counters`, `rate_limits` and every `dashboard.*` table have RLS on and **no policies**. Only
the service role or definer functions can reach them.

## Tables and their writers

| Table | Written by | Notes |
|---|---|---|
| `profiles` | trigger, extension | `consent_status`, `feedback_language`, `first_login_at` |
| `consent_log` | extension | `version` = `CONSENT_TEXT_VERSION` in the extension |
| `coding_sessions` | extension | activity counters merged every 3 min; `files_visited` is assigned, not added |
| `interactions` | `explain`; `record-level` (`max_level_reached`); `record-self-report` | one row per help request; keeps `ladder_payload` so history can be reopened |
| `events` | `log-event`, `record-level` | `unique (user_id, client_event_id)` makes retries idempotent |
| `explanations` | `explain` | shared content-addressed cache; `reuse_count` via `increment_explanation_reuse()` |
| `learner_profiles` | `explain` (counter), `generate-summary` | `summary` is private model memory fed into prompts; `student_summary` and `suggested_practice` are shown to the student |
| `usage_counters` | `explain` | hourly buckets for the rate limit |
| `rate_limits` | `dashboard_set_rate_limits` | single row; overrides the `RATE_LIMIT_*` secrets when present |
| `dashboard.admins`, `.sessions`, `.audit_log` | `dashboard_*` RPCs | only the SHA-256 of a session token is stored; sessions last 12 h |

Deleting a student means deleting from `auth.users`, which cascades through everything (`dashboard_delete_student`).
Statement-level triggers on `interactions`, `coding_sessions`, `events` and `profiles` broadcast
`{table}` on the public Realtime channel `dashboard-activity` (0021).

## Edge Functions

| Function | Auth | What it does |
|---|---|---|
| `explain` | student JWT | produces the hint ladder (pipeline below) |
| `generate-summary` | student JWT | rewrites the `learner_profiles` texts. The server re-checks the cadence (24 h or 3 new interactions); `force` skips it and is used only after a language change |
| `record-level` | student JWT | handles L2/L3 reveals: sets `max_level_reached` and writes one event per level |
| `record-self-report` | student JWT | stores `helpful_rating`, `self_reported_outcome` and `post_confidence` |
| `log-event` | student JWT | accepts allowlisted event types; checks that the interaction or session belongs to the caller |
| `dashboard-config` | dashboard token in the body | returns the provider, model and limits. Never returns keys or URLs |

**`explain` pipeline:**
1. Validate the request (`code` ≤ 8000 chars, `freeText` ≤ 300).
2. Look up the cache. A hit costs no quota.
3. Check the rate limit.
4. Call the LLM (structured output, temperature 0.2).
5. Validate the structure and run the pedagogical checks, with at most one whole-object repair pass.
6. If a hard failure (wrong language, or private summary leaked) happens twice, degrade to L0+L1 only and set
   `gatingDegraded`.
7. Write the cache, the interaction and the usage, then bump the `learner_profiles` counter.

**Conventions that keep `explain` working:**
- **Vendor isolation.** Only `_shared/providers/` knows which vendor is used. To add one, write an adapter and
  add a case in `registry.ts`. A misconfiguration throws at cold start; there is never a silent default.
- **Prompt caching.** The system message must stay byte-identical for every student with the same language and
  programming language. Per-student data (the rolling summary) goes in the user message (addendum §2).
- **Cache key.** `computeCacheKey` / `normalizeErrorSignature` in `_shared/cache.ts` define it. Changing either
  invalidates the whole cache. The null course/week parts stay in the key on purpose.

## Environment variables (Edge Function secrets, names only)

- Provided by Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- Required: `AI_PROVIDER` (`openai` | `anthropic` | `gemini` | `openai_compatible`), `AI_API_KEY`, `AI_MODEL`.
  `AI_BASE_URL` is also required with `openai_compatible`.
- Optional:
  - Fallback provider: `AI_FALLBACK_PROVIDER`, `AI_FALLBACK_API_KEY`, `AI_FALLBACK_MODEL`, `AI_FALLBACK_BASE_URL`.
  - Timeout and output size: `AI_TIMEOUT_MS`, `AI_MAX_OUTPUT_TOKENS`, `AI_MAX_OUTPUT_TOKENS_TR`,
    `AI_MAX_OUTPUT_TOKENS_ES`.
  - Rate limits: `RATE_LIMIT_HOURLY`, `RATE_LIMIT_DAILY`. These are only defaults; the `rate_limits` row wins
    when it exists.

## Writing a migration

- Use the next free number (`0025`). Start with a header comment giving the reason and the addendum section or
  feature tag.
- For a new table, enable RLS in the same migration and add only the policies the client truly needs. Never add
  client insert/update policies on tables that Edge Functions own (`interactions`, `events`, …).
- For `SECURITY DEFINER` functions:
  - Use `set search_path = ''` and fully qualified names, and `revoke all … from public`.
  - Dashboard RPCs must call `dashboard.require_session()` or `require_admin()` first.
  - Log data or account changes with `dashboard.audit(...)`.
  - Grant execute to `anon, authenticated`.
  - Helpers in the `dashboard` schema are never granted to API roles.
- When changing an RPC's parameter list, drop the old signature in the same migration.
- If the dashboard should refresh live when a new table is written, add the `dashboard_broadcast` trigger. The
  broadcast payload must never carry row data, because anyone with the publishable key can join the channel.

## Known gaps

- `explain` does not check that the `sessionId` in the body belongs to the caller; `log-event` does check.
  The foreign key only proves the session exists.
- The consent withdrawal flow is missing. See the root `CLAUDE.md`.
