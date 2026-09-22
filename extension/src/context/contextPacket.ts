import * as vscode from 'vscode';
import { redact } from './redaction';
import type { ExplainRequest } from '../backend/types';

const FALLBACK_RADIUS = 20;

/** Bounded, symbol-aware window plus diagnostics (base spec §13.2, and the
 * V1 regression this must never repeat -- Appendix C #2: a single line
 * with no diagnostics is not enough context for a useful explanation). */
export async function buildContextPacket(
  document: vscode.TextDocument,
  focusLine: number,
  diagnostics: vscode.Diagnostic[],
): Promise<ExplainRequest['context']> {
  const range = await resolveBoundedRange(document, focusLine);
  const code = redact(document.getText(range));

  return {
    fileName: baseName(document.fileName),
    progLanguage: document.languageId,
    focusLine: focusLine + 1,
    codeRange: { startLine: range.start.line + 1, endLine: range.end.line + 1 },
    code,
    diagnostics: diagnostics.map((d) => ({
      line: d.range.start.line + 1,
      severity: severityLabel(d.severity),
      message: d.message,
      source: d.source,
      code: normalizeDiagnosticCode(d.code),
    })),
  };
}

async function resolveBoundedRange(document: vscode.TextDocument, focusLine: number): Promise<vscode.Range> {
  try {
    const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
      'vscode.executeDocumentSymbolProvider',
      document.uri,
    );
    const enclosing = findEnclosingSymbol(symbols ?? [], focusLine);
    if (enclosing) return enclosing.range;
  } catch {
    // No symbol provider for this language, or it failed -- fixed radius below.
  }
  const start = Math.max(0, focusLine - FALLBACK_RADIUS);
  const end = Math.min(document.lineCount - 1, focusLine + FALLBACK_RADIUS);
  return new vscode.Range(start, 0, end, document.lineAt(end).text.length);
}

function findEnclosingSymbol(symbols: vscode.DocumentSymbol[], line: number): vscode.DocumentSymbol | undefined {
  for (const symbol of symbols) {
    if (symbol.range.start.line <= line && line <= symbol.range.end.line) {
      return findEnclosingSymbol(symbol.children, line) ?? symbol;
    }
  }
  return undefined;
}

function severityLabel(severity: vscode.DiagnosticSeverity): string {
  switch (severity) {
    case vscode.DiagnosticSeverity.Error:
      return 'error';
    case vscode.DiagnosticSeverity.Warning:
      return 'warning';
    case vscode.DiagnosticSeverity.Information:
      return 'information';
    default:
      return 'hint';
  }
}

function normalizeDiagnosticCode(code: vscode.Diagnostic['code']): string | undefined {
  if (code === undefined) return undefined;
  if (typeof code === 'object') return String(code.value);
  return String(code);
}

function baseName(path: string): string {
  const parts = path.split(/[\\/]/);
  return parts[parts.length - 1] ?? path;
}
