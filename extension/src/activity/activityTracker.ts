import * as vscode from 'vscode';

/**
 * [STUDENT-ACTIVITY-DATA]: local, in-memory activity observer for one
 * VS Code session. Purely an observer -- knows nothing about auth or
 * Supabase; the caller periodically calls flush() and decides what to do
 * with the snapshot (extension.ts syncs it to coding_sessions). This
 * separation keeps the one genuinely tricky part (distinguishing real
 * authorship from noise) isolated and testable independent of networking.
 *
 * What each metric actually measures, and why:
 *
 * - Active time: a heartbeat + idle-timeout model (same shape used by
 *   editor time-trackers like WakaTime), not wall-clock "editor open"
 *   time. A heartbeat only advances the clock if the previous heartbeat
 *   was within IDLE_TIMEOUT_MS -- a longer gap (stepped away, window
 *   unfocused) contributes nothing. This is a heuristic approximation of
 *   engagement, not a precise measurement of attention; documented as such
 *   rather than presented as exact.
 *
 * - Lines written/deleted: driven by onDidChangeTextDocument, which VS
 *   Code confirms fires for typing, undo/redo, saves that trigger
 *   formatting, Format Document, rename-symbol refactors, and Git
 *   discard/revert alike -- there is no public API field that marks an
 *   edit as "the user typed this" versus "a tool did this." Two
 *   mitigations, both confirmed reliable, are applied:
 *     1. `event.reason` reliably distinguishes Undo/Redo (VS Code API,
 *        added specifically for this purpose) -- both are excluded
 *        entirely from the written/deleted counters, since replaying or
 *        reverting a prior edit isn't a new authorship event and would
 *        double-count (or falsely count as deletion) content already
 *        attributed once at the time it was actually typed.
 *     2. A per-event line-count ceiling (MAX_EVENT_LINES) excludes bulk,
 *        single-shot changes -- format-on-save, "Format Document",
 *        multi-file-spanning renames, and git discard/revert all arrive
 *        as one or a few large content changes, while real typing (even
 *        fast, even pasted in short bursts) almost never does. This is a
 *        heuristic, not a guarantee: a genuinely large legitimate paste is
 *        excluded by the same rule, and a *small* auto-completion,
 *        snippet expansion, or single-line auto-import insertion is
 *        indistinguishable from manual typing and WILL be counted. There
 *        is no public VS Code API that closes this gap. Opening a file
 *        never fires this event at all, so pre-existing file content is
 *        never at risk of being counted, by construction, independent of
 *        either mitigation above.
 *
 * - Files created: onDidCreateFiles, confirmed (VS Code issue tracker) to
 *   fire for Explorer-initiated "New File" actions and workspace.applyEdit
 *   create operations, but NOT for files created via the integrated
 *   terminal, external tools, or a raw filesystem watcher path. This
 *   undercounts real file creation in those cases -- an acceptable
 *   asymmetry, since undercounting is a conservative floor, not the
 *   inflation risk the pre-existing-content requirement is guarding
 *   against.
 *
 * - Language/file-format distribution: vscode.TextDocument.languageId,
 *   the same normalized field already used elsewhere in this codebase
 *   (context/contextPacket.ts's progLanguage) -- fully reliable, counted
 *   per qualifying edit event (not per keystroke, not per file), so it
 *   reflects where edit *volume* went, not just which languages were
 *   opened.
 */

const IDLE_TIMEOUT_MS = 2 * 60_000; // 2 minutes -- gap longer than this doesn't count as continuous activity
// Ceiling on how much of a single absence is attributed to "stepped away
// to look something up". Without it an overnight break would dwarf every
// real look-it-up trip in the same column and make the total meaningless.
const MAX_ATTRIBUTED_ABSENCE_MS = 10 * 60_000;
// single-event line delta above this is treated as a bulk/tool operation,
// not typing -- exported so PostFeedbackTracker can apply the same ceiling
// when deciding whether an edit is a real reaction to a fix.
export const MAX_EVENT_LINES = 20;

