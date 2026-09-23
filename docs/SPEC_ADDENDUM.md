# AI Code Feedback V2 — Spec Addendum

This document patches the issues found in review of the original build spec
(`AI Code Feedback — Version 2`, referred to below as "the base spec"). Every
entry references the base spec's section number, states the problem, and
gives the concrete fix. Where the base spec left something unspecified
entirely, that's called out rather than invented silently.

Treat this file as authoritative over the base spec wherever the two
disagree. Nothing here changes the product's design principles (§1.3–1.5) —
these are corrections to make the architecture internally consistent and
actually buildable within the stated constraints (§2.2).

---

## 1. RLS policies (replaces §5.3 in full)

Two problems in the base spec's policy block:

- It grants `own_rows_insert on interactions ... with check (auth.uid() =
  user_id)` — a client-side insert right on the exact table the surrounding
  prose says must be Edge-Function-only. As written, any student can call the
  Supabase REST API directly with their JWT and write fabricated
  `interactions` rows (fake `helpful_rating`, fake `model_used`, fake
  `cache_hit`), corrupting the research dataset and bypassing rate limiting.
- §5.2 requires the client to defensively insert a `profiles` row if the
  trigger failed, but no INSERT policy exists on `profiles`. Default-deny RLS
  means that defensive path silently fails.

While fixing these, two more gaps surfaced: nothing grants the client the
ability to create the `coding_sessions` row that `sessionId` in every
`/explain` request (§10.1) presupposes must already exist, and consent
decisions (§13.1) have no write path at all.

**Full corrected policy set:**

```sql
-- ============ profiles ============
create policy own_profile_select on profiles
  for select to authenticated using (auth.uid() = id);

create policy own_profile_insert on profiles
  for insert to authenticated with check (auth.uid() = id);

create policy own_profile_update on profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Column-level guard RLS can't express directly: username must not change
-- after creation (prevents a student silently renaming into a freed or
-- reserved username — see §7 below on username squatting).
create or replace function prevent_username_change()
returns trigger language plpgsql as $$
begin
  if new.username is distinct from old.username then
    raise exception 'username is immutable';
  end if;
  return new;
end;
$$;
create trigger profiles_lock_username
  before update on profiles
  for each row execute function prevent_username_change();

-- ============ courses / course_weeks ============
-- unchanged from base spec: enrolled-read only, no client writes.

-- ============ coding_sessions ============
-- Session bookkeeping carries no cost/quota risk, so the client owns it.
create policy own_session_select on coding_sessions
  for select to authenticated using (auth.uid() = user_id);
create policy own_session_insert on coding_sessions
  for insert to authenticated with check (auth.uid() = user_id);
create policy own_session_update on coding_sessions
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============ interactions ============
-- READ ONLY from the client (sidebar history view, §9.3). All writes —
-- create and update — happen inside explain/followup/events with the
-- service-role key, which bypasses RLS. No insert/update policy here,
-- deliberately.
create policy own_interactions_select on interactions
  for select to authenticated using (auth.uid() = user_id);

-- ============ events ============
-- No client policies at all. The client never reads events back; it only
-- ever posts them through the /events function, which uses the service
-- role. (This matches usage_counters below.)

-- ============ followup_turns (new table, see §3) ============
create policy own_followup_select on followup_turns
  for select to authenticated using (auth.uid() = user_id);
-- writes: service role only, via /followup.

-- ============ explanations ============
-- unchanged from base spec: readable if enrolled in the owning course
-- (or course_id is null), no client writes.

-- ============ learner_profiles ============
-- Not read or written by the client in any flow described in the base
-- spec. No client policies. Service role only.

-- ============ usage_counters ============
-- unchanged from base spec: no client policies at all.

-- ============ consent_log ============
-- Consent capture is low-risk, not cost/quota-bearing, and gates
-- telemetry/model calls (§13.1) — the client needs a direct write path
-- so first-run consent isn't blocked on an extra Edge Function round trip.
create policy own_consent_select on consent_log
  for select to authenticated using (auth.uid() = user_id);
create policy own_consent_insert on consent_log
  for insert to authenticated with check (auth.uid() = user_id);
-- Withdrawal (status = 'withdrawn') is still written here directly by the
-- withdraw-consent Edge Function using the service role — see §8 below —
-- so no update/delete policy is needed on this table either.
```

---

## 2. Appendix B — prompt assembly (replaces the prompt layout)

