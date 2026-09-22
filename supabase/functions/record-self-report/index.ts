import { verifyUser, getAdminClient, UnauthenticatedError } from '../_shared/authClient.ts';
import { errorResponse, json, corsHeaders } from '../_shared/http.ts';

// [FEEDBACK-EFFECTIVENESS]: the student's own answer about an
// explanation -- was it helpful, and did they end up solving the problem.
// An interaction attribute with one value, not an occurrence, so it
// updates interactions directly (like record-level) rather than appending
// to the events log.
//
// Any field may arrive on its own: the three questions are answered
// independently in the sidebar, and a student may answer one and ignore
// the rest.
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  let userId: string;
  try {
    ({ userId } = await verifyUser(req));
  } catch (e) {
    if (e instanceof UnauthenticatedError) return errorResponse('unauthenticated', e.message, 401);
    throw e;
  }

  const body = (await req.json().catch(() => null)) as {
    interactionId?: string;
    helpfulRating?: number;
    outcome?: string;
    postConfidence?: string;
  } | null;

  const interactionId = body?.interactionId;
  const helpfulRating = body?.helpfulRating;
  const outcome = body?.outcome;
  const postConfidence = body?.postConfidence;

  if (!interactionId) {
    return errorResponse('invalid_request', 'interactionId is required', 422);
  }
  if (helpfulRating !== undefined && helpfulRating !== 1 && helpfulRating !== -1) {
    return errorResponse('invalid_request', 'helpfulRating must be 1 or -1', 422);
  }
  if (outcome !== undefined && outcome !== 'solved' && outcome !== 'still_stuck') {
    return errorResponse('invalid_request', "outcome must be 'solved' or 'still_stuck'", 422);
  }
  if (postConfidence !== undefined && !['yes', 'maybe', 'no'].includes(postConfidence)) {
    return errorResponse('invalid_request', "postConfidence must be 'yes', 'maybe' or 'no'", 422);
  }
  if (helpfulRating === undefined && outcome === undefined && postConfidence === undefined) {
    return errorResponse('invalid_request', 'nothing to record', 422);
  }

  const admin = getAdminClient();
  const update: Record<string, unknown> = {};
  if (helpfulRating !== undefined) update.helpful_rating = helpfulRating;
  if (outcome !== undefined) update.self_reported_outcome = outcome;
  if (postConfidence !== undefined) update.post_confidence = postConfidence;

  const { data, error } = await admin
    .from('interactions')
    .update(update)
    .eq('id', interactionId)
    .eq('user_id', userId)
    .select('id')
    .maybeSingle();

  if (error || !data) {
    return errorResponse('invalid_request', 'Interaction not found', 404);
  }

  return json({ ok: true });
});
