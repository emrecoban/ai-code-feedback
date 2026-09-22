import * as vscode from 'vscode';
import { t } from '../i18n/strings';
import { noteOfferShown } from '../util/affordanceChrome';

const DEBOUNCE_MS = 400;

/**
 * [SELECTION-ASK] / [MULTISELECT-ASK]. Base spec §8.2: a non-empty
 * selection held for ~400ms offers to ask about it. A checkmark would be
 * wrong here -- nothing has been sent in the pull model, the student has
 * only made something available to ask about -- so this uses a spark
 * glyph instead ("help available", not "captured").
 *
 * Two surfaces, same split as DiagnosticTrigger's ("What does this
 * mean?"), which hit this exact problem first:
 * - The CodeLens: a real line above the selection, genuinely clickable --
 *   no hover step. This is the primary, directly-clickable action.
 * - The gutter icon: colorable (via the contributed aiFeedback.helpAccent
 *   theme color) and carries a hoverMessage with a real clickable link,
 *   but can never render as its own separate line -- only inline within
 *   the lines it's anchored to.
 * There used to also be an inline end-of-line chip; removed as redundant
 * clutter once the CodeLens was confirmed as the clearer surface -- two
 * things fighting for the same "ask about this" job on the same lines
 * was worse than either alone (same call DiagnosticTrigger already made).
 * The status bar item, the lightbulb Quick Fix, and the keybinding are
 * unrelated surfaces and unaffected by this.
 */
export class SelectionTrigger implements vscode.CodeActionProvider, vscode.CodeLensProvider {
  private readonly onDidChangeCodeLensesEmitter = new vscode.EventEmitter<void>();
  readonly onDidChangeCodeLenses = this.onDidChangeCodeLensesEmitter.event;

  private readonly gutterDecoration: vscode.TextEditorDecorationType;
  private readonly statusBarItem: vscode.StatusBarItem;
  private readonly disposables: vscode.Disposable[] = [];

  private debounceTimer: ReturnType<typeof setTimeout> | undefined;
  private wasShowing = false;
  private currentSelection: { uri: string; startLine: number; lineCount: number } | undefined;

  constructor(context: vscode.ExtensionContext) {
    this.gutterDecoration = vscode.window.createTextEditorDecorationType({
      light: { gutterIconPath: context.asAbsolutePath('media/help-gutter-light.svg'), gutterIconSize: 'contain' },
      dark: { gutterIconPath: context.asAbsolutePath('media/help-gutter-dark.svg'), gutterIconSize: 'contain' },
      overviewRulerColor: new vscode.ThemeColor('aiFeedback.helpAccent'),
      overviewRulerLane: vscode.OverviewRulerLane.Right,
    });

    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 90);
    // A Command object rather than a bare id, so this surface is
    // distinguishable from the other three that share this command.
    this.statusBarItem.command = {
      title: '',
      command: 'aiFeedback.pickQuestionPreset',
      arguments: ['selection_status_bar'],
    };

    this.disposables.push(
      this.gutterDecoration,
      this.statusBarItem,
      vscode.window.onDidChangeTextEditorSelection((e) => this.handleSelectionChange(e)),
      vscode.window.onDidChangeActiveTextEditor(() => this.clear()),
    );
  }

  dispose(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.disposables.forEach((d) => d.dispose());
    this.onDidChangeCodeLensesEmitter.dispose();
  }

  /** Language changed -- redraw with the current selection, if any.
   * render()/clear() below already fire onDidChangeCodeLenses themselves
   * whenever the CodeLens set could actually change, so no extra fire is
   * needed here. */
  refresh(): void {
    const editor = vscode.window.activeTextEditor;
    if (editor && !editor.selection.isEmpty) this.render(editor);
    else this.clear();
  }

  provideCodeActions(_document: vscode.TextDocument, range: vscode.Range | vscode.Selection): vscode.CodeAction[] {
    if (range.isEmpty) return [];
    const action = new vscode.CodeAction(t('Ask about this selection'), vscode.CodeActionKind.QuickFix);
    action.command = { title: '', command: 'aiFeedback.pickQuestionPreset', arguments: ['selection_lightbulb'] };
    return [action];
  }

  /** [MULTISELECT-ASK]: the directly-clickable replacement for the old
   * hover-only chip -- one CodeLens above the first line of the current
   * selection, only for the document it actually belongs to (VS Code may
   * call this once per visible editor, not just the active one). */
  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    if (!this.currentSelection || this.currentSelection.uri !== document.uri.toString()) return [];
    const { startLine, lineCount } = this.currentSelection;
    const title =
      lineCount === 1 ? t('Ask about 1 selected line') : t('Ask about {0} selected lines', String(lineCount));
    return [
      new vscode.CodeLens(new vscode.Range(startLine, 0, startLine, 0), {
        title,
        command: 'aiFeedback.pickQuestionPreset',
        arguments: ['selection_codelens'],
      }),
    ];
  }

  private handleSelectionChange(e: vscode.TextEditorSelectionChangeEvent): void {
    if (e.kind === vscode.TextEditorSelectionChangeKind.Command) return; // base spec §8.6
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    // Debounced so it doesn't flicker while the student is still dragging.
    this.debounceTimer = setTimeout(() => {
      if (e.selections[0]?.isEmpty ?? true) this.clear();
      else this.render(e.textEditor);
    }, DEBOUNCE_MS);
  }

  private render(editor: vscode.TextEditor): void {
    const selection = editor.selection;
    if (selection.isEmpty) {
      this.clear();
      return;
    }

    if (!this.wasShowing) {
      this.wasShowing = true;
      noteOfferShown();
    }

    const hover = askHoverMessage();
    editor.setDecorations(this.gutterDecoration, [
      { range: new vscode.Range(selection.start.line, 0, selection.end.line, 0), hoverMessage: hover },
    ]);

    const lineCount = selection.end.line - selection.start.line + 1;
    this.currentSelection = { uri: editor.document.uri.toString(), startLine: selection.start.line, lineCount };
    this.onDidChangeCodeLensesEmitter.fire();

    this.statusBarItem.text = lineCount === 1 ? `$(sparkle) ${t('Ask about 1 selected line')}` : `$(sparkle) ${t('Ask about {0} selected lines', String(lineCount))}`;
    this.statusBarItem.accessibilityInformation = { label: this.statusBarItem.text, role: 'button' };
    this.statusBarItem.show();
  }

  private clear(): void {
    this.wasShowing = false;
    const hadSelection = !!this.currentSelection;
    this.currentSelection = undefined;
    const editor = vscode.window.activeTextEditor;
    if (editor) editor.setDecorations(this.gutterDecoration, []);
    this.statusBarItem.hide();
    if (hadSelection) this.onDidChangeCodeLensesEmitter.fire();
  }
}

/** The gutter icon's hover link -- a MarkdownString command link, not the
 * decoration itself, is what's actually clickable there. pickQuestionPreset
 * takes no arguments, so unlike the diagnostic case there's no
 * argument-serialization pitfall to route around here. */
function askHoverMessage(): vscode.MarkdownString {
  const md = new vscode.MarkdownString(`[${t('Ask about this')} →](command:aiFeedback.pickQuestionPreset)`);
  md.isTrusted = true;
  return md;
}