**Problem:** §6.4 makes byte-identical prefix caching a explicit cost
control ("getting this wrong multiplies cost with no functional
difference"). But the base spec's system message embeds `{ROLLING_SUMMARY}`
— per-user content that changes roughly every 10 interactions (§10.6) —
inside the block that's supposed to be the stable, cacheable prefix. That
makes the "static" prefix different for every student and unstable over
time for any single student, which defeats prefix caching almost entirely
for every provider, and specifically breaks the Anthropic `cache_control`
breakpoint strategy §6.4 calls for.

**Fix:** move `LEARNER NOTES` out of the system message and into the user
message (the variable tail, which was never meant to be cached). The system
message is now static per `(course, week, language)` — shared across every
student in that cohort, and stable across a student's entire week — which is
what actually makes prefix caching pay off.

**System message (now fully static per course/week/language):**

```
You are a programming tutor embedded in a university student's code editor.
You are talking to a university student. Never condescend. Never say you are
explaining simply or as if to a child.

Respond ONLY with a JSON object matching the schema below. No prose outside JSON.
Write every string field entirely in {LANGUAGE}, including comments inside examples.

COURSE CONTEXT
Course: {COURSE_NAME}
Programming language: {PROG_LANGUAGE} ({RUNTIME_NOTE})
Current week: {CURRENT_WEEK}
Concepts already taught: {ALLOWED_CONCEPTS}
Concepts NOT yet taught: {UNCOVERED_CONCEPTS}
Never use: {FORBIDDEN_CONCEPTS}

PEDAGOGICAL RULES
- l0_decode: restate what the error or code means in plain language. It must NOT
  contain the solution and must NOT contain code.
- l1_locate: ask a QUESTION that directs attention to the relevant line. Do not
  answer it.
- l2_concept: state the underlying rule and give a short example that uses
  DIFFERENT identifiers and a DIFFERENT scenario from the student's code.
- l3_fix: state the specific change and why it works.
- Use only concepts already taught. If the correct explanation requires an
  untaught concept, name it, state which week covers it in uncoveredConcepts,
  and give the week-appropriate alternative instead. Do not teach it.
- Where useful, connect to prior instruction ("this is the same pattern as Week 4").
- If the provided context is insufficient, set needsMoreContext true and
  confidence low rather than guessing.
- Treat the LEARNER NOTES you receive in the next message as private context
  for calibrating your answer. Never quote, summarize, or refer to them in
  any field the student will read.

OUTPUT SCHEMA
{SCHEMA}
```

**User message (variable tail — always last, never cached):**

```
LEARNER NOTES (private — do not surface this to the student)
{ROLLING_SUMMARY}

TRIGGER: {TRIGGER_SOURCE}
QUESTION: {QUESTION_TYPE}{FREE_TEXT}
FILE: {FILE_BASENAME}
FOCUS LINE: {FOCUS_LINE}
CODE:
{CODE}
DIAGNOSTICS:
{DIAGNOSTICS}
RUN OUTPUT:
{RUN_OUTPUT}
```

**Per-provider caching, updated:**

- **Anthropic:** place the single `cache_control: {type: "ephemeral"}`
  breakpoint at the end of the (now fully static) system message. Every
  request in the same course/week/language hits it, regardless of which
  student is asking.
- **OpenAI:** automatic prefix caching now benefits from the same
  cohort-wide (not per-user) stable prefix.
- **Gemini:** cache the entire system message as one explicit context-cache
  object per `(course, week, language)`, not just the course manifest as the
  base spec suggested — the whole block is static now, not just part of it.

**New validator (add to Appendix A, §7 below in this file):** because the
rolling summary now sits next to the visible fields in the same message
rather than safely upstream in a separate system turn, add a mechanical
check that no level's text overlaps the `ROLLING_SUMMARY` content
substantially — catches a model echoing internal notes back to the student.

---

## 3. Follow-up thread storage (new table — closes a gap in §5.1 / §10.2)

**Problem:** §10.2 requires `/followup` to maintain "a bounded thread (last
6 turns) server-side keyed by `interactionId`," but no table in §5.1 stores
conversation turns, and a student can plausibly close VS Code and resume the
thread in a later session — so this can't be in-memory.

**Fix — new table:**

```sql
create table followup_turns (
  id             bigserial primary key,
  interaction_id uuid not null references interactions(id) on delete cascade,
  user_id        uuid not null references profiles(id) on delete cascade,
  turn_index     int not null,
  role           text not null check (role in ('student','assistant')),
  kind           text check (kind in ('still_confused','free_text')),
  representation text check (representation in ('analogy','trace','worked_example')),
  content        text not null,
  created_at     timestamptz not null default now(),
  unique (interaction_id, turn_index)
);
create index on followup_turns (interaction_id, turn_index);
alter table followup_turns enable row level security;
-- policies: see §1 above.
```

`/followup` behavior: read the last 6 rows for `interaction_id` ordered by
`turn_index desc limit 6` (reverse for chronological order) to build the
model's history, then insert two new rows — the student's turn and the
assistant's answer — at `max(turn_index)+1` and `+2`. Older turns are kept
for research completeness; only the 6 most recent are ever fed back into the
model, matching the base spec's stated bound.

---

## 4. Interaction-row updates after creation (closes a gap in §10)

**Problem:** `interactions.helpful_rating`, `max_level_reached`,
`followup_count`, `still_confused_count`, `resolved` / `resolved_at`, and
`time_to_first_edit_ms` all need to change after the row is created by
`/explain`, but §10 defines no update path — and per §1 above, the client
correctly has no direct write access to `interactions`. Adding a bespoke
endpoint per field would multiply the API surface for no reason, since all
of these are already driven by events already flowing through `/events`
(§10.3, §12.2).

