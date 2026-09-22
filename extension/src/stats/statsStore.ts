import type { SupabaseClient } from '@supabase/supabase-js';
import { t } from '../i18n/strings';

export interface Stat {
  key: string;
  label: string;
  value: string;
}

export interface HistoryEntry {
  /** Needed so a card can be clicked to re-open what was said. */
  id: string;
  title: string;
  /** 0-3, same as interactions.max_level_reached -- the sidebar derives
   * both the outcome dot's color and the "L0 · L1 · ..." level label from
   * this single number, rather than the store pre-computing two
   * presentational values that could drift out of sync with each other. */
  maxLevelReached: number;
  createdAt: string;
  /** 'diagnostic' | 'selection' today (the DB constraint reserves a few
   * more values nothing currently produces). Shown on hover, not on the
   * card face, to keep the card itself scannable. */
  triggerSource: string;
  /** Always 'what_does_this_mean' for diagnostic-triggered rows; null on
   * rows that predate this column. */
  questionType: string | null;
  /** Diagnostic-triggered rows only; the actual free-text a student typed
   * for a 'free_text' selection question is never persisted, so this is
   * the closest thing to "what prompted this" for the rest. */
  errorSignature: string | null;
}

export interface NarrativeInfo {
  studentSummary: string;
  suggestedPractice: string;
}

export interface UserStatsView {
  /** Distinguishes "no interactions yet" (roadmap's week-one empty state)
   * from "some activity, but not enough yet for a narrative" -- both
   * render differently in the sidebar. */
  hasActivity: boolean;
  narrative: NarrativeInfo | null;
  history: HistoryEntry[];
  numbers: Stat[];
  /** Advisory only -- the caller may use this to fire a fire-and-forget
   * generate-summary call, but generate-summary re-checks the same
   * condition server-side before spending a model call. */
  narrativeIsStale: boolean;
  /** 0-1, how close the narrative is to its next regeneration -- the
   * sidebar renders this as a progress bar. Resets to 0 the moment
   * generate-summary succeeds, since that resets both of the underlying
   * columns this is computed from. */
  summaryProgress: number;
}

// [USER-STATS]: returns an array (usually one entry) rather than a single
// Stat, so a fetcher that needs several numbers from the same query --
// like the activity metrics below, all four columns of one coding_sessions
// row -- can return them together instead of the caller issuing one
// redundant round trip per number.
type StatFetcher = (client: SupabaseClient, userId: string) => Promise<Stat[]>;

async function explanationsAskedFor(client: SupabaseClient, userId: string): Promise<Stat[]> {
  // interactions gets one row per explain call, cache hit or miss
  // (base spec §5.1) -- a plain count, no row data needed.
  const { count } = await client.from('interactions').select('*', { count: 'exact', head: true }).eq('user_id', userId);
  return [{ key: 'explanationsAskedFor', label: t('Explanations asked for'), value: String(count ?? 0) }];
}

