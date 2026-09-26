// Generates the synthetic sample used on every page of the site.
//
//   npm run docs:sample
//
// 1. Builds one fictional cohort (25 students, Python, 8 weekly labs of two
//    class hours) plus three accounts the cleaning rules remove, with a fixed
//    seed. Values computed by the extension or by explain at collection time
//    (help latency, recurring counts, ...) are reproduced with the same rules.
// 2. Loads the rows into an in-memory Postgres (PGlite) that has every
//    migration from supabase/migrations applied, and calls the dashboard's own
//    SQL functions. No derived metric is typed by hand.
// 3. Writes .vitepress/data/sample/*.json, the JSON snippets shown on the
//    pages, and the synthetic external instruments (pre-test, post-test, TAM).
//
// Nothing here touches the real Supabase project. All names, ids, dates and
// values are invented; the calendar is set in 2030 so it cannot be mistaken
// for study data.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRng, sigmoid, clamp } from './lib/prng.mjs';
import { openDb, insertRows } from './lib/pg.mjs';
import { quantile, pairedT, pearson, round, mean, sd } from './lib/stats.mjs';
import { buildViews } from './lib/views.mjs';
import {
  ERRORS, TOPICS, SELECTION_TITLE, FREE_TEXT, LADDER, STUDENT_SUMMARY, PRACTICE, PRIVATE_NOTES,
} from './lib/catalog.mjs';

const DOCS = dirname(dirname(fileURLToPath(import.meta.url)));
const MIGRATIONS = join(DOCS, '..', 'supabase', 'migrations');
const OUT = join(DOCS, '.vitepress', 'data', 'sample');

export const SEED = 20300304;
const rng = createRng(SEED);

// ---------------------------------------------------------------- calendar
const TZ = 'Europe/Istanbul'; // UTC+03:00 all year
const OFFSET_H = 3;
const DAY = 86_400_000;
const MIN = 60_000;
const local = (y, m, d, h = 0, mi = 0) => Date.UTC(y, m - 1, d, h - OFFSET_H, mi);
const WEEK1 = local(2030, 3, 4); // Monday of lab week 1
const WEEKS = 8;
const weekStart = (w) => WEEK1 + (w - 1) * 7 * DAY;
const LAB_DAY = 1; // Tuesday
const LAB_START_H = 10; // 10:00-11:50, two class hours
const AS_OF = local(2030, 4, 29, 9, 0); // the dashboard's "now" for this sample
const RANGE = { from: '2030-03-04', to: '2030-04-28' };
const iso = (ms) => new Date(ms).toISOString();
const DIFFICULTY = [0.75, 0.9, 1.05, 1.1, 1.0, 1.2, 1.1, 1.0];

// ---------------------------------------------------------------- students
const INITIAL_LANG = ['tr', 'tr', 'en', 'tr', 'tr', 'es', 'en', 'tr', 'tr', 'tr', 'en', 'tr', 'tr', 'tr', 'es', 'tr', 'tr', 'en', 'tr', 'tr', 'tr', 'en', 'tr', 'tr', 'tr'];
const LANG_CHANGES = { S03: { week: 2, to: 'tr' }, S18: { week: 4, to: 'tr' }, S15: { week: 5, to: 'en' } };
export const FEATURED = 'S07';

function makeStudent(i, overrides = {}) {
  const code = `S${String(i).padStart(2, '0')}`;
  return {
    code,
    username: code.toLowerCase(),
    userId: rng.uuid(),
    skill: rng.normal(),
    help: rng.normal(),
    growth: clamp(rng.normal(0.55, 0.3), 0, 1.2),
    engagement: rng.normal(),
    persist: rng.normal(),
    paster: rng.chance(0.2),
    lang: INITIAL_LANG[(i - 1) % INITIAL_LANG.length],
    consent: 'granted',
    cohort: true,
    ...overrides,
  };
}

const students = [];
for (let i = 1; i <= 25; i++) students.push(makeStudent(i));
// S07 is the student every page follows: asks a lot at the start and less
// over the weeks. Chosen for illustration; the other students are random.
Object.assign(students[6], { skill: -0.3, help: 0.9, growth: 1.2, engagement: 0.35, persist: 0.1, paster: false });
// Accounts that the proposed cleaning rules remove or merge.
const extra = [
  { ...makeStudent(26), code: 'T01', username: 'teacher-demo', cohort: false, role: 'test', skill: 1.5, help: 0.5 },
  { ...makeStudent(26), code: 'S26', username: 's26', cohort: false, consent: 'declined' },
];
const s12 = students[11];
const s12x = { ...s12, username: 's12x', userId: rng.uuid(), duplicateOf: 'S12' };

