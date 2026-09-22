import { ProviderError } from './types.ts';

const DEFAULT_TIMEOUT_MS = Number(Deno.env.get('AI_TIMEOUT_MS') ?? '20000');

/** One timeout + one caller-supplied abort, normalized into a single signal. */
export function timeoutController(parentSignal?: AbortSignal): {
  signal: AbortSignal;
  cleanup: () => void;
} {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  const onParentAbort = () => controller.abort();
  parentSignal?.addEventListener('abort', onParentAbort);
  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      parentSignal?.removeEventListener('abort', onParentAbort);
    },
  };
}

/** Normalizes any vendor's HTTP error onto the shared internal error set
 * (base spec §6.4) -- callers must never branch on vendor-specific shapes. */
export function mapHttpError(status: number, bodyText: string): ProviderError {
  if (status === 429) return new ProviderError('provider_rate_limited', `Rate limited (${status})`);
  if (status === 400 || status === 422) {
    return new ProviderError('provider_invalid_request', `Invalid request (${status}): ${bodyText.slice(0, 300)}`);
  }
  if (status >= 500) return new ProviderError('provider_error', `Upstream error (${status})`);
  return new ProviderError('provider_error', `Unexpected status ${status}: ${bodyText.slice(0, 300)}`);
}

export function mapNetworkError(e: unknown): ProviderError {
  if (e instanceof DOMException && e.name === 'AbortError') {
    return new ProviderError('provider_timeout', 'Request timed out');
  }
  return new ProviderError('provider_error', e instanceof Error ? e.message : String(e));
}

export async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '';
  }
}
