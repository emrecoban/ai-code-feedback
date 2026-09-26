# extension/

VS Code extension `ai-code-feedback`, publisher `EmreCOBAN`. It needs VS Code ≥ 1.90 and activates on
`onStartupFinished`. esbuild bundles strict TypeScript into one CJS file, `dist/extension.js`. Only `vscode`
is external; `@supabase/supabase-js` is bundled, so the `.vsix` ships without `node_modules`.

## Commands

- `pnpm compile` / `pnpm watch` / `pnpm typecheck` / `pnpm package` (minified production bundle).
- **Debug:** open `extension/` itself as the workspace and press F5 ("Run Extension"). It compiles first and
  starts with `--disable-extensions`.
- **Logs:** Output panel → "AI Code Feedback" (`util/logger.ts`).
- **Packaging a `.vsix`:** this isn't scripted, and `@vscode/vsce` is not a dependency. Run
  `pnpm dlx @vscode/vsce package --no-dependencies`. `--no-dependencies` is safe because everything is
  bundled, and it keeps vsce from walking pnpm's symlinked `node_modules`. vsce runs `vscode:prepublish` if
  one is defined; otherwise run `pnpm package` first. The output `*.vsix` is gitignored.

## Where things live (`src/`)

- `extension.ts`: activation, every command registration, and the orchestration between modules (sign-in,
  consent, coding session, explain request, 3-minute activity flush, stats). Most cross-module wiring is here.
- `auth/`:
  - `SessionManager` holds a supabase-js client with `persistSession`/`autoRefreshToken` off. It stores the
    session in VS Code `SecretStorage` itself, refreshes when within 120 s of expiry, and re-syncs across
    windows through `secrets.onDidChange`.
  - Sign-in and sign-up are a single button. Auth error codes are mapped to reasons such as
    `server_misconfigured`.
- `triggers/`:
  - `DiagnosticTrigger` puts "What does this mean?" on errors and warnings through a CodeLens, a lightbulb and
    a gutter chip. It shows at most 3 offers per document, debounced.
  - `SelectionTrigger` offers the same for selections through a CodeLens, a lightbulb, the status bar and
    `Cmd/Ctrl+Alt+Space`.
- `context/`: builds the packet sent to `explain`: the enclosing symbol's range (or ±20 lines as a fallback)
  plus diagnostics. It sends only the file basename, and everything goes through `redaction.ts`.
- `activity/`: local observers that know nothing about Supabase. `ActivityTracker` counts active time, lines,
  pastes, focus, saves and more. `PostFeedbackTracker` watches edits after the L3 fix is revealed.
  `AttentionTracker` detects a return to the code or abandonment.
- `stats/`: reads the student's own stats and history through RLS, and decides whether the narrative is stale
  (24 h or 3 new interactions). The server re-checks this before it spends a model call.
- `ui/sidebarView.ts`: the webview (view `aiFeedback.sidebar` in the activity-bar container). HTML, CSS and JS
  are inline template strings with a nonce-based CSP. There is no framework and no separate webview build.

## Explain flow and invariants

1. A trigger or command calls `buildContextPacket`, then `requestExplanation()`.
2. `requestExplanation()` checks sign-in. Next, consent: only `pending` blocks, and a student who **declined**
   still gets AI feedback, only telemetry is off.
3. It calls `ensureCodingSession`, then `callEdgeFunction('explain')` with a 25 s abort and `withTimeout`.
4. On success: `sidebar.setExplanation()`, then `refreshStats()`, which may fire `generate-summary`.

Invariants:
- **No stuck spinner.** The webview disables its button synchronously on click, so every early return must call
  `sidebar.setLoading(false)` (base spec Appendix C #1).
- **Activation stays fast.** No blocking network calls during activation. Session restore runs lazily after
  `activate()` returns.
- **No attribution without a session.** Activity recorded while signed out, or before a `coding_sessions` row
  exists, is discarded.
- **Level reveals.** An L2/L3 reveal travels as webview `levelReached` → `aiFeedback.recordLevelReached` →
  `record-level`. An L3 reveal also arms `PostFeedbackTracker`.
- **Research events.** Use `logResearchEvent()`, which is fire-and-forget. Give each event a deterministic
  `clientEventId` (`<type>:<interactionId>`) when it can happen only once per interaction, and a random suffix
  when it can repeat. A new event type must also be added to `ALLOWED_EVENT_TYPES` in
  `supabase/functions/log-event`.

## Webview ↔ extension host

- **Webview → host:** `ready`, `authSubmit`, `explainSelection`, `setLanguage`, `reopenExplanation`,
  `explanationCopied`, `selfReport`, `levelReached`. Most of these re-invoke internal commands.
- **Host → webview:** `state`, `explanation`, `stats`, `loading`, `authLoading`, `authError`.
- **Internal commands** are registered in `extension.ts` but are not in `contributes.commands`:
  `aiFeedback.submitAuth`, `explainDiagnostic`, `explainDiagnosticAt`, `pickQuestionPreset`,
  `setFeedbackLanguage`, `recordLevelReached`, `reopenExplanation`, `recordExplanationCopied`,
  `recordSelfReport`.
  - `explainDiagnosticAt` takes a URI *string* and a line number because `command:` hover links round-trip
    their arguments through JSON.
- **View-title buttons** are gated on the `aiFeedback.signedIn` context key.

## i18n: three separate systems, keep EN/TR/ES in sync in each

| Text | Source | Follows |
|---|---|---|
| Command palette, settings, view names | `package.nls{,.tr,.es}.json` | VS Code's display language |
| Notifications, prompts, consent, CodeLens titles | `src/i18n/strings.ts` (`t()`) | the student's feedback language |
| Everything inside the webview | `STRINGS` table in `src/ui/sidebarView.ts` | the student's feedback language |

- **Never use `vscode.l10n`.** It is fixed to VS Code's display language for the whole session, which can't
  work for different students on a shared lab machine (addendum §13).
- **Where the language is stored.** The student's language lives in `profiles.feedback_language`, with a
  device-level seed in `globalState` (`aiFeedback.lastLanguage`).
- **Dead settings.** `aiFeedback.feedbackLanguage` and `aiFeedback.uiLanguage` are declared in `package.json`
  but the code never reads them.
- **Language changes.** After changing the language, call `refresh()` on both triggers so CodeLenses already on
  screen redraw.

## Other gotchas

- The class is still named `SidebarViewProvider`, but the container is the activity bar. Moving it to the panel
  was tried and reverted on purpose (addendum §14). Don't move it again without asking.
- **The consent text is versioned.** `CONSENT_TEXT_VERSION` in `constants.ts` is written to `consent_log`, so
  bump it whenever you change the wording.
- **Redaction patterns fail safe.** Over-redacting is acceptable; leaking a real key is not. Add patterns and
  don't loosen existing ones.
- **Some counters are totals, not deltas.** `flushActivity()` merges most counters by addition, but
  `files_visited` is a session-wide distinct count and is assigned.
