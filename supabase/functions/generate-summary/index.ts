import { verifyUser, getAdminClient, UnauthenticatedError } from '../_shared/authClient.ts';
import { errorResponse, json, corsHeaders } from '../_shared/http.ts';
import { resolveProviders, sendWithFailover } from '../_shared/providers/registry.ts';

// [USER-STATS]: the narrative band and "Try this one" practice suggestion
// are both produced by one call so there's no second AI cost. The client
// decides *when* to call this (staleness check against
// summary_generated_at / interactions_since_update) but never whether the
// call is skipped -- that judgment is re-checked here server-side so a
// stale client can't force a regeneration outside the intended cadence.
const STALE_HOURS = 24;
const MIN_NEW_INTERACTIONS = 3;
const HISTORY_LIMIT = 30;

const SUMMARY_SCHEMA = {
  type: 'object',
  required: ['summary', 'student_summary', 'suggested_practice'],
  additionalProperties: false,
  properties: {
    summary: { type: 'string', minLength: 10, maxLength: 500 },
    student_summary: { type: 'string', minLength: 20, maxLength: 700 },
    suggested_practice: { type: 'string', minLength: 10, maxLength: 400 },
  },
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  let userId: string;
  try {
    ({ userId } = await verifyUser(req));
  } catch (e) {
    if (e instanceof UnauthenticatedError) return errorResponse('unauthenticated', e.message, 401);
    throw e;
  }

  // [USER-STATS]: `force` is the one deliberate bypass of the cadence
  // above -- set only when the student just changed their feedback
  // language. student_summary/suggested_practice are written in whatever
  // language was active at generation time, and neither the 24h nor the
  // 3-interaction gate has anything to do with language correctness, so
  // without this a language switch could leave "Try this one" showing
  // the previous language for up to a day. It does not change what gets
  // generated or the rules that govern it -- only skips the wait when the
  // student has just made it stale in a way the timer doesn't track.
  const body = (await req.json().catch(() => null)) as { force?: boolean } | null;
  const force = body?.force === true;

  const admin = getAdminClient();

  const { data: profile } = await admin
    .from('learner_profiles')
    .select('summary_generated_at, interactions_since_update')
    .eq('user_id', userId)
    .maybeSingle();

  const generatedAt = profile?.summary_generated_at ? new Date(profile.summary_generated_at) : null;
  const hoursSince = generatedAt ? (Date.now() - generatedAt.getTime()) / 3_600_000 : Infinity;
  const newInteractions = profile?.interactions_since_update ?? 0;

  if (!force && (hoursSince < STALE_HOURS || newInteractions < MIN_NEW_INTERACTIONS)) {
    return json({ skipped: true });
  }

  const { data: profileRow } = await admin
    .from('profiles')
    .select('feedback_language')
    .eq('id', userId)
    .maybeSingle();
  const language = (profileRow?.feedback_language as 'en' | 'tr' | 'es') ?? 'en';

  const { data: history } = await admin
    .from('interactions')
    .select('title, error_signature, error_signature_normalized, question_type, trigger_source, max_level_reached, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(HISTORY_LIMIT);

  if (!history || history.length === 0) {
    return json({ skipped: true });
  }

  // [PROMPT-AUDIT]: distinct calendar dates from coding_sessions, same
  // definition the client already uses for its own "days using this" stat
  // (stats/statsStore.ts) -- kept consistent rather than introducing a
  // different proxy (e.g. raw session count) under a similar name.
  const { data: sessions } = await admin.from('coding_sessions').select('started_at').eq('user_id', userId);
  const daysActive = new Set((sessions ?? []).map((s) => new Date(s.started_at as string).toDateString())).size;

  // [PROMPT-AUDIT]: three aggregates computed from the same `history` rows
  // already fetched above -- no new interactions query. Gated on
  // MIN_NEW_INTERACTIONS (the same bar the staleness check itself uses)
  // so a thin sample never gets presented as a pattern.
  const resolvedCount = history.filter((r) => (r.max_level_reached as number) <= 1).length;
  const ruleCount = history.filter((r) => (r.max_level_reached as number) === 2).length;
  const fixCount = history.filter((r) => (r.max_level_reached as number) >= 3).length;

  const questionTypeCounts = new Map<string, number>();
  for (const row of history) {
    const qt = (row.question_type as string | null) ?? 'unspecified';
    questionTypeCounts.set(qt, (questionTypeCounts.get(qt) ?? 0) + 1);
  }

  const signatureCounts = new Map<string, number>();
  for (const row of history) {
    const sig = row.error_signature_normalized as string | null;
    if (!sig) continue;
    signatureCounts.set(sig, (signatureCounts.get(sig) ?? 0) + 1);
  }
  const [topSignature, topSignatureCount] = [...signatureCounts.entries()].sort((a, b) => b[1] - a[1])[0] ?? [
    null,
    0,
  ];

  const statsLines = [`Days using this extension: ${daysActive}`];
  if (history.length >= MIN_NEW_INTERACTIONS) {
    statsLines.push(
      `Resolution pattern (last ${history.length}): ${resolvedCount} resolved from the explanation alone, ${ruleCount} needed the rule, ${fixCount} needed the full fix.`,
    );
    const questionTypeText = [...questionTypeCounts.entries()].map(([qt, count]) => `${qt} (${count})`).join(', ');
    statsLines.push(`Question types asked: ${questionTypeText}`);
  }
  if (topSignature && topSignatureCount >= MIN_NEW_INTERACTIONS) {
    statsLines.push(`Recurring error: an error normalized as "${topSignature}" has appeared ${topSignatureCount} times in this log.`);
  }
  const studentStats = statsLines.join('\n');

  const logText = history
    .slice()
    .reverse()
    .map((row, i) => {
      const outcome =
        row.max_level_reached <= 1 ? 'resolved at explanation only' :
        row.max_level_reached >= 3 ? 'saw the fix' : 'saw the rule';
      const label = row.title || row.error_signature || row.trigger_source;
      return `${i + 1}. ${label} -- ${outcome}`;
    })
    .join('\n');

  let providers;
  try {
    providers = resolveProviders();
  } catch (e) {
    console.error('Provider misconfiguration:', e);
    return errorResponse('provider_error', 'Summary generation temporarily unavailable.', 502);
  }

  const system = buildSystemPrompt(language);
  const user = `STUDENT STATS\n${studentStats}\n\nINTERACTION LOG (oldest first):\n${logText}`;

  let text: string;
  try {
    const result = await sendWithFailover(providers, {
      system,
      user,
      schema: SUMMARY_SCHEMA,
      maxOutputTokens: 700,
      temperature: 0.4,
      schemaName: 'emit_summary',
      schemaDescription: 'Emit the student progress summary.',
    });
    text = result.response.text;
  } catch (e) {
    console.error('generate-summary provider call failed:', e);
    return errorResponse('provider_error', 'Could not generate a summary right now.', 502);
  }

  let parsed: { summary: string; student_summary: string; suggested_practice: string };
  try {
    parsed = JSON.parse(text);
    if (
      typeof parsed.summary !== 'string' ||
      typeof parsed.student_summary !== 'string' ||
      typeof parsed.suggested_practice !== 'string'
    ) {
      throw new Error('missing fields');
    }
  } catch {
    console.error('generate-summary: model output failed to parse', text);
    return errorResponse('provider_error', 'Could not generate a summary right now.', 502);
  }

  await admin
    .from('learner_profiles')
    .update({
      summary: parsed.summary,
      student_summary: parsed.student_summary,
      suggested_practice: parsed.suggested_practice,
      summary_generated_at: new Date().toISOString(),
      interactions_since_update: 0,
    })
    .eq('user_id', userId);

  return json({ ok: true });
});

