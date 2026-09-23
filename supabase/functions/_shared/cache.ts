import { getAdminClient } from './authClient.ts';

// base spec §10.4
export async function computeCacheKey(parts: {
  courseId: string | null;
  currentWeek: number | null;
  language: string;
  questionType: string;
  errorSignature: string;
  code: string;
}): Promise<string> {
  const raw = [
    parts.courseId ?? 'generic',
    parts.currentWeek ?? 'na',
    parts.language,
    parts.questionType,
    normalizeErrorSignature(parts.errorSignature),
    await sha256(normalizeCode(parts.code)),
  ].join('|');
  return sha256(raw);
}

// [PROMPT-AUDIT]: exported so explain/index.ts can store the same
// normalized form on the interaction row itself, rather than reimplementing
// this regex. Recurring-error detection needs this -- the raw message
// stored on interactions.error_signature differs across otherwise-identical
// errors whenever a line number or literal value differs.
export function normalizeErrorSignature(sig: string): string {
  return sig.replace(/\d+/g, '#').replace(/["'].*?["']/g, '"X"').trim().toLowerCase();
}

function normalizeCode(code: string): string {
  return code.replace(/\/\/.*$/gm, '').replace(/#.*$/gm, '').replace(/\s+/g, ' ').trim();
}

async function sha256(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Supabase's Edge Runtime global: keeps the worker alive until a promise
// settles, even after the response has been sent. Read off globalThis so
// the code still runs (without the guarantee) wherever it isn't defined.
function runAfterResponse(work: PromiseLike<unknown>): void {
  const settled = Promise.resolve(work).catch((e) => console.error('Background task failed:', e));
  (globalThis as { EdgeRuntime?: { waitUntil(p: Promise<unknown>): void } }).EdgeRuntime?.waitUntil(settled);
}

export async function lookupCache(cacheKey: string): Promise<{ payload: unknown; modelUsed: string } | null> {
  const client = getAdminClient();
  const { data } = await client
    .from('explanations')
    .select('id, payload, model_used')
    .eq('cache_key', cacheKey)
    .maybeSingle();
  if (!data) return null;

  // Best-effort counter, finished after the response goes out so a cache
  // hit is no slower for it. A supabase-js builder only sends its request
  // once it is awaited or .then()'d -- the old `void builder` here never
  // sent anything. Atomic on the SQL side (migrations/0022), so concurrent
  // hits all count.
  runAfterResponse(
    client.rpc('increment_explanation_reuse', { p_id: data.id }).then(({ error }) => {
      if (error) console.error('Cache reuse counter failed:', error);
    }),
  );

  return { payload: data.payload, modelUsed: data.model_used };
}

export async function writeCache(input: {
  cacheKey: string;
  courseId: string | null;
  weekNo: number | null;
  language: string;
  errorSignature: string | null;
  payload: unknown;
  modelUsed: string;
}): Promise<void> {
  await getAdminClient()
    .from('explanations')
    .upsert(
      {
        cache_key: input.cacheKey,
        course_id: input.courseId,
        week_no: input.weekNo,
        language: input.language,
        error_signature: input.errorSignature,
        payload: input.payload,
        model_used: input.modelUsed,
        source: 'generated',
      },
      { onConflict: 'cache_key' },
    );
}
