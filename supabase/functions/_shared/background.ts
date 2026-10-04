// Supabase's Edge Runtime global: keeps the worker alive until a promise
// settles, even after the response has been sent. Read off globalThis so
// the code still runs (without the guarantee) wherever it isn't defined.
// For best-effort writes that must never slow down or fail a response.
export function runAfterResponse(work: PromiseLike<unknown>): void {
  const settled = Promise.resolve(work).catch((e) => console.error('Background task failed:', e));
  (globalThis as { EdgeRuntime?: { waitUntil(p: Promise<unknown>): void } }).EdgeRuntime?.waitUntil(settled);
}