// Same per-language-literal pattern as `langName` right below -- the
// model was previously told to start a sentence with the hardcoded
// English phrase "Worth going back over:" even when writing the rest of
// student_summary in Turkish/Spanish, which is exactly the kind of
// literal-quoted-string-in-the-prompt the model tends to reproduce
// verbatim instead of translating. Giving it the already-localized lead-in
// removes that failure mode instead of relying on the model to translate
// a quoted instruction on its own.
const WORTH_REVISITING_PREFIX: Record<'en' | 'tr' | 'es', string> = {
  en: 'Worth going back over:',
  tr: 'Tekrar göz atmakta fayda var:',
  es: 'Vale la pena repasar:',
};

function buildSystemPrompt(language: 'en' | 'tr' | 'es'): string {
  const langName = { en: 'English', tr: 'Turkish', es: 'Spanish' }[language];
  const worthRevisitingPrefix = WORTH_REVISITING_PREFIX[language];
  return `You are summarizing one student's recent programming activity for two audiences.

Respond ONLY with a JSON object matching this schema, no prose outside JSON:
${JSON.stringify(SUMMARY_SCHEMA)}

Write "student_summary" and "suggested_practice" entirely in ${langName}. Write "summary" in English regardless -- it is for internal use only.

RULES
- Ground every claim in the interaction log and student stats you are given. Never invent an error, pattern, or event that isn't in the log or stats.
- Describe events, not ability. "X came up three times" is fine. "You struggle with X" is not -- never evaluate the student's competence.
- Do not use time-bucket phrases like "this week", "recently", or "lately". Describe the pattern itself, not when it happened.
- "Days using this extension" is for calibrating tone only (e.g. how much to spell out vs. assume) -- never state this number or refer to it directly in student_summary.
- summary: 2-4 terse sentences, third person, for another AI's internal context. No pleasantries.
- student_summary: 3-5 sentences speaking directly to the student ("you"), warm but plain. If (and only if) the log supports one, end with exactly one sentence starting with "${worthRevisitingPrefix}" (already in ${langName} -- use it exactly as given, do not translate it yourself) naming one concrete, specific thing. If nothing clearly stands out, omit that sentence rather than force one.
- suggested_practice: one short, self-contained practice problem (2-3 sentences) targeting whichever error or topic repeats most in the log or student stats. If nothing repeats, base it on the most recent entry instead.`;
}