async function errorsWorkedOutYourself(client: SupabaseClient, userId: string): Promise<Stat[]> {
  // max_level_reached <= 1 means the student never asked to see the rule
  // or the fix -- the L0/L1 explanation alone was enough.
  const { count } = await client
    .from('interactions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .lte('max_level_reached', 1);
  return [{ key: 'errorsWorkedOutYourself', label: t('Errors you worked out yourself'), value: String(count ?? 0) }];
}

async function daysUsingThis(client: SupabaseClient, userId: string): Promise<Stat[]> {
  // No dedicated "run" or "active day" tracking exists, so this counts
  // distinct calendar dates across coding_sessions.started_at (one row
  // per VS Code session) -- reliable with what's actually recorded today,
  // computed client-side since Postgres distinct-date counts aren't worth
  // a dedicated RPC for a number this cheap to derive locally.
  const { data } = await client.from('coding_sessions').select('started_at').eq('user_id', userId);
  const days = new Set((data ?? []).map((row) => new Date(row.started_at as string).toDateString()));
  return [{ key: 'daysUsingThis', label: t('Days using this'), value: String(days.size) }];
}

/** [STUDENT-ACTIVITY-DATA]: one query against coding_sessions, summed
 * client-side into five numbers -- same "fetch raw rows, aggregate in JS"
 * convention already used by daysUsingThis above, and one round trip
 * shared across all five rather than separate queries against the same
 * table. Placed immediately after daysUsingThis in STAT_FETCHERS below,
 * which is what puts these rows right after "days using this" in the
 * rendered list -- render order is simply array order.
 *
 * errors_resolved_without_asking (from DiagnosticTrigger's
 * detectSilentResolutions) is a different claim than
 * errorsWorkedOutYourself above: that one counts errors a student *asked*
 * about and resolved with the explanation alone; this one counts errors
 * that disappeared having never been asked about at all -- the only
 * direct evidence available that a student didn't need the extension. */
async function activityMetrics(client: SupabaseClient, userId: string): Promise<Stat[]> {
  const { data } = await client
    .from('coding_sessions')
    .select('active_seconds, lines_written, lines_deleted, files_created, errors_resolved_without_asking')
    .eq('user_id', userId);
  const rows = data ?? [];

  const totalActiveSeconds = rows.reduce((sum, r) => sum + ((r.active_seconds as number | null) ?? 0), 0);
  const totalLinesWritten = rows.reduce((sum, r) => sum + ((r.lines_written as number | null) ?? 0), 0);
  const totalLinesDeleted = rows.reduce((sum, r) => sum + ((r.lines_deleted as number | null) ?? 0), 0);
  const totalFilesCreated = rows.reduce((sum, r) => sum + ((r.files_created as number | null) ?? 0), 0);
  const totalSelfResolved = rows.reduce(
    (sum, r) => sum + ((r.errors_resolved_without_asking as number | null) ?? 0),
    0,
  );

  return [
    { key: 'totalActiveTime', label: t('Total active time'), value: `${(totalActiveSeconds / 3600).toFixed(1)}h` },
    { key: 'linesWritten', label: t('Lines written'), value: String(totalLinesWritten) },
    { key: 'linesDeleted', label: t('Lines deleted'), value: String(totalLinesDeleted) },
    { key: 'filesCreated', label: t('Files created'), value: String(totalFilesCreated) },
    { key: 'selfResolvedErrors', label: t('Errors you fixed without asking'), value: String(totalSelfResolved) },
  ];
}

/**
 * [USER-STATS]: one fetcher per number (or tightly-related group of
 * numbers) shown, listed here in render order. Adding another cumulative
 * number later means writing one more function with this shape and adding
 * it to this array -- nothing else (the sidebar, the render logic) needs
 * to know what a "stat" is beyond {key, label, value}.
 */
const STAT_FETCHERS: StatFetcher[] = [
  explanationsAskedFor,
  errorsWorkedOutYourself,
  daysUsingThis,
  activityMetrics,
];

/** A fetcher failing (network hiccup, RLS edge case) shouldn't blank out
 * every other stat -- collect whatever succeeded. */
async function fetchNumbers(client: SupabaseClient, userId: string): Promise<Stat[]> {
  const results = await Promise.allSettled(STAT_FETCHERS.map((fetch) => fetch(client, userId)));
  return results
    .filter((r): r is PromiseFulfilledResult<Stat[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value);
}

/** [FEEDBACK-EFFECTIVENESS]: fetches one past explanation on demand, for
 * re-reading from the history list. Deliberately not part of
 * fetchUserStats -- pulling ten full hint ladders on every stats refresh
 * to show ten one-line cards would be wasteful, and most are never
 * re-opened. Returns null for rows written before ladder_payload existed,
 * which the caller treats as "nothing to show". */
export async function fetchInteractionLadder(
  client: SupabaseClient,
  userId: string,
  interactionId: string,
): Promise<{ title: string; levels: unknown } | null> {
  const { data } = await client
    .from('interactions')
    .select('title, ladder_payload')
    .eq('id', interactionId)
    .eq('user_id', userId)
    .maybeSingle();

  const payload = data?.ladder_payload as Record<string, unknown> | null | undefined;
  if (!payload) return null;

  return {
    title: (data?.title as string | null) || t('Untitled'),
    levels: {
      l0_decode: payload.l0_decode,
      l1_locate: payload.l1_locate,
      l2_concept: payload.l2_concept,
      l3_fix: payload.l3_fix,
    },
  };
}

const HISTORY_LIMIT = 10;
const STALE_HOURS = 24;
const MIN_NEW_INTERACTIONS = 3;

async function fetchHistory(client: SupabaseClient, userId: string): Promise<HistoryEntry[]> {
  const { data } = await client
    .from('interactions')
    .select('id, title, max_level_reached, created_at, trigger_source, question_type, error_signature')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(HISTORY_LIMIT);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    // Rows from before the title column existed have none.
    title: (row.title as string | null) || t('Untitled'),
    maxLevelReached: row.max_level_reached as number,
    createdAt: row.created_at as string,
    triggerSource: row.trigger_source as string,
    questionType: row.question_type as string | null,
    errorSignature: row.error_signature as string | null,
  }));
}

