import { verifyUser, getAdminClient, UnauthenticatedError } from '../_shared/authClient.ts';
import { errorResponse, json, corsHeaders } from '../_shared/http.ts';

// [FEEDBACK-EFFECTIVENESS]: one endpoint for every research event the
// client can observe but the server cannot -- editor-side behaviour like
// "the student edited right after seeing the fix" or "the diagnostic they
// asked about is now gone". Replaces the per-event-type function this
// started as: the shape of each payload is its own business, but the type
// must be known and the row must belong to the caller, and that is the
// same check every time.
//
// Events always carry a derived measurement (a ratio, a duration), never
// raw code -- see extension/src/backend/researchEvents.ts for the callers.
const ALLOWED_EVENT_TYPES = new Set([
  'post_feedback_edit',
  'diagnostic_resolved',
  'explanation_visibility',
  'fix_undone',
  'question_picker_abandoned',
  'returned_to_code',
  'feedback_abandoned',
  'request_failed',
  'file_cleared',
  'feedback_language_changed',
  'explanation_reopened',
  'explanation_copied',
  'run_finished',
]);

interface LogEventBody {
  eventType?: string;
  clientEventId?: string;
  interactionId?: string | null;
  sessionId?: string | null;
  payload?: unknown;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  let userId: string;
  try {
    ({ userId } = await verifyUser(req));
  } catch (e) {
    if (e instanceof UnauthenticatedError) return errorResponse('unauthenticated', e.message, 401);
    throw e;
  }

  const body = (await req.json().catch(() => null)) as LogEventBody | null;
  const eventType = body?.eventType;
  const clientEventId = body?.clientEventId;
  const interactionId = body?.interactionId ?? null;
  const payload = body?.payload ?? {};

  if (!eventType || !ALLOWED_EVENT_TYPES.has(eventType)) {
    return errorResponse('invalid_request', 'eventType is not recognised', 422);
  }
  if (!clientEventId) {
    return errorResponse('invalid_request', 'clientEventId is required', 422);
  }
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    return errorResponse('invalid_request', 'payload must be an object', 422);
  }
  if (!interactionId && !body?.sessionId) {
    return errorResponse('invalid_request', 'interactionId or sessionId is required', 422);
  }

  const admin = getAdminClient();

  // An interaction id resolves to its own session, so the client never has
  // to send both -- and either way the row is only accepted if it belongs
  // to the caller.
  let sessionId: string;
  if (interactionId) {
    const { data } = await admin
      .from('interactions')
      .select('session_id')
      .eq('id', interactionId)
      .eq('user_id', userId)
      .maybeSingle();
    if (!data) return errorResponse('invalid_request', 'Interaction not found', 404);
    sessionId = data.session_id as string;
  } else {
    const { data } = await admin
      .from('coding_sessions')
      .select('id')
      .eq('id', body!.sessionId!)
      .eq('user_id', userId)
      .maybeSingle();
    if (!data) return errorResponse('invalid_request', 'Session not found', 404);
    sessionId = data.id as string;
  }

  await admin.from('events').insert({
    session_id: sessionId,
    user_id: userId,
    interaction_id: interactionId,
    event_type: eventType,
    client_event_id: clientEventId,
    payload,
    client_ts: new Date().toISOString(),
  });

  return json({ ok: true });
});
