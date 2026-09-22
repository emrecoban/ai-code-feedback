import * as vscode from 'vscode';

// A learned, consistent signal outperforms a persistent, verbose one --
// full labels teach the symbol; after that, they're just clutter. Shared
// across the diagnostic and selection affordances so the decay reflects
// how many help offers the student has seen in total, not per-trigger.
const COUNT_KEY = 'aiFeedback.helpOfferShownCount';
const VERBOSE_THRESHOLD = 10;

let globalState: vscode.Memento | undefined;

export function initAffordanceChrome(state: vscode.Memento): void {
  globalState = state;
}

/** Call once per newly-shown (not re-rendered) help offer. */
export function noteOfferShown(): void {
  const count = (globalState?.get<number>(COUNT_KEY) ?? 0) + 1;
  void globalState?.update(COUNT_KEY, count);
}

/** True while the full label + hint should still show; false once the
 * student has seen enough of them to have learned the icon. The
 * aiFeedback.verboseAffordances setting is an explicit opt-out of the
 * decay for students who'd rather keep the label. */
export function isVerbose(): boolean {
  const alwaysVerbose = vscode.workspace.getConfiguration('aiFeedback').get<boolean>('verboseAffordances', false);
  if (alwaysVerbose) return true;
  return (globalState?.get<number>(COUNT_KEY) ?? 0) < VERBOSE_THRESHOLD;
}
