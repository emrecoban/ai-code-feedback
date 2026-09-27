import type { ChatRequest, ChatResponse, Provider } from './types.ts';
import { ProviderError } from './types.ts';
import { timeoutController, mapHttpError, mapNetworkError, safeText } from './http.ts';

/** What this adapter is allowed to send. Servers behind an
 * OpenAI-compatible gateway disagree on three things, and none of them
 * can be detected before asking:
 *
 * - the output cap is `max_completion_tokens` on newer runtimes (Kimi K3
 *   documents only this one) and `max_tokens` on older ones,
 * - `response_format` is honoured fully, partially, or not at all,
 * - `reasoning_effort` is required by always-thinking models and
 *   rejected outright by models that don't reason.
 *
 * Keying any of this off the model name would break the moment another
 * model appears on the gateway, so the adapter instead starts optimistic
 * and steps down one capability at a time whenever the server answers
 * 400, remembering what finally worked so later calls skip the probing. */
interface Capabilities {
  tokenField: 'max_completion_tokens' | 'max_tokens';
  responseFormat: 'json_schema' | 'json_object' | 'none';
  reasoningEffort: string | null;
}

/** Also backs the openai_compatible adapter (base spec §6.4) -- same
 * wire format, just a different baseUrl. */
export function createOpenAiProvider(opts: {
  id: 'openai' | 'openai_compatible';
  apiKey: string;
  model: string;
  baseUrl?: string;
  strictSchema: boolean;
  /** 'low' | 'high' | 'max' for models that always reason. Null omits
   * the field, which is what a non-reasoning model needs. */
  reasoningEffort?: string | null;
}): Provider {
  const baseUrl = normalizeBaseUrl(opts.baseUrl ?? 'https://api.openai.com/v1');

  const learned: Capabilities = {
    tokenField: 'max_completion_tokens',
    responseFormat: opts.strictSchema ? 'json_schema' : 'json_object',
    reasoningEffort: opts.reasoningEffort ?? null,
  };

  function buildBody(req: ChatRequest, caps: Capabilities): Record<string, unknown> {
    const body: Record<string, unknown> = {
      model: opts.model,
      temperature: req.temperature,
      messages: [
        { role: 'system', content: req.system },
        { role: 'user', content: req.user },
      ],
    };
    body[caps.tokenField] = req.maxOutputTokens;
    if (caps.reasoningEffort) body.reasoning_effort = caps.reasoningEffort;
    if (caps.responseFormat === 'json_schema') {
      body.response_format = {
        type: 'json_schema',
        json_schema: { name: req.schemaName ?? 'hint_ladder', schema: req.schema, strict: true },
      };
    } else if (caps.responseFormat === 'json_object') {
      body.response_format = { type: 'json_object' };
    }
    return body;
  }

  /** One rung down, or null at the bottom. Ordered by how likely each
   * field is to be the thing the server objected to: strict schema has
   * the most extra requirements, `reasoning_effort` is the newest field,
   * and `max_completion_tokens` only fails on genuinely old runtimes.
   * Plain JSON mode is given up last, since losing it costs output
   * quality on every later call. */
  function degrade(caps: Capabilities): Capabilities | null {
    if (caps.responseFormat === 'json_schema') return { ...caps, responseFormat: 'json_object' };
    if (caps.reasoningEffort) return { ...caps, reasoningEffort: null };
    if (caps.tokenField === 'max_completion_tokens') return { ...caps, tokenField: 'max_tokens' };
    if (caps.responseFormat === 'json_object') return { ...caps, responseFormat: 'none' };
    return null;
  }

  async function call(req: ChatRequest, caps: Capabilities): Promise<ChatResponse> {
    const { signal, cleanup } = timeoutController(req.signal);
    let res: Response;
    try {
      res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${opts.apiKey}` },
        body: JSON.stringify(buildBody(req, caps)),
        signal,
      });
    } catch (e) {
      throw mapNetworkError(e);
    } finally {
      cleanup();
    }

    if (!res.ok) throw mapHttpError(res.status, await safeText(res));

    const body = await res.json();
    const choice = body.choices?.[0];
    const message = (choice?.message ?? {}) as Record<string, unknown>;

    // A refusal is a deliberate answer, not a malformed one. Left to fall
    // through it arrives at the validators as empty text and is reported
    // two repair passes later as "not valid JSON", which hides the actual
    // reason. Raised as provider_error rather than invalid_request so it
    // doesn't get mistaken for a capability problem and trigger the
    // ladder below -- a different model may well not refuse.
    const refusal = typeof message.refusal === 'string' ? message.refusal.trim() : '';
    if (refusal) throw new ProviderError('provider_error', `Model refused to answer: ${refusal.slice(0, 200)}`);

    const usage = (body.usage ?? {}) as Record<string, number>;
    const { promptTokens, completionTokens } = reconcileTokens(usage);

    return {
      text: extractText(message),
      promptTokens,
      completionTokens,
      modelUsed: body.model ?? opts.model,
      structuredOutputUsed: caps.responseFormat === 'json_schema',
      finishedCleanly: choice?.finish_reason === 'stop',
    };
  }

  return {
    id: opts.id,
    async send(req: ChatRequest): Promise<ChatResponse> {
      let caps: Capabilities | null = { ...learned };
      let lastInvalid: ProviderError | null = null;

      while (caps) {
        try {
          const response = await call(req, caps);
          // Remember the working combination so the next request doesn't
          // pay for the same round of 400s.
          learned.tokenField = caps.tokenField;
          learned.responseFormat = caps.responseFormat;
          learned.reasoningEffort = caps.reasoningEffort;
          return response;
        } catch (e) {
          if (!(e instanceof ProviderError) || e.code !== 'provider_invalid_request') throw e;
          lastInvalid = e;
          caps = degrade(caps);
        }
      }
      throw lastInvalid ?? new ProviderError('provider_error', 'Request rejected with every supported shape');
    },
  };
}

/** Reasoning models keep their chain of thought in `reasoning_content`
 * and the answer in `content`; Kimi K3's docs are explicit that only
 * `content` should be parsed. `reasoning_content` is therefore a last
 * resort, for the case that actually happens in practice: the model
 * spends its whole budget thinking, never emits an answer, and the only
 * thing worth salvaging is whatever JSON it managed to draft while
 * reasoning. Preferring `content` keeps the normal path unchanged. */
function extractText(message: Record<string, unknown>): string {
  return asText(message.content) || asText(message.reasoning_content);
}

/** Some gateways return content as an array of parts instead of a string. */
function asText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (!Array.isArray(value)) return '';
  return value
    .map((part) => {
      if (typeof part === 'string') return part;
      const text = (part as { text?: unknown })?.text;
      return typeof text === 'string' ? text : '';
    })
    .join('')
    .trim();
}

/** DeepSeek through Doubleword reports `total_tokens` but omits
 * `prompt_tokens` entirely, so adding the two fields the base spec
 * expects under-reports what the request actually cost -- and that total
 * is what the hourly quota is charged against. Fill in whichever side is
 * missing from the one that isn't. */
function reconcileTokens(usage: Record<string, number>): { promptTokens: number; completionTokens: number } {
  const prompt = numeric(usage.prompt_tokens);
  const completion = numeric(usage.completion_tokens);
  const total = numeric(usage.total_tokens);
  return {
    promptTokens: prompt || Math.max(0, total - completion),
    completionTokens: completion || Math.max(0, total - prompt),
  };
}

function numeric(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;
}

/** AI_BASE_URL is documented as the API root (e.g.
 * "https://api.groq.com/openai/v1"), but pasting a full endpoint URL
 * including "/chat/completions" -- exactly what most providers' sample
 * curl commands show -- is an easy, natural mistake. Strip it if present
 * rather than silently doubling the path and producing a confusing 404. */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '').replace(/\/chat\/completions$/i, '');
}
