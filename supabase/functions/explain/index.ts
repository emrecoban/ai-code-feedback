import { verifyUser, getAdminClient, UnauthenticatedError } from '../_shared/authClient.ts';
import { errorResponse, json, corsHeaders } from '../_shared/http.ts';
import { resolveProviders, sendWithFailover } from '../_shared/providers/registry.ts';
import { ProviderError } from '../_shared/providers/types.ts';
import {
  HINT_LADDER_SCHEMA,
  validateStructure,
  hasNoFixLeak,
  l1IsQuestion,
  languageMatches,
  noRollingSummaryLeak,
  type HintLadder,
} from '../_shared/hintLadder.ts';
import { buildSystemMessage, buildUserMessage } from '../_shared/promptAssembly.ts';
import { computeCacheKey, lookupCache, writeCache, normalizeErrorSignature } from '../_shared/cache.ts';
import { checkRateLimit, recordUsage } from '../_shared/rateLimit.ts';

const SUPPORTED_LANGUAGES = ['en', 'tr', 'es'];
const SUPPORTED_TRIGGERS = ['diagnostic', 'runtime', 'selection', 'stuck', 'paste', 'success'];
// Mirrors TriggerSurface in extension/src/backend/types.ts. Validated
// rather than trusted, so an unrecognised value is stored as "unknown"
// instead of as arbitrary client-supplied text.
const SUPPORTED_TRIGGER_SURFACES = [
  'diagnostic_codelens',
  'diagnostic_lightbulb',
  'diagnostic_gutter_hover',
  'selection_codelens',
  'selection_lightbulb',
  'selection_status_bar',
  'selection_keybinding',
  'sidebar_button',
  'command_palette',
];

interface ExplainBody {
  sessionId: string;
  triggerSource: string;
  questionType?: string;
  freeText?: string | null;
  helpLatencyMs?: number | null;
  editsBeforeAsk?: number | null;
  triggerSurface?: string | null;
  selectionLineCount?: number | null;
  selectionCharCount?: number | null;
  language: string;
  context: {
    fileName: string;
    progLanguage: string;
    focusLine: number;
    codeRange: { startLine: number; endLine: number };
    code: string;
    diagnostics: Array<{ line: number; severity: string; message: string; source?: string; code?: string }>;
    runOutput?: string;
  };
  clientRequestId: string;
}

