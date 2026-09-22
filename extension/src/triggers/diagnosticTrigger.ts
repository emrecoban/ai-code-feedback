import * as vscode from 'vscode';
import { t } from '../i18n/strings';
import { noteOfferShown } from '../util/affordanceChrome';

const DEBOUNCE_MS = 1200;
const LINE_STABILITY_MS = 800;
const MAX_OFFERS_PER_DOCUMENT = 3;

// A diagnostic appearing in a document this soon after another one there
// was resolved is treated as following on from that fix rather than as
// unrelated new work.
const FOLLOW_ON_WINDOW_MS = 60_000;

/** What markExplained() observed about the run-up to a help request. */
export interface AskContext {
  signature: string;
  helpLatencyMs?: number;
  editsBeforeAsk?: number;
}

/** One document's run from "first problem appeared" to "no problems
 * left" -- the whole arc of getting a file working, which individual
 * diagnostics can't show on their own. */
export interface FileEpisode {
  fileName: string;
  msWithErrors: number;
  editsWhileErrors: number;
  diagnosticsSeen: number;
  diagnosticsAsked: number;
}

/** What it cost to get rid of a diagnostic the student asked about.
 * msPresent/editsWhilePresent are absent when the diagnostic was never
 * shown an offer, so there's no baseline to measure from. */
export interface ResolutionContext {
  msToResolution: number;
  msPresent?: number;
  editsWhilePresent?: number;
}

/**
 * [ERROR-EXPLAIN]: offers "What does this mean?" once a diagnostic has
 * been present for DEBOUNCE_MS and the document has stopped changing for
 * LINE_STABILITY_MS (base spec §8.1). An offer costs nothing -- this
 * never calls the backend; it only decides when to show it.
 *
 * Shows the affordance for every offerable diagnostic in the document, up
 * to MAX_OFFERS_PER_DOCUMENT (base spec §8.1's own cap: "prefer the
 * topmost errors") -- one novice error cascading into a dozen diagnostics
 * still shouldn't wallpaper the file, but a student with three genuinely
 * separate errors needs to reach each of them individually.
 *
 * Two surfaces, each carrying half of what the other can't:
 * - The CodeLens: a real line above the code, genuinely clickable --
 *   VS Code fixes CodeLens text to the theme's editorCodeLens.foreground,
 *   with no API for an extension to override that per-lens. Not
 *   colorable, full stop, for any extension.
 * - The gutter icon: colorable (via the contributed aiFeedback.helpAccent
 *   theme color) and carries a hoverMessage with a real clickable link,
 *   but a decoration can never render as its own separate line above the
 *   code -- only inline within the line it's anchored to.
 * There used to also be an inline end-of-line chip; removed as
 * redundant clutter once the CodeLens was confirmed as the clearer
 * surface -- two things fighting for the same "explain this" job on the
 * same line was worse than either alone.
 */
export class DiagnosticTrigger implements vscode.CodeLensProvider, vscode.CodeActionProvider {
  private readonly onDidChangeCodeLensesEmitter = new vscode.EventEmitter<void>();
  readonly onDidChangeCodeLenses = this.onDidChangeCodeLensesEmitter.event;

  private readonly stableDiagnostics = new Map<string, vscode.Diagnostic[]>();
  private readonly pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly lastEditAt = new Map<string, number>();
  private readonly seenSignatures = new Set<string>();
  // [FEEDBACK-EFFECTIVENESS]: when each offer first became visible, and
  // the document's edit count at that moment -- the baseline both "how
  // long before they asked" and "how many attempts before they asked" are
  // measured against. Pruned when the diagnostic goes away, so a
  // recurring error is measured afresh.
  private readonly offerSnapshots = new Map<string, { offeredAt: number; editCount: number }>();
  // Diagnostics the student actually asked about. The interaction id
  // arrives later than the click (only the response carries it), hence
  // the separate attachInteraction() step.
  private readonly explainedSignatures = new Map<string, { explainedAt: number; interactionId?: string }>();
  // Monotonic per-document edit counter; only ever read as a difference
  // between two offer snapshots, never reported on its own.
  private readonly editCounts = new Map<string, number>();
  private silentlyResolvedCount = 0;
  private silentResolutionEdits = 0;
  private offersShownCount = 0;
  private followOnErrorCount = 0;
  /** Last time a diagnostic was resolved in each document -- the window a
   * newly-appearing diagnostic there is judged against. */
  private readonly lastResolutionAt = new Map<string, number>();
  /** The in-progress error episode for each document, opened when its
   * first problem appears and closed when the last one goes away. */
  private readonly episodes = new Map<
    string,
    { startedAt: number; editCountAtStart: number; seen: number; asked: number }
  >();
  private readonly disposables: vscode.Disposable[] = [];

