import * as vscode from 'vscode';
import { randomUUID } from 'node:crypto';
import { SecretStore } from './auth/secretStore';
import { SessionManager, type SignInFailureReason } from './auth/sessionManager';
import { SidebarViewProvider } from './ui/sidebarView';
import { ensureConsent, type ConsentStatus } from './consent/consentFlow';
import { callEdgeFunction, BackendError } from './backend/client';
import type { ExplainRequest, ExplainResponse, TriggerSurface } from './backend/types';
import { buildContextPacket } from './context/contextPacket';
import { DiagnosticTrigger, isOfferable } from './triggers/diagnosticTrigger';
import { SelectionTrigger } from './triggers/selectionTrigger';
import { fetchUserStats, fetchInteractionLadder } from './stats/statsStore';
import { ActivityTracker } from './activity/activityTracker';
import { PostFeedbackTracker, type PostFeedbackEdit } from './activity/postFeedbackTracker';
import { AttentionTracker } from './activity/attentionTracker';
import { logResearchEvent, type ResearchEventType } from './backend/researchEvents';
import { guessDefaultFeedbackLanguage } from './i18n/language';
import { t, setLanguage, getLanguage, type Language } from './i18n/strings';
import { initAffordanceChrome } from './util/affordanceChrome';
import { logger } from './util/logger';
import { withTimeout, isTimeoutOrAbort } from './util/timeout';

const LANGUAGE_STORAGE_KEY = 'aiFeedback.lastLanguage';
const FEEDBACK_LANGUAGES = ['en', 'tr', 'es'] as const;
const TEXT_SIZE_STORAGE_KEY = 'aiFeedback.textSize';
type TextSize = 'normal' | 'large';
const ACTIVITY_FLUSH_INTERVAL_MS = 3 * 60_000; // 3 minutes

