import * as vscode from 'vscode';

const RETURN_WINDOW_MS = 10 * 60_000; // past this the next edit is new work, not a reaction to the hint

interface PendingReturn {
  interactionId: string;
  level: number;
  shownAt: number;
  expiresAt: number;
}

/**
 * [FEEDBACK-EFFECTIVENESS]: how long a student sits with a hint before
 * going back to the code. The gap between consecutive hint levels is
 * already derivable from the level_reached events, but the last hint of
 * any interaction has no successor -- and the interesting one is usually
 * the last, since that's the hint they actually acted on.
 *
 * Deliberately measures the return to the *editor*, not the panel: a long
 * pause with the explanation open and then an edit is reading and
 * thinking, which is the behaviour worth distinguishing from clicking
 * straight through to the next level.
 *
 * Re-arming on each new level replaces the previous pending measurement,
 * so what gets reported is always the gap from the most recent hint --
 * the one the student was actually looking at when they turned back.
 */
export class AttentionTracker implements vscode.Disposable {
  private readonly disposables: vscode.Disposable[] = [];
  private pending: PendingReturn | undefined;
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private readonly onReturnToCode: (interactionId: string, level: number, msToReturn: number) => void,
    /** Fires when the student never comes back to the code at all: the
     * window elapses, or the session ends first. Feedback that was read
     * and then acted on and feedback that was read and then dropped look
     * identical in every other signal. */
    private readonly onAbandoned: (interactionId: string, level: number, reason: 'timeout' | 'session_end') => void =
      () => {},
  ) {
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.contentChanges.length > 0) this.reportReturn();
      }),
      // Clicking or moving the caret in the editor is returning to the
      // code just as much as typing is, and it usually happens first.
      vscode.window.onDidChangeTextEditorSelection(() => this.reportReturn()),
    );
  }

  dispose(): void {
    // A session ending with feedback still unacted-on is abandonment too,
    // and the timer below will never get to say so.
    this.reportAbandoned('session_end');
    this.disposables.forEach((d) => d.dispose());
  }

  /** Called whenever new feedback becomes visible: level 1 when the
   * explanation itself arrives (L0/L1 are shown together), then 2 and 3
   * as the student reveals them. */
  noteFeedbackShown(interactionId: string, level: number): void {
    // A new level supersedes the previous pending measurement rather than
    // ending it -- revealing the next hint isn't abandoning the last one.
    if (this.timer) clearTimeout(this.timer);

    const now = Date.now();
    this.pending = { interactionId, level, shownAt: now, expiresAt: now + RETURN_WINDOW_MS };
    this.timer = setTimeout(() => this.reportAbandoned('timeout'), RETURN_WINDOW_MS);
  }

  private reportReturn(): void {
    const pending = this.pending;
    if (!pending) return;

    this.clearPending();
    if (Date.now() > pending.expiresAt) return;
    this.onReturnToCode(pending.interactionId, pending.level, Date.now() - pending.shownAt);
  }

  private reportAbandoned(reason: 'timeout' | 'session_end'): void {
    const pending = this.pending;
    if (!pending) return;

    this.clearPending();
    this.onAbandoned(pending.interactionId, pending.level, reason);
  }

  private clearPending(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
    this.pending = undefined;
  }
}
