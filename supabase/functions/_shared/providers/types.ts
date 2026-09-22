// Internal request/response contract every vendor adapter must satisfy
// (base spec §6.4). Nothing outside this directory may know which vendor
// is in use.

export interface ChatRequest {
  system: string;
  user: string;
  schema: Record<string, unknown>;
  maxOutputTokens: number;
  temperature: number;
  signal?: AbortSignal;
  /** Tool/schema name and description shown to the model where the
   * provider's structured-output mechanism is tool-based (Anthropic) or
   * takes a schema label (OpenAI). Defaults to the hint-ladder wording in
   * each adapter for backward compatibility -- [USER-STATS]'s
   * generate-summary is the first caller to override these, since a
   * schema-agnostic default like "emit_hint_ladder" would mislead the
   * model on a completely different call shape. */
  schemaName?: string;
  schemaDescription?: string;
}

export interface ChatResponse {
  text: string;
  promptTokens: number;
  completionTokens: number;
  modelUsed: string;
  structuredOutputUsed: boolean;
  /** true only when the vendor's own stop/finish reason was a clean stop,
   * never a length/max-tokens cutoff -- see docs/SPEC_ADDENDUM.md §7. */
  finishedCleanly: boolean;
}

export type ProviderErrorCode =
  | 'provider_timeout'
  | 'provider_rate_limited'
  | 'provider_invalid_request'
  | 'provider_error';

export class ProviderError extends Error {
  constructor(
    public readonly code: ProviderErrorCode,
    message: string,
  ) {
    super(message);
  }
}

export interface Provider {
  id: 'openai' | 'anthropic' | 'gemini' | 'openai_compatible';
  send(req: ChatRequest): Promise<ChatResponse>;
}