// Read from the manifest in activate() rather than hardcoded: every
// coding_sessions row records the version that produced it, so a stale
// literal here would silently mislabel which build a student's research
// data came from after any release.
let extensionVersion = '0.0.0';
let codingSessionId: string | undefined;
let failedSignInAttempts = 0;
let throttledUntil = 0;
let globalState: vscode.Memento | undefined;
// [FEEDBACK-EFFECTIVENESS]: bridges requestExplanation() (which has the
// response's l3_fix text and the document it was about) to
// recordLevelReached() (which only learns *when* level 3 is actually
// revealed, from the webview's existing 'levelReached' message) -- see
// PostFeedbackTracker for what happens once armed. Entries are removed as
// soon as they're consumed; an explanation whose fix is never revealed
// leaves a small orphaned entry (two short strings) for the life of the
// extension host, which is not worth extra cleanup machinery at this scale.
const pendingFixByInteraction = new Map<string, { documentUri: string; fixText: string; focusLine: number }>();
// [STUDENT-ACTIVITY-DATA]: set in activate(), called from deactivate() for
// a best-effort final flush -- not guaranteed on an abrupt shutdown/crash,
// since VS Code only awaits deactivate() during a normal exit.
let finalActivityFlush: (() => Promise<void>) | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  globalState = context.globalState;
  extensionVersion = (context.extension.packageJSON as { version?: string }).version ?? extensionVersion;

  // Seed with whatever language this machine last used, before we even
  // know if anyone is signed in -- otherwise the very first sign-in
  // prompt of a fresh VS Code session would always show in English
  // regardless of the student's actual preference (docs/SPEC_ADDENDUM.md
  // §13: vscode.l10n can't do this, since it's locked to VS Code's own
  // display language, not to a value this extension controls).
  const storedLanguage = context.globalState.get<Language>(LANGUAGE_STORAGE_KEY);
  setLanguage(storedLanguage ?? guessDefaultFeedbackLanguage());
  initAffordanceChrome(context.globalState);

  const secretStore = new SecretStore(context.secrets);
  const sessionManager = new SessionManager(secretStore);
  const attentionTracker = new AttentionTracker(
    (interactionId, level, msToReturn) =>
      void logResearchEvent(sessionManager, {
        eventType: 'returned_to_code',
        clientEventId: `returned_to_code:${interactionId}:${level}`,
        interactionId,
        payload: { level, msToReturn },
      }),
    (interactionId, level, reason) =>
      void logResearchEvent(sessionManager, {
        eventType: 'feedback_abandoned',
        clientEventId: `feedback_abandoned:${interactionId}:${level}`,
        interactionId,
        payload: { level, reason },
      }),
  );
  const sidebar = new SidebarViewProvider(
    (interactionId, dwell) =>
      void logResearchEvent(sessionManager, {
        eventType: 'explanation_visibility',
        clientEventId: `explanation_visibility:${interactionId}`,
        interactionId,
        payload: dwell,
      }),
    (interactionId, level) => attentionTracker.noteFeedbackShown(interactionId, level),
  );
  const diagnosticTrigger = new DiagnosticTrigger(context, (interactionId, resolution) =>
    void logResearchEvent(sessionManager, {
      eventType: 'diagnostic_resolved',
      clientEventId: `diagnostic_resolved:${interactionId}`,
      interactionId,
      payload: { ...resolution },
    }),
    (episode) => logSessionEvent(sessionManager, 'file_cleared', { ...episode }),
  );
  const selectionTrigger = new SelectionTrigger(context);
  const activityTracker = new ActivityTracker((exitCode) =>
    logSessionEvent(sessionManager, 'run_finished', { exitCode: exitCode ?? null, success: exitCode === 0 }),
  );
  const postFeedbackTracker = new PostFeedbackTracker(
    (interactionId, edit) => void logPostFeedbackEdit(sessionManager, interactionId, edit),
    (interactionId) =>
      void logResearchEvent(sessionManager, {
        eventType: 'fix_undone',
        clientEventId: `fix_undone:${interactionId}`,
        interactionId,
        payload: {},
      }),
  );

  // [STUDENT-ACTIVITY-DATA]: periodic sync to this session's
  // coding_sessions row, independent of whether the student ever asks for
  // an explanation. flushActivity() itself decides whether there's
  // anywhere to persist to (discards activity while signed out).
  const activityFlushTimer = setInterval(
    () => void flushActivity(sessionManager, activityTracker, diagnosticTrigger),
    ACTIVITY_FLUSH_INTERVAL_MS,
  );
  finalActivityFlush = async () => {
    // The last explanation of a session has no successor to end its dwell,
    // so it is reported here instead of being dropped.
    sidebar.flushExplanationDwell();
    await flushActivity(sessionManager, activityTracker, diagnosticTrigger);
  };

  // [AUTH-TOOLBAR] text-size control: a device preference, not tied to
  // any one account, so it's restored the same way as the language seed
  // above -- before sign-in is even checked -- rather than waiting on the
  // async restore() below.
  const storedTextSize = context.globalState.get<TextSize>(TEXT_SIZE_STORAGE_KEY);
  sidebar.setTextSize(storedTextSize ?? 'normal');

  context.subscriptions.push(
    secretStore,
    diagnosticTrigger,
    selectionTrigger,
    activityTracker,
    postFeedbackTracker,
    attentionTracker,
    { dispose: () => clearInterval(activityFlushTimer) },
    vscode.window.registerWebviewViewProvider(SidebarViewProvider.viewId, sidebar),
    vscode.languages.registerCodeLensProvider({ scheme: 'file' }, diagnosticTrigger),
    vscode.languages.registerCodeActionsProvider(
      { scheme: 'file' },
      diagnosticTrigger,
      { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] },
    ),
    vscode.languages.registerCodeActionsProvider(
      { scheme: 'file' },
      selectionTrigger,
      { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] },
    ),
    vscode.languages.registerCodeLensProvider({ scheme: 'file' }, selectionTrigger),
    sessionManager.onDidChangeAuth((state) => {
      sidebar.setAuthState(state);
      // [AUTH-TOOLBAR]'s view/title buttons are gated on this context key
      // in package.json's "when" clause -- VS Code has no other way for a
      // static menu contribution to react to runtime state.
      void vscode.commands.executeCommand('setContext', 'aiFeedback.signedIn', state.signedIn);
      if (!state.signedIn) codingSessionId = undefined;
    }),
    // [WELCOMEVIEW] is a real form embedded in the sidebar now, not a
    // QuickInput flow -- these two just reveal the panel the form lives in.
    vscode.commands.registerCommand('aiFeedback.signIn', () =>
      vscode.commands.executeCommand('workbench.view.extension.aiFeedback'),
    ),
    vscode.commands.registerCommand('aiFeedback.signOut', () => sessionManager.signOut()),
    vscode.commands.registerCommand('aiFeedback.switchAccount', async () => {
      await sessionManager.signOut();
      await vscode.commands.executeCommand('workbench.view.extension.aiFeedback');
    }),
    // Internal command, invoked from [WELCOMEVIEW]'s single Log in / Sign
    // Up button.
    vscode.commands.registerCommand('aiFeedback.submitAuth', (username: string, password: string) =>
      submitAuth(sessionManager, sidebar, username, password),
    ),
    // Reachable from the command palette as well as the sidebar button,
    // which is why the surface defaults rather than being assumed.
    vscode.commands.registerCommand('aiFeedback.explainSelection', (surface?: TriggerSurface) =>
      explainSelection(sessionManager, sidebar, { triggerSurface: surface ?? 'command_palette' }),
    ),
    // Internal command, invoked with arguments from the CodeLens/CodeAction
    // the diagnostic trigger contributes -- not in contributes.commands.
    vscode.commands.registerCommand(
      'aiFeedback.explainDiagnostic',
      (uri: vscode.Uri, diagnostic: vscode.Diagnostic, surface: TriggerSurface = 'diagnostic_codelens') =>
        explainDiagnostic(sessionManager, sidebar, diagnosticTrigger, uri, diagnostic, surface),
    ),
    // Internal command, invoked only from the chip decoration's hover
    // link -- takes a URI string + line number rather than a Uri/
    // Diagnostic, since command: links round-trip their arguments
    // through JSON and a Uri's computed properties don't survive that.
    vscode.commands.registerCommand(
      'aiFeedback.explainDiagnosticAt',
      (uriString: string, line: number, surface: TriggerSurface = 'diagnostic_gutter_hover') =>
        explainDiagnosticAt(sessionManager, sidebar, diagnosticTrigger, uriString, line, surface),
    ),
    // Base spec §8.2's question picker -- bound to the selection lightbulb,
    // the status bar item, and the Cmd/Ctrl+Alt+Space keybinding.
    vscode.commands.registerCommand('aiFeedback.pickQuestionPreset', (surface: TriggerSurface = 'selection_keybinding') =>
      pickQuestionPreset(sessionManager, sidebar, surface),
    ),
    // Internal command, invoked from [WELCOMEVIEW]'s signed-out language <select>.
    vscode.commands.registerCommand('aiFeedback.setFeedbackLanguage', (language: string) =>
      setFeedbackLanguage(sessionManager, sidebar, diagnosticTrigger, selectionTrigger, language),
    ),
    // [AUTH-TOOLBAR]'s globe icon -- the signed-in equivalent of
    // [WELCOMEVIEW]'s <select>, as a QuickPick instead since there's no
    // dropdown living in the view once signed in.
    vscode.commands.registerCommand('aiFeedback.changeFeedbackLanguage', () =>
      changeFeedbackLanguage(sessionManager, sidebar, diagnosticTrigger, selectionTrigger),
    ),
    // [AUTH-TOOLBAR]'s text-size icon -- a device display preference, not
    // tied to any account, so no sessionManager/sign-in plumbing needed.
    vscode.commands.registerCommand('aiFeedback.changeTextSize', () => changeTextSize(sidebar)),
    // Internal command, invoked only from the webview's "Show me the
    // rule"/"Show me the fix" button clicks -- see sidebarView.ts's
    // 'levelReached' message.
    vscode.commands.registerCommand('aiFeedback.recordLevelReached', (interactionId: string, level: number) =>
      recordLevelReached(sessionManager, sidebar, postFeedbackTracker, interactionId, level),
    ),
    // Internal commands, invoked only from the webview's history list.
    vscode.commands.registerCommand('aiFeedback.reopenExplanation', (interactionId: string) =>
      reopenExplanation(sessionManager, sidebar, interactionId),
    ),
    vscode.commands.registerCommand('aiFeedback.recordExplanationCopied', (interactionId: string, level?: string) =>
      logResearchEvent(sessionManager, {
        eventType: 'explanation_copied',
        // Copying more than once from the same interaction is a repeatable
        // occurrence, so no natural key.
        clientEventId: `explanation_copied:${randomUUID()}`,
        interactionId,
        payload: { level: level ?? null },
      }),
    ),
    // Internal command, invoked only from the webview's self-report chips.
    vscode.commands.registerCommand(
      'aiFeedback.recordSelfReport',
      (interactionId: string, helpfulRating?: number, outcome?: string, postConfidence?: string) =>
        recordSelfReport(sessionManager, interactionId, helpfulRating, outcome, postConfidence),
    ),
  );

  // Lazy, non-blocking restore -- activation must stay under the §16
  // performance budget (< 200ms, no blocking network calls).
  void (async () => {
    const state = await sessionManager.restore();
    if (state.signedIn) {
      await promptConsentIfNeeded(sessionManager);
      await syncFeedbackLanguage(sessionManager, sidebar);
      await refreshStats(sessionManager, sidebar);
      // [STUDENT-ACTIVITY-DATA]: eager, not lazy -- a session row must
      // exist from sign-in, not only once the student first asks for an
      // explanation, or activity from a student who never does would have
      // nowhere to be recorded. requestExplanation()'s own
      // ensureCodingSession() call becomes a cached no-op once this runs.
      void ensureCodingSession(sessionManager);
    }
  })();
}

