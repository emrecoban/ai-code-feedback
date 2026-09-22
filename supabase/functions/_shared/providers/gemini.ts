import type { ChatRequest, ChatResponse, Provider } from './types.ts';
import { timeoutController, mapHttpError, mapNetworkError, safeText } from './http.ts';

export function createGeminiProvider(opts: { apiKey: string; model: string }): Provider {
  return {
    id: 'gemini',
    async send(req: ChatRequest): Promise<ChatResponse> {
      const { signal, cleanup } = timeoutController(req.signal);
      let res: Response;
      try {
        res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:generateContent?key=${opts.apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: req.system }] },
              contents: [{ role: 'user', parts: [{ text: req.user }] }],
              generationConfig: {
                temperature: req.temperature,
                maxOutputTokens: req.maxOutputTokens,
                responseMimeType: 'application/json',
                responseSchema: stripUnsupportedKeywords(req.schema),
              },
            }),
            signal,
          },
        );
      } catch (e) {
        throw mapNetworkError(e);
      } finally {
        cleanup();
      }

      if (!res.ok) throw mapHttpError(res.status, await safeText(res));

      const body = await res.json();
      const candidate = body.candidates?.[0];
      const text = (candidate?.content?.parts ?? [])
        .map((p: { text?: string }) => p.text ?? '')
        .join('');
      return {
        text,
        promptTokens: body.usageMetadata?.promptTokenCount ?? 0,
        completionTokens: body.usageMetadata?.candidatesTokenCount ?? 0,
        modelUsed: opts.model,
        structuredOutputUsed: true,
        finishedCleanly: candidate?.finishReason === 'STOP',
      };
    },
  };
}

/** Gemini's responseSchema is a strict subset of JSON Schema and rejects
 * requests containing "additionalProperties" -- the parameter-rejection
 * case base spec §6.4 calls out. Stripped statically rather than via the
 * full probe-once-and-cache mechanism §6.4 describes, since this one is
 * known in advance rather than discovered at runtime. */
function stripUnsupportedKeywords(schema: Record<string, unknown>): Record<string, unknown> {
  const clone: Record<string, unknown> = { ...schema };
  delete clone.additionalProperties;
  if (clone.properties && typeof clone.properties === 'object') {
    const props = clone.properties as Record<string, unknown>;
    const newProps: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(props)) {
      newProps[key] =
        typeof value === 'object' && value !== null
          ? stripUnsupportedKeywords(value as Record<string, unknown>)
          : value;
    }
    clone.properties = newProps;
  }
  if (clone.items && typeof clone.items === 'object') {
    clone.items = stripUnsupportedKeywords(clone.items as Record<string, unknown>);
  }
  return clone;
}