// ---------------------------------------------------------------- helpers from the real code
// supabase/functions/_shared/cache.ts normalizeErrorSignature
const normalizeErrorSignature = (sig) => sig.replace(/\d+/g, '#').replace(/["'].*?["']/g, '"X"').trim().toLowerCase();
const tokens = (t) => t.toLowerCase().match(/[a-z0-9_]+/g) ?? [];
const hex = (n) => Array.from({ length: n }, () => Math.floor(rng.next() * 16).toString(16)).join('');

// ---------------------------------------------------------------- generation
const rows = { profiles: [], consent_log: [], coding_sessions: [], interactions: [], events: [], learner_profiles: [], usage_counters: [], explanations: [] };
const clientTs = (ms) => iso(ms - rng.int(5, 40));
const event = (e) => rows.events.push({
  session_id: e.session_id, user_id: e.user_id, interaction_id: e.interaction_id ?? null, event_type: e.type,
  client_event_id: e.key, payload: e.payload, client_ts: clientTs(e.at), server_ts: iso(e.at), _at: e.at,
});

function langAt(s, week) {
  const change = LANG_CHANGES[s.code];
  return change && week >= change.week ? change.to : s.lang;
}

function sessionCounters(s, minutes, lab) {
  const a = clamp(rng.normal(0.68, 0.08) + 0.03 * s.engagement, 0.4, 0.9);
  const linesWritten = rng.poisson(minutes * 0.7 * (1 + 0.15 * s.engagement));
  const pasteCount = rng.poisson(s.paster ? 0.5 : 0.08);
  let pasteLines = 0;
  for (let k = 0; k < pasteCount; k++) pasteLines += rng.int(22, 70);
  const focusLosses = rng.poisson(minutes * 0.06);
  let unfocused = 0;
  for (let k = 0; k < focusLosses; k++) unfocused += Math.min(600, Math.round(rng.lognormal(45, 0.9)));
  const pyEdits = rng.poisson(linesWritten * 1.3) + 1;
  const language_counts = { python: pyEdits };
  if (rng.chance(0.15)) language_counts.markdown = rng.int(1, 12);
  if (rng.chance(0.05)) language_counts.plaintext = rng.int(1, 5);
  return {
    active_seconds: Math.round(minutes * 60 * a),
    lines_written: linesWritten,
    lines_deleted: rng.poisson(linesWritten * 0.35),
    files_created: rng.poisson(lab ? 0.8 : 0.3),
    language_counts,
    large_paste_count: pasteCount,
    large_paste_lines: pasteLines,
    focus_loss_count: focusLosses,
    unfocused_seconds: unfocused,
    save_count: rng.poisson(minutes * 0.18),
    debug_session_count: rng.poisson(minutes * 0.03),
    task_run_count: rng.poisson(minutes * 0.004),
    idle_gap_count: rng.poisson(minutes / 40),
    editor_switch_count: rng.poisson(minutes * 0.12),
    files_visited: 1 + rng.poisson(1.2),
  };
}

const emptyCounters = () => ({
  active_seconds: 0, lines_written: 0, lines_deleted: 0, files_created: 0, language_counts: {},
  large_paste_count: 0, large_paste_lines: 0, focus_loss_count: 0, unfocused_seconds: 0, save_count: 0,
  debug_session_count: 0, task_run_count: 0, idle_gap_count: 0, editor_switch_count: 0, files_visited: 0,
  errors_resolved_without_asking: 0, diagnostics_offered: 0, follow_on_error_count: 0, silent_resolution_edits: 0,
});

/** Questions of one student, in time order, for recurrence counts. */
const history = new Map();

function addInteraction(s, session, q) {
  const past = history.get(s.userId) ?? [];
  const sig = q.error_signature;
  const norm = sig ? normalizeErrorSignature(sig).slice(0, 500) : null;
  let recurringError = 0;
  let msSince = null;
  if (norm) {
    const same = past.filter((p) => p.error_signature_normalized === norm);
    recurringError = same.length;
    if (same.length) msSince = q._at - same[same.length - 1]._at;
  }
  const recurringConcept = past.filter((p) => p.concept.toLowerCase() === q.concept.toLowerCase()).length;
  const row = {
    id: rng.uuid(), session_id: session.id, user_id: s.userId, course_id: null,
    trigger_source: q.trigger_source, question_type: q.question_type, error_signature: sig ? sig.slice(0, 500) : null,
    max_level_reached: q.max_level_reached, cache_hit: q.cache_hit, model_used: 'openai_compatible',
    prompt_tokens: q.cache_hit ? null : q.prompt_tokens, completion_tokens: q.cache_hit ? null : q.completion_tokens,
    latency_ms: q.cache_hit ? null : q.latency_ms, created_at: iso(q._at), title: q.title,
    _tok: { prompt_tokens: q.prompt_tokens, completion_tokens: q.completion_tokens, latency_ms: q.latency_ms },
    error_signature_normalized: norm, recurring_error_count: recurringError, concept: q.concept,
    recurring_concept_count: recurringConcept, free_text: q.free_text ?? null, help_latency_ms: q.help_latency_ms ?? null,
    edits_before_ask: q.edits_before_ask ?? null, trigger_surface: q.trigger_surface,
    ms_since_previous_same_error: msSince, selection_line_count: q.selection_line_count ?? null,
    selection_char_count: q.selection_char_count ?? null, error_source: q.error_source ?? null,
    error_code: q.error_code ?? null, error_severity: q.error_severity ?? null, helpful_rating: q.helpful_rating ?? null,
    self_reported_outcome: q.self_reported_outcome ?? null, file_name: q.file_name,
    ladder_payload: q.ladder_payload, post_confidence: q.post_confidence ?? null,
    _at: q._at, _lang: q.lang, _degraded: q.degraded,
  };
  past.push(row);
  history.set(s.userId, past);
  rows.interactions.push(row);
  return row;
}

function ladderFor(lang, title, concept, degraded) {
  const base = LADDER[lang];
  return {
    title, concept, confidence: 'high', needsMoreContext: false,
    l0_decode: base.l0_decode, l1_locate: base.l1_locate,
    l2_concept: degraded ? { rule: '', example: '' } : base.l2_concept,
    l3_fix: degraded ? { change: '', why: '' } : base.l3_fix,
  };
}

/** Everything the extension and the Edge Functions record around one question. */
function questionEvents(s, session, row, q, sessionEnd) {
  const t0 = q._at;
  const base = { session_id: session.id, user_id: s.userId, interaction_id: row.id };
  let shownLevel = 1;
  let shownAt = t0;
  if (q.max_level_reached >= 2) {
    const at2 = t0 + Math.round(rng.lognormal(22_000, 0.8));
    event({ ...base, type: 'level_reached', key: `level_reached:${row.id}:2`, at: at2, payload: { level: 2, isEscalation: true, msSinceCreated: at2 - t0 } });
    shownLevel = 2;
    shownAt = at2;
    if (q.max_level_reached >= 3) {
      const at3 = at2 + Math.round(rng.lognormal(16_000, 0.8));
      event({ ...base, type: 'level_reached', key: `level_reached:${row.id}:3`, at: at3, payload: { level: 3, isEscalation: true, msSinceCreated: at3 - t0 } });
      shownLevel = 3;
      shownAt = at3;
    }
  }
  // Back to the code, or left without acting (AttentionTracker, 10-minute window).
  if (rng.chance(0.87 + 0.04 * s.engagement)) {
    const ms = Math.min(600_000, Math.round(rng.lognormal(18_000, 1.0)));
    event({ ...base, type: 'returned_to_code', key: `returned_to_code:${row.id}:${shownLevel}`, at: shownAt + ms, payload: { level: shownLevel, msToReturn: ms } });
  } else {
    const reason = shownAt + 600_000 > sessionEnd || rng.chance(0.15) ? 'session_end' : 'timeout';
    event({ ...base, type: 'feedback_abandoned', key: `feedback_abandoned:${row.id}:${shownLevel}`, at: Math.min(shownAt + 600_000, sessionEnd), payload: { level: shownLevel, reason } });
  }
  // Time on screen (lost for some explanations when VS Code closes).
  if (rng.chance(0.9)) {
    const visibleAtDelivery = rng.chance(0.86);
    const visibleMs = visibleAtDelivery ? Math.round(rng.lognormal(48_000, 0.8)) : Math.round(rng.lognormal(20_000, 1.0));
    event({ ...base, type: 'explanation_visibility', key: `explanation_visibility:${row.id}`, at: t0 + visibleMs + Math.round(rng.lognormal(60_000, 0.7)), payload: { visibleMs, visibleAtDelivery } });
  }
  // First edit after the fix, and a quick undo (PostFeedbackTracker).
  if (q.max_level_reached >= 3 && !q.degraded && rng.chance(0.74)) {
    const overlap = clamp(rng.normal(0.42 - 0.12 * s.skill, 0.18), 0, 1);
    const distance = rng.chance(0.55) ? 0 : rng.chance(0.45) ? 1 : rng.chance(0.4) ? 2 : rng.int(3, 14);
    const at = shownAt + Math.round(rng.lognormal(25_000, 0.8));
    event({ ...base, type: 'post_feedback_edit', key: `post_feedback_edit:${row.id}`, at, payload: { overlapRatio: Math.round(overlap * 1000) / 1000, editedLineDistance: distance } });
    if (rng.chance(0.08)) event({ ...base, type: 'fix_undone', key: `fix_undone:${row.id}`, at: at + rng.int(3_000, 90_000), payload: {} });
  }
  // The error the student asked about goes away (DiagnosticTrigger).
  if (row.trigger_source === 'diagnostic' && rng.chance(clamp(0.8 + 0.07 * s.skill - (q.max_level_reached === 0 ? 0.05 : 0), 0.5, 0.97))) {
    const ms = Math.round(rng.lognormal(q.max_level_reached >= 3 ? 55_000 : 95_000, 0.9));
    const payload = { msToResolution: ms };
    if (row.help_latency_ms != null) {
      payload.msPresent = row.help_latency_ms + ms;
      payload.editsWhilePresent = (row.edits_before_ask ?? 0) + rng.poisson(2);
    }
    event({ ...base, type: 'diagnostic_resolved', key: `diagnostic_resolved:${row.id}`, at: t0 + ms, payload });
  }
  if (rng.chance(0.03 + 0.12 * (q.max_level_reached >= 3))) {
    const level = q.max_level_reached >= 3 && rng.chance(0.7) ? 'L3' : rng.pick(['L0', 'L1', 'L2', null]);
    event({ ...base, type: 'explanation_copied', key: `explanation_copied:${rng.uuid()}`, at: t0 + rng.int(20_000, 200_000), payload: { level } });
  }
}

function sessionEvents(s, session, start, minutes, counters, askedByFile) {
  const base = { session_id: session.id, user_id: s.userId };
  const episodes = Math.min(4, rng.poisson(minutes / 60 + 0.4));
  for (let k = 0; k < episodes; k++) {
    const seen = 1 + rng.poisson(1.8);
    const at = start + rng.int(10, Math.max(11, minutes - 2)) * MIN;
    event({
      ...base, type: 'file_cleared', key: `file_cleared:${rng.uuid()}`, at,
      payload: {
        fileName: session._file, msWithErrors: Math.round(rng.lognormal(360_000, 0.8)), editsWhileErrors: rng.poisson(6 + 3 * seen),
        diagnosticsSeen: seen, diagnosticsAsked: Math.min(seen, askedByFile > 0 ? rng.int(0, Math.min(seen, askedByFile)) : 0),
      },
    });
  }
  for (let k = 0; k < counters.task_run_count; k++) {
    const exitCode = rng.chance(0.6) ? 0 : 1;
    event({ ...base, type: 'run_finished', key: `run_finished:${rng.uuid()}`, at: start + rng.int(5, minutes) * MIN, payload: { exitCode, success: exitCode === 0 } });
  }
}

/** One coding session with its questions and events. */
function simulateSession(s, week, start, minutes, lab) {
  const session = {
    id: rng.uuid(), user_id: s.userId, course_id: null, started_at: iso(start), last_seen_at: iso(start + minutes * MIN),
    ended_at: null, extension_version: '0.2.0', vscode_version: '1.104.2', os: lab ? 'win32' : rng.pick(['win32', 'darwin', 'win32', 'linux']),
    _file: lab ? `lab${week}_${TOPICS[week - 1].file}.py` : `hw${week}.py`, _user: s.code,
  };
  const counters = { ...emptyCounters(), ...sessionCounters(s, minutes, lab) };
  const lang = langAt(s, week);
  const w = week - 1;
  const g = s.growth * w;
  const pAsk = clamp(sigmoid(-0.25 + 0.9 * s.help - 0.45 * s.skill - 0.3 * g + rng.normal(0, 0.15)), 0.03, 0.97);
  const lambda = (minutes / 100) * 9 * DIFFICULTY[w] * Math.exp(-0.35 * s.skill) * (1 - 0.03 * w);
  const errorCount = rng.poisson(lambda);
  const questions = [];
  let resolvedCount = 0;
  const errorWeights = Object.fromEntries(ERRORS.map((e, k) => [k, e.weeks[w] + 0.05]));
  for (let k = 0; k < errorCount; k++) {
    const offered = rng.chance(0.86);
    if (offered) counters.diagnostics_offered++;
    const asks = offered ? rng.chance(pAsk) : rng.chance(0.05 * pAsk);
    if (asks) {
      questions.push({ kind: 'diagnostic', offered, error: ERRORS[Number(rng.weighted(errorWeights))] });
    } else if (rng.chance(offered ? 0.86 : 0.75)) {
      counters.errors_resolved_without_asking++;
      resolvedCount++;
      if (offered) counters.silent_resolution_edits += rng.poisson(2 + 0.6 * Math.max(0, s.persist));
    }
  }
  const selections = rng.poisson((minutes / 100) * 1.1 * Math.exp(0.35 * s.help) * (1 - 0.02 * w));
  for (let k = 0; k < selections; k++) questions.push({ kind: 'selection' });
  const pickerAbandons = rng.poisson(0.15 * selections + 0.05);

  // Place questions in time.
  const sessionEnd = start + minutes * MIN;
  const times = questions.map(() => start + rng.int(4, Math.max(5, minutes - 4)) * MIN + rng.int(0, 59_000)).sort((a, b) => a - b);
  questions.forEach((q, k) => { q._at = times[k]; });

  for (const q of questions) {
    if (rng.chance(0.025)) {
      const kind = rng.weighted({ timeout: 3, backend: 7 });
      const payload = kind === 'backend' ? (rng.chance(0.2) ? { kind, code: 'rate_limited', retryAfterSeconds: rng.int(60, 3000) } : { kind, code: 'provider_error' }) : { kind };
      event({ session_id: session.id, user_id: s.userId, type: 'request_failed', key: `request_failed:${rng.uuid()}`, at: q._at + 25_000, payload });
      continue;
    }
    let row;
    const cacheHit = rng.chance(q.kind === 'diagnostic' ? 0.08 : 0.03);
    const tok = { prompt_tokens: Math.round(rng.normal(1750, 230)), completion_tokens: Math.round(rng.normal(lang === 'en' ? 500 : 560, 80)), latency_ms: Math.round(rng.lognormal(4200, 0.35)) };
    const degraded = rng.chance(0.01);
    if (q.kind === 'diagnostic') {
      const e = q.error;
      const v = e.vars ? rng.pick(e.vars) : '';
      const pL2 = sigmoid(-0.45 + 0.6 * s.help - 0.6 * s.skill - 0.22 * g + 0.4 * (DIFFICULTY[w] - 1));
      const pL3 = sigmoid(0.35 + 0.5 * s.help - 0.5 * s.skill - 0.08 * g);
      const level = degraded ? 0 : rng.chance(pL2) ? (rng.chance(pL3) ? 3 : 2) : 0;
      const surface = q.offered ? rng.weighted({ diagnostic_codelens: 62, diagnostic_lightbulb: 20, diagnostic_gutter_hover: 18 }) : 'diagnostic_lightbulb';
      const title = e.title[lang](v);
      const concept = e.concept[lang];
      row = addInteraction(s, session, {
        _at: q._at, lang, degraded, trigger_source: 'diagnostic', question_type: 'what_does_this_mean', error_signature: e.msg(v),
        max_level_reached: level, cache_hit: cacheHit, ...tok, title, concept, trigger_surface: surface,
        help_latency_ms: q.offered ? clamp(Math.round(rng.lognormal(35_000 * Math.exp(-0.3 * s.help), 0.9)), 1_500, 1_800_000) : null,
        edits_before_ask: q.offered ? rng.poisson(Math.exp(0.9 + 0.5 * s.persist)) : null,
        error_source: 'Pylance', error_code: e.code, error_severity: e.severity, file_name: session._file,
        ladder_payload: ladderFor(lang, title, concept, degraded),
      });
    } else {
      const surface = rng.weighted({ selection_codelens: 30, selection_lightbulb: 14, selection_status_bar: 10, selection_keybinding: 20, sidebar_button: 21, command_palette: 5 });
      const qtype = surface === 'sidebar_button' || surface === 'command_palette'
        ? 'what_does_this_do'
        : rng.weighted({ what_does_this_do: 35, whats_wrong: 30, why_works: 10, simpler_example: 15, free_text: 10 });
      const pL2 = sigmoid(-0.9 + 0.4 * s.help - 0.4 * s.skill - 0.1 * g);
      const pL3 = sigmoid(qtype === 'whats_wrong' ? 0.3 : -0.6);
      const level = degraded ? 0 : rng.chance(pL2) ? (rng.chance(pL3) ? 3 : 2) : 0;
      const topic = TOPICS[w];
      const title = SELECTION_TITLE[qtype][lang](topic.noun[lang]);
      const concept = topic.concept[lang];
      const lines = surface === 'sidebar_button' && rng.chance(0.3) ? null : rng.chance(0.6) ? rng.int(1, 6) : rng.int(7, 40);
      row = addInteraction(s, session, {
        _at: q._at, lang, degraded, trigger_source: 'selection', question_type: qtype, error_signature: null,
        max_level_reached: level, cache_hit: cacheHit, ...tok, title, concept, trigger_surface: surface,
        free_text: qtype === 'free_text' ? rng.pick(FREE_TEXT[lang]) : null,
        selection_line_count: lines, selection_char_count: lines == null ? null : lines * rng.int(18, 42),
        file_name: session._file, ladder_payload: ladderFor(lang, title, concept, degraded),
      });
    }
    // Self-report chips under the explanation (each answered on its own).
    if (rng.chance(0.55)) row.helpful_rating = rng.chance(0.82) ? 1 : -1;
    if (rng.chance(0.45)) row.self_reported_outcome = rng.chance(row.max_level_reached >= 3 ? 0.62 : 0.74) ? 'solved' : 'still_stuck';
    if (rng.chance(0.4)) {
      const score = 0.55 * s.skill - 0.45 * (row.max_level_reached >= 3) + 0.08 * w + rng.normal(0, 0.5);
      row.post_confidence = score > 0.35 ? 'yes' : score < -0.45 ? 'no' : 'maybe';
    }
    questionEvents(s, session, row, { ...q, max_level_reached: row.max_level_reached, degraded }, sessionEnd);
  }
  for (let k = 0; k < pickerAbandons; k++) {
    const lines = rng.int(1, 20);
    event({
      session_id: session.id, user_id: s.userId, type: 'question_picker_abandoned', key: `question_picker_abandoned:${rng.uuid()}`,
      at: start + rng.int(3, minutes) * MIN,
      payload: { stage: rng.chance(0.75) ? 'preset' : 'free_text', triggerSurface: rng.weighted({ selection_codelens: 4, selection_lightbulb: 2, selection_status_bar: 1, selection_keybinding: 3 }), selectionLineCount: lines, selectionCharCount: lines * rng.int(18, 40) },
    });
  }
  counters.follow_on_error_count = Array.from({ length: resolvedCount }).filter(() => rng.chance(0.18)).length;
  const asked = questions.filter((q) => q.kind === 'diagnostic').length;
  sessionEvents(s, session, start, minutes, counters, asked);
  delete counters._;
  Object.assign(session, counters);
  rows.coding_sessions.push(session);
  return session;
}

function simulateStudent(s, weeks = [1, 2, 3, 4, 5, 6, 7, 8]) {
  const createdAt = weekStart(weeks[0]) + LAB_DAY * DAY + (LAB_START_H * 60 + rng.int(1, 9)) * MIN;
  rows.profiles.push({
    id: s.userId, username: s.username, display_name: null, ui_language: 'en', feedback_language: s.lang,
    first_login_at: iso(createdAt + 2_000), consent_status: s.consent, consent_at: iso(createdAt + 35_000),
    created_at: iso(createdAt), updated_at: iso(createdAt), _code: s.code,
  });
  rows.consent_log.push({ id: rng.uuid(), user_id: s.userId, status: s.consent, version: '2026-08-v1', created_at: iso(createdAt + 35_000) });
  for (const week of weeks) {
    const change = LANG_CHANGES[s.code];
    const attends = s.code === FEATURED || rng.chance(clamp(0.93 + 0.03 * s.engagement, 0.75, 0.99));
    if (attends) {
      const labStart = weekStart(week) + LAB_DAY * DAY + (LAB_START_H * 60 + rng.int(0, 8)) * MIN;
      const owner = s.code === 'S12' && week === 3 ? s12x : s; // signed in with a typo that day
      simulateSession(owner, week, labStart, rng.int(98, 108), true);
      if (rng.chance(0.1)) {
        // A second VS Code window: its own session row, never used.
        const at = labStart + rng.int(5, 80) * MIN;
        rows.coding_sessions.push({
          id: rng.uuid(), user_id: owner.userId, course_id: null, started_at: iso(at), last_seen_at: iso(at), ended_at: null,
          extension_version: '0.2.0', vscode_version: '1.104.2', os: 'win32', ...emptyCounters(),
        });
      }
      if (change && change.week === week) {
        event({ session_id: rows.coding_sessions.at(-1).id, user_id: s.userId, type: 'feedback_language_changed', key: `feedback_language_changed:${rng.uuid()}`, at: labStart + 3 * MIN, payload: { from: s.lang, to: change.to } });
      }
    }
    const homeSessions = Math.min(3, rng.poisson(clamp(0.5 + 0.4 * s.engagement, 0.1, 1.5)));
    for (let k = 0; k < homeSessions; k++) {
      const day = rng.int(2, 6);
      const start = weekStart(week) + day * DAY + (rng.int(17, 22) * 60 + rng.int(0, 59)) * MIN;
      simulateSession(s, week, start, rng.int(15, 75), false);
    }
  }
  if (LANG_CHANGES[s.code]) rows.profiles.at(-1).feedback_language = LANG_CHANGES[s.code].to;
}

for (const s of students) simulateStudent(s);
rows.profiles.push({ ...rows.profiles.find((p) => p.id === s12.userId), id: s12x.userId, username: 's12x', created_at: rows.coding_sessions.find((c) => c.user_id === s12x.userId)?.started_at, _code: 'S12x' });
rows.profiles.at(-1).first_login_at = rows.profiles.at(-1).created_at;
rows.profiles.at(-1).updated_at = rows.profiles.at(-1).created_at;
rows.profiles.at(-1).consent_at = rows.profiles.at(-1).created_at;
rows.consent_log.push({ id: rng.uuid(), user_id: s12x.userId, status: 'granted', version: '2026-08-v1', created_at: rows.profiles.at(-1).created_at });
simulateStudent(extra[0], [1, 2]);
simulateStudent(extra[1], [1, 2, 3, 4]);

// A cache hit needs an earlier generated answer with the same key, so the
// first answer for each key is always generated.
{
  const seen = new Set();
  for (const q of [...rows.interactions].sort((a, b) => a._at - b._at)) {
    const k = `${q._lang}|${q.question_type}|${q.error_signature_normalized ?? ''}`;
    if (q.cache_hit && !seen.has(k)) Object.assign(q, { cache_hit: false }, q._tok);
    if (!q.cache_hit) seen.add(k);
  }
}

// Reopening from the history list happens in a later session.
for (const row of [...rows.interactions]) {
  if (!rng.chance(0.06)) continue;
  const later = rows.coding_sessions.filter((c) => c.user_id === row.user_id && Date.parse(c.started_at) > row._at + 3_600_000 && c.active_seconds > 0);
  if (!later.length) continue;
  const at = Date.parse(later[0].started_at) + rng.int(2, 20) * MIN;
  event({ session_id: row.session_id, user_id: row.user_id, interaction_id: row.id, type: 'explanation_reopened', key: `explanation_reopened:${rng.uuid()}`, at, payload: {} });
}

const summaryHistory = {};
// learner_profiles: explain bumps the counter on every non-cached answer;
// the client asks generate-summary when 24 h have passed and 3+ new answers exist.
for (const p of rows.profiles) {
  const qs = rows.interactions.filter((i) => i.user_id === p.id).sort((a, b) => a._at - b._at);
  if (!qs.some((q) => !q.cache_hit)) continue;
  let n = 0;
  let generatedAt = null;
  const history = [];
  for (const q of qs) {
    if (!q.cache_hit) n++;
    if (n >= 3 && (generatedAt == null || q._at - generatedAt >= DAY)) {
      generatedAt = q._at + 6_000;
      history.push({ at: iso(generatedAt), newQuestions: n });
      n = 0;
    }
  }
  summaryHistory[p.id] = history;
  const lang = p.feedback_language;
  const counts = {};
  for (const q of qs) counts[q.concept] = (counts[q.concept] ?? 0) + 1;
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
  const topEn = ERRORS.find((e) => Object.values(e.concept).includes(top))?.concept.en ?? TOPICS.find((t) => Object.values(t.concept).includes(top))?.concept.en ?? top;
  const fixPct = Math.round((100 * qs.filter((q) => q.max_level_reached >= 3).length) / qs.length);
  rows.learner_profiles.push({
    user_id: p.id, course_id: null, summary: generatedAt ? PRIVATE_NOTES(topEn, fixPct) : '', interactions_since_update: n,
    updated_at: p.created_at, student_summary: generatedAt ? STUDENT_SUMMARY[lang](top) : '',
    suggested_practice: generatedAt ? PRACTICE[lang](top) : '', summary_generated_at: generatedAt ? iso(generatedAt) : null,
  });
}

// usage_counters: one row per student per UTC hour of non-cached answers.
const usage = new Map();
for (const q of rows.interactions) {
  if (q.cache_hit) continue;
  const hour = new Date(q._at);
  hour.setUTCMinutes(0, 0, 0);
  const key = `${q.user_id}|${hour.toISOString()}`;
  const u = usage.get(key) ?? { user_id: q.user_id, window_start: hour.toISOString(), requests: 0, total_tokens: 0 };
  u.requests++;
  u.total_tokens += q.prompt_tokens + q.completion_tokens;
  usage.set(key, u);
}
rows.usage_counters = [...usage.values()];

// explanations: one cache row per non-cached answer; cache hits reuse one.
const byLangError = new Map();
for (const q of [...rows.interactions].sort((a, b) => a._at - b._at)) {
  const k = `${q._lang}|${q.question_type}|${q.error_signature_normalized ?? ''}`;
  if (q.cache_hit && byLangError.has(k)) {
    byLangError.get(k).reuse_count++;
    q.model_used = byLangError.get(k).model_used;
    continue;
  }
  const row = { id: rng.uuid(), cache_key: hex(64), course_id: null, week_no: null, language: q._lang, error_signature: q.error_signature, payload: q.ladder_payload, model_used: 'openai_compatible', source: 'generated', reuse_count: 0, created_at: q.created_at };
  rows.explanations.push(row);
  byLangError.set(k, row);
}

// ---------------------------------------------------------------- external instruments (synthetic)
// Assumptions until the real instruments are confirmed: 28 dichotomous items
// per test in five content areas (6/6/6/5/5), and 19 TAM items on a 5-point
// scale, split PU 1-5, SN 6-8, BI 9-12, ATT 13-16, AU 17-19.
const TEST_AREAS = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5];
const TAM_CONSTRUCTS = { PU: [1, 2, 3, 4, 5], SN: [6, 7, 8], BI: [9, 10, 11, 12], ATT: [13, 14, 15, 16], AU: [17, 18, 19] };
const itemEase = Array.from({ length: 28 }, () => rng.normal(-0.1, 0.8));
const keyTable = [];
const instruments = [];
const tested = [...students, extra[1]];
for (const [k, s] of tested.entries()) {
  const studentNo = `SYN-2030-${String(k + 1).padStart(3, '0')}`;
  keyTable.push({ username: s.username, student_no: studentNo });
  if (s.code === 'S12') keyTable.push({ username: 's12x', student_no: studentNo });
  const qs = rows.interactions.filter((i) => i.user_id === s.userId);
  const hintShare = qs.length ? qs.filter((q) => q.max_level_reached <= 1).length / qs.length : 0.5;
  const skillPost = s.skill + 0.55 + 0.2 * s.engagement + 0.35 * (hintShare - 0.5) + 0.15 * s.growth + rng.normal(0, 0.3);
  const row = { student_no: studentNo };
  for (let i = 0; i < 28; i++) row[`PreQ${i + 1}`] = rng.chance(sigmoid(1.1 * s.skill + itemEase[i] - 0.3)) ? 1 : 0;
  for (let i = 0; i < 28; i++) row[`PostQ${i + 1}`] = rng.chance(sigmoid(1.1 * skillPost + itemEase[i] - 0.3)) ? 1 : 0;
  const helpful = qs.filter((q) => q.helpful_rating != null);
  const accept = 0.6 * (helpful.length ? helpful.filter((q) => q.helpful_rating === 1).length / helpful.length - 0.8 : 0) + 0.15 * s.help + 0.2 * s.engagement + rng.normal(0, 0.35);
  for (let i = 1; i <= 19; i++) {
    const construct = Object.entries(TAM_CONSTRUCTS).find(([, items]) => items.includes(i))[0];
    const shift = construct === 'SN' ? -0.3 : construct === 'AU' ? 0.2 * s.engagement : 0;
    row[`Item${i}`] = clamp(Math.round(3.8 + accept + shift + rng.normal(0, 0.55)), 1, 5);
  }
  instruments.push(row);
}

// ---------------------------------------------------------------- dashboard SQL on the synthetic rows
const strip = (r) => Object.fromEntries(Object.entries(r).filter(([k]) => !k.startsWith('_')));
const { db, close } = await openDb(MIGRATIONS, AS_OF);
const everyone = [...students, ...extra, s12x];
await insertRows(db, 'auth.users', everyone.map((s) => ({ id: s.userId, email: `${s.username}@students.aicodefeedback.dev`, raw_user_meta_data: { username: s.username } })));
await db.query('delete from public.consent_log');
for (const p of rows.profiles) {
  await db.query(
    'update public.profiles set feedback_language=$2, first_login_at=$3, consent_status=$4, consent_at=$5, created_at=$6, updated_at=$6 where id=$1',
    [p.id, p.feedback_language, p.first_login_at, p.consent_status, p.consent_at, p.created_at],
  );
}
await insertRows(db, 'public.consent_log', rows.consent_log);
await insertRows(db, 'public.coding_sessions', rows.coding_sessions.map(strip));
await insertRows(db, 'public.interactions', rows.interactions.map(strip));
await insertRows(db, 'public.events', rows.events.map(strip));
await insertRows(db, 'public.learner_profiles', rows.learner_profiles);
await insertRows(db, 'public.usage_counters', rows.usage_counters);
await insertRows(db, 'public.explanations', rows.explanations);

// A dashboard session for the calls below (the real functions check it).
await db.query(`insert into dashboard.admins (username, password_hash, role, must_change_password) values ('synthetic', 'x', 'admin', false)`);
await db.query(`insert into dashboard.sessions (token_hash, admin_id, expires_at) select dashboard.hash_token('synthetic-token'), id, now() + interval '12 hours' from dashboard.admins`);
const call = async (sql, params = []) => (await db.query(sql, params)).rows[0].r;
const TOKEN = 'synthetic-token';

const codeOf = new Map(everyone.map((s) => [s.userId, s.code === 'S12' && s.username === 's12x' ? 'S12x' : s.code]));
codeOf.set(s12x.userId, 'S12x');
/** Replaces uuids with pseudonymous codes and drops fields that depend on the real clock. */
function tidy(value) {
  if (Array.isArray(value)) return value.map(tidy);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k === 'generated_at') continue;
      out[k] = k === 'user_id' ? codeOf.get(v) ?? v : tidy(v);
    }
    return out;
  }
  return value;
}