export function deactivate(): Thenable<void> | void {
  logger.dispose();
  return finalActivityFlush?.();
}

/**
 * [WELCOMEVIEW]'s single Log in / Sign Up button lands here -- there is
 * no separate registration endpoint in this architecture, only
 * sessionManager.signIn(), which tries signing in and silently
 * auto-registers on the first attempt for a username that doesn't exist
 * yet (base spec §4.3). One button, one call.
 */
async function submitAuth(
  sessionManager: SessionManager,
  sidebar: SidebarViewProvider,
  username: string,
  password: string,
): Promise<void> {
  if (Date.now() < throttledUntil) {
    const seconds = Math.ceil((throttledUntil - Date.now()) / 1000);
    sidebar.setAuthError(t('Too many attempts. Try again in {0}s.', String(seconds)));
    return;
  }

  sidebar.setAuthError(undefined);
  sidebar.setAuthLoading(true);
  let result: Awaited<ReturnType<SessionManager['signIn']>>;
  try {
    // Base spec §9.4 / Appendix C #1's "never leave a stuck loading
    // state" applies here too: visible progress for the network round
    // trip signIn() makes, plus [WELCOMEVIEW]'s own inline spinner.
    result = await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: t('Signing in…') },
      () => sessionManager.signIn(username, password),
    );
  } finally {
    sidebar.setAuthLoading(false);
  }

  if (result.ok) {
    failedSignInAttempts = 0;
    void vscode.window.showInformationMessage(t('Welcome, {0}!', result.username));
    if (result.isFirstLogin) {
      // Use whatever [WELCOMEVIEW]'s own language picker is currently
      // set to, rather than re-guessing from vscode.env.language -- the
      // student already told us explicitly, before signing in.
      await sessionManager
        .getClient()
        .from('profiles')
        .update({ feedback_language: getLanguage() })
        .eq('username', result.username);
    }
    await promptConsentIfNeeded(sessionManager);
    await syncFeedbackLanguage(sessionManager, sidebar);
    await refreshStats(sessionManager, sidebar);
    void ensureCodingSession(sessionManager); // [STUDENT-ACTIVITY-DATA]: see the restore path's identical call
    return;
  }

  failedSignInAttempts += 1;
  if (failedSignInAttempts >= 5) {
    throttledUntil = Date.now() + 60_000;
    failedSignInAttempts = 0;
  }

  const messages: Record<SignInFailureReason, string> = {
    invalid_username: t('That username is not valid.'),
    invalid_password: t('That password is not valid.'),
    // Ambiguous by construction (base spec §4.3): this fires whether the
    // account already exists with a different password, or the student
    // meant to register a taken username -- one button now covers both
    // intents, so the message has to cover both too.
    wrong_password: t('Incorrect password for this username.'),
    network: t('Could not reach the server. Check your connection and try again.'),
    rate_limited: t('Too many attempts, wait a moment.'),
    server_misconfigured: t('Sign-in is temporarily unavailable. Please tell your instructor.'),
    unknown: t('Something went wrong while signing in.'),
  };
  sidebar.setAuthError(messages[result.reason]);
}

/**
 * Shows the consent prompt if it has never been answered. Declining does
 * NOT block AI feedback -- only telemetry -- so this only ever gates on
 * 'pending', never on the resulting answer (base spec §13.1).
 */
async function promptConsentIfNeeded(sessionManager: SessionManager): Promise<ConsentStatus | undefined> {
  const client = sessionManager.getClient();
  const { data: userData } = await client.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return undefined;

  const { data: profile } = await client
    .from('profiles')
    .select('consent_status')
    .eq('id', userId)
    .maybeSingle();

  const status: ConsentStatus = (profile?.consent_status as ConsentStatus | undefined) ?? 'pending';
  if (status !== 'pending') return status;
  return ensureConsent(client, userId, status);
}

async function ensureCodingSession(sessionManager: SessionManager): Promise<string | undefined> {
  if (codingSessionId) return codingSessionId;

  const client = sessionManager.getClient();
  const { data: userData } = await client.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return undefined;

  const { data, error } = await client
    .from('coding_sessions')
    .insert({
      user_id: userId,
      extension_version: extensionVersion,
      vscode_version: vscode.version,
      os: process.platform,
    })
    .select('id')
    .single();

  if (error || !data) {
    logger.error('Could not create coding_sessions row', error);
    return undefined;
  }
  codingSessionId = data.id as string;
  return codingSessionId;
}