  private readonly gutterDecoration: vscode.TextEditorDecorationType;

  /** `onDiagnosticResolved` fires when a diagnostic the student asked
   * about later disappears -- i.e. the explanation was followed by an
   * actual fix -- with how long that took from the moment they asked. */
  constructor(
    context: vscode.ExtensionContext,
    private readonly onDiagnosticResolved: (interactionId: string, resolution: ResolutionContext) => void = () => {},
    /** Fires when a document that had problems has none left. */
    private readonly onFileCleared: (episode: FileEpisode) => void = () => {},
  ) {
    this.gutterDecoration = vscode.window.createTextEditorDecorationType({
      light: { gutterIconPath: context.asAbsolutePath('media/help-gutter-light.svg'), gutterIconSize: 'contain' },
      dark: { gutterIconPath: context.asAbsolutePath('media/help-gutter-dark.svg'), gutterIconSize: 'contain' },
      overviewRulerColor: new vscode.ThemeColor('aiFeedback.helpAccent'),
      overviewRulerLane: vscode.OverviewRulerLane.Right,
    });

    this.disposables.push(
      this.gutterDecoration,
      vscode.languages.onDidChangeDiagnostics((e) => this.handleDiagnosticsChange(e)),
      vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.contentChanges.length === 0) return;
        const key = e.document.uri.toString();
        this.lastEditAt.set(key, Date.now());
        this.editCounts.set(key, (this.editCounts.get(key) ?? 0) + 1);
      }),
      vscode.window.onDidChangeActiveTextEditor((editor) => this.renderDecorations(editor)),
    );
  }

  dispose(): void {
    for (const timer of this.pendingTimers.values()) clearTimeout(timer);
    this.disposables.forEach((d) => d.dispose());
    this.onDidChangeCodeLensesEmitter.dispose();
  }

  /** Forces already-rendered CodeLenses/decorations to redraw -- used
   * when the student changes their language, since their text was built
   * with the old one (base spec §11's per-student language). */
  refresh(): void {
    this.onDidChangeCodeLensesEmitter.fire();
    this.renderDecorations(vscode.window.activeTextEditor);
  }

  /** [FEEDBACK-EFFECTIVENESS]: called from extension.ts the moment
   * aiFeedback.explainDiagnostic(At) actually fires for a diagnostic, so
   * a later disappearance is correctly attributed to "asked for help"
   * rather than counted as an unaided, silent resolution.
   *
   * Returns what the student did before asking, plus the signature the
   * caller passes back to attachInteraction() once the response arrives.
   * The two measurements are absent when this diagnostic never had a
   * visible offer -- a lightbulb on a diagnostic past the per-document
   * offer cap, for instance -- rather than being reported as zero. */
  markExplained(uri: vscode.Uri, diagnostic: vscode.Diagnostic): AskContext {
    const signature = diagnosticSignature(uri, diagnostic);
    this.explainedSignatures.set(signature, { explainedAt: Date.now() });

    const episode = this.episodes.get(uri.toString());
    if (episode) episode.asked++;

    const snapshot = this.offerSnapshots.get(signature);
    if (!snapshot) return { signature };
    return {
      signature,
      helpLatencyMs: Date.now() - snapshot.offeredAt,
      editsBeforeAsk: (this.editCounts.get(uri.toString()) ?? 0) - snapshot.editCount,
    };
  }

  /** Links the click recorded by markExplained() to the interaction the
   * backend created for it, so a later resolution can be reported against
   * that interaction. */
  attachInteraction(signature: string, interactionId: string): void {
    const explained = this.explainedSignatures.get(signature);
    if (explained) explained.interactionId = interactionId;
  }

  /** Drain-and-reset, same shape as ActivityTracker.flush() -- extension.ts
   * folds these into the same periodic coding_sessions sync rather than a
   * separate mechanism. */
  flushCounters(): {
    silentlyResolved: number;
    silentResolutionEdits: number;
    offersShown: number;
    followOnErrors: number;
  } {
    const counters = {
      silentlyResolved: this.silentlyResolvedCount,
      silentResolutionEdits: this.silentResolutionEdits,
      offersShown: this.offersShownCount,
      followOnErrors: this.followOnErrorCount,
    };
    this.silentlyResolvedCount = 0;
    this.silentResolutionEdits = 0;
    this.offersShownCount = 0;
    this.followOnErrorCount = 0;
    return counters;
  }

  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    return this.offerableDiagnostics(document.uri).map((d) => {
      const line = Math.max(0, d.range.start.line);
      return new vscode.CodeLens(new vscode.Range(line, 0, line, 0), {
        title: t('What does this mean?'),
        command: 'aiFeedback.explainDiagnostic',
        arguments: [document.uri, d, 'diagnostic_codelens'],
      });
    });
  }

  provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] {
    return vscode.languages
      .getDiagnostics(document.uri)
      .filter((d) => !!d.range.intersection(range) && isOfferable(d))
      .map((d) => {
        const action = new vscode.CodeAction(t('What does this mean?'), vscode.CodeActionKind.QuickFix);
        action.command = {
          title: '',
          command: 'aiFeedback.explainDiagnostic',
          arguments: [document.uri, d, 'diagnostic_lightbulb'],
        };
        action.diagnostics = [d];
        return action;
      });
  }

  private offerableDiagnostics(uri: vscode.Uri): vscode.Diagnostic[] {
    return (this.stableDiagnostics.get(uri.toString()) ?? []).slice(0, MAX_OFFERS_PER_DOCUMENT);
  }

  private handleDiagnosticsChange(e: vscode.DiagnosticChangeEvent): void {
    for (const uri of e.uris) {
      if (uri.scheme !== 'file') continue; // base spec §8.1/§8.6
      const key = uri.toString();
      const existing = this.pendingTimers.get(key);
      if (existing) clearTimeout(existing);
      this.pendingTimers.set(
        key,
        setTimeout(() => {
          this.pendingTimers.delete(key);
          this.settle(uri);
        }, DEBOUNCE_MS),
      );
    }
  }

  private settle(uri: vscode.Uri): void {
    const key = uri.toString();
    const sinceEdit = Date.now() - (this.lastEditAt.get(key) ?? 0);
    if (sinceEdit < LINE_STABILITY_MS) {
      this.pendingTimers.set(
        key,
        setTimeout(() => this.settle(uri), LINE_STABILITY_MS - sinceEdit),
      );
      return;
    }
    // Prefer the topmost errors (base spec §8.1) -- sort before capping.
    const sorted = vscode.languages
      .getDiagnostics(uri)
      .filter(isOfferable)
      .sort((a, b) => a.range.start.line - b.range.start.line);

    this.detectSilentResolutions(uri, this.stableDiagnostics.get(key) ?? [], sorted);

    this.stableDiagnostics.set(key, sorted);
    this.onDidChangeCodeLensesEmitter.fire();

    const editor = vscode.window.activeTextEditor;
    if (editor?.document.uri.toString() === key) this.renderDecorations(editor);
  }

  /** [FEEDBACK-EFFECTIVENESS]: a previously-offered diagnostic that is no
   * longer present was fixed -- and whether the student asked about it
   * first splits that into the study's two most important outcomes.
   * Never explained: they fixed it unaided, the only such evidence this
   * extension can observe, since every other signal it collects only
   * exists once a student asks for help. Explained: the explanation was
   * followed by a real fix, reported with how long that took.
   *
   * Piggybacks on settle()'s existing debounce/stability delay rather
   * than adding a new timer, so transient flicker during active typing is
   * already filtered out the same way it already is for legitimate
   * offers. Skipped while the document is closed, since diagnostics
   * disappearing on close reflects the editor tearing down state, not the
   * student fixing anything.
   *
   * Known, accepted imprecision (matches seenSignatures' own line+message
   * signature elsewhere in this file): if an unrelated edit shifts a
   * still-unresolved diagnostic to a different line, this sees it as one
   * diagnostic resolving and a new one appearing, not the same one
   * persisting. Also counts a diagnostic beyond MAX_OFFERS_PER_DOCUMENT
   * that was tracked but never actually rendered -- still a genuine
   * unaided fix, just not one the student necessarily saw offered. */
  private detectSilentResolutions(uri: vscode.Uri, previous: vscode.Diagnostic[], next: vscode.Diagnostic[]): void {
    // No guard on `previous` being empty: the loop below is a no-op then,
    // but the follow-on check at the end still has to run -- "fixed the
    // last error, a new one appeared right after" is exactly the case
    // that arrives with nothing in `previous`.
    const isOpen = vscode.workspace.textDocuments.some((doc) => doc.uri.toString() === uri.toString());
    if (!isOpen) return;

    const key = uri.toString();
    const editCount = this.editCounts.get(key) ?? 0;
    const nextSignatures = new Set(next.map((d) => diagnosticSignature(uri, d)));
    let resolvedHere = false;

    for (const diagnostic of previous) {
      const signature = diagnosticSignature(uri, diagnostic);
      if (nextSignatures.has(signature)) continue;

      const explained = this.explainedSignatures.get(signature);
      const snapshot = this.offerSnapshots.get(signature);
      this.explainedSignatures.delete(signature);
      this.offerSnapshots.delete(signature);
      resolvedHere = true;

      // How long the diagnostic was around and how many edits it survived
      // -- the cost of getting rid of it, which is what makes assisted and
      // unaided fixes comparable.
      const editsWhilePresent = snapshot ? editCount - snapshot.editCount : undefined;

      if (!explained) {
        this.silentlyResolvedCount++;
        this.silentResolutionEdits += editsWhilePresent ?? 0;
      } else if (explained.interactionId) {
        this.onDiagnosticResolved(explained.interactionId, {
          msToResolution: Date.now() - explained.explainedAt,
          msPresent: snapshot ? Date.now() - snapshot.offeredAt : undefined,
          editsWhilePresent,
        });
      }
    }

    const appeared = this.countFollowOnErrors(uri, previous, next, resolvedHere);
    this.trackEpisode(uri, next, appeared);
  }

  /** [FEEDBACK-EFFECTIVENESS]: one document's arc from its first problem
   * to being clean again. Individual diagnostics say what went wrong;
   * this says what the whole repair cost -- how long, how many edits, how
   * many separate problems surfaced, and how many of them the student
   * needed help with. */
  private trackEpisode(uri: vscode.Uri, next: vscode.Diagnostic[], appeared: number): void {
    const key = uri.toString();
    const episode = this.episodes.get(key);

    if (!episode) {
      if (next.length === 0) return;
      this.episodes.set(key, {
        startedAt: Date.now(),
        editCountAtStart: this.editCounts.get(key) ?? 0,
        seen: next.length,
        asked: 0,
      });
      return;
    }

    episode.seen += appeared;
    if (next.length > 0) return;

    this.episodes.delete(key);
    this.onFileCleared({
      fileName: baseName(uri),
      msWithErrors: Date.now() - episode.startedAt,
      editsWhileErrors: (this.editCounts.get(key) ?? 0) - episode.editCountAtStart,
      diagnosticsSeen: episode.seen,
      diagnosticsAsked: episode.asked,
    });
  }

  /** [FEEDBACK-EFFECTIVENESS]: diagnostics that appear in a document just
   * after another one there was fixed -- the difference between a change
   * the student understood and one that only moved the problem. Counted
   * on a time window rather than only within the same diff, since the
   * follow-on error usually surfaces a few keystrokes later, not in the
   * same settle cycle. */
  private countFollowOnErrors(
    uri: vscode.Uri,
    previous: vscode.Diagnostic[],
    next: vscode.Diagnostic[],
    resolvedHere: boolean,
  ): number {
    const key = uri.toString();
    const previousSignatures = new Set(previous.map((d) => diagnosticSignature(uri, d)));
    const appeared = next.filter((d) => !previousSignatures.has(diagnosticSignature(uri, d)));

    const lastResolution = this.lastResolutionAt.get(key);
    // Either the fix and the new problem landed in the same settle cycle
    // (the clearest case), or the new one turned up shortly after.
    const followsRecentFix =
      resolvedHere || (lastResolution !== undefined && Date.now() - lastResolution <= FOLLOW_ON_WINDOW_MS);
    if (appeared.length > 0 && followsRecentFix) {
      this.followOnErrorCount += appeared.length;
    }

    if (resolvedHere) this.lastResolutionAt.set(key, Date.now());
    return appeared.length;
  }

  private renderDecorations(editor: vscode.TextEditor | undefined): void {
    if (!editor) return;
    const diagnostics = this.offerableDiagnostics(editor.document.uri);
    if (diagnostics.length === 0) {
      editor.setDecorations(this.gutterDecoration, []);
      return;
    }

    const gutterOptions: vscode.DecorationOptions[] = diagnostics.map((d) => {
      const signature = diagnosticSignature(editor.document.uri, d);
      if (!this.seenSignatures.has(signature)) {
        this.seenSignatures.add(signature);
        noteOfferShown();
      }
      // Gated separately from seenSignatures above, which deliberately
      // never prunes (the chrome nudge fires once ever). These snapshots
      // are pruned when the diagnostic is fixed, so the same error coming
      // back is measured as a fresh help-seeking opportunity.
      if (!this.offerSnapshots.has(signature)) {
        this.offerSnapshots.set(signature, {
          offeredAt: Date.now(),
          editCount: this.editCounts.get(editor.document.uri.toString()) ?? 0,
        });
        this.offersShownCount++;
      }
      const line = d.range.start.line;
      return {
        range: new vscode.Range(line, 0, line, 0),
        hoverMessage: explainHoverMessage(editor.document.uri, line),
      };
    });

    editor.setDecorations(this.gutterDecoration, gutterOptions);
  }
}

