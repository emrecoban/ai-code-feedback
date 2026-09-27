import type { ChatRequest, ChatResponse, Provider } from './types.ts';
import { ProviderError } from './types.ts';
import { createOpenAiProvider } from './openai.ts';
import { createAnthropicProvider } from './anthropic.ts';
import { createGeminiProvider } from './gemini.ts';

export interface ResolvedProviders {
  primary: Provider;
  fallback: Provider | null;
  maxOutputTokens: (language: string) => number;
}

function buildProvider(id: string, apiKey: string, model: string, baseUrl: string | undefined): Provider {
  switch (id) {
    case 'openai':
      return createOpenAiProvider({ id: 'openai', apiKey, model, strictSchema: true });
    case 'anthropic':
      return createAnthropicProvider({ apiKey, model });
    case 'gemini':
      return createGeminiProvider({ apiKey, model });
    case 'openai_compatible':
      if (!baseUrl) throw new Error('AI_BASE_URL is required when AI_PROVIDER=openai_compatible');
      // Strict schema is now attempted here too. The adapter steps down
      // to plain JSON mode by itself when a server rejects it, so asking
      // costs one 400 on endpoints that can't do it and buys genuinely
      // constrained output on the ones that can (Kimi K3 documents
      // json_schema with strict).
      //
      // reasoning_effort defaults to "low" because the models reached
      // this way are the always-thinking kind: GLM 5.3 cannot disable
      // reasoning and defaults to "max" effort, which is how a 1600-token
      // budget got spent entirely on thought with no answer left over.
      // Set AI_REASONING_EFFORT to "high"/"max" to trade cost for depth,
      // or to "none" for a model that rejects the field outright -- though
      // the adapter also drops it on its own if the server objects.
      return createOpenAiProvider({
        id: 'openai_compatible',
        apiKey,
        model,
        baseUrl,
        strictSchema: true,
        reasoningEffort: resolveReasoningEffort(),
      });
    default:
      throw new Error(`Unrecognized AI_PROVIDER: "${id}"`);
  }
}

/** "none" (or an empty value) omits reasoning_effort entirely, for a
 * gateway model that rejects the field. Anything else is passed straight
 * through rather than validated against a fixed list, so a runtime that
 * accepts efforts this code has never heard of still works. */
function resolveReasoningEffort(): string | null {
  const configured = (Deno.env.get('AI_REASONING_EFFORT') ?? 'low').trim();
  return !configured || configured.toLowerCase() === 'none' ? null : configured;
}

let cached: ResolvedProviders | null = null;

/** Validates all provider env vars once at cold start and fails loudly
 * (base spec §6.1) -- never falls back to a default provider on
 * misconfiguration. */
export function resolveProviders(): ResolvedProviders {
  if (cached) return cached;

  const providerId = Deno.env.get('AI_PROVIDER');
  const apiKey = Deno.env.get('AI_API_KEY');
  const model = Deno.env.get('AI_MODEL');
  const baseUrl = Deno.env.get('AI_BASE_URL') || undefined;

  if (!providerId) throw new Error('AI_PROVIDER is not set');
  if (!apiKey) throw new Error('AI_API_KEY is not set');
  if (!model) throw new Error('AI_MODEL is not set');

  const primary = buildProvider(providerId, apiKey, model, baseUrl);

  let fallback: Provider | null = null;
  const fallbackId = Deno.env.get('AI_FALLBACK_PROVIDER');
  if (fallbackId) {
    const fallbackKey = Deno.env.get('AI_FALLBACK_API_KEY');
    const fallbackModel = Deno.env.get('AI_FALLBACK_MODEL');
    if (!fallbackKey || !fallbackModel) {
      throw new Error('AI_FALLBACK_PROVIDER is set but AI_FALLBACK_API_KEY/AI_FALLBACK_MODEL are missing');
    }
    fallback = buildProvider(
      fallbackId,
      fallbackKey,
      fallbackModel,
      Deno.env.get('AI_FALLBACK_BASE_URL') || undefined,
    );
  }

  // specs/SPEC_ADDENDUM.md §7 raised this from 1200 to 1600 for
  // Turkish/Spanish token expansion, with optional per-language
  // overrides. 1600 was sized for a model that answers directly, and it
  // is far too small for the always-thinking models behind an
  // openai_compatible gateway: GLM 5.3 spent a whole 1600-token budget on
  // reasoning and returned no answer at all. The cap only bounds what a
  // model may generate -- nothing is charged for headroom that goes
  // unused -- so a model that answers in 800 tokens still costs 800.
  const baseMaxTokens = Number(Deno.env.get('AI_MAX_OUTPUT_TOKENS') ?? '8000');
  const overrides: Record<string, number> = {
    tr: Number(Deno.env.get('AI_MAX_OUTPUT_TOKENS_TR') ?? baseMaxTokens),
    es: Number(Deno.env.get('AI_MAX_OUTPUT_TOKENS_ES') ?? baseMaxTokens),
  };

  cached = {
    primary,
    fallback,
    maxOutputTokens: (language: string) => overrides[language] ?? baseMaxTokens,
  };
  return cached;
}

/** On provider_timeout or a 5xx, retries once against the fallback
 * provider if configured (base spec §6.4), recording which one answered. */
export async function sendWithFailover(
  providers: ResolvedProviders,
  req: ChatRequest,
): Promise<{ response: ChatResponse; providerUsed: string }> {
  try {
    const response = await providers.primary.send(req);
    return { response, providerUsed: providers.primary.id };
  } catch (err) {
    const shouldFailover =
      providers.fallback &&
      err instanceof ProviderError &&
      (err.code === 'provider_timeout' || err.code === 'provider_error');
    if (!shouldFailover) throw err;
    const response = await providers.fallback!.send(req);
    return { response, providerUsed: providers.fallback!.id };
  }
}