/** [STUDENT-ACTIVITY-DATA]: periodic sync of ActivityTracker's local
 * counters into this session's coding_sessions row. Always drains the
 * tracker (even while signed out or before a session exists yet), but
 * discards the snapshot rather than attributing it to nobody -- activity
 * that happens before/without a signed-in session is never persisted, so
 * it can't be misattributed once the student does sign in.
 *
 * Read-then-write to merge deltas into the existing row -- the same
 * accepted "lost increment under a rare concurrent write" tradeoff
 * recordUsage()/bumpLearnerProfileCounter() already use elsewhere in this
 * codebase for the same reason: not worth a dedicated increment RPC for
 * bookkeeping this low-stakes, and a single student normally has at most
 * one extension host writing to their own row at a time. */
async function flushActivity(
  sessionManager: SessionManager,
  tracker: ActivityTracker,
  diagnosticTrigger: DiagnosticTrigger,
): Promise<void> {
  const snapshot = tracker.flush();
  // [FEEDBACK-EFFECTIVENESS]: drained unconditionally, same as the rest of
  // this snapshot -- discarded below with everything else if there's
  // nowhere to attribute it to yet.
  const diagnosticCounters = diagnosticTrigger.flushCounters();
  if (!codingSessionId) return;
  if (
    snapshot.activeSeconds === 0 &&
    snapshot.linesWritten === 0 &&
    snapshot.linesDeleted === 0 &&
    snapshot.filesCreated === 0 &&
    Object.keys(snapshot.languageCounts).length === 0 &&
    snapshot.largePasteCount === 0 &&
    snapshot.focusLossCount === 0 &&
    snapshot.saveCount === 0 &&
    snapshot.debugSessionCount === 0 &&
    snapshot.taskRunCount === 0 &&
    snapshot.idleGapCount === 0 &&
    snapshot.editorSwitchCount === 0 &&
    diagnosticCounters.silentlyResolved === 0 &&
    diagnosticCounters.offersShown === 0 &&
    diagnosticCounters.followOnErrors === 0
  ) {
    return;
  }

  try {
    const client = sessionManager.getClient();
    const { data: existing } = await client
      .from('coding_sessions')
      .select(
        'active_seconds, lines_written, lines_deleted, files_created, language_counts, errors_resolved_without_asking, diagnostics_offered, large_paste_count, large_paste_lines, focus_loss_count, unfocused_seconds, save_count, debug_session_count, task_run_count, follow_on_error_count, silent_resolution_edits, idle_gap_count, editor_switch_count',
      )
      .eq('id', codingSessionId)
      .maybeSingle();
    if (!existing) return;

    const mergedLanguageCounts: Record<string, number> = {
      ...((existing.language_counts as Record<string, number> | null) ?? {}),
    };
    for (const [lang, count] of Object.entries(snapshot.languageCounts)) {
      mergedLanguageCounts[lang] = (mergedLanguageCounts[lang] ?? 0) + count;
    }

    await client
      .from('coding_sessions')
      .update({
        active_seconds: (existing.active_seconds ?? 0) + snapshot.activeSeconds,
        lines_written: (existing.lines_written ?? 0) + snapshot.linesWritten,
        lines_deleted: (existing.lines_deleted ?? 0) + snapshot.linesDeleted,
        files_created: (existing.files_created ?? 0) + snapshot.filesCreated,
        language_counts: mergedLanguageCounts,
        errors_resolved_without_asking:
          (existing.errors_resolved_without_asking ?? 0) + diagnosticCounters.silentlyResolved,
        silent_resolution_edits: (existing.silent_resolution_edits ?? 0) + diagnosticCounters.silentResolutionEdits,
        follow_on_error_count: (existing.follow_on_error_count ?? 0) + diagnosticCounters.followOnErrors,
        diagnostics_offered: (existing.diagnostics_offered ?? 0) + diagnosticCounters.offersShown,
        large_paste_count: (existing.large_paste_count ?? 0) + snapshot.largePasteCount,
        large_paste_lines: (existing.large_paste_lines ?? 0) + snapshot.largePasteLines,
        focus_loss_count: (existing.focus_loss_count ?? 0) + snapshot.focusLossCount,
        unfocused_seconds: (existing.unfocused_seconds ?? 0) + snapshot.unfocusedSeconds,
        save_count: (existing.save_count ?? 0) + snapshot.saveCount,
        debug_session_count: (existing.debug_session_count ?? 0) + snapshot.debugSessionCount,
        task_run_count: (existing.task_run_count ?? 0) + snapshot.taskRunCount,
        idle_gap_count: (existing.idle_gap_count ?? 0) + snapshot.idleGapCount,
        editor_switch_count: (existing.editor_switch_count ?? 0) + snapshot.editorSwitchCount,
        // Assigned, not added: this is already a session-wide distinct
        // count, so adding successive flushes would inflate it.
        files_visited: snapshot.filesVisitedTotal,
        // Incidental fix: this column has existed since the base schema
        // but nothing ever updated it after row creation -- now that this
        // function already touches the row on a timer, keeping it current
        // costs nothing extra.
        last_seen_at: new Date().toISOString(),
      })
      .eq('id', codingSessionId);
  } catch (err) {
    logger.error('flushActivity failed', err);
  }
}

interface PendingExplanation {
  triggerSource: ExplainRequest['triggerSource'];
  questionType: string;
  freeText?: string;
  context: ExplainRequest['context'];
  // [FEEDBACK-EFFECTIVENESS]: kept local to the extension host, never sent
  // to the server -- contextPacket.ts only sends a basename, which isn't
  // enough to match against onDidChangeTextDocument's own document.uri
  // later, once the student reveals the fix.
  documentUri: vscode.Uri;
  triggerSurface: TriggerSurface;
  selectionLineCount?: number;
  selectionCharCount?: number;
  /** The line the feedback is about -- the diagnostic's line, or the
   * cursor line for a selection. Used to judge whether the edit that
   * followed landed where the explanation pointed. */
  focusLine: number;
  /** What the student did between the offer appearing and asking; absent
   * for interactions that didn't start from a visible offer. */
  helpLatencyMs?: number;
  editsBeforeAsk?: number;
  /** Runs once the backend has created the interaction, which is the
   * first moment its id exists -- lets a trigger link what it already
   * recorded about the click to that interaction. */
  onInteractionCreated?: (interactionId: string) => void;
}