export interface ActivitySnapshot {
  activeSeconds: number;
  linesWritten: number;
  linesDeleted: number;
  filesCreated: number;
  languageCounts: Record<string, number>;
  largePasteCount: number;
  largePasteLines: number;
  focusLossCount: number;
  unfocusedSeconds: number;
  saveCount: number;
  debugSessionCount: number;
  taskRunCount: number;
  idleGapCount: number;
  editorSwitchCount: number;
  /** Distinct files seen this session -- an absolute count, not a delta,
   * so the caller assigns it rather than adding it. */
  filesVisitedTotal: number;
}

export class ActivityTracker implements vscode.Disposable {
  private readonly disposables: vscode.Disposable[] = [];

  private lastHeartbeatAt: number | undefined;
  private activeMs = 0;
  private linesWritten = 0;
  private linesDeleted = 0;
  private filesCreated = 0;
  private largePasteCount = 0;
  private largePasteLines = 0;
  private focusLossCount = 0;
  private unfocusedMs = 0;
  private unfocusedSince: number | undefined;
  private saveCount = 0;
  private debugSessionCount = 0;
  private taskRunCount = 0;
  private idleGapCount = 0;
  private editorSwitchCount = 0;
  // Kept for the whole session, never cleared on flush: "how many
  // different files did they work in" is only meaningful over the session,
  // and clearing it per flush would double-count a file revisited later.
  private readonly filesVisited = new Set<string>();
  private lastActiveUri: string | undefined;
  private readonly languageCounts = new Map<string, number>();