async function dashboardSnapshot(label) {
  const weekRanges = Array.from({ length: WEEKS }, (_, k) => {
    const d = new Date(weekStart(k + 1) + OFFSET_H * 3_600_000);
    const from = d.toISOString().slice(0, 10);
    const to = new Date(d.getTime() + 6 * DAY).toISOString().slice(0, 10);
    return { week: k + 1, from, to };
  });
  const cohortIds = rows.profiles.filter((p) => students.some((s) => s.userId === p.id)).map((p) => p.id);
  const overview = tidy(await call('select public.dashboard_overview($1, $2, $3, $4) as r', [TOKEN, RANGE.from, RANGE.to, TZ]));
  delete overview.online_now;
  const snap = {
    label,
    overview,
    students: tidy(await call('select public.dashboard_students($1, $2, $3, $4) as r', [TOKEN, RANGE.from, RANGE.to, TZ])),
    insights: tidy(await call('select public.dashboard_insights($1, $2, $3, $4) as r', [TOKEN, RANGE.from, RANGE.to, TZ])),
    engagement: tidy(await call('select public.dashboard_engagement($1, $2, $3, $4, null) as r', [TOKEN, RANGE.from, RANGE.to, TZ])),
    trend: tidy(await call('select dashboard.weekly_trend(null, $1::date, $2) as r', [RANGE.to, TZ])),
    weekly: [],
    byStudent: {},
  };
  for (const wr of weekRanges) {
    const ov = tidy(await call('select public.dashboard_overview($1, $2, $3, $4) as r', [TOKEN, wr.from, wr.to, TZ]));
    const en = tidy(await call('select public.dashboard_engagement($1, $2, $3, $4, null) as r', [TOKEN, wr.from, wr.to, TZ]));
    // Keep only who was flagged and why, to show "Needs attention" for one week.
    const attention = (ov.attention ?? []).map((a) => ({ user_id: a.user_id, reasons: a.reasons }));
    delete ov.online_now; delete ov.series; delete ov.recent; delete ov.attention;
    const ins = tidy(await call('select public.dashboard_insights($1, $2, $3, $4) as r', [TOKEN, wr.from, wr.to, TZ]));
    delete en.files; delete en.quota;
    delete ins.health.series;
    snap.weekly.push({ ...wr, overview: ov, attention, engagement: en, health: ins.health });
  }
  for (const id of cohortIds) {
    const code = codeOf.get(id);
    const detail = tidy(await call('select public.dashboard_student_detail($1, $2, $3, $4, $5) as r', [TOKEN, id, RANGE.from, RANGE.to, TZ]));
    const engagement = tidy(await call('select public.dashboard_engagement($1, $2, $3, $4, $5) as r', [TOKEN, RANGE.from, RANGE.to, TZ, id]));
    const weeks = [];
    for (const wr of weekRanges) {
      const d = tidy(await call('select public.dashboard_student_detail($1, $2, $3, $4, $5) as r', [TOKEN, id, wr.from, wr.to, TZ]));
      const e = tidy(await call('select public.dashboard_engagement($1, $2, $3, $4, $5) as r', [TOKEN, wr.from, wr.to, TZ, id]));
      weeks.push({ week: wr.week, activity: d.activity, help: d.help, reading: e.reading, after: e.after, before: e.before, resolution: e.resolution, habits: e.habits, runs: e.runs, errors: e.errors });
    }
    const keep = code === FEATURED;
    snap.byStudent[code] = {
      trend: detail.trend,
      activity: detail.activity,
      help: detail.help,
      languages: detail.languages,
      concepts: detail.concepts,
      summary: keep ? detail.summary : undefined,
      recent: keep ? detail.recent : undefined,
      series: keep ? detail.series : undefined,
      engagement: keep ? engagement : { ...engagement, files: undefined, quota: undefined },
      weeks,
    };
  }
  return snap;
}