/**
 * Shared path for every trigger: sign-in/consent/session preconditions,
 * then the actual call. Individual triggers (selection today; diagnostic,
 * stuck, paste, run in later increments) only need to build the context
 * packet and pick a trigger source.
 */
async function requestExplanation(
  sessionManager: SessionManager,
  sidebar: SidebarViewProvider,
  pending: PendingExplanation,
): Promise<void> {
  const state = sessionManager.getState();
  if (!state.signedIn) {
    void vscode.window.showInformationMessage(t('Sign in first.'));
    // [SELECTION-EXPLAIN]: the webview disables the button synchronously
    // on click, before this function even runs -- every early return
    // here has to explicitly re-enable it, since none of them reach the
    // try/finally around the actual request below.
    sidebar.setLoading(false);
    return;
  }

  // "Presented on first run, before any model call" (§13.1) -- make sure
  // the prompt has been shown (not necessarily granted) before proceeding.
  await promptConsentIfNeeded(sessionManager);

  const client = sessionManager.getClient();
  const { data: userData } = await client.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) {
    sidebar.setLoading(false);
    return;
  }

  const { data: profile } = await client
    .from('profiles')
    .select('consent_status, feedback_language')
    .eq('id', userId)
    .maybeSingle();

  if (!profile || profile.consent_status === 'pending') {
    void vscode.window.showInformationMessage(t('Please respond to the consent prompt to continue.'));
    sidebar.setLoading(false);
    return;
  }

  // Reveal the sidebar and show its loading state *before* the network
  // call, not after -- otherwise the student sees nothing happen for
  // however long the request takes (base spec §9.4). The try/finally
  // guarantees the spinner clears even on failure (Appendix C #1: never
  // leave a stuck loading state) -- but that guarantee is only as good as
  // the promise it wraps actually settling. Neither `fetch` nor
  // supabase-js has a default timeout, so a stalled connection used to
  // hang forever with the spinner stuck on screen. REQUEST_TIMEOUT_MS
  // below, combined with the AbortController passed to callEdgeFunction,
  // guarantees this always resolves one way or another.
  const REQUEST_TIMEOUT_MS = 25_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  await vscode.commands.executeCommand('workbench.view.extension.aiFeedback');
  sidebar.setLoading(true);
  try {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: t('Getting feedback…') },
      () =>
        withTimeout(
          (async () => {
            const sessionId = await ensureCodingSession(sessionManager);
            const accessToken = await sessionManager.getAccessToken();
            if (!sessionId || !accessToken) {
              void vscode.window.showErrorMessage(t('Could not start a session. Check your connection.'));
              return;
            }

            const request: ExplainRequest = {
              sessionId,
              triggerSource: pending.triggerSource,
              questionType: pending.questionType,
              freeText: pending.freeText ?? null,
              helpLatencyMs: pending.helpLatencyMs ?? null,
              editsBeforeAsk: pending.editsBeforeAsk ?? null,
              triggerSurface: pending.triggerSurface,
              selectionLineCount: pending.selectionLineCount ?? null,
              selectionCharCount: pending.selectionCharCount ?? null,
              language: (profile.feedback_language as ExplainRequest['language']) ?? 'en',
              context: pending.context,
              clientRequestId: randomUUID(),
            };

            const response = await callEdgeFunction<ExplainResponse>('explain', request, accessToken, controller.signal);
            // [FEEDBACK-EFFECTIVENESS]: remembered here, not armed here --
            // tracking only starts once recordLevelReached() sees the
            // student actually reveal this fix (level 3), which may be
            // much later or never.
            const fixText = response.levels.l3_fix.change;
            if (fixText.trim()) {
              pendingFixByInteraction.set(response.interactionId, {
                documentUri: pending.documentUri.toString(),
                fixText,
                focusLine: pending.focusLine,
              });
            }
            pending.onInteractionCreated?.(response.interactionId);
            sidebar.setExplanation(response);
            void refreshStats(sessionManager, sidebar);
          })(),
          REQUEST_TIMEOUT_MS,
        ),
    );
  } catch (err) {
    // [FEEDBACK-EFFECTIVENESS]: friction the student actually felt. Without
    // it, "didn't use the tool" and "tried and it failed" are the same
    // silence in the data -- and a rate-limited or timed-out request is
    // exactly the moment a student gives up on asking.
    if (isTimeoutOrAbort(err)) {
      logRequestFailed(sessionManager, { kind: 'timeout' });
      void vscode.window.showErrorMessage(t('The request took too long. Please try again.'));
    } else if (err instanceof BackendError) {
      logRequestFailed(sessionManager, { kind: 'backend', code: err.code, retryAfterSeconds: err.retryAfterSeconds });
      void vscode.window.showErrorMessage(t('Request failed: {0}', err.message));
    } else {
      logRequestFailed(sessionManager, { kind: 'unknown' });
      logger.error('requestExplanation failed', err);
      void vscode.window.showErrorMessage(t('Something went wrong.'));
    }
  } finally {
    clearTimeout(timer);
    sidebar.setLoading(false);
  }
}

async function explainSelection(
  sessionManager: SessionManager,
  sidebar: SidebarViewProvider,
  options: { questionType?: string; freeText?: string; triggerSurface: TriggerSurface },
): Promise<void> {
  const { questionType = 'what_does_this_do', freeText, triggerSurface } = options;
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    void vscode.window.showInformationMessage(t('Open a file and select some code first.'));
    // Same reasoning as requestExplanation()'s early returns: the button
    // was already disabled synchronously on click, before this even ran.
    sidebar.setLoading(false);
    return;
  }
  const focusLine = editor.selection.active.line;
  const context = await buildContextPacket(editor.document, focusLine, []);
  const selectedText = editor.document.getText(editor.selection);
  if (selectedText.trim().length > 0) {
    context.code = selectedText;
  }

  await requestExplanation(sessionManager, sidebar, {
    triggerSource: 'selection',
    questionType,
    freeText,
    context,
    documentUri: editor.document.uri,
    triggerSurface,
    focusLine,
    ...selectionSize(editor.selection, selectedText),
  });
}