**Fix:** give `/events` a small server-side reducer that runs, with the
service-role key, after the batch insert — and only over the events that
were *newly* inserted this call (via `on conflict (client_event_id) do
nothing returning *`), so retried batches don't double-apply.

| `event_type` | Update applied to `interactions` |
|---|---|
| `level_revealed` | `max_level_reached = greatest(max_level_reached, payload.level)` |
| `still_confused` | `still_confused_count = still_confused_count + 1` |
| `followup_sent` | `followup_count = followup_count + 1` |
| `rating_given` | `helpful_rating = payload.value` (reject if not in `{-1,0,1}`) |
| `diagnostic_resolved` | `resolved = true, resolved_at = server_ts, time_to_first_edit_ms = coalesce(interactions.time_to_first_edit_ms, payload.msToFirstEdit)` |
| `fix_applied` | event-only, no column (nothing in the schema tracks this per-interaction beyond the event log; that's sufficient for §12.3's metrics) |

Every update is scoped `where id = event.interaction_id and user_id =
event.user_id`, so a malformed or spoofed `interactionId` in the payload
can never touch another student's row (the function trusts the JWT's
`user_id`, never the payload's).

---

## 5. UI surface (resolves the [DECISION REQUIRED] in §9.3)

**Problem:** the base spec's preferred option —
`window.createWebviewTextEditorInset`, a webview inset anchored beneath a
specific line — is a **proposed API**, not stable. It's been proposed for
years without shipping and requires `--enable-proposed-api`, which directly
violates §2.2's hard constraint. Neither of the base spec's fallback options
(a hover, or a bottom-panel `WebviewView`) is actually anchored to the line:
a hover is transient and can't host free-text input; a panel view isn't
spatially tied to the code at all.

**Resolved decision — a two-tier surface, both built from stable APIs:**

1. **First reveal (L0+L1), anchored:** register a `HoverProvider` scoped to
   the pending explanation's range, and trigger it programmatically via
   `commands.executeCommand('editor.action.showHover')` at the diagnostic's
   position when the CodeLens/CodeAction is clicked. This is a real,
   line-anchored popup using only stable APIs. `L2`/`L3` reveal buttons are
   command links inside the same `MarkdownString`; clicking one updates
   internal state and re-invokes `showHover` so the popup refreshes in
   place rather than being lost.
2. **Anything needing to survive cursor movement or take input (L2/L3 once
   revealed, "I still don't understand," free-text follow-up, the 👍/👎
   rating):** a "Continue in panel" command link promotes the same
   interaction into a `WebviewView` registered in the **panel area**
   (bottom, per base-spec option 3) — not the sidebar. When promoted, a
   `TextEditorDecorationType` highlights the source line/gutter so the
   panel and the code stay visually linked even though they aren't pixel-
   adjacent. The panel is where free-text input, the representation-cycling
   "I still don't understand" control, and Apply Fix live, since a hover
   cannot host any of those.

Both surfaces render from the same `levels` object — the hover is a
read-only projection of it, the panel is the full interactive surface. This
keeps the "appears exactly where the confusion is" principle for the
first-click moment (§1.3) that matters most, while being honest that a
hover can't carry the whole experience, and it doesn't need any API beyond
`languages.registerHoverProvider`, `commands.executeCommand`,
`window.createTextEditorDecorationType`, and
`window.registerWebviewViewProvider` — all stable since well before the
`^1.90.0` engine floor.

Prototype this against the M2 exit criterion before building the rest of
the hint ladder UI on top of it.

---

## 6. Course-week calendar resolution (extends §7.3)

**Problem:** `currentWeek = floor((today - start_date) / week_length_days)
+ 1` has no accommodation for a semester break. One holiday week
permanently desyncs the derived week from the syllabus for the rest of the
term — and concept gating (§7.5), which is tested as an explicit M3 exit
criterion, would then gate against the wrong week for every remaining week.

**Fix — two instructor-facing knobs, both optional:**

```sql
alter table courses add column week_override int;      -- manual pin
alter table courses add column paused_days int not null default 0;  -- cumulative
```

```
currentWeek =
  course.week_override is not null
    ? course.week_override
    : floor((today - course.start_date - paused_days) / course.week_length_days) + 1
clamped to [1, max(week_no)]
```

`paused_days` accumulates the number of calendar days any break spanned
(instructor adds to it once per break); `week_override` is an escape hatch
for pinning the week directly when the formula still doesn't match reality.
Document both in `docs/INSTRUCTOR.md`.

---

## 7. Token budget for non-English output (extends §6.1, §15.3)

**Problem:** Appendix A's character caps across all four levels sum to
~3000 characters of content plus JSON structural overhead, against a
default `AI_MAX_OUTPUT_TOKENS` of 1200. That's plausible for English but
tight for Turkish, which can tokenize worse than its raw character-length
overhead suggests — this is exactly the shape of V1's defect #4
(Appendix C), just with a higher cap.