// The dashboard as it would look with every account (raw) ...
const rawOverview = tidy(await call('select public.dashboard_overview($1, $2, $3, $4) as r', [TOKEN, RANGE.from, RANGE.to, TZ]));
delete rawOverview.online_now;
const rawStudents = tidy(await call('select public.dashboard_students($1, $2, $3, $4) as r', [TOKEN, RANGE.from, RANGE.to, TZ]));
// ... and after the account-level cleaning rules C1-C3 (proposed, CONFIRM):
// drop the teacher test account and the student who declined, and merge the
// typo account s12x into s12.
await db.query('update public.coding_sessions set user_id=$1 where user_id=$2', [s12.userId, s12x.userId]);
await db.query('update public.interactions set user_id=$1 where user_id=$2', [s12.userId, s12x.userId]);
await db.query('update public.events set user_id=$1 where user_id=$2', [s12.userId, s12x.userId]);
for (const id of [extra[0].userId, extra[1].userId, s12x.userId]) await db.query('delete from auth.users where id=$1', [id]);
await db.query('delete from public.profiles where id = any($1::uuid[])', [[extra[0].userId, extra[1].userId, s12x.userId]]);
const clean = await dashboardSnapshot('clean');
const question = tidy(await call('select public.dashboard_question($1, $2) as r', [TOKEN, rows.interactions.find((i) => i.user_id === students[6].userId && i.max_level_reached === 3 && i.trigger_source === 'diagnostic').id]));
// The read-only SQL reports in supabase/analytics, run as they are.
const analytics = {};
for (const name of ['dependency_trend', 'question_type_resolution', 'session_rhythm', 'sessions_without_help']) {
  const sql = readFileSync(join(DOCS, '..', 'supabase', 'analytics', `${name}.sql`), 'utf8');
  analytics[name] = tidy((await db.query(sql)).rows.map((r) => JSON.parse(JSON.stringify(r))));
}
// Proposed rule C5 (CONFIRM): leave empty sessions out of session measures.
// The same dashboard function, run again without them.
await db.query(`delete from public.coding_sessions cs where cs.active_seconds = 0
  and not exists (select 1 from public.interactions i where i.session_id = cs.id)
  and not exists (select 1 from public.events e where e.session_id = cs.id)`);