/** Fire-and-forget. These two are the research events with no interaction
 * to hang off -- nothing was created -- so they are attributed to the
 * coding session instead, and skipped entirely when there isn't one yet
 * (signed out, or nothing has created a session row), the same rule
 * flushActivity() applies. */
function logQuestionPickerAbandoned(sessionManager: SessionManager, payload: Record<string, unknown>): void {
  logSessionEvent(sessionManager, 'question_picker_abandoned', payload);
}

function logRequestFailed(sessionManager: SessionManager, payload: Record<string, unknown>): void {
  logSessionEvent(sessionManager, 'request_failed', payload);
}

function logSessionEvent(
  sessionManager: SessionManager,
  eventType: ResearchEventType,
  payload: Record<string, unknown>,
): void {
  if (!codingSessionId) return;
  void logResearchEvent(sessionManager, {
    eventType,
    // No natural key: these are genuinely repeatable occurrences, unlike
    // the once-per-interaction events.
    clientEventId: `${eventType}:${randomUUID()}`,
    sessionId: codingSessionId,
    payload,
  });
}

/** How precisely the student pointed at what they're stuck on. An empty
 * selection (asking with just a cursor) reports nothing rather than
 * zeroes, so "didn't select anything" stays distinguishable from
 * "selected an empty line". */
function selectionSize(
  selection: vscode.Selection,
  selectedText: string,
): { selectionLineCount?: number; selectionCharCount?: number } {
  if (selection.isEmpty) return {};
  return {
    selectionLineCount: selection.end.line - selection.start.line + 1,
    selectionCharCount: selectedText.length,
  };
}

/** Base spec §8.2: the actual "small menu" -- four presets plus free
 * text, opened from the selection lightbulb, status bar item, or
 * keybinding. Presets remove prompt authoring, which novices lack the
 * vocabulary for; free text stays available for anything else. */
async function pickQuestionPreset(
  sessionManager: SessionManager,
  sidebar: SidebarViewProvider,
  triggerSurface: TriggerSurface,
): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.selection.isEmpty) {
    void vscode.window.showInformationMessage(t('Open a file and select some code first.'));
    return;
  }

  const presets = [
    { label: t('What does this do?'), questionType: 'what_does_this_do' },
    { label: t('Why does this work?'), questionType: 'why_works' },
    { label: t("What's wrong here?"), questionType: 'whats_wrong' },
    { label: t('Show me a simpler example'), questionType: 'simpler_example' },
    { label: t('Something else…'), questionType: 'free_text' },
  ];

  const selection = selectionSize(editor.selection, editor.document.getText(editor.selection));

  const picked = await vscode.window.showQuickPick(presets, {
    title: t('Ask about your selection'),
    placeHolder: t('What would you like to know?'),
  });
  if (!picked) {
    // [FEEDBACK-EFFECTIVENESS]: starting to ask and then backing out is
    // hesitancy the interactions table can never show, because no
    // interaction is ever created.
    logQuestionPickerAbandoned(sessionManager, { stage: 'preset', triggerSurface, ...selection });
    return;
  }

  let freeText: string | undefined;
  if (picked.questionType === 'free_text') {
    freeText = await vscode.window.showInputBox({
      prompt: t('What do you want to ask?'),
      ignoreFocusOut: true,
      validateInput: (value) => (value.length > 300 ? t('Keep it under 300 characters.') : undefined),
    });
    if (!freeText) {
      logQuestionPickerAbandoned(sessionManager, { stage: 'free_text', triggerSurface, ...selection });
      return;
    }
  }

  await explainSelection(sessionManager, sidebar, { questionType: picked.questionType, freeText, triggerSurface });
}

async function explainDiagnostic(
  sessionManager: SessionManager,
  sidebar: SidebarViewProvider,
  diagnosticTrigger: DiagnosticTrigger,
  uri: vscode.Uri,
  diagnostic: vscode.Diagnostic,
  triggerSurface: TriggerSurface,
): Promise<void> {
  const document = await vscode.workspace.openTextDocument(uri);
  const focusLine = diagnostic.range.start.line;
  const context = await buildContextPacket(document, focusLine, [diagnostic]);

  // [FEEDBACK-EFFECTIVENESS]: recorded before the request even completes --
  // "asked for help" is true the moment the student clicks, regardless of
  // whether the call later succeeds.
  const ask = diagnosticTrigger.markExplained(uri, diagnostic);

  await requestExplanation(sessionManager, sidebar, {
    triggerSource: 'diagnostic',
    questionType: 'what_does_this_mean',
    context,
    documentUri: uri,
    triggerSurface,
    focusLine,
    helpLatencyMs: ask.helpLatencyMs,
    editsBeforeAsk: ask.editsBeforeAsk,
    onInteractionCreated: (interactionId) => diagnosticTrigger.attachInteraction(ask.signature, interactionId),
  });
}

/** Invoked only from the chip decoration's hover link. Re-resolves the
 * live diagnostic at the given line rather than trusting one carried
 * through the command: link's JSON round-trip -- more robust anyway,
 * since it reflects whatever is actually there at click time. */
async function explainDiagnosticAt(
  sessionManager: SessionManager,
  sidebar: SidebarViewProvider,
  diagnosticTrigger: DiagnosticTrigger,
  uriString: string,
  line: number,
  triggerSurface: TriggerSurface,
): Promise<void> {
  const uri = vscode.Uri.parse(uriString);
  const document = await vscode.workspace.openTextDocument(uri);
  const diagnostic = vscode.languages.getDiagnostics(uri).find((d) => d.range.start.line === line && isOfferable(d));
  if (!diagnostic) return;

  const ask = diagnosticTrigger.markExplained(uri, diagnostic);

  const context = await buildContextPacket(document, line, [diagnostic]);
  await requestExplanation(sessionManager, sidebar, {
    triggerSource: 'diagnostic',
    questionType: 'what_does_this_mean',
    context,
    documentUri: uri,
    triggerSurface,
    focusLine: line,
    helpLatencyMs: ask.helpLatencyMs,
    editsBeforeAsk: ask.editsBeforeAsk,
    onInteractionCreated: (interactionId) => diagnosticTrigger.attachInteraction(ask.signature, interactionId),
  });
}