**Fix:**

- Raise the default to `AI_MAX_OUTPUT_TOKENS=1600`, and add optional
  per-language overrides read at cold start: `AI_MAX_OUTPUT_TOKENS_TR`,
  `AI_MAX_OUTPUT_TOKENS_ES` (fall back to the base value if unset).
- Add an explicit, objective property to the §15.3 evaluation set, since
  this was the highest-profile V1 failure and deserves a direct regression
  test rather than only a fluency spot-check: **the provider's stop reason
  is `stop`, never `length`/`max_tokens`, on every case in the eval set, in
  all three languages.** Fluency checks tell you the prose is good;
  this tells you it wasn't cut off.

---

## 8. Username recovery path (extends §4.3's accepted-risk note)

**Problem:** §4.3 only accepts the enumeration risk (can someone tell a
username exists). It doesn't address the more serious failure mode: with
email confirmation and password recovery both disabled (§4.2), whoever
registers a username first — by accident, or by deliberately trying
classmates' likely usernames — permanently locks the real owner out, with
**no recovery mechanism specified anywhere in the base spec.**

**Fix — a minimal instructor-invoked reset path, kept out of the student
client entirely so it doesn't expand student-facing scope:**

New Edge Function `admin-reset-password`:

```jsonc
// POST /functions/v1/admin-reset-password
// Header: Authorization: Bearer <instructor's own Supabase session JWT>
{ "username": "string", "newPassword": "string" }
```

The function checks the caller's JWT maps to a `profiles` row with an
`enrollments` row where `role = 'instructor'` for the course the target
username belongs to, then calls `auth.admin.updateUserById` with the
service-role key to set the new password. The instructor communicates the
new password to the student out-of-band (in person, on the lab machine).
No client UI is built for this in V2 — document the `curl`/`supabase
functions invoke` invocation in `docs/INSTRUCTOR.md` so it stays a rare,
deliberate instructor action rather than a self-service flow that would
reopen the same squatting risk.

---

## 9. Consent withdrawal (replaces §13.1's deletion description)

**Problem:** §13.1 says withdrawal "deletes the user's `events` and
`interactions` rows," but leaves `learner_profiles`, `usage_counters`, and
the audit trail itself unaddressed. Worse, deleting `consent_log` rows
(which the base schema comment calls "consent audit") would destroy the
very record that withdrawal happened.

**Fix — the `withdraw-consent` Edge Function runs this sequence, service
role, in order:**

1. Insert a new `consent_log` row with `status = 'withdrawn'` — this
   record is kept, never deleted; it's the proof of the request.
2. `delete from coding_sessions where user_id = :uid` — this cascades
   automatically to `interactions` (FK `on delete cascade`), which in turn
   cascades to `events` and `followup_turns` (both FK'd to rows this
   removes). One statement clears the whole interaction/event/follow-up
   graph correctly, rather than deleting each table separately and risking
   drift if the schema changes later.
3. Reset `learner_profiles` for that user: `summary = ''`,
   `struggle_concepts = '{}'`, `mastered_concepts = '{}'`,
   `interactions_since_update = 0`.
4. Delete `usage_counters` rows for that user.
5. Set `profiles.consent_status = 'declined'`.

`explanations` (the shared cache) is correctly left untouched — it's keyed
by course/week/language/content hash, not by user, and contains no
per-student data.

---

## 10. Async summarizer trigger (closes a gap in §10.6)

**Problem:** §10.6 requires the rolling-summary update to run "off the
request path so it never adds latency," but Supabase Edge Functions have no
built-in task queue, and the base spec never says what mechanism actually
achieves this — left as-is, the natural implementation calls it
synchronously from `/explain` and adds latency to every request.

**Fix:** use `EdgeRuntime.waitUntil()`, which Supabase Edge Functions
support for background work that continues after the response has already
been sent to the client.

- Increment `learner_profiles.interactions_since_update` as part of the
  same transaction that creates the `interactions` row in `/explain`.
- After sending the response, both `/explain` and the `/events` reducer
  (§4 above, for the `session_end` case) check whether
  `interactions_since_update >= 10` **or** a `session_end` event just
  landed with `interactions_since_update > 0`. If either holds, call
  `EdgeRuntime.waitUntil(fetch(SUMMARIZE_FUNCTION_URL, { ...service-role
  auth... }))` and reset the counter to 0 immediately (not after the
  summarizer finishes, so a slow summarizer can't cause a burst of
  redundant calls).

This implements the base spec's own recommended default in §10.6 ("every 10
interactions or at session end, whichever comes first") with a concrete
mechanism instead of leaving it implicit. It also means `session_end` needs
to be an event type the client actually emits on deactivation — confirm
`extension.deactivate()` flushes the telemetry buffer (§12.1) synchronously
enough that this event isn't lost; if `deactivate()` can't guarantee that,
emit `session_end` on the last `last_seen_at` heartbeat gap instead (e.g.
server-side, a session with no heartbeat for N minutes) rather than relying
on a clean shutdown.

