import { getAdminClient } from '../_shared/authClient.ts';
import { errorResponse, json, corsHeaders } from '../_shared/http.ts';
import { DEFAULT_LIMITS, getRateLimits } from '../_shared/rateLimit.ts';

// The AI settings that live only in Edge Function secrets (the database
// can't see them), for the research dashboard: which provider and model
// explain is configured with, and the quota explain enforces -- the one
// set in the dashboard, or the secrets' defaults.
//
// Deployed with verify_jwt: false -- dashboard accounts are not Supabase
// Auth users, so there is no JWT to verify. The dashboard session token
// in the body is checked instead, through the same dashboard_session
// function every dashboard request relies on. Nothing secret is returned:
// model names and limits only, never keys or URLs.
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const body = (await req.json().catch(() => null)) as { token?: string } | null;
  if (!body?.token) return errorResponse('unauthenticated', 'Not signed in', 401);

  const { data, error } = await getAdminClient().rpc('dashboard_session', { p_token: body.token });
  const account = (data as { account?: { must_change_password?: boolean } } | null)?.account;
  // Same rule as every data function: no data until a pending password
  // change is done.
  if (error || !account || account.must_change_password) {
    return errorResponse('unauthenticated', 'Not signed in', 401);
  }

  const fallbackProvider = Deno.env.get('AI_FALLBACK_PROVIDER') || null;
  // The same reading explain's checkRateLimit() uses, so the dashboard
  // shows exactly what is enforced.
  const limits = await getRateLimits();
  return json({
    provider: Deno.env.get('AI_PROVIDER') ?? null,
    model: Deno.env.get('AI_MODEL') ?? null,
    fallback: fallbackProvider
      ? { provider: fallbackProvider, model: Deno.env.get('AI_FALLBACK_MODEL') ?? null }
      : null,
    limits: {
      hourly: limits.hourly,
      daily: limits.daily,
      source: limits.source,
      updated_at: limits.updatedAt,
      updated_by: limits.updatedBy,
    },
    default_limits: DEFAULT_LIMITS,
  });
});