/** Pushes the student's current feedback_language into the sidebar's
 * language <select> and into the shared i18n table -- called after
 * sign-in and on activation restore so both reflect the stored
 * preference rather than always defaulting to English until the student
 * touches the picker. */
async function syncFeedbackLanguage(sessionManager: SessionManager, sidebar: SidebarViewProvider): Promise<void> {
  const client = sessionManager.getClient();
  const { data: userData } = await client.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return;

  const { data } = await client.from('profiles').select('feedback_language').eq('id', userId).maybeSingle();
  const language = data?.feedback_language;
  applyLanguage(sidebar, FEEDBACK_LANGUAGES.includes(language) ? language : 'en');
}

/** [USER-STATS]: (re)fetches every stat in stats/statsStore.ts and pushes
 * the result to the sidebar. Called after sign-in, on activation restore,
 * after each explanation (so the count stays live), and after a language
 * change (so the labels do too) -- always a fresh query rather than a
 * locally-incremented counter, so it can never drift from what's
 * actually in the database. */
async function refreshStats(sessionManager: SessionManager, sidebar: SidebarViewProvider): Promise<void> {
  const client = sessionManager.getClient();
  const { data: userData } = await client.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return;

  const stats = await fetchUserStats(client, userId);
  sidebar.setStats(stats);

  if (stats.narrativeIsStale) void regenerateSummary(sessionManager, sidebar);
}

let summaryRegenInFlight = false;

/** [USER-STATS]: fire-and-forget narrative regeneration. The client's
 * staleness check is advisory only -- generate-summary re-checks the same
 * condition server-side before spending a model call, so a false positive
 * here just costs one skipped request, never a wrong write. Per the
 * roadmap ("if generation fails, show the previous version -- never a
 * spinner, never an empty panel"), failures are swallowed: the stats
 * section already has whatever it had before and simply won't update
 * until the next successful run. The in-flight guard exists because
 * refreshStats() runs after every explanation, which would otherwise fire
 * several overlapping generate-summary calls in a burst of requests.
 *
 * `force` bypasses the server's normal 24h/3-interaction cadence -- used
 * only right after a feedback-language change, since student_summary and
 * suggested_practice ("Try this one") are written in whichever language
 * was active at generation time and neither gate has anything to do with
 * language correctness. Without this, switching languages could leave
 * stale, wrong-language text on screen for up to a day. */
async function regenerateSummary(
  sessionManager: SessionManager,
  sidebar: SidebarViewProvider,
  force = false,
): Promise<void> {
  if (summaryRegenInFlight) return;
  summaryRegenInFlight = true;
  try {
    const accessToken = await sessionManager.getAccessToken();
    if (!accessToken) return;
    await callEdgeFunction('generate-summary', { force }, accessToken);
    void refreshStats(sessionManager, sidebar);
  } catch (err) {
    logger.error('generate-summary failed', err);
  } finally {
    summaryRegenInFlight = false;
  }
}

/** [USER-STATS]: invoked from the webview when the student clicks "Show
 * me the rule" (level 2) or "Show me the fix" (level 3) -- the only
 * writer of interactions.max_level_reached, which the "errors you worked
 * out yourself" stat and the history list's outcome markers both read.
 * Best-effort: a failure here just means the stat lags by one
 * interaction until the next successful call, not worth surfacing to the
 * student over. */
async function recordLevelReached(
  sessionManager: SessionManager,
  sidebar: SidebarViewProvider,
  postFeedbackTracker: PostFeedbackTracker,
  interactionId: string,
  level: number,
): Promise<void> {
  try {
    const accessToken = await sessionManager.getAccessToken();
    if (!accessToken) return;
    await callEdgeFunction('record-level', { interactionId, level }, accessToken);
  } catch (err) {
    logger.error('recordLevelReached failed', err);
    return;
  }

  // [FEEDBACK-EFFECTIVENESS]: level 3 is exactly "the fix was just
  // revealed" -- arm tracking now, using whatever requestExplanation()
  // remembered about this interaction's document and fix text.
  const pendingFix = pendingFixByInteraction.get(interactionId);
  if (level === 3 && pendingFix) {
    postFeedbackTracker.track({
      uri: pendingFix.documentUri,
      fixText: pendingFix.fixText,
      focusLine: pendingFix.focusLine,
      interactionId,
    });
  }
  pendingFixByInteraction.delete(interactionId);

  void refreshStats(sessionManager, sidebar);
}

/** [FEEDBACK-EFFECTIVENESS]: re-opens a past explanation from the history
 * list. Which explanations a student comes back to says something no
 * first-read measure can -- and the fetch is on demand precisely because
 * most are never re-opened. Rows from before ladder_payload existed have
 * nothing to show, which is a no-op rather than an error. */
async function reopenExplanation(
  sessionManager: SessionManager,
  sidebar: SidebarViewProvider,
  interactionId: string,
): Promise<void> {
  const client = sessionManager.getClient();
  const { data: userData } = await client.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return;

  const ladder = await fetchInteractionLadder(client, userId, interactionId);
  if (!ladder) return;

  const levels = ladder.levels as ExplainResponse['levels'];
  sidebar.replayExplanation({
    interactionId,
    cacheHit: false,
    // A degraded answer stored empty rule/fix text; say so rather than
    // offering reveal buttons that would open onto nothing.
    gatingDegraded: !levels.l2_concept?.rule,
    title: ladder.title,
    confidence: 'high',
    needsMoreContext: false,
    levels,
  });

  void logResearchEvent(sessionManager, {
    eventType: 'explanation_reopened',
    clientEventId: `explanation_reopened:${randomUUID()}`,
    interactionId,
    payload: {},
  });
}