/** [ERROR-EXPLAIN]'s hover link -- a MarkdownString command link, not the
 * decoration itself, is what's actually clickable. Deliberately takes
 * the URI as a string and the diagnostic as a line number rather than
 * passing a vscode.Uri/Diagnostic through the link -- command URIs
 * round-trip their arguments through JSON, which silently drops a Uri's
 * computed properties (fsPath and friends aren't own enumerable
 * properties), so the handler re-resolves the live diagnostic at click
 * time instead of trusting a serialized one. */
function explainHoverMessage(uri: vscode.Uri, line: number): vscode.MarkdownString {
  const args = encodeURIComponent(JSON.stringify([uri.toString(), line, 'diagnostic_gutter_hover']));
  const md = new vscode.MarkdownString(`[${t('What does this mean?')} →](command:aiFeedback.explainDiagnosticAt?${args})`);
  md.isTrusted = true;
  return md;
}

export function isOfferable(d: vscode.Diagnostic): boolean {
  return d.severity === vscode.DiagnosticSeverity.Error || d.severity === vscode.DiagnosticSeverity.Warning;
}

/** Shared by the gutter's seenSignatures gate and detectSilentResolutions'
 * before/after diff -- both need to identify "the same diagnostic" the
 * same way. */
function diagnosticSignature(uri: vscode.Uri, d: vscode.Diagnostic): string {
  return `${uri.toString()}:${d.range.start.line}:${d.message}`;
}

/** Bare filename only -- the same thing contextPacket.ts sends to the
 * model. A full path would identify the student's machine and directory
 * layout for no research benefit. */
function baseName(uri: vscode.Uri): string {
  const parts = uri.path.split('/');
  return parts[parts.length - 1] ?? uri.path;
}
