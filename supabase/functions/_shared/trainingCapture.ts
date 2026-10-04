import { getAdminClient } from './authClient.ts';
import { runAfterResponse } from './background.ts';
import { HINT_LADDER_SCHEMA } from './hintLadder.ts';
import { promptTemplateText } from './promptAssembly.ts';

// [FINE-TUNING-DATA]: one training_samples row per newly generated answer
// (migrations/0025, addendum §19) -- exactly what the model was sent and
// what it said, so the answer can later be used as fine-tuning data as it
// is. Labels are not stored here: dashboard.training_record() derives them
// from what happened afterwards, each time a record is read or exported.
//
// The JSON parts are stored verbatim, so their field names below are the
// column contents' own (snake_case, like the rest of the schema).

/** Shape of a training_samples row. Bump it when a field is added,
 * renamed or changes meaning, so older rows can be told apart. */
export const CAPTURE_VERSION = 1;

/** The request as fields: everything the user message was built from,
 * for prompt layouts other than production's. */
export interface TrainingContext {
  trigger_source: string;
  trigger_surface: string | null;
  question_type: string | null;
  free_text: string | null;
  feedback_language: string;
  prog_language: string;
  file_name: string;
  focus_line: number;
  code_range: { startLine: number; endLine: number } | null;
  /** Redacted by the extension before it was sent (context/redaction.ts). */
  code: string;
  diagnostics: Array<{ line: number; severity: string; message: string; source?: string; code?: string }>;
  run_output: string | null;
  help_latency_ms: number | null;
  edits_before_ask: number | null;
  selection_line_count: number | null;
  selection_char_count: number | null;
  /** The private rolling summary as it was at this moment; the
   * learner_profiles row is overwritten later. */
  learner_notes: string;
}

export interface TrainingGeneration {
  provider: string;
  model: string;
  temperature: number;
  max_output_tokens: number;
}

export interface TrainingValidation {
  /** 1, or 2 when the first answer failed and the repair pass was used. */
  accepted_pass: number;
  /** Why the first pass was rejected; empty when it was accepted. */
  first_pass_errors: string[];
  /** Pedagogical checks the accepted answer failed but was kept despite. */
  soft_issues: string[];
  /** Only set when the answer was degraded to L0+L1. */
  hard_issues: string[];
  gating_degraded: boolean;
  finished_cleanly: boolean;
}

export interface TrainingSample {
  interactionId: string;
  /** The messages exactly as sent on the first pass. */
  system: string;
  user: string;
  context: TrainingContext;
  generation: TrainingGeneration;
  /** The model's raw text for the accepted answer. */
  responseText: string;
  validation: TrainingValidation;
}

let promptVersion: Promise<string> | undefined;

/** A short hash of all fixed prompt text, computed once per worker. */
function getPromptVersion(): Promise<string> {
  promptVersion ??= crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(promptTemplateText(HINT_LADDER_SCHEMA)))
    .then((digest) =>
      Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 12),
    );
  return promptVersion;
}

/** Stores the sample after the response has gone out: best-effort, like all
 * research writes -- it is never slower for it, and a failure is logged,
 * never shown to the student. */
export function captureTrainingSample(sample: TrainingSample): void {
  runAfterResponse(
    getPromptVersion().then(async (version) => {
      const { error } = await getAdminClient()
        .from('training_samples')
        .insert({
          interaction_id: sample.interactionId,
          capture_version: CAPTURE_VERSION,
          prompt_version: version,
          generation: sample.generation,
          messages: [
            { role: 'system', content: sample.system },
            { role: 'user', content: sample.user },
          ],
          context: sample.context,
          response_text: sample.responseText,
          validation: sample.validation,
        });
      if (error) console.error('Training sample capture failed:', error);
    }),
  );
}