type AdminClient = ReturnType<typeof getAdminClient>;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  let userId: string;
  try {
    ({ userId } = await verifyUser(req));
  } catch (e) {
    if (e instanceof UnauthenticatedError) return errorResponse('unauthenticated', e.message, 401);
    throw e;
  }

  const body = (await req.json().catch(() => null)) as ExplainBody | null;
  const validationError = validateRequest(body);
  if (validationError) return errorResponse('invalid_request', validationError, 422);
  const b = body!;

  const admin = getAdminClient();

  // Cache lookup happens before rate limiting -- a cache hit costs no quota.
  // courseId/currentWeek are always null now that course context is gone;
  // they stay in the key so existing cache entries keep matching, and so
  // the explanations table's own course_id/week_no columns still have a
  // source if a curriculum is ever introduced deliberately.
  const cacheKey = await computeCacheKey({
    courseId: null,
    currentWeek: null,
    language: b.language,
    questionType: b.questionType ?? 'unspecified',
    errorSignature: b.context.diagnostics[0]?.message ?? '',
    code: b.context.code,
  });

  const cached = await lookupCache(cacheKey);
  if (cached) {
    // Cache entries written before the "title"/"concept" fields existed
    // won't have them -- fall back rather than let undefined leak into
    // the response or the history list.
    const cachedLadder = { title: 'Untitled', concept: 'unspecified', ...(cached.payload as HintLadder) };
    const interactionId = await recordInteraction(admin, b, userId, {
      cacheHit: true,
      modelUsed: cached.modelUsed,
      ladder: cachedLadder,
    });
    return json(toApiResponse(interactionId, true, false, cachedLadder));
  }

  const rate = await checkRateLimit(userId);
  if (!rate.allowed) {
    return errorResponse(
      'rate_limited',
      'Too many requests. Please wait before asking again.',
      429,
      rate.retryAfterSeconds,
    );
  }

  const { data: learnerProfile } = await admin
    .from('learner_profiles')
    .select('summary')
    .eq('user_id', userId)
    .maybeSingle();
  const rollingSummary = learnerProfile?.summary ?? '';

  const systemMessage = buildSystemMessage(
    {
      language: b.language as 'en' | 'tr' | 'es',
      progLanguage: b.context.progLanguage,
    },
    HINT_LADDER_SCHEMA,
  );
  const userMessage = buildUserMessage({
    rollingSummary,
    triggerSource: b.triggerSource,
    questionType: b.questionType ?? 'unspecified',
    freeText: b.freeText,
    fileName: b.context.fileName,
    focusLine: b.context.focusLine,
    code: b.context.code,
    diagnostics: b.context.diagnostics,
    runOutput: b.context.runOutput,
  });

  let providers;
  try {
    providers = resolveProviders();
  } catch (e) {
    console.error('Provider misconfiguration:', e);
    return errorResponse(
      'provider_error',
      'AI feedback is temporarily unavailable. Please tell your instructor.',
      502,
    );
  }

  const maxOutputTokens = providers.maxOutputTokens(b.language);
  const startedAt = Date.now();

  let attempt: {
    ladder: HintLadder;
    providerUsed: string;
    promptTokens: number;
    completionTokens: number;
  } | null = null;
  let gatingDegraded = false;
  let lastErrors: string[] = [];

  // Up to two passes: the second is a single whole-object repair attempt
  // (base spec Appendix A), not a per-field patch -- regenerating the
  // whole object keeps the four levels mutually consistent, which is the
  // entire reason they're generated together in the first place.
  for (let pass = 0; pass < 2 && !attempt; pass++) {
    const promptTail = pass === 0 ? '' : `\n\n${buildRepairNote(lastErrors)}`;
    let sendResult;
    try {
      sendResult = await sendWithFailover(providers, {
        system: systemMessage,
        user: `${userMessage}${promptTail}`,
        schema: HINT_LADDER_SCHEMA,
        maxOutputTokens,
        temperature: 0.2,
      });
    } catch (e) {
      const code = e instanceof ProviderError ? e.code : 'provider_error';
      const status = code === 'provider_timeout' ? 504 : 502;
      console.error('Provider call failed:', e);
      return errorResponse(code, 'The AI service did not respond. Please try again.', status);
    }

    const structure = validateStructure(sendResult.response.text);
    if (!structure.valid) {
      lastErrors = structure.errors;
      continue;
    }
    const ladder = structure.value!;

    const softIssues: string[] = [];
    if (!hasNoFixLeak(ladder)) softIssues.push('l0_decode leaked the fix or contained a code fence');
    if (!l1IsQuestion(ladder)) softIssues.push('l1_locate did not end with a question mark');

    const hardIssues: string[] = [];
    if (!languageMatches(ladder, b.language)) hardIssues.push(`response was not written in ${b.language}`);
    if (!noRollingSummaryLeak(ladder, rollingSummary)) hardIssues.push('response leaked private learner notes');

    if (hardIssues.length === 0) {
      if (softIssues.length > 0) console.warn('Hint ladder soft-validation issues (accepted):', softIssues);
      attempt = {
        ladder,
        providerUsed: sendResult.providerUsed,
        promptTokens: sendResult.response.promptTokens,
        completionTokens: sendResult.response.completionTokens,
      };
      break;
    }

    lastErrors = hardIssues;
    if (pass === 1) {
      // Second failure on a hard (pedagogical-safety) issue: degrade to
      // L0+L1 only rather than answer in the wrong language or leak
      // private notes (base spec §7.5).
      gatingDegraded = true;
      attempt = {
        ladder: { ...ladder, l2_concept: { rule: '', example: '' }, l3_fix: { change: '', why: '' } },
        providerUsed: sendResult.providerUsed,
        promptTokens: sendResult.response.promptTokens,
        completionTokens: sendResult.response.completionTokens,
      };
    }
  }

  if (!attempt) {
    console.error('Hint ladder validation failed twice:', lastErrors);
    return errorResponse('provider_error', 'Could not generate a valid explanation. Please try again.', 502);
  }

  const latencyMs = Date.now() - startedAt;
  const totalTokens = attempt.promptTokens + attempt.completionTokens;

  await writeCache({
    cacheKey,
    courseId: null,
    weekNo: null,
    language: b.language,
    errorSignature: b.context.diagnostics[0]?.message ?? null,
    payload: attempt.ladder,
    modelUsed: attempt.providerUsed,
  });

  const interactionId = await recordInteraction(admin, b, userId, {
    cacheHit: false,
    modelUsed: attempt.providerUsed,
    promptTokens: attempt.promptTokens,
    completionTokens: attempt.completionTokens,
    latencyMs,
    ladder: attempt.ladder,
  });

  await recordUsage(userId, totalTokens);
  await bumpLearnerProfileCounter(admin, userId);

  return json(toApiResponse(interactionId, false, gatingDegraded, attempt.ladder));
});

