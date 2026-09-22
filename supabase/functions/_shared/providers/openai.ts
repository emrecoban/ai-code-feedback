import type { ChatRequest, ChatResponse, Provider } from './types.ts';
import { ProviderError } from './types.ts';
import { timeoutController, mapHttpError, mapNetworkError, safeText } from './http.ts';

/** Also backs the openai_compatible adapter (base spec §6.4) -- same
 * wire format, just a different baseUrl. */
export function createOpenAiProvider(opts: {
  id: 'openai' | 'openai_compatible';
  apiKey: string;
  model: string;
  baseUrl?: string;
  strictSchema: boolean;
}): Provider {
  const baseUrl = normalizeBaseUrl(opts.baseUrl ?? 'https://api.openai.com/v1');

  async function call(req: ChatRequest, responseFormat: Record<string, unknown>): Promise<ChatResponse> {
    const { signal, cleanup } = timeoutController(req.signal);
    let res: Response;
    try {
      res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${opts.apiKey}` },
        body: JSON.stringify({
          model: opts.model,
          temperature: req.temperature,
          max_tokens: req.maxOutputTokens,
          messages: [
            { role: 'system', content: req.system },
            { role: 'user', content: req.user },
          ],
          response_format: responseFormat,
        }),
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
    return {
      text: choice?.message?.content ?? '',
      promptTokens: body.usage?.prompt_tokens ?? 0,
      completionTokens: body.usage?.completion_tokens ?? 0,
      modelUsed: body.model ?? opts.model,
      structuredOutputUsed: responseFormat.type === 'json_schema',
      finishedCleanly: choice?.finish_reason === 'stop',
    };
  }

  return {
    id: opts.id,
    async send(req: ChatRequest): Promise<ChatResponse> {
      if (!opts.strictSchema) {
        return call(req, { type: 'json_object' });
      }
      // Degradation ladder (base spec §6.4): strict schema-constrained
      // output first; OpenAI's strict mode has extra requirements beyond
      // plain JSON Schema (e.g. every property must be in `required`),
      // so a request that violates those comes back as
      // provider_invalid_request -- fall back to plain JSON mode rather
      // than surfacing that as a hard failure.
      try {
        return await call(req, {
          type: 'json_schema',
          json_schema: { name: req.schemaName ?? 'hint_ladder', schema: req.schema, strict: true },
        });
      } catch (e) {
        if (e instanceof ProviderError && e.code === 'provider_invalid_request') {
          return call(req, { type: 'json_object' });
        }
        throw e;
      }
    },
  };
}

/** AI_BASE_URL is documented as the API root (e.g.
 * "https://api.groq.com/openai/v1"), but pasting a full endpoint URL
 * including "/chat/completions" -- exactly what most providers' sample
 * curl commands show -- is an easy, natural mistake. Strip it if present
 * rather than silently doubling the path and producing a confusing 404. */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '').replace(/\/chat\/completions$/i, '');
}