const withoutEmpty = {
  class: tidy(await call('select public.dashboard_engagement($1, $2, $3, $4, null) as r', [TOKEN, RANGE.from, RANGE.to, TZ])).habits,
  featured: tidy(await call('select public.dashboard_engagement($1, $2, $3, $4, $5) as r', [TOKEN, RANGE.from, RANGE.to, TZ, students[6].userId])).habits,
};
await close();

// ---------------------------------------------------------------- student panel (extension statsStore formulas)
const localDate = (ms) => new Date(ms + OFFSET_H * 3_600_000).toISOString().slice(0, 10);
const panel = {};
for (const s of students) {
  const qs = rows.interactions.filter((i) => i.user_id === s.userId);
  const cs = rows.coding_sessions.filter((c) => c.user_id === s.userId);
  panel[s.code] = {
    explanationsAskedFor: qs.length,
    errorsWorkedOutYourself: qs.filter((q) => q.max_level_reached <= 1).length,
    daysUsingThis: new Set(cs.map((c) => localDate(Date.parse(c.started_at)))).size,
    totalActiveHours: Math.round(cs.reduce((a, c) => a + c.active_seconds, 0) / 360) / 10,
    linesWritten: cs.reduce((a, c) => a + c.lines_written, 0),
    linesDeleted: cs.reduce((a, c) => a + c.lines_deleted, 0),
    filesCreated: cs.reduce((a, c) => a + c.files_created, 0),
    errorsFixedWithoutAsking: cs.reduce((a, c) => a + c.errors_resolved_without_asking, 0),
  };
}

