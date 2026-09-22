import { verifyUser, getAdminClient, UnauthenticatedError } from '../_shared/authClient.ts';
import { errorResponse, json, corsHeaders } from '../_shared/http.ts';

// [USER-STATS]: the hint ladder UI never reported how far a student got
// past the initial cached response -- interactions.max_level_reached was
// declared in the base schema but nothing ever wrote to it. This function
// is the only writer: the webview calls it when the student clicks "Show
// me the rule" (level 2) or "Show me the fix" (level 3), and the client's
// "errors you worked out yourself" stat (max_level_reached <= 1) and the
// history list's "solved yourself" / "saw the fix" markers both read the
// column this populates.
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  let userId: string;
  try {
    ({ userId } = await verifyUser(req));
  } catch (e) {
    if (e instanceof UnauthenticatedError) return errorResponse('unauthenticated', e.message, 401);
    throw e;
  }

  const body = (await req.json().catch(() => null)) as { interactionId?: string; level?: number } | null;
  const interactionId = body?.interactionId;
  const level = body?.level;
  if (!interactionId || (level !== 2 && level !== 3)) {
    return errorResponse('invalid_request', 'interactionId and level (2 or 3) are required', 422);
  }

  const admin = getAdminClient();
  const { data: existing, error: fetchError } = await admin
    .from('interactions')
    .select('session_id, max_level_reached, created_at')
    .eq('id', interactionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError || !existing) {
    return errorResponse('invalid_request', 'Interaction not found', 404);
  }

  const isEscalation = level > (existing.max_level_reached ?? 0);
  if (isEscalation) {
    await admin
      .from('interactions')
      .update({ max_level_reached: level })
      .eq('id', interactionId)
      .eq('user_id', userId);
  }

  // [FEEDBACK-EFFECTIVENESS]: previously this endpoint only ever recorded
  // a high-water mark, so there was no way to tell "clicked through
  // everything immediately" from "sat on L1 for three minutes first." One
  // timestamped row per reveal in the events table (declared since the
  // base schema, never written to until now) fixes that -- how long a
  // reveal is delayed after the interaction was created, or after the
  // previous reveal, is derivable later from server_ts across rows for
  // the same interaction_id, so nothing extra needs to be computed here.
  // client_event_id is deterministic (not client-supplied) so the same
  // level can never be double-logged for one interaction.
  await admin.from('events').insert({
    session_id: existing.session_id,
    user_id: userId,
    interaction_id: interactionId,
    event_type: 'level_reached',
    client_event_id: `level_reached:${interactionId}:${level}`,
    payload: {
      level,
      isEscalation,
      msSinceCreated: Date.now() - new Date(existing.created_at as string).getTime(),
    },
    client_ts: new Date().toISOString(),
  });

  return json({ ok: true });
});
