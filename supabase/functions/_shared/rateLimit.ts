import { getAdminClient } from './authClient.ts';

// base spec §6.5. The secrets are the defaults; an admin can override both
// from the dashboard (public.rate_limits, migrations/0024).
export const DEFAULT_LIMITS = {
  hourly: Number(Deno.env.get('RATE_LIMIT_HOURLY') ?? '40'),
  daily: Number(Deno.env.get('RATE_LIMIT_DAILY') ?? '200'),
};

export interface RateLimits {
  hourly: number;
  daily: number;
  source: 'dashboard' | 'secrets';
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

/** Read on every check, so a change made in the dashboard applies to the
 * very next request. A failed read falls back to the secrets rather than
 * blocking every student. */
export async function getRateLimits(): Promise<RateLimits> {
  const { data, error } = await getAdminClient()
    .from('rate_limits')
    .select('hourly, daily, updated_at, updated_by')
    .maybeSingle();
  if (error) console.error('Reading rate_limits failed; using the secrets:', error);
  if (error || !data) return { ...DEFAULT_LIMITS, source: 'secrets', updatedAt: null, updatedBy: null };
  return {
    hourly: data.hourly,
    daily: data.daily,
    source: 'dashboard',
    updatedAt: data.updated_at,
    updatedBy: data.updated_by,
  };
}

function hourBucket(date: Date): string {
  const d = new Date(date);
  d.setUTCMinutes(0, 0, 0);
  return d.toISOString();
}

export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const client = getAdminClient();
  const now = new Date();
  const currentHour = hourBucket(now);
  const dayStart = new Date(now);
  dayStart.setUTCHours(0, 0, 0, 0);

  // All three at once: reading the limits adds no wait of its own.
  const [limits, { data: hourRow }, { data: dayRows }] = await Promise.all([
    getRateLimits(),
    client
      .from('usage_counters')
      .select('requests')
      .eq('user_id', userId)
      .eq('window_start', currentHour)
      .maybeSingle(),
    client
      .from('usage_counters')
      .select('requests')
      .eq('user_id', userId)
      .gte('window_start', dayStart.toISOString()),
  ]);
  if ((hourRow?.requests ?? 0) >= limits.hourly) {
    return { allowed: false, retryAfterSeconds: secondsUntilNextHour(now) };
  }

  const dailyTotal = (dayRows ?? []).reduce((sum, r) => sum + (r.requests ?? 0), 0);
  if (dailyTotal >= limits.daily) {
    return { allowed: false, retryAfterSeconds: secondsUntilNextDay(now) };
  }

  return { allowed: true };
}

/** Read-then-upsert; a lost increment under concurrent requests from the
 * same user in the same hour is an acceptable tradeoff for a soft quota
 * at classroom scale, versus adding a dedicated increment RPC. */
export async function recordUsage(userId: string, tokens: number): Promise<void> {
  const client = getAdminClient();
  const currentHour = hourBucket(new Date());
  const { data } = await client
    .from('usage_counters')
    .select('requests, total_tokens')
    .eq('user_id', userId)
    .eq('window_start', currentHour)
    .maybeSingle();

  await client.from('usage_counters').upsert(
    {
      user_id: userId,
      window_start: currentHour,
      requests: (data?.requests ?? 0) + 1,
      total_tokens: (data?.total_tokens ?? 0) + tokens,
    },
    { onConflict: 'user_id,window_start' },
  );
}

function secondsUntilNextHour(now: Date): number {
  const next = new Date(now);
  next.setUTCHours(next.getUTCHours() + 1, 0, 0, 0);
  return Math.ceil((next.getTime() - now.getTime()) / 1000);
}

function secondsUntilNextDay(now: Date): number {
  const next = new Date(now);
  next.setUTCHours(24, 0, 0, 0);
  return Math.ceil((next.getTime() - now.getTime()) / 1000);
}