/** [FEEDBACK-EFFECTIVENESS]: the student's own answer about an
 * explanation -- the only signal here that isn't inferred from behaviour,
 * and the one the behavioural proxies get validated against. Silent on
 * failure like the rest: a student who answered a one-click question
 * should never get an error popup about it. */
async function recordSelfReport(
  sessionManager: SessionManager,
  interactionId: string,
  helpfulRating?: number,
  outcome?: string,
  postConfidence?: string,
): Promise<void> {
  try {
    const accessToken = await sessionManager.getAccessToken();
    if (!accessToken) return;
    await callEdgeFunction(
      'record-self-report',
      { interactionId, helpfulRating, outcome, postConfidence },
      accessToken,
    );
  } catch (err) {
    logger.error('recordSelfReport failed', err);
  }
}

/** [FEEDBACK-EFFECTIVENESS]: reports PostFeedbackTracker's derived
 * measurements -- how closely the student's edit resembled the suggested
 * fix, and how far from the line the explanation pointed at it landed --
 * through the shared research-event path. */
async function logPostFeedbackEdit(
  sessionManager: SessionManager,
  interactionId: string,
  edit: PostFeedbackEdit,
): Promise<void> {
  await logResearchEvent(sessionManager, {
    eventType: 'post_feedback_edit',
    clientEventId: `post_feedback_edit:${interactionId}`,
    interactionId,
    payload: { ...edit },
  });
}

/** Invoked from [WELCOMEVIEW]'s signed-out language <select>. One picker
 * for both the sidebar's own UI and the AI's feedback language
 * (docs/SPEC_ADDENDUM.md §13) -- vscode.l10n can't do this since it only
 * follows VS Code's own display language, shared by every student on a
 * lab machine, not settable per student. Once signed in, the equivalent
 * entry point is [AUTH-TOOLBAR]'s globe icon -> changeFeedbackLanguage()
 * below, which shows a QuickPick and calls this same function. */
async function setFeedbackLanguage(
  sessionManager: SessionManager,
  sidebar: SidebarViewProvider,
  diagnosticTrigger: DiagnosticTrigger,
  selectionTrigger: SelectionTrigger,
  language: string,
): Promise<void> {
  if (!FEEDBACK_LANGUAGES.includes(language as (typeof FEEDBACK_LANGUAGES)[number])) return;
  const typedLanguage = language as (typeof FEEDBACK_LANGUAGES)[number];

  // [WELCOMEVIEW]'s own picker fires this while signed out -- there's no
  // profile row to persist to yet, but the choice still applies locally
  // and gets written to the new profile on first login (see submitAuth).
  const client = sessionManager.getClient();
  const { data: userData } = await client.auth.getUser();
  const userId = userData.user?.id;

  if (userId) {
    const { error } = await client.from('profiles').update({ feedback_language: typedLanguage }).eq('id', userId);
    if (error) {
      logger.error('Could not update feedback language', error);
      void vscode.window.showErrorMessage(t('Could not update your language preference.'));
      return;
    }
  }

  // [FEEDBACK-EFFECTIVENESS]: switching language mid-course -- especially
  // to a first language -- is a signal about comprehension, not just
  // preference. Recorded before applyLanguage() so the previous value is
  // still readable.
  if (getLanguage() !== typedLanguage) {
    logSessionEvent(sessionManager, 'feedback_language_changed', { from: getLanguage(), to: typedLanguage });
  }

  applyLanguage(sidebar, typedLanguage);
  // Decorations/CodeLenses already on screen were built with the old
  // language's text; CodeActions are recomputed on demand so they don't
  // need this.
  diagnosticTrigger.refresh();
  selectionTrigger.refresh();
  if (userId) {
    void refreshStats(sessionManager, sidebar);
    // [USER-STATS]: re-localize the narrative band immediately rather
    // than leaving "Try this one" in the old language until the next
    // natural regeneration -- see regenerateSummary()'s force parameter.
    void regenerateSummary(sessionManager, sidebar, true);
  }
}

const LANGUAGE_OPTIONS: Array<{ label: string; language: (typeof FEEDBACK_LANGUAGES)[number] }> = [
  { label: 'English', language: 'en' },
  { label: 'Türkçe', language: 'tr' },
  { label: 'Español', language: 'es' },
];

/** [AUTH-TOOLBAR]'s globe icon (base spec §11.4's originally-described
 * QuickPick change flow). Only reachable once signed in -- see the
 * "aiFeedback.signedIn" when-clause on the view/title menu item in
 * package.json -- so this always has a profile row to write to. */
async function changeFeedbackLanguage(
  sessionManager: SessionManager,
  sidebar: SidebarViewProvider,
  diagnosticTrigger: DiagnosticTrigger,
  selectionTrigger: SelectionTrigger,
): Promise<void> {
  const picked = await vscode.window.showQuickPick(LANGUAGE_OPTIONS, {
    title: t('Change feedback language'),
    placeHolder: t('Choose a language'),
  });
  if (!picked) return;
  await setFeedbackLanguage(sessionManager, sidebar, diagnosticTrigger, selectionTrigger, picked.language);
}

/** [AUTH-TOOLBAR]'s text-size icon. Options are built fresh on each call,
 * not hoisted to a module-level constant like LANGUAGE_OPTIONS above --
 * "Normal"/"Large" must track the student's *current* feedback/UI
 * language (unlike the language picker's own native-name labels, which
 * are deliberately fixed regardless of active language), so t() has to
 * be re-evaluated at call time. */
async function changeTextSize(sidebar: SidebarViewProvider): Promise<void> {
  const options: Array<{ label: string; size: TextSize }> = [
    { label: t('Normal'), size: 'normal' },
    { label: t('Large'), size: 'large' },
  ];
  const picked = await vscode.window.showQuickPick(options, {
    title: t('Change text size'),
    placeHolder: t('Choose a text size'),
  });
  if (!picked) return;
  sidebar.setTextSize(picked.size);
  void globalState?.update(TEXT_SIZE_STORAGE_KEY, picked.size);
}

function applyLanguage(sidebar: SidebarViewProvider, language: Language): void {
  setLanguage(language);
  sidebar.setFeedbackLanguage(language);
  void globalState?.update(LANGUAGE_STORAGE_KEY, language);
}