---

## 11. Model-output schema vs. API-response schema (clarifies Appendix A / §10.1)

Not a bug, but worth stating so an implementer doesn't validate one against
the other by mistake: **these are two different shapes.** Appendix A's JSON
Schema validates the model's *raw output* — `l0_decode`, `l1_locate`, etc.
as top-level keys. §10.1's response body nests the same four fields under
`levels`. The Edge Function validates against Appendix A first, then
reshapes into the `levels`-nested response before returning it to the
client. Keep the reshaping as one small, explicitly named function (e.g.
`toApiResponse(validated: HintLadder): ExplainResponse`) rather than
inlining it, so the two schemas don't silently drift into each other.

---

## 12. Synthetic email domain (corrects §4.2's example) and a required dashboard setting

Found by testing against the live project (`spmypppuxdtnvelkldya`) during M1, not by static review.

**No RFC 2606 reserved TLD passes Supabase Auth's email validator on this
project.** §4.2 names `students.aicodefeedback.local` as the example
`AUTH_EMAIL_DOMAIN`. Live-tested with `auth.signUp` directly against this
project across two separate sessions: `.local`, `.test`, **and `.invalid`**
are all rejected outright with `400 email_address_invalid`, before any
other logic runs. (An earlier pass through this addendum concluded
`.invalid` passed cleanly — that was wrong: a rate-limit response from an
adjacent test call was misread as a pass. A clean, isolated retest showed
`.invalid` fails exactly like the other two.) A domain shaped like a real
gTLD (`students.aicodefeedback.dev`) passes the same validator cleanly.
**Fix applied:** `AUTH_EMAIL_DOMAIN = 'students.aicodefeedback.dev'` (see
`extension/src/constants.ts`). GoTrue appears to specifically reject
reserved/non-resolving TLDs rather than merely checking syntax, which
defeats the "guaranteed non-delivery" property those TLDs exist for — so
this trades that guarantee for one that actually authenticates, on the
(correct, but load-bearing) assumption that confirmation emails are never
actually sent once the setting below is fixed. If a future deployment
changes this value, sanity-check it against a real `auth.signUp` call
first — don't assume any TLD passes, reserved or otherwise.

**Action required, outside what any tool available to this build could
reach — confirmed a second time, now with a clean, isolated reproduction:**
`auth.signUp` for a brand-new username (`emrecoban55@students.aicodefeedback.dev`)
returns `429 over_email_send_rate_limit`, and no `auth.users` row is
created (confirmed by querying `auth.users` directly). That only happens
if this project is still attempting to send a confirmation email on
signup, which means **"Email confirmation" is still enabled**, contradicting
the hard requirement in §4.2 ("Email confirmation: disabled — otherwise
auto-registration cannot return a usable session"). This is what produced
the "Something went wrong while signing in." error the first end-to-end
test hit. None of the Supabase MCP tools available to this build expose
Auth configuration (only project/database/Edge Function management) — this
has to be flipped by hand:

**Supabase Dashboard → Authentication → Sign In / Providers → Email →
turn off "Confirm email"** (also worth turning off "Secure email change"
and confirming "Allow new users to sign up" is on, per §4.2's other
settings). Until this is done, every new student's first sign-in will hit
a branch the client now handles clearly rather than generically —
`SessionManager.signIn` maps `over_email_send_rate_limit` (and
`email_address_invalid` / `email_provider_disabled`, defensively) to
`server_misconfigured`, surfaced to the student as "Sign-in is temporarily
unavailable. Please tell your instructor." rather than a bare "Something
went wrong." — but registration will not actually succeed end to end until
the toggle above is off.

---

## Summary of net-new schema objects introduced by this addendum

```sql
alter table courses add column week_override int;
alter table courses add column paused_days int not null default 0;

create table followup_turns (
  id             bigserial primary key,
  interaction_id uuid not null references interactions(id) on delete cascade,
  user_id        uuid not null references profiles(id) on delete cascade,
  turn_index     int not null,
  role           text not null check (role in ('student','assistant')),
  kind           text check (kind in ('still_confused','free_text')),
  representation text check (representation in ('analogy','trace','worked_example')),
  content        text not null,
  created_at     timestamptz not null default now(),
  unique (interaction_id, turn_index)
);
create index on followup_turns (interaction_id, turn_index);
alter table followup_turns enable row level security;
```

New Edge Function: `admin-reset-password` (§8).
New Edge Function: `withdraw-consent` (§9) — was implied but undefined in
the base spec's command list (§14 lists `aiFeedback.withdrawConsent` as a
client command, but §10's API contracts never defined its backend).

---

## 13. `vscode.l10n` cannot implement per-student language (corrects §11.2)

Found while implementing the sidebar's language picker (M2+), not by
static review — the base spec's own §11.1 distinguishes "UI language"
from "VS Code's own display language" as separate concepts, but §11.2
prescribes `vscode.l10n` as the mechanism for runtime strings without
flagging that `vscode.l10n.t()` cannot actually deliver that distinction.

**The mechanism `vscode.l10n` provides is: one bundle, chosen once at
extension activation, based on VS Code's own configured display
language — for the entire session, for every user of that VS Code
process.** There is no API to select a different bundle at runtime based
on a value the extension controls (a database column, a dropdown
selection). This is a hard blocker for this product specifically: base
spec §1.1 states lab machines are shared, which means one shared VS Code
installation's display-language setting, while the whole point of
`feedback_language` (§5.1) is that each student picks their own. Two
students on the same lab machine can never each get their own language
out of `vscode.l10n` — the second student to sign in would just see
whatever the first student's choice (or the machine's fixed display
language) already set.