function validateRequest(body: ExplainBody | null): string | null {
  if (!body) return 'Request body is not valid JSON';
  if (!body.sessionId) return 'sessionId is required';
  if (!SUPPORTED_TRIGGERS.includes(body.triggerSource)) return 'triggerSource is invalid';
  if (!SUPPORTED_LANGUAGES.includes(body.language)) return 'language is invalid';
  if (!body.context || typeof body.context.code !== 'string') return 'context.code is required';
  if (body.context.code.length > 8000) return 'context.code is too long';
  if (body.freeText && body.freeText.length > 300) return 'freeText exceeds 300 characters';
  if (!body.clientRequestId) return 'clientRequestId is required';
  return null;
}

function nonNegativeIntOrNull(value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.round(value) : null;
}

function buildRepairNote(errors: string[]): string {
  return [
    'REPAIR: Your previous response violated these rules -- fix ALL of them',
    'and resend the complete JSON object:',
    ...errors.map((e) => `- ${e}`),
  ].join('\n');
}

async function recordInteraction(
  admin: AdminClient,
  b: ExplainBody,
  userId: string,
  extra: {
    cacheHit: boolean;
    modelUsed: string;
    promptTokens?: number;
    completionTokens?: number;
    latencyMs?: number;
    ladder: HintLadder;
  },
): Promise<string> {
  // The first diagnostic is the one the whole interaction is about --
  // same one error_signature has always come from.
  const primaryDiagnostic = b.context.diagnostics[0];
  const rawSignature = primaryDiagnostic?.message ?? null;
  const normalizedSignature = rawSignature ? normalizeErrorSignature(rawSignature).slice(0, 500) : null;
  const concept = extra.ladder.concept.trim();

  // [FEEDBACK-EFFECTIVENESS]: how many prior interactions for this user
  // already carry this exact normalized signature -- 0 means "first time
  // seeing this." A student needing an explanation again for the same
  // error is a direct signal that the earlier explanation didn't produce
  // lasting understanding, which max_level_reached alone can't tell you.
  let recurringErrorCount = 0;
  // [FEEDBACK-EFFECTIVENESS]: how long ago the same error was last asked
  // about. recurring_error_count says an error came back; this says how
  // fast, which separates "the explanation just now didn't land" from
  // "made the same mistake again next week".
  let msSincePreviousSameError: number | null = null;
  if (normalizedSignature) {
    const { count } = await admin
      .from('interactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('error_signature_normalized', normalizedSignature);
    recurringErrorCount = count ?? 0;

    if (recurringErrorCount > 0) {
      const { data: previous } = await admin
        .from('interactions')
        .select('created_at')
        .eq('user_id', userId)
        .eq('error_signature_normalized', normalizedSignature)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (previous) {
        msSincePreviousSameError = Date.now() - new Date(previous.created_at as string).getTime();
      }
    }
  }

  // [FEEDBACK-EFFECTIVENESS]: the concept-level counterpart to the count
  // above -- catches recurrence across different-looking errors that
  // share one misconception (three different off-by-one bugs on
  // different lines), which the exact-text match can't. Case-insensitive
  // match only (no separate normalized column) since `concept` is a short,
  // model-written phrase, not a full diagnostic message.
  const { count: conceptCount } = await admin
    .from('interactions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .ilike('concept', concept);
  const recurringConceptCount = conceptCount ?? 0;

  const { data, error } = await admin
    .from('interactions')
    .insert({
      session_id: b.sessionId,
      user_id: userId,
      trigger_source: b.triggerSource,
      question_type: b.questionType ?? null,
      error_signature: rawSignature?.slice(0, 500) ?? null,
      // [PROMPT-AUDIT]: same normalization already used for the cache
      // key, reused (not reimplemented) so generate-summary can detect
      // genuine recurrence -- two errors differing only by a line number
      // or literal value now match.
      error_signature_normalized: normalizedSignature,
      recurring_error_count: recurringErrorCount,
      concept,
      recurring_concept_count: recurringConceptCount,
      // The student's own words, kept only for free-text questions --
      // already length-capped by validateRequest().
      free_text: b.freeText ?? null,
      // Client-measured, so sanitised here rather than trusted: a
      // malformed or negative value is stored as "not measured" instead
      // of polluting the column with nonsense.
      help_latency_ms: nonNegativeIntOrNull(b.helpLatencyMs),
      edits_before_ask: nonNegativeIntOrNull(b.editsBeforeAsk),
      trigger_surface: SUPPORTED_TRIGGER_SURFACES.includes(b.triggerSurface ?? '') ? b.triggerSurface : null,
      ms_since_previous_same_error: msSincePreviousSameError,
      selection_line_count: nonNegativeIntOrNull(b.selectionLineCount),
      selection_char_count: nonNegativeIntOrNull(b.selectionCharCount),
      // The linter's own classification, collected by the client since
      // [PROMPT-AUDIT] and passed to the model, but never stored until
      // now -- a rule code is a precise category the free-text message
      // isn't.
      error_source: primaryDiagnostic?.source ?? null,
      error_code: primaryDiagnostic?.code ?? null,
      error_severity: primaryDiagnostic?.severity ?? null,
      cache_hit: extra.cacheHit,
      model_used: extra.modelUsed,
      prompt_tokens: extra.promptTokens ?? null,
      completion_tokens: extra.completionTokens ?? null,
      latency_ms: extra.latencyMs ?? null,
      title: extra.ladder.title,
      file_name: b.context.fileName,
      // The explanation itself, so the student's own history can show it
      // again -- the shared cache it also lives in is keyed by content,
      // not by who asked.
      ladder_payload: extra.ladder,
    })
    .select('id')
    .single();
  if (error || !data) throw new Error(`Could not record interaction: ${error?.message}`);
  return data.id as string;
}

async function bumpLearnerProfileCounter(admin: AdminClient, userId: string): Promise<void> {
  const { data } = await admin
    .from('learner_profiles')
    .select('interactions_since_update')
    .eq('user_id', userId)
    .maybeSingle();
  await admin.from('learner_profiles').upsert(
    {
      user_id: userId,
      interactions_since_update: (data?.interactions_since_update ?? 0) + 1,
    },
    { onConflict: 'user_id' },
  );
  // interactions_since_update feeds [USER-STATS]'s staleness check for
  // generate-summary -- the client reads it directly and decides whether
  // to trigger regeneration, rather than a server-side background job.
}

function toApiResponse(interactionId: string, cacheHit: boolean, gatingDegraded: boolean, ladder: HintLadder) {
  return {
    interactionId,
    cacheHit,
    gatingDegraded,
    title: ladder.title,
    confidence: ladder.confidence,
    needsMoreContext: ladder.needsMoreContext,
    levels: {
      l0_decode: ladder.l0_decode,
      l1_locate: ladder.l1_locate,
      l2_concept: ladder.l2_concept,
      l3_fix: ladder.l3_fix,
    },
  };
}
