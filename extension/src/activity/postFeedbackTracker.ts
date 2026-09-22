import * as vscode from 'vscode';
import { MAX_EVENT_LINES } from './activityTracker';

const TRACKING_WINDOW_MS = 5 * 60_000; // 5 minutes -- long enough for a real attempt, short enough that a later, unrelated edit isn't misattributed
const UNDO_WINDOW_MS = 2 * 60_000; // an undo this soon after acting on a fix is about that fix; later than this it's ordinary editing

export interface PendingFixInput {
  uri: string;
  fixText: string;
  /** Zero-based line the explanation was about -- the diagnostic's line,
   * or the cursor line for a selection question. */
  focusLine: number;
  interactionId: string;
}

interface PendingFix extends PendingFixInput {
  expiresAt: number;
}

export interface PostFeedbackEdit {
  /** 0-1 token overlap between what the student wrote and the suggested fix. */
  overlapRatio: number;
  /** How many lines away from the focus line the edit landed. 0 means
   * they edited exactly where the explanation pointed; a large number
   * means they went somewhere else entirely. */
  editedLineDistance: number;
}

interface UndoWatch {
  uri: string;
  interactionId: string;
  expiresAt: number;
}

/**
 * [FEEDBACK-EFFECTIVENESS]: a narrower, one-shot counterpart to
 * ActivityTracker -- not "how much did the student type," but "once they
 * act on one specific AI-suggested fix, how much does what they actually
 * wrote resemble it." A high overlap on the very next qualifying edit
 * reads as reproducing the fix as given; a low one reads as an
 * independent attempt. Reports only a derived similarity ratio, never the
 * edited text itself.
 *
 * Tracking starts only once the student reveals the fix (level 3), not as
 * soon as a response arrives -- an edit made while only L0/L1 are visible
 * is a reaction to those, not to a fix the student hasn't seen yet.
 *
 * Single-slot by design: a second track() call before the first resolves
 * replaces it. Two different explanations both reaching level 3 within
 * the same short window, before either is acted on, is rare enough in
 * this single-explanation-at-a-time sidebar that a Map keyed by
 * interaction would be more machinery than the case is worth.
 */
export class PostFeedbackTracker implements vscode.Disposable {
  private readonly disposable: vscode.Disposable;
  private pending: PendingFix | undefined;
  private undoWatch: UndoWatch | undefined;

  constructor(
    private readonly onResult: (interactionId: string, edit: PostFeedbackEdit) => void,
    /** Fires when the student undoes shortly after acting on a fix -- the
     * clearest signal available that the applied change wasn't understood
     * or didn't work. */
    private readonly onFixUndone: (interactionId: string) => void = () => {},
  ) {
    this.disposable = vscode.workspace.onDidChangeTextDocument((e) => this.handleChange(e));
  }

  dispose(): void {
    this.disposable.dispose();
  }

  track(fix: PendingFixInput): void {
    if (!fix.fixText.trim()) return; // gating-degraded responses carry an empty l3_fix -- nothing to compare against
    this.pending = { ...fix, expiresAt: Date.now() + TRACKING_WINDOW_MS };
  }

  private handleChange(e: vscode.TextDocumentChangeEvent): void {
    this.checkForUndo(e);

    const pending = this.pending;
    if (!pending) return;
    if (e.document.uri.toString() !== pending.uri) return;
    if (Date.now() > pending.expiresAt) {
      this.pending = undefined;
      return;
    }
    if (e.contentChanges.length === 0) return;
    if (e.reason === vscode.TextDocumentChangeReason.Undo || e.reason === vscode.TextDocumentChangeReason.Redo) return;

    let addedLines = 0;
    let editedText = '';
    let editedLineDistance = Number.POSITIVE_INFINITY;
    for (const change of e.contentChanges) {
      addedLines += change.text.split('\n').length - 1;
      editedText += change.text;
      // Distance to the nearest edge of the changed range, so an edit
      // spanning the focus line reads as 0 rather than as the distance to
      // where the range happens to start.
      const distance =
        change.range.start.line > pending.focusLine
          ? change.range.start.line - pending.focusLine
          : Math.max(0, pending.focusLine - change.range.end.line);
      editedLineDistance = Math.min(editedLineDistance, distance);
    }
    // Same bulk-edit ceiling ActivityTracker uses to exclude format-on-save
    // and similar tool-driven rewrites -- a genuine reaction to one
    // specific fix is never a dozen-line rewrite.
    if (addedLines > MAX_EVENT_LINES) return;
    if (!editedText.trim()) return; // a pure deletion carries no fix content to compare

    this.pending = undefined; // one-shot: only the first qualifying edit after the fix is shown
    // The edit that was just measured is the one an undo would reverse,
    // so the undo watch starts exactly here.
    this.undoWatch = {
      uri: pending.uri,
      interactionId: pending.interactionId,
      expiresAt: Date.now() + UNDO_WINDOW_MS,
    };
    this.onResult(pending.interactionId, {
      overlapRatio: jaccardOverlap(editedText, pending.fixText),
      editedLineDistance: Number.isFinite(editedLineDistance) ? editedLineDistance : 0,
    });
  }

  private checkForUndo(e: vscode.TextDocumentChangeEvent): void {
    const watch = this.undoWatch;
    if (!watch) return;
    if (Date.now() > watch.expiresAt) {
      this.undoWatch = undefined;
      return;
    }
    if (e.document.uri.toString() !== watch.uri) return;
    if (e.reason !== vscode.TextDocumentChangeReason.Undo) return;

    this.undoWatch = undefined; // one-shot, like the overlap measurement itself
    this.onFixUndone(watch.interactionId);
  }
}

function jaccardOverlap(a: string, b: string): number {
  const tokensA = new Set(tokenize(a));
  const tokensB = new Set(tokenize(b));
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection++;
  }
  const union = tokensA.size + tokensB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9_]+/g) ?? [];
}
