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

export async function lookupCache(cacheKey: string): Promise<{ payload: unknown; modelUsed: string } | null> {
  const client = getAdminClient();
  const { data } = await client
    .from('explanations')
    .select('id, payload, model_used, reuse_count')
    .eq('cache_key', cacheKey)
    .maybeSingle();
  if (!data) return null;

  // Best-effort counter -- a lost increment under a concurrent cache hit
  // is an acceptable tradeoff for not needing a dedicated RPC here.
  void client.from('explanations').update({ reuse_count: (data.reuse_count ?? 0) + 1 }).eq('id', data.id);

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
