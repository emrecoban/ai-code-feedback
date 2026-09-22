/** Which affordance the student actually used to ask. Several of these
 * route through the same command, so each invocation site passes its own
 * value rather than the handler trying to infer it. */
export type TriggerSurface =
  | 'diagnostic_codelens'
  | 'diagnostic_lightbulb'
  | 'diagnostic_gutter_hover'
  | 'selection_codelens'
  | 'selection_lightbulb'
  | 'selection_status_bar'
  | 'selection_keybinding'
  | 'sidebar_button'
  | 'command_palette';

export interface ExplainRequest {
  sessionId: string;
  triggerSource: 'diagnostic' | 'runtime' | 'selection' | 'stuck' | 'paste' | 'success';
  questionType?: string;
  freeText?: string | null;
  /** How long the "What does this mean?" offer was visible before the
   * student clicked it, and how many edits they made in that window.
   * Both null unless this interaction started from a visible offer --
   * see DiagnosticTrigger.markExplained(). */
  helpLatencyMs?: number | null;
  editsBeforeAsk?: number | null;
  triggerSurface?: TriggerSurface | null;
  /** How much code was highlighted when asking about a selection; null
   * for diagnostic-triggered interactions, which have no selection. */
  selectionLineCount?: number | null;
  selectionCharCount?: number | null;
  language: 'en' | 'tr' | 'es';
  context: {
    fileName: string;
    progLanguage: string;
    focusLine: number;
    codeRange: { startLine: number; endLine: number };
    code: string;
    diagnostics: Array<{ line: number; severity: string; message: string; source?: string; code?: string }>;
    runOutput?: string;
    previousCode?: string;
  };
  clientRequestId: string;
}

export interface HintLevels {
  l0_decode: string;
  l1_locate: string;
  l2_concept: { rule: string; example: string };
  l3_fix: { change: string; why: string };
}

export interface ExplainResponse {
  interactionId: string;
  cacheHit: boolean;
  gatingDegraded: boolean;
  title: string;
  confidence: 'high' | 'low';
  needsMoreContext: boolean;
  levels: HintLevels;
}

export interface EdgeFunctionError {
  error: string;
  message: string;
  retryAfterSeconds?: number;
}