async function fetchNarrative(
  client: SupabaseClient,
  userId: string,
): Promise<{ narrative: NarrativeInfo | null; narrativeIsStale: boolean; summaryProgress: number }> {
  const { data } = await client
    .from('learner_profiles')
    .select('student_summary, suggested_practice, summary_generated_at, interactions_since_update')
    .eq('user_id', userId)
    .maybeSingle();

  const generatedAt = data?.summary_generated_at ? new Date(data.summary_generated_at as string) : null;
  const hoursSince = generatedAt ? (Date.now() - generatedAt.getTime()) / 3_600_000 : Infinity;
  const interactionsSinceUpdate = (data?.interactions_since_update as number | undefined) ?? 0;

  // Regeneration needs BOTH gates open (time elapsed AND enough new
  // interactions since the last one) -- overall progress is bottlenecked
  // by whichever gate is further behind, same AND the staleness check
  // itself uses. A never-generated profile has hoursSince = Infinity, so
  // timeProgress is already 1 and progress reduces to just the count
  // gate -- correct for the very first summary, with no special-casing.
  const timeProgress = Math.min(1, hoursSince / STALE_HOURS);
  const countProgress = Math.min(1, interactionsSinceUpdate / MIN_NEW_INTERACTIONS);
  const summaryProgress = Math.min(timeProgress, countProgress);

  const studentSummary = (data?.student_summary as string | undefined) ?? '';
  const narrative =
    studentSummary.length > 0
      ? { studentSummary, suggestedPractice: (data?.suggested_practice as string | undefined) ?? '' }
      : null;

  return { narrative, narrativeIsStale: summaryProgress >= 1, summaryProgress };
}

/** [USER-STATS]: one query group per band (numbers, history, narrative),
 * run in parallel and assembled into one view. Adding a new number is a
 * one-function change to STAT_FETCHERS above; adding a whole new band
 * means one more fetch function here plus one field on UserStatsView --
 * neither touches the sidebar's render code, which only knows the shape
 * of UserStatsView. */
export async function fetchUserStats(client: SupabaseClient, userId: string): Promise<UserStatsView> {
  const [numbers, history, narrativeResult] = await Promise.all([
    fetchNumbers(client, userId),
    fetchHistory(client, userId),
    fetchNarrative(client, userId),
  ]);

  return {
    hasActivity: history.length > 0,
    narrative: narrativeResult.narrative,
    history,
    numbers,
    narrativeIsStale: narrativeResult.narrativeIsStale,
    summaryProgress: narrativeResult.summaryProgress,
  };
}