// ---------------------------------------------------------------- write
rmSync(OUT, { recursive: true, force: true });
for (const dir of ['raw', 'external', 'snippets']) mkdirSync(join(OUT, dir), { recursive: true });
const write = (name, data, pretty = false) =>
  writeFileSync(join(OUT, name), (pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)) + '\n');
const byTime = (a, b) => a._at - b._at || String(a.id ?? a.client_event_id).localeCompare(String(b.id ?? b.client_event_id));

// Raw tables, as the rows would sit in Supabase. The explanation text
// (interactions.ladder_payload, explanations.payload) is kept out of these
// files: it is the same generic text in every row.
write('raw/profiles.json', rows.profiles.map(strip));
write('raw/consent_log.json', rows.consent_log);
write('raw/coding_sessions.json', [...rows.coding_sessions].sort((a, b) => a.started_at.localeCompare(b.started_at)).map(strip));
write('raw/interactions.json', [...rows.interactions].sort(byTime).map((r) => { const o = strip(r); delete o.ladder_payload; return o; }));
write('raw/events.json', [...rows.events].sort(byTime).map(strip));
write('raw/learner_profiles.json', rows.learner_profiles);
write('raw/usage_counters.json', rows.usage_counters);
write('raw/explanations.json', rows.explanations.map(({ payload, ...r }) => r));
write('external/key_table.json', keyTable);
write('external/instruments.json', instruments);

