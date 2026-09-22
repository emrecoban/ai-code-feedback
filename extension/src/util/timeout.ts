export class TimeoutError extends Error {}

/**
 * Races a promise against a timer. Neither `fetch` nor supabase-js has a
 * default timeout, so a stalled connection or an unresponsive server can
 * otherwise hang a request forever -- with it, any await built on this
 * settles one way or another within `ms`, which is what actually
 * guarantees a loading spinner can never get stuck (base spec §9.4,
 * Appendix C #1).
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new TimeoutError(`Timed out after ${ms}ms`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

/** True for both our own timeout and a fetch AbortController firing --
 * the two ways REQUEST_TIMEOUT_MS can end a stalled request. */
export function isTimeoutOrAbort(err: unknown): boolean {
  return err instanceof TimeoutError || (err instanceof Error && err.name === 'AbortError');
}