**Fix applied:** every string whose language should follow the student's
own choice — the sidebar webview's own text, sign-in prompts, error
messages, the consent dialog, CodeLens/CodeAction titles — is now sourced
from a hand-maintained table keyed by the same language value stored in
`profiles.feedback_language`, not from `vscode.l10n.t()`. See
`extension/src/i18n/strings.ts` (non-webview code) and the `STRINGS`
table in `extension/src/ui/sidebarView.ts` (the webview, which needs its
own copy since it runs in a separate JS context with no access to the
extension host's modules). Changing the picker calls `setLanguage()`
immediately and also fires `DiagnosticTrigger.refresh()` so CodeLenses
already on screen redraw with the new language's title rather than
waiting for the next diagnostics change to pick it up.

**What still correctly uses VS Code's own display language:**
`package.nls.*.json` — command palette entries, the settings UI, and view
container names. That text belongs to VS Code's own chrome, which a
Turkish-display-language user reasonably expects in Turkish regardless of
which feedback language they've picked inside the extension; the two are
legitimately different axes, and only one of them (`feedback_language`)
needed the runtime-switchable per-student table. The `l10n/` bundle
directory and `package.json`'s `"l10n"` field were removed as dead weight
once every `vscode.l10n.t()` call site was migrated — keeping unused
translation bundles around would just be a trap for the next person
who edits one expecting it to do something.

---

## 14. The sidebar view container corrects to the panel area (revises §9.3)

Reported directly by a student testing the extension: clicking the AI
Code Feedback activity-bar icon hid the Explorer, and vice versa — the
two could never be visible together. This isn't a bug specific to this
extension; VS Code's primary side bar can only display one view
container at a time, full stop, for every extension that contributes to
`viewsContainers.activitybar`. Base spec §9.3 calls the sidebar the
fallback "session review log" surface without flagging that an
activity-bar placement structurally conflicts with the Explorer the
student is coding in.

**Fix applied:** the view container moved from `activitybar` to `panel`
in `extension/package.json` (same region as Terminal/Output/Problems, at
the bottom of the window) — a location VS Code keeps entirely separate
from the primary side bar, so Explorer and this view can be open at the
same time. No source change was needed: `views.aiFeedback`,
`SidebarViewProvider`'s registration, and the
`workbench.view.extension.aiFeedback` reveal command are all
container-location-agnostic. The class is still named
`SidebarViewProvider` for now — purely cosmetic leftover naming, not
worth a disruptive rename on its own.

An alternative some users may still prefer: VS Code's secondary side bar
(right-hand side, `Cmd/Ctrl+Alt+B` or the "Open Secondary Side Bar"
command) can hold any view simultaneously with the primary side bar too —
but placement there is user-driven drag-and-drop only; there is no
`viewsContainers` location an extension can declare to default into it.
Confirmed directly against the current VS Code extension API docs
(`contributes.viewsContainers` accepts only `activitybar` and `panel` —
nothing else, for any extension), not just assumed.

**Reverted back to `activitybar` on explicit instruction**, after being
told the tradeoff plainly: the Explorer-hiding problem this section
exists to describe is back. The deciding factor given was that manual
drag-to-secondary-sidebar placement doesn't survive base spec §1.1's
"lab machines reset on reboot" -- every student would need to redo it
by hand, every session, with no way to know to. Between "reliably back
to the original bug" and "a fix that quietly stops working on exactly
the machines this ships to," `activitybar` was chosen anyway; noted here
so the reasoning isn't lost if this gets revisited.

---

## 15. [USER-STATS]: scoped implementation of the expanded stats view (supersedes §10)

A roadmap proposed expanding the sidebar's stats section into four bands
(narrative summary, suggested practice, interaction history, cumulative
numbers). Before building any of it, each part was checked against what
the schema and edge functions actually track. Several pieces didn't
survive that check; what shipped is narrower than the roadmap, on purpose.

**Excluded outright:**
- **"Programs run"** — no run-tracking exists anywhere in the system
  (no event, no column, nothing an Edge Function observes). Faking it
  from a proxy (e.g. counting `runtime`-triggered interactions) would
  represent something the system never actually recorded. Left out
  rather than shown as a plausible-looking but fabricated number.
- **`interactions.what_to_remember`, `interactions.difficulty`** — no
  code path reads either field; the roadmap's own "where each unlocked
  capability lives" table only cites `what_to_remember` feeding "future
  review," not this view. Added later if and when something consumes them.
- **Unlimited re-explanation, scheduled cache invalidation** — both
  explicitly scoped by the roadmap itself to live outside this view (the
  hint ladder UI and a separate maintenance job, respectively). Not part
  of this pass.
- **A `globalState` local interaction log for consent-independent
  history** — turned out to already be unnecessary. `interactions` rows
  are written by `/explain` regardless of the student's consent
  choice; only the `events` telemetry table is consent-gated (§13.1,
  "declining does NOT block AI feedback — only telemetry"). History and
  the cumulative numbers already work for every signed-in student without
  a parallel client-side log.

**Simplified:**
- The roadmap's practice-problem generation described grounding on "their
  most repeated error signature." What ships grounds on the same
  `interactions.title` field the history list displays (falling back to
  `error_signature`/`trigger_source` for rows predating `title`), rather
  than adding a second concept-extraction path — one field, two consumers,
  instead of two independent pieces of model output that could drift
  apart.
- **`interactions.max_level_reached` was a silent gap, not a simplification
  target.** The column has existed since the base schema, but nothing
  ever wrote to it — the hint ladder UI's "show me the rule" / "show me
  the fix" buttons revealed content client-side only. This is a real fix,
  not a scoped-down substitute: a new `record-level` Edge Function is the
  sole writer, called from the webview on each reveal.

**Replaces §10's `EdgeRuntime.waitUntil()` mechanism entirely.** §10
proposed a background job triggered from `/explain` and the `/events`
reducer, firing at 10 accumulated interactions or on `session_end`. None
of that was ever built. Since the narrative/practice pair is only read
from this one view (not injected into prompts the way `summary` is), a
background job that runs regardless of whether anyone is looking wastes
model calls when the view goes unopened for days. What shipped instead:
the client checks staleness itself (`summary_generated_at` older than 24h
**and** `interactions_since_update >= 3`, both read directly off
`learner_profiles`, which now has a read-only own-row RLS policy) when
`refreshStats()` runs, and fires a plain `generate-summary` Edge Function
call if so — no `waitUntil`, no reducer changes, no session_end event
required. The server re-checks the same condition before spending a model
call, so a stale client-side check only ever costs one skipped request,
never a wrong write. An in-flight guard in `extension.ts` prevents
overlapping calls when `refreshStats()` fires in a burst (e.g. right
after an explanation).

**One extension call site had a name collision that needed fixing before
`generate-summary` could ship.** The Anthropic adapter forces structured
output via a tool call named `emit_hint_ladder`, described as "Emit the
four-level hint ladder explanation" — hardcoded, since `explain` was the
only caller. `generate-summary` needed its own tool name/description for
an entirely different schema; reusing the hint-ladder ones verbatim would
have told the model it was calling a hint-ladder tool while actually
handing it a summary schema. `ChatRequest` (shared provider contract)
gained optional `schemaName`/`schemaDescription` fields, defaulting to the
existing hint-ladder wording so `explain`'s behavior is unchanged;
`generate-summary` is the first caller to override them.

**Net-new schema, this pass:**
```sql
alter table interactions add column title text;

alter table learner_profiles add column student_summary text not null default '';
alter table learner_profiles add column suggested_practice text not null default '';
alter table learner_profiles add column summary_generated_at timestamptz;

create policy own_learner_profile_select on learner_profiles
  for select to authenticated using (auth.uid() = user_id);
```
`interactions.title` (3–6 words) is produced by the same model call that
generates the hint ladder — Appendix A's schema gained it as a required
field, at no extra cost or request.

**New Edge Functions:** `record-level` (writes `max_level_reached`, the
gap above), `generate-summary` (writes `student_summary`,
`suggested_practice`, `summary_generated_at`, `summary`, and resets
`interactions_since_update`).

**What the shipped view actually shows:** a narrative band (empty-state
copy for zero interactions, a "still gathering" note once there's
activity but fewer than 3 interactions since the last summary), a
suggested-practice band, a 20-row history list (title, a positive/neutral-
only outcome marker, locale-correct relative time via
`Intl.RelativeTimeFormat`), and three cumulative numbers — explanations
asked for, errors worked out yourself (`max_level_reached <= 1`), and
days using this (distinct calendar dates from `coding_sessions.started_at`,
computed client-side rather than via a dedicated aggregate query). Each
band is independently toggled and rendered from `stats/statsStore.ts`'s
`UserStatsView` shape; adding another band later is one more fetch
function plus one more `hidden`-toggled block, not a restructure.

---

## 16. `[PROMPT-AUDIT]`: the `/explain` prompt no longer implies course/week context it doesn't have

An audit of every prompt this extension sends found that `explain`'s system
message always rendered a "COURSE CONTEXT" block — `Course: Independent
study (no course configured)`, `Current week: 0`, `Concepts already taught:
none recorded`, `Programming language: X ()` (a literal dangling empty
parens) — on every single request, regardless of whether a course exists.

**Root cause:** the client hardcodes `courseId: null` in every `/explain`
request (`extension.ts`'s `requestExplanation()`) — there is no
course-selection feature in the shipped extension. `resolveCourseContext()`
therefore always short-circuits to `null` server-side, and every course-shaped
field in the prompt was a hardcoded fallback string, not real data. This
was not a prior removal that got reverted — §2's own caching design is
built *around* `(course, week, language)` as a real dimension, and nothing
in this codebase's history shows the course-context prompt block ever
being taken out. The course-selection feature was apparently never built
on the client side, leaving the server-side scaffolding to run unchanged,
producing placeholder-looking structured data that the model had no way
to distinguish from a real course integration. A manual admin script,
`supabase/scripts/import-course.ts`, can populate `courses`/`course_weeks`,
but nothing invokes it automatically, and even if it were run, the
always-`null` `courseId` means a real course would still never reach the
prompt.

**Fix — `buildSystemMessage()` (`_shared/promptAssembly.ts`) now takes a
nullable `course` object instead of pre-defaulted flat fields:**
- No course (today's reality, always): the block shrinks to a single
  `PROGRAMMING LANGUAGE` line using the client-detected language — no
  `Course:`, no `Current week:`, no `Concepts already/NOT taught:`, no
  `Never use:`. The two PEDAGOGICAL RULES bullets that depend on a
  curriculum ("use only concepts already taught," the "Week 4" example)
  are omitted too, rather than left in as unsatisfiable instructions.
- Real course (the day `courseId` is ever wired up client-side): the full
  COURSE CONTEXT block and concept-gating rules render exactly as before,
  including the fixed `Programming language: X (runtime)` format — now
  only appending `(runtime)` when non-empty, closing the dangling-`()` bug
  for that branch as well.

**Also removed, since the audit found they were being solicited from the
model and then silently discarded:** `HINT_LADDER_SCHEMA`'s `conceptsUsed`
and `uncoveredConcepts` fields (and the `HintLadder` interface fields,
`ExplainResponse`'s matching client-side fields, and
`conceptsWithinAllowed()`, the validator that checked `conceptsUsed`
against the taught-concepts list). Confirmed via grep across
`extension/src/`: neither field was ever read by the webview or anywhere
else on the client — `uncoveredConcepts` in particular required the model
to invent a `week` integer it had no real data to source, precisely
because course/week tracking doesn't exist. This wasn't a course-gated
removal; both fields were equally dead whether or not a course exists,
since nothing downstream ever consumed them. The "used untaught concepts"
hard-issue branch in `explain/index.ts`'s repair-retry logic is removed
along with it — it was already unreachable in practice (gating was
`null`-disabled given the always-absent course), and now has nothing to
check now that `conceptsUsed` isn't solicited at all.

No schema/migration changes: `courses`/`course_weeks`/`enrollments` and
`import-course.ts` are untouched, so a real course integration remains a
live possibility, not something this fix forecloses — it only stopped the
model from being told a curriculum exists when this product doesn't
currently track one.

---

## 17. Course tables removed (supersedes the "remains a live possibility" note in §16)

`courses`, `course_weeks` and `enrollments` were dropped in
`supabase/migrations/0018_drop_course_tables.sql`, together with
`supabase/scripts/import-course.ts` and the sample course files it read.
None of the three tables had ever held a row, and no deployed Edge Function
queried them: `/explain` has always sent `courseId: null` (§16).

What deliberately stays:
- The nullable `course_id` columns on `coding_sessions`, `interactions`,
  `explanations` and `learner_profiles`, now plain columns without foreign
  keys. The deployed functions still write `null` to them, and dropping them
  would need a coordinated redeploy for no benefit.
- `explanation_read`, rewritten as `course_id is null`: exactly the rows it
  already allowed, minus the enrollment branch that could no longer match.
- The `course-materials` storage bucket (0003): separate from the tables,
  and nothing reads it either, but removing it was out of scope.

A course/group feature, if it is ever wanted, starts from scratch rather
than from this scaffolding.

---

## 18. Request limits and student passwords from the dashboard

Base spec §6.5 reads the per-student limits from the `RATE_LIMIT_HOURLY` and
`RATE_LIMIT_DAILY` secrets only. Since `supabase/migrations/0024`, an admin
can set both in the research dashboard; they are stored in
`public.rate_limits` (a single row, RLS on with no policies, no grants to
`anon`/`authenticated`). `_shared/rateLimit.ts` reads that row on every
check, in parallel with the usage queries, and falls back to the secrets
when there is no row or the read fails. The secrets therefore remain the
defaults. They are not rewritten by the dashboard, because that would need a
Supabase management token with control over the whole project.

Dashboard admins can also set a student's password
(`dashboard_student_set_password`): 8–72 characters (bcrypt ignores
anything past 72 bytes), hashed with pgcrypto in the `$2a$10$` form Supabase
Auth already uses, and followed by deleting the student's `auth.sessions`
and `auth.refresh_tokens`, so the extension signs the student out
everywhere. Both actions are written to the dashboard's activity log, never
with the password.