const featured = students.find((s) => s.code === FEATURED);
write('derived.json', {
  meta: {
    seed: SEED, tz: TZ, asOf: iso(AS_OF), range: RANGE, featured: FEATURED,
    weeks: Array.from({ length: WEEKS }, (_, k) => ({ week: k + 1, start: new Date(weekStart(k + 1) + OFFSET_H * 3_600_000).toISOString().slice(0, 10) })),
    cohort: students.map((s) => s.code),
    removedByCleaning: { test: 'T01', declined: 'S26', merged: { from: 'S12x', into: 'S12' } },
    counts: Object.fromEntries(Object.entries(rows).map(([k, v]) => [k, v.length])),
    instruments: { testItems: 28, testAreas: TEST_AREAS, tamItems: 19, tamConstructs: TAM_CONSTRUCTS, likert: [1, 5] },
  },
  raw: { overview: rawOverview, students: rawStudents },
  clean,
  panel,
  question,
});

// Small snippets shown on the pages (<<< @/../.vitepress/data/sample/snippets/...).
const pick = (obj, keys) => Object.fromEntries(keys.map((k) => [k, obj[k]]));
const w3 = { from: weekStart(3), to: weekStart(4) };
const s07Sessions = rows.coding_sessions.filter((c) => c.user_id === featured.userId && Date.parse(c.started_at) >= w3.from && Date.parse(c.started_at) < w3.to);
const s07Questions = rows.interactions.filter((i) => i.user_id === featured.userId && i._at >= w3.from && i._at < w3.to).sort(byTime);
write('snippets/independence-trend.sessions.json', s07Sessions.slice(0, 2).map((c) => pick(c, ['id', 'user_id', 'started_at', 'last_seen_at', 'diagnostics_offered', 'errors_resolved_without_asking'])), true);
write('snippets/independence-trend.interactions.json', s07Questions.slice(0, 2).map((i) => pick(i, ['id', 'session_id', 'user_id', 'created_at', 'trigger_source', 'max_level_reached'])), true);
write('snippets/independence-trend.week.json', clean.byStudent[FEATURED].trend.find((t) => t.week === new Date(weekStart(3) + OFFSET_H * 3_600_000).toISOString().slice(0, 10)), true);