  constructor(
    /** Fires when a task finishes, with its exit code -- the only
     * observable "did the program actually run" signal. A program started
     * by typing into the integrated terminal is invisible here, so this
     * undercounts rather than guesses. */
    private readonly onRunFinished: (exitCode: number | undefined) => void = () => {},
  ) {
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument((e) => this.handleTextDocumentChange(e)),
      // Reading/reviewing code is genuine engagement, not just "the editor
      // happens to be open" -- counted as a heartbeat but never as a
      // written/deleted line, since neither event carries content changes.
      vscode.window.onDidChangeTextEditorSelection(() => this.recordHeartbeat()),
      vscode.window.onDidChangeActiveTextEditor((editor) => this.handleActiveEditorChange(editor)),
      vscode.window.onDidChangeWindowState((state) => this.handleWindowStateChange(state)),
      vscode.workspace.onDidCreateFiles((e) => this.handleFilesCreated(e)),
      // The "run it and see" loop. Saving is also genuine activity, so it
      // counts as a heartbeat as well as a save.
      vscode.workspace.onDidSaveTextDocument(() => {
        this.saveCount++;
        this.recordHeartbeat();
      }),
      vscode.debug.onDidStartDebugSession(() => this.debugSessionCount++),
      vscode.tasks.onDidStartTask(() => this.taskRunCount++),
      vscode.tasks.onDidEndTaskProcess((e) => this.onRunFinished(e.exitCode)),
    );
  }

  dispose(): void {
    this.disposables.forEach((d) => d.dispose());
  }

  /** Returns accumulated deltas since the last flush and resets them to
   * zero. Callers are responsible for deciding what to do with the
   * result -- this class has no knowledge of auth state or persistence,
   * so it is always safe to call (e.g. on a timer) regardless of whether
   * anyone is signed in; discarding an unwanted snapshot is the caller's
   * job. */
  flush(): ActivitySnapshot {
    const snapshot: ActivitySnapshot = {
      activeSeconds: Math.round(this.activeMs / 1000),
      linesWritten: this.linesWritten,
      linesDeleted: this.linesDeleted,
      filesCreated: this.filesCreated,
      languageCounts: Object.fromEntries(this.languageCounts),
      largePasteCount: this.largePasteCount,
      largePasteLines: this.largePasteLines,
      focusLossCount: this.focusLossCount,
      unfocusedSeconds: Math.round(this.unfocusedMs / 1000),
      saveCount: this.saveCount,
      debugSessionCount: this.debugSessionCount,
      taskRunCount: this.taskRunCount,
      idleGapCount: this.idleGapCount,
      editorSwitchCount: this.editorSwitchCount,
      filesVisitedTotal: this.filesVisited.size,
    };
    this.activeMs = 0;
    this.linesWritten = 0;
    this.linesDeleted = 0;
    this.filesCreated = 0;
    this.languageCounts.clear();
    this.largePasteCount = 0;
    this.largePasteLines = 0;
    this.focusLossCount = 0;
    this.unfocusedMs = 0;
    this.saveCount = 0;
    this.debugSessionCount = 0;
    this.taskRunCount = 0;
    this.idleGapCount = 0;
    this.editorSwitchCount = 0;
    return snapshot;
  }

  private recordHeartbeat(): void {
    if (!vscode.window.state.focused) return;
    const now = Date.now();
    if (this.lastHeartbeatAt !== undefined) {
      const gapMs = now - this.lastHeartbeatAt;
      // The same threshold that decides what counts as active time also
      // decides what counts as a break: work resuming after a gap this
      // long is a new stretch, and how many of those a session contains
      // is the difference between one sitting and six interrupted ones.
      if (gapMs <= IDLE_TIMEOUT_MS) this.activeMs += gapMs;
      else this.idleGapCount++;
    }
    this.lastHeartbeatAt = now;
  }

  private handleActiveEditorChange(editor: vscode.TextEditor | undefined): void {
    this.recordHeartbeat();
    if (!editor || editor.document.uri.scheme !== 'file') return;

    const key = editor.document.uri.toString();
    this.filesVisited.add(key);
    // Only a move to a *different* file counts as a switch; VS Code fires
    // this event for plenty of things that leave the student in the same
    // place, and those aren't navigation.
    if (this.lastActiveUri !== undefined && this.lastActiveUri !== key) this.editorSwitchCount++;
    this.lastActiveUri = key;
  }

  private handleWindowStateChange(state: vscode.WindowState): void {
    if (!state.focused) {
      // Stop the clock on blur rather than let the next heartbeat after
      // refocus retroactively count the entire unfocused gap.
      this.lastHeartbeatAt = undefined;
      this.focusLossCount++;
      this.unfocusedSince = Date.now();
      return;
    }
    // Only completed absences are counted, on the way back in. An absence
    // still in progress is attributed whenever it actually ends, even if
    // that lands in a later flush window -- simpler than splitting one
    // absence across flushes, and it keeps the cap meaningfully per-trip.
    // An absence that never ends (the session is over) is never counted,
    // which is correct: that isn't a look-it-up trip.
    if (this.unfocusedSince !== undefined) {
      this.unfocusedMs += Math.min(Date.now() - this.unfocusedSince, MAX_ATTRIBUTED_ABSENCE_MS);
      this.unfocusedSince = undefined;
    }
  }

  private handleTextDocumentChange(e: vscode.TextDocumentChangeEvent): void {
    if (e.document.uri.scheme !== 'file') return; // skip output/settings/diff/etc. virtual documents
    if (e.contentChanges.length === 0) return; // dirty-state-only change, no actual content edit

    // Any real edit is activity, even one this function goes on to
    // exclude from the line counters below (e.g. a triggered refactor).
    this.recordHeartbeat();

    if (e.reason === vscode.TextDocumentChangeReason.Undo || e.reason === vscode.TextDocumentChangeReason.Redo) {
      return;
    }

    let added = 0;
    let removed = 0;
    for (const change of e.contentChanges) {
      removed += change.range.end.line - change.range.start.line;
      added += change.text.split('\n').length - 1;
    }
    // A single large insertion that replaces almost nothing looks like
    // pasted code; format-on-save and refactors rewrite a large range
    // instead. Counted here, before the bulk-edit ceiling below discards
    // the event -- the same edits that are too big to be authorship are
    // exactly the ones worth knowing arrived from somewhere else. Still a
    // heuristic: VS Code exposes no "this was a paste" flag.
    if (e.contentChanges.length === 1 && added > MAX_EVENT_LINES && removed <= 1) {
      this.largePasteCount++;
      this.largePasteLines += added;
    }

    if (added > MAX_EVENT_LINES || removed > MAX_EVENT_LINES) return;

    this.linesWritten += added;
    this.linesDeleted += removed;
    const lang = e.document.languageId;
    this.languageCounts.set(lang, (this.languageCounts.get(lang) ?? 0) + 1);
  }

  private handleFilesCreated(e: vscode.FileCreateEvent): void {
    this.filesCreated += e.files.filter((f) => f.scheme === 'file').length;
  }
}
