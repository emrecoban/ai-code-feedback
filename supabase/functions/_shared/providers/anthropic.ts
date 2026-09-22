import type { ChatRequest, ChatResponse, Provider } from './types.ts';
import { timeoutController, mapHttpError, mapNetworkError, safeText } from './http.ts';

const ANTHROPIC_VERSION = '2023-06-01';

/** Structured output via a forced tool call -- Claude has no native
 * response_format, so a single tool matching the hint-ladder schema is
 * defined and tool_choice forces the model to call it; the tool_use
 * block's `input` is already parsed against that schema. */
export function createAnthropicProvider(opts: { apiKey: string; model: string }): Provider {
  return {
    id: 'anthropic',
    async send(req: ChatRequest): Promise<ChatResponse> {
      const { signal, cleanup } = timeoutController(req.signal);
      const toolName = req.schemaName ?? 'emit_hint_ladder';
      let res: Response;
      try {
        res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': opts.apiKey,
            'anthropic-version': ANTHROPIC_VERSION,
          },
          body: JSON.stringify({
            model: opts.model,
            max_tokens: req.maxOutputTokens,
            temperature: req.temperature,
            // Explicit cache_control breakpoint (base spec §6.4): the
            // system message is fully static per course/week/language
            // after docs/SPEC_ADDENDUM.md §2, so this hits across every
            // student in the cohort, not just repeat calls from one user.
            system: [{ type: 'text', text: req.system, cache_control: { type: 'ephemeral' } }],
            messages: [{ role: 'user', content: req.user }],
            tools: [
              {
                name: toolName,
                description: req.schemaDescription ?? 'Emit the four-level hint ladder explanation.',
                input_schema: req.schema,
              },
            ],
            tool_choice: { type: 'tool', name: toolName },
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
      const toolUse = (body.content ?? []).find((b: { type: string }) => b.type === 'tool_use');
      return {
        text: toolUse ? JSON.stringify(toolUse.input) : '',
        promptTokens: body.usage?.input_tokens ?? 0,
        completionTokens: body.usage?.output_tokens ?? 0,
        modelUsed: body.model ?? opts.model,
        structuredOutputUsed: !!toolUse,
        // With tool_choice forced, a clean completion stops with
        // "tool_use", not "end_turn"; "max_tokens" means it was cut off.
        finishedCleanly: body.stop_reason === 'tool_use',
      };
    },
  };
}
