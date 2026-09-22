import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '../constants';
import type { EdgeFunctionError } from './types';

export class BackendError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly retryAfterSeconds?: number,
  ) {
    super(message);
  }
}

export async function callEdgeFunction<TResponse>(
  functionName: string,
  body: unknown,
  accessToken: string,
  signal?: AbortSignal,
): Promise<TResponse> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      apikey: SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    let payload: EdgeFunctionError;
    try {
      payload = (await res.json()) as EdgeFunctionError;
    } catch {
      throw new BackendError('provider_error', `Request failed with status ${res.status}`);
    }
    throw new BackendError(payload.error, payload.message, payload.retryAfterSeconds);
  }

  return (await res.json()) as TResponse;
}