// ---------------------------------------------------------------- page views
// Small files the charts import, so no page ships the whole sample. Only
// descriptive summaries (quartiles, pooled sums, example tests) are computed
// here, always from the dashboard's own output above.
mkdirSync(join(OUT, 'views'), { recursive: true });
const studyWeeks = Array.from({ length: WEEKS }, (_, k) => new Date(weekStart(k + 1) + OFFSET_H * 3_600_000).toISOString().slice(0, 10));
const inStudy = (t) => t.filter((x) => studyWeeks.includes(x.week));
const cohortCodes = students.map((s) => s.code);
const testTotals = (code) => {
  const username = code.toLowerCase();
  const no = keyTable.find((k) => k.username === username)?.student_no;
  const row = instruments.find((r) => r.student_no === no);
  const sum = (prefix) => Array.from({ length: 28 }, (_, i) => row[`${prefix}${i + 1}`]).reduce((a, b) => a + b, 0);
  return { pre: sum('PreQ'), post: sum('PostQ') };
};

{
  const RATES = ['pct_offers_taken', 'pct_hint_enough', 'pct_sessions_without_help'];
  const rates = {};
  for (const rate of RATES) {
    const perStudent = cohortCodes.map((c) => inStudy(clean.byStudent[c].trend).map((t) => t[rate]));
    rates[rate] = {
      featured: inStudy(clean.byStudent[FEATURED].trend).map((t) => t[rate]),
      class: inStudy(clean.trend).map((t) => t[rate]),
      q1: studyWeeks.map((_, k) => round(quantile(perStudent.map((s) => s[k]), 0.25), 1)),
      q3: studyWeeks.map((_, k) => round(quantile(perStudent.map((s) => s[k]), 0.75), 1)),
    };
  }
  // One value per student for SPSS: pooled over weeks 1-2 (early) and 7-8 (late).
  const pooled = (code, weeks, num, den, cap = 100) => {
    const ts = inStudy(clean.byStudent[code].trend).filter((_, k) => weeks.includes(k + 1));
    const n = ts.reduce((a, t) => a + t[num], 0);
    const d = ts.reduce((a, t) => a + t[den], 0);
    return d > 0 ? Math.min(cap, (100 * n) / d) : null;
  };
  const perStudent = cohortCodes.map((code) => ({
    code,
    offers_early: pooled(code, [1, 2], 'from_errors', 'help_offers'),
    offers_late: pooled(code, [7, 8], 'from_errors', 'help_offers'),
    gain: testTotals(code).post - testTotals(code).pre,
  }));
  const both = perStudent.filter((s) => s.offers_early != null && s.offers_late != null);
  const t = pairedT(both.map((s) => s.offers_early), both.map((s) => s.offers_late));
  const r = pearson(both.map((s) => s.offers_late - s.offers_early), both.map((s) => s.gain));
  write('views/independence-trend.json', {
    weeks: studyWeeks.map((start, k) => ({ week: k + 1, start })),
    featured: FEATURED,
    rates,
    featuredRows: inStudy(clean.byStudent[FEATURED].trend).map((t, k) => ({ week: k + 1, ...pick(t, ['questions', 'from_errors', 'help_offers', 'sessions', 'sessions_without_help']) })),
    analysis: {
      n: both.length,
      early: { mean: round(mean(both.map((s) => s.offers_early)), 1), sd: round(sd(both.map((s) => s.offers_early)), 1) },
      late: { mean: round(mean(both.map((s) => s.offers_late)), 1), sd: round(sd(both.map((s) => s.offers_late)), 1) },
      pairedT: { t: round(t.t, 2), df: t.df, p: round(t.p, 3), dz: round(t.dz, 2) },
      gainCorrelation: { r: round(r.r, 2), df: r.df, p: round(r.p, 3) },
      featured: perStudent.find((s) => s.code === FEATURED),
    },
  });
}

{
  const { views, snippets } = buildViews({
    rows, clean, panel, question, analytics, withoutEmpty, summaryHistory, students, s12x,
    FEATURED, weekStart, WEEKS, OFFSET_H,
  });
  for (const [slug, view] of Object.entries(views)) write(`views/${slug}.json`, view);
  for (const [name, list] of Object.entries(snippets)) if (list) write(`snippets/${name}.json`, list.length === 1 ? list[0] : list, true);
}

console.log('Synthetic sample written to', OUT);
console.log(Object.entries(rows).map(([k, v]) => `${k}: ${v.length}`).join(', '));
process.exit(0);
