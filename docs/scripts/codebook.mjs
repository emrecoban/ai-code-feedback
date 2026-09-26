// Codebook and synthetic downloads (run by `npm run docs:sample` after sample.mjs).
//
// Writes to src/public/downloads/:
//   codebook.csv / codebook.xlsx   one row per inventory item (sheet "items") and
//                                  one row per variable of the wide file (sheet "wide")
//   synthetic_events_long.csv      one row per research event, payload fields as columns
//   synthetic_questions_long.csv   one row per question, without any stored text
//   synthetic_students_wide.csv    one row per student, ready for SPSS
//   synthetic_labels_{en,tr,es}.sps  SPSS syntax that reads the wide file and applies
//                                  variable labels, value labels and missing codes
//   README.txt
// and .vitepress/data/downloads.json (file list for the codebook page) and
// .vitepress/data/sample/wide.json (the wide rows, for the linking page).
//
// Everything comes from the synthetic sample. Cleaning rules C1 to C5 are applied
// the same way as in the sample views. The output is the same on every run.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories, items as names, values } from '../.vitepress/data/terms.ts';
import { xlsx } from './lib/xlsx.mjs';

const DOCS = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(DOCS, '.vitepress/data');
const SAMPLE = join(DATA, 'sample');
const OUT = join(DOCS, 'src/public/downloads');
const LANGS = ['en', 'tr', 'es'];
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));

const inv = read(join(DATA, 'inventory.json'));
const meta = read(join(SAMPLE, 'derived.json')).meta;
const raw = Object.fromEntries(['profiles', 'coding_sessions', 'interactions', 'events'].map((t) => [t, read(join(SAMPLE, 'raw', `${t}.json`))]));
const keyTable = read(join(SAMPLE, 'external/key_table.json'));
const instruments = read(join(SAMPLE, 'external/instruments.json'));

// Missing value codes (cleaning rule C8).
const MISSING = { notApplicable: -99, notMeasured: -98, notAnswered: -97 };
const MISSING_LABEL = {
  [-99]: { en: 'Not applicable', tr: 'Uygulanamaz', es: 'No aplicable' },
  [-98]: { en: 'Not measured', tr: 'Ölçülmedi', es: 'No medido' },
  [-97]: { en: 'Not answered', tr: 'Yanıtlanmadı', es: 'Sin respuesta' },
};

// ---------------------------------------------------------------- value labels
// Stored value -> [namespace, key] in terms.values, for every item with a closed set.
const VALUE_SETS = {
  'profiles.consent_status': ['consent_status'],
  'consent_log.status': ['consent_status'],
  'profiles.feedback_language': ['language'],
  'profiles.ui_language': ['language'],
  'explanations.language': ['language'],
  'event.feedback_language_changed.from': ['language'],
  'event.feedback_language_changed.to': ['language'],
  'interactions.trigger_source': ['trigger_source'],
  'interactions.trigger_surface': ['trigger_surface'],
  'event.question_picker_abandoned.triggerSurface': ['trigger_surface', ['selection_codelens', 'selection_lightbulb', 'selection_status_bar', 'selection_keybinding']],
  'interactions.question_type': ['question_type', ['what_does_this_mean', 'what_does_this_do', 'why_works', 'whats_wrong', 'simpler_example', 'free_text']],
  'interactions.error_severity': ['severity'],
  'interactions.max_level_reached': ['max_level_reached', { 0: 'hint', 1: 'hint', 2: 'rule', 3: 'fix' }],
  'interactions.helpful_rating': ['rating', { 1: 'up', [-1]: 'down' }],
  'interactions.self_reported_outcome': ['outcome'],
  'interactions.post_confidence': ['confidence'],
  'event.feedback_abandoned.reason': ['abandon_reason'],
  'event.question_picker_abandoned.stage': ['picker_stage'],
  'event.returned_to_code.level': ['shown_level'],
  'event.feedback_abandoned.level': ['shown_level'],
  'event.level_reached.level': ['shown_level', ['2', '3']],
  'event.explanation_copied.level': ['ladder'],
  'event.request_failed.kind': ['failure'],
  'event.request_failed.code': ['failureCode'],
  'dashboard.admins.role': ['role'],
};
function valueLabels(id, l) {
  const set = VALUE_SETS[id];
  if (set) {
    const [ns, pick] = set;
    const table = values[ns];
    const pairs = Array.isArray(pick) ? pick.map((k) => [k, k]) : pick ? Object.entries(pick) : Object.keys(table).map((k) => [k, k]);
    return pairs.map(([stored, key]) => `${stored} = ${table[key][l]}`).join('; ');
  }
  if (id === 'events.event_type') {
    return inv.items.filter((i) => i.level === 'event').map((i) => `${i.id.slice(6)} = ${names[i.id][l]}`).join('; ');
  }
  if (/^external\.(Pre|Post)Q\d+$/.test(id)) return { en: '0 = wrong; 1 = right', tr: '0 = yanlış; 1 = doğru', es: '0 = incorrecto; 1 = correcto' }[l];
  return '';
}

// ---------------------------------------------------------------- codebook: items
const spssName = (id) => {
  let v = id.replace(/[^A-Za-z0-9]+/g, '_').replace(/_+$/, '');
  if (!/^[A-Za-z]/.test(v)) v = `v_${v}`;
  return v.slice(0, 64);
};
const nullable = (i) => /\bnull\b|absent/i.test(i.allowed ?? '');
const itemRows = inv.items.map((i) => ({
  variable: spssName(i.id),
  item_id: i.id,
  label_en: names[i.id]?.en ?? '',
  label_tr: names[i.id]?.tr ?? '',
  label_es: names[i.id]?.es ?? '',
  category: i.category,
  category_en: categories[i.category]?.en ?? '',
  kind: i.kind,
  level: i.level,
  type: i.type ?? '',
  allowed_values: i.allowed ?? '',
  value_labels_en: valueLabels(i.id, 'en'),
  value_labels_tr: valueLabels(i.id, 'tr'),
  value_labels_es: valueLabels(i.id, 'es'),
  missing: nullable(i) ? 'NULL (empty cell)' : '',
  source_table: i.table ?? (i.level === 'payload' || i.level === 'event' ? 'events' : ''),
  source_column: i.column ?? '',
  formula_version: i.formula_version ?? '',
  page: i.page ?? '',
}));
{
  const seen = new Set();
  for (const r of itemRows) {
    if (seen.has(r.variable)) throw new Error(`duplicate variable name ${r.variable}`);
    seen.add(r.variable);
  }
}

// ---------------------------------------------------------------- cleaned cohort
// C1 consent granted, C2 no test accounts, C3 merge usernames through the key
// table, C4 study window only (the sample has nothing outside it), C5 empty
// sessions left out of session measures.
const studentNoOf = Object.fromEntries(keyTable.map((k) => [k.username, k.student_no]));
const cohortNos = new Set(meta.cohort.map((c) => studentNoOf[c.toLowerCase()]));
const codeOfStudentNo = Object.fromEntries(meta.cohort.map((c) => [studentNoOf[c.toLowerCase()], c]));
const studentOfUser = {};
for (const p of raw.profiles) {
  const no = studentNoOf[p.username];
  if (p.consent_status !== 'granted' || !no || !cohortNos.has(no)) continue;
  studentOfUser[p.id] = codeOfStudentNo[no];
}
const cohort = meta.cohort;
const weekOf = (ts) => {
  const t = Date.parse(ts);
  let w = 0;
  for (const wk of meta.weeks) if (t >= Date.parse(`${wk.start}T00:00:00+03:00`)) w = wk.week;
  return w;
};
const inCohort = (r) => studentOfUser[r.user_id] != null;
const sessions = raw.coding_sessions.filter(inCohort);
const questions = raw.interactions.filter(inCohort).sort((a, b) => a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id));
const events = raw.events.filter(inCohort).sort((a, b) => a.server_ts.localeCompare(b.server_ts) || a.client_event_id.localeCompare(b.client_event_id));

// ---------------------------------------------------------------- long files
const PAYLOAD_KEYS = inv.items.filter((i) => i.level === 'payload').map((i) => i.key);
const payloadKeys = [...new Set(PAYLOAD_KEYS)];
const bool = (v) => (v === true ? 1 : v === false ? 0 : v);
const eventsLong = events.map((e) => ({
  student: studentOfUser[e.user_id],
  week: weekOf(e.server_ts),
  server_ts: e.server_ts,
  event_type: e.event_type,
  question_id: e.interaction_id ?? '',
  ...Object.fromEntries(payloadKeys.map((k) => [k, e.payload?.[k] == null ? '' : bool(e.payload[k])])),
}));
const Q_COLUMNS = ['id', 'session_id', 'created_at', 'trigger_source', 'trigger_surface', 'question_type', 'error_source', 'error_code', 'error_severity', 'max_level_reached', 'cache_hit', 'helpful_rating', 'self_reported_outcome', 'post_confidence', 'help_latency_ms', 'edits_before_ask', 'recurring_error_count', 'recurring_concept_count', 'ms_since_previous_same_error', 'selection_line_count', 'selection_char_count', 'latency_ms', 'prompt_tokens', 'completion_tokens'];
const questionsLong = questions.map((q) => ({
  student: studentOfUser[q.user_id],
  week: weekOf(q.created_at),
  ...Object.fromEntries(Q_COLUMNS.map((c) => [c === 'id' ? 'question_id' : c, q[c] == null ? '' : bool(q[c])])),
}));

// ---------------------------------------------------------------- wide file
const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const avg = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const r2 = (x) => (x == null ? null : Math.round(x * 100) / 100);
const pct = (a, b) => (b ? r2((100 * a) / b) : null);
const or = (x, code) => (x == null || Number.isNaN(x) ? code : x);
const dayIn = (ts) => new Intl.DateTimeFormat('en-CA', { timeZone: meta.tz }).format(new Date(ts));
const LANG_CODE = { en: 1, tr: 2, es: 3 };
const TAM = { tam_pu: [1, 5], tam_sn: [6, 8], tam_bi: [9, 12], tam_att: [13, 16], tam_au: [17, 19] };

/** Variables of the wide file: name, source items, label, type, compute. */
const T = (en, tr, es) => ({ en, tr, es });
const WIDE = [
  { name: 'student', src: ['profiles.username'], label: T('Participant code', 'Katılımcı kodu', 'Código de participante'), type: 'string' },
  { name: 'feedback_language', src: ['profiles.feedback_language'], label: T('Feedback language', 'Geri bildirim dili', 'Idioma de las explicaciones'), type: 'code', labels: Object.fromEntries(Object.entries(LANG_CODE).map(([k, v]) => [v, values.language[k]])) },
  { name: 'n_sessions', src: ['metric.sessions', 'coding_sessions.active_seconds'], label: T('Sessions (without empty sessions)', 'Oturumlar (boş oturumlar olmadan)', 'Sesiones (sin sesiones vacías)'), type: 'int' },
  { name: 'active_hours', src: ['coding_sessions.active_seconds'], label: T('Active coding time (hours)', 'Aktif kodlama süresi (saat)', 'Tiempo activo programando (horas)'), type: 'num' },
  { name: 'active_days', src: ['metric.active_days'], label: T('Active days', 'Aktif gün', 'Días activos'), type: 'int' },
  { name: 'questions', src: ['metric.questions'], label: T('Questions', 'Sorular', 'Preguntas'), type: 'int' },
  { name: 'questions_per_hour', src: ['metric.questions', 'coding_sessions.active_seconds'], label: T('Questions per active hour', 'Aktif saat başına soru', 'Preguntas por hora activa'), type: 'num' },
  { name: 'error_question_pct', src: ['interactions.trigger_source'], label: T('Questions about an error (%)', 'Bir hata hakkındaki sorular (%)', 'Preguntas sobre un error (%)'), type: 'num' },
  { name: 'hint_enough_pct', src: ['metric.hint_enough_pct'], label: T('Hint was enough (%)', 'İpucu yeterli oldu (%)', 'Bastó con la pista (%)'), type: 'num' },
  { name: 'fix_pct', src: ['interactions.max_level_reached'], label: T('Questions that reached the fix (%)', 'Düzeltmeye ulaşan sorular (%)', 'Preguntas que llegaron a la corrección (%)'), type: 'num' },
  { name: 'mean_edits_before_ask', src: ['interactions.edits_before_ask'], label: T('Edits before asking (mean)', 'Sormadan önceki düzenlemeler (ortalama)', 'Ediciones antes de preguntar (media)'), type: 'num' },
  { name: 'median_help_latency_s', src: ['interactions.help_latency_ms'], label: T('Wait after the help offer (median, s)', 'Yardım teklifinden sonra bekleme (ortanca, sn)', 'Espera tras la oferta de ayuda (mediana, s)'), type: 'num' },
  { name: 'offers_taken_pct', src: ['metric.pct_offers_taken'], label: T('Asked for help when offered (%)', 'Teklif edildiğinde yardım istedi (%)', 'Pidió ayuda cuando se le ofreció (%)'), type: 'num' },
  { name: 'fixed_unaided', src: ['coding_sessions.errors_resolved_without_asking'], label: T('Fixed without asking', 'Sormadan düzeltilen', 'Corregidos sin preguntar'), type: 'int' },
  { name: 'fixed_unaided_per_hour', src: ['coding_sessions.errors_resolved_without_asking', 'coding_sessions.active_seconds'], label: T('Fixed without asking per active hour', 'Aktif saat başına sormadan düzeltilen', 'Corregidos sin preguntar por hora activa'), type: 'num' },
  { name: 'no_help_session_pct', src: ['metric.sessions_without_help_pct'], label: T('Sessions without help (%, without empty sessions)', 'Yardımsız oturumlar (%, boş oturumlar olmadan)', 'Sesiones sin ayuda (%, sin sesiones vacías)'), type: 'num' },
  { name: 'error_gone_pct', src: ['metric.error_gone_pct'], label: T('Error gone after explaining (%)', 'Açıklamadan sonra hata gitti (%)', 'Error resuelto tras explicar (%)'), type: 'num' },
  { name: 'median_visible_s', src: ['event.explanation_visibility.visibleMs'], label: T('Time on screen (median, s)', 'Ekranda kalma süresi (ortanca, sn)', 'Tiempo en pantalla (mediana, s)'), type: 'num' },
  { name: 'median_return_s', src: ['event.returned_to_code.msToReturn'], label: T('Back to the code after (median, s)', 'Koda dönüş süresi (ortanca, sn)', 'Volvió al código tras (mediana, s)'), type: 'num' },
  { name: 'abandon_pct', src: ['metric.abandoned'], label: T('Questions left without acting (%)', 'Bir şey yapmadan bırakılan sorular (%)', 'Preguntas sin actuar después (%)'), type: 'num' },
  { name: 'copies', src: ['event.explanation_copied'], label: T('Copies from explanations', 'Açıklamalardan kopyalamalar', 'Copias de explicaciones'), type: 'int' },
  { name: 'reopens', src: ['event.explanation_reopened'], label: T('Explanations opened again', 'Yeniden açılan açıklamalar', 'Explicaciones reabiertas'), type: 'int' },
  { name: 'helpful_pct', src: ['interactions.helpful_rating'], label: T('Rated helpful (% of given ratings)', 'Faydalı bulunan (verilen değerlendirmelerin %)', 'Valorado útil (% de las valoraciones)'), type: 'num' },
  { name: 'solved_pct', src: ['interactions.self_reported_outcome'], label: T('Answered "solved it" (% of answers)', '"Çözdüm" yanıtı (yanıtların %)', 'Respondió «lo resolví» (% de respuestas)'), type: 'num' },
  { name: 'confident_pct', src: ['interactions.post_confidence'], label: T('Answered "yes, I could do it alone" (% of answers)', '"Evet, tek başıma yapabilirim" yanıtı (yanıtların %)', 'Respondió «sí, podría solo» (% de respuestas)'), type: 'num' },
  { name: 'large_pastes', src: ['coding_sessions.large_paste_count'], label: T('Large pastes', 'Büyük yapıştırma', 'Pegados grandes'), type: 'int' },
  { name: 'left_vscode_per_hour', src: ['coding_sessions.focus_loss_count', 'coding_sessions.active_seconds'], label: T('Left VS Code per active hour', 'Aktif saat başına VS Code’dan ayrılma', 'Salidas de VS Code por hora activa'), type: 'num' },
  { name: 'lines_added', src: ['coding_sessions.lines_written'], label: T('Lines added', 'Eklenen satır', 'Líneas añadidas'), type: 'int' },
  { name: 'failed_requests', src: ['event.request_failed'], label: T('Failed requests', 'Başarısız istekler', 'Solicitudes fallidas'), type: 'int' },
  { name: 'cache_pct', src: ['interactions.cache_hit'], label: T('Answered from cache (%)', 'Önbellekten yanıtlanan (%)', 'Respondido desde caché (%)'), type: 'num' },
  { name: 'pre_total', src: ['external.pre_total'], label: T('Pre-test score', 'Ön test puanı', 'Puntuación del pretest'), type: 'int' },
  { name: 'post_total', src: ['external.post_total'], label: T('Post-test score', 'Son test puanı', 'Puntuación del postest'), type: 'int' },
  { name: 'gain', src: ['external.gain'], label: T('Learning gain (post minus pre)', 'Öğrenme kazancı (son test eksi ön test)', 'Ganancia de aprendizaje (postest menos pretest)'), type: 'int' },
  ...Object.keys(TAM).map((k) => ({ name: k, src: [`external.${k}`], label: names[`external.${k}`], type: 'num' })),
  ...Array.from({ length: 28 }, (_, n) => ({ name: `PreQ${n + 1}`, src: [`external.PreQ${n + 1}`], label: names[`external.PreQ${n + 1}`], type: 'item01' })),
  ...Array.from({ length: 28 }, (_, n) => ({ name: `PostQ${n + 1}`, src: [`external.PostQ${n + 1}`], label: names[`external.PostQ${n + 1}`], type: 'item01' })),
  ...Array.from({ length: 19 }, (_, n) => ({ name: `Item${n + 1}`, src: [`external.Item${n + 1}`], label: names[`external.Item${n + 1}`], type: 'likert' })),
];
for (const v of WIDE) for (const s of v.src) if (!inv.items.some((i) => i.id === s)) throw new Error(`wide ${v.name}: unknown source item ${s}`);

function wideRow(code) {
  const own = (r) => studentOfUser[r.user_id] === code;
  const S = sessions.filter(own);
  const nonEmpty = S.filter((c) => c.active_seconds > 0);
  const Q = questions.filter(own);
  const E = events.filter(own);
  const ev = (type) => E.filter((e) => e.event_type === type);
  const profile = raw.profiles.find((p) => p.username === code.toLowerCase());
  const hours = S.reduce((a, c) => a + c.active_seconds, 0) / 3600;
  const diag = Q.filter((q) => q.trigger_source === 'diagnostic');
  const offers = S.reduce((a, c) => a + c.diagnostics_offered, 0);
  const qIdsWithSession = new Set(Q.map((q) => q.session_id));
  const resolvedIds = new Set(ev('diagnostic_resolved').map((e) => e.interaction_id));
  const abandonedIds = new Set(ev('feedback_abandoned').map((e) => e.interaction_id));
  const rated = Q.filter((q) => q.helpful_rating != null);
  const outcome = Q.filter((q) => q.self_reported_outcome != null);
  const conf = Q.filter((q) => q.post_confidence != null);
  const edits = Q.map((q) => q.edits_before_ask).filter((x) => x != null);
  const lat = Q.map((q) => q.help_latency_ms).filter((x) => x != null).map((x) => x / 1000);
  const inst = instruments.find((r) => r.student_no === studentNoOf[code.toLowerCase()]);
  const sum = (pre, n) => Array.from({ length: n }, (_, k) => inst[`${pre}${k + 1}`]).reduce((a, b) => a + b, 0);
  const tam = (a, b) => r2(avg(Array.from({ length: b - a + 1 }, (_, k) => inst[`Item${a + k}`])));
  const row = {
    student: code,
    feedback_language: LANG_CODE[profile.feedback_language],
    n_sessions: nonEmpty.length,
    active_hours: r2(hours),
    active_days: new Set(S.map((c) => dayIn(c.started_at))).size,
    questions: Q.length,
    questions_per_hour: or(hours ? r2(Q.length / hours) : null, MISSING.notApplicable),
    error_question_pct: or(pct(diag.length, Q.length), MISSING.notApplicable),
    hint_enough_pct: or(pct(Q.filter((q) => q.max_level_reached <= 1).length, Q.length), MISSING.notApplicable),
    fix_pct: or(pct(Q.filter((q) => q.max_level_reached >= 3).length, Q.length), MISSING.notApplicable),
    mean_edits_before_ask: or(r2(avg(edits)), MISSING.notMeasured),
    median_help_latency_s: or(r2(median(lat)), MISSING.notMeasured),
    offers_taken_pct: or(offers ? Math.min(100, pct(diag.length, offers)) : null, MISSING.notApplicable),
    fixed_unaided: S.reduce((a, c) => a + c.errors_resolved_without_asking, 0),
    fixed_unaided_per_hour: or(hours ? r2(S.reduce((a, c) => a + c.errors_resolved_without_asking, 0) / hours) : null, MISSING.notApplicable),
    no_help_session_pct: or(pct(nonEmpty.filter((c) => !qIdsWithSession.has(c.id)).length, nonEmpty.length), MISSING.notApplicable),
    error_gone_pct: or(pct(diag.filter((q) => resolvedIds.has(q.id)).length, diag.length), MISSING.notApplicable),
    median_visible_s: or(r2(median(ev('explanation_visibility').map((e) => e.payload.visibleMs / 1000))), MISSING.notMeasured),
    median_return_s: or(r2(median(ev('returned_to_code').map((e) => e.payload.msToReturn / 1000))), MISSING.notMeasured),
    abandon_pct: or(pct(Q.filter((q) => abandonedIds.has(q.id)).length, Q.length), MISSING.notApplicable),
    copies: ev('explanation_copied').length,
    reopens: ev('explanation_reopened').length,
    helpful_pct: or(pct(rated.filter((q) => q.helpful_rating === 1).length, rated.length), MISSING.notAnswered),
    solved_pct: or(pct(outcome.filter((q) => q.self_reported_outcome === 'solved').length, outcome.length), MISSING.notAnswered),
    confident_pct: or(pct(conf.filter((q) => q.post_confidence === 'yes').length, conf.length), MISSING.notAnswered),
    large_pastes: S.reduce((a, c) => a + c.large_paste_count, 0),
    left_vscode_per_hour: or(hours ? r2(S.reduce((a, c) => a + c.focus_loss_count, 0) / hours) : null, MISSING.notApplicable),
    lines_added: S.reduce((a, c) => a + c.lines_written, 0),
    failed_requests: ev('request_failed').length,
    cache_pct: or(pct(Q.filter((q) => q.cache_hit).length, Q.length), MISSING.notApplicable),
    pre_total: inst ? sum('PreQ', 28) : MISSING.notMeasured,
    post_total: inst ? sum('PostQ', 28) : MISSING.notMeasured,
  };
  row.gain = inst ? row.post_total - row.pre_total : MISSING.notMeasured;
  for (const [k, [a, b]] of Object.entries(TAM)) row[k] = inst ? tam(a, b) : MISSING.notMeasured;
  for (const pre of ['PreQ', 'PostQ']) for (let n = 1; n <= 28; n++) row[`${pre}${n}`] = inst ? inst[`${pre}${n}`] : MISSING.notMeasured;
  for (let n = 1; n <= 19; n++) row[`Item${n}`] = inst ? inst[`Item${n}`] : MISSING.notMeasured;
  return row;
}
const wide = cohort.map(wideRow);
for (const v of WIDE) if (!(v.name in wide[0])) throw new Error(`wide variable ${v.name} not computed`);

// ---------------------------------------------------------------- writers
const csvCell = (v) => {
  if (v == null) return '';
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (rows, cols = Object.keys(rows[0])) => [cols.join(','), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(','))].join('\r\n') + '\r\n';

const wideCodebook = WIDE.map((v) => ({
  variable: v.name,
  source_items: v.src.join(' '),
  label_en: v.label.en,
  label_tr: v.label.tr,
  label_es: v.label.es,
  type: { string: 'string', code: 'numeric code', int: 'integer', num: 'number', item01: 'integer 0/1', likert: 'integer 1-5 (placeholder scale)' }[v.type],
  value_labels_en: v.labels ? Object.entries(v.labels).map(([c, t]) => `${c} = ${t.en}`).join('; ') : v.type === 'item01' ? '0 = wrong; 1 = right' : '',
  missing_codes: v.type === 'string' ? '' : '-99 not applicable; -98 not measured; -97 not answered',
}));

const spssQuote = (s) => `'${String(s).replace(/'/g, "''")}'`;
function spss(l) {
  const fmt = (v) => (v.type === 'string' ? 'A8' : v.type === 'num' ? 'F8.2' : 'F4.0');
  const header = {
    en: ['* Synthetic sample data. Not real study data.', '* Reads synthetic_students_wide.csv and applies English variable labels, value labels and missing codes.', '* Run SET UNICODE=ON. with no data set open before you run this file.'],
    tr: ['* Sentetik örnek veri. Gerçek çalışma verisi değildir.', '* synthetic_students_wide.csv dosyasını okur ve Türkçe değişken etiketlerini, değer etiketlerini ve eksik değer kodlarını uygular.', '* Bu dosyayı çalıştırmadan önce, açık veri seti yokken SET UNICODE=ON. komutunu çalıştırın.'],
    es: ['* Datos de muestra sintéticos. No son datos reales del estudio.', '* Lee synthetic_students_wide.csv y aplica en español las etiquetas de variables, las etiquetas de valores y los códigos de valores perdidos.', '* Ejecute SET UNICODE=ON. sin ningún conjunto de datos abierto antes de ejecutar este archivo.'],
  }[l];
  const lines = [...header, ''];
  lines.push("GET DATA /TYPE=TXT /FILE='synthetic_students_wide.csv' /ENCODING='UTF8'", '  /ARRANGEMENT=DELIMITED /DELIMITERS="," /QUALIFIER=\'"\' /FIRSTCASE=2', '  /VARIABLES=');
  WIDE.forEach((v, k) => lines.push(`    ${v.name} ${fmt(v)}${k === WIDE.length - 1 ? '.' : ''}`));
  lines.push('EXECUTE.', '', 'VARIABLE LABELS');
  WIDE.forEach((v, k) => lines.push(`  ${v.name} ${spssQuote(v.label[l])}${k === WIDE.length - 1 ? '.' : ' /'}`));
  const valueBlocks = [];
  for (const v of WIDE) {
    if (v.labels) valueBlocks.push(`  ${v.name} ${Object.entries(v.labels).map(([c, t]) => `${c} ${spssQuote(t[l])}`).join(' ')}`);
  }
  const items01 = WIDE.filter((v) => v.type === 'item01').map((v) => v.name);
  const wrongRight = { en: ['wrong', 'right'], tr: ['yanlış', 'doğru'], es: ['incorrecto', 'correcto'] }[l];
  valueBlocks.push(`  ${items01.join(' ')} 0 ${spssQuote(wrongRight[0])} 1 ${spssQuote(wrongRight[1])}`);
  const numeric = WIDE.filter((v) => v.type !== 'string').map((v) => v.name);
  const miss = Object.entries(MISSING_LABEL).map(([c, t]) => `${c} ${spssQuote(t[l])}`).join(' ');
  valueBlocks.push(`  ${numeric.join(' ')} ${miss}`);
  lines.push('', 'ADD VALUE LABELS', valueBlocks.join(' /\n') + '.');
  lines.push('', 'MISSING VALUES', `  ${numeric.join(' ')} (-99, -98, -97).`, '', 'EXECUTE.', '');
  return lines.join('\r\n');
}

const README = [
  'AI Code Feedback: codebook and SYNTHETIC sample data',
  '',
  'All data files in this folder are synthetic. They were generated by a script',
  'with a fixed seed for a fictional cohort of 25 students (8 weekly labs, 2030).',
  'They contain no real student data.',
  '',
  'codebook.csv / codebook.xlsx       every data item of the system, and every variable of the wide file',
  'synthetic_events_long.csv          one row per research event (payload fields as columns)',
  'synthetic_questions_long.csv       one row per question (no stored text)',
  'synthetic_students_wide.csv        one row per student, with the synthetic test and TAM scores',
  'synthetic_labels_en|tr|es.sps      SPSS syntax for the wide file (labels in English, Turkish or Spanish)',
  '',
  'In the long files, true and false are written as 1 and 0, and an empty cell means NULL.',
  'In the wide file, -99 = not applicable, -98 = not measured, -97 = not answered.',
  'TAM item scale and construct grouping are placeholders (TODO) until the real instrument is documented.',
  '',
].join('\r\n');

mkdirSync(OUT, { recursive: true });
const files = [];
const write = (name, data, info) => {
  writeFileSync(join(OUT, name), data);
  files.push({ file: name, bytes: Buffer.byteLength(data), ...info });
};
const itemCols = Object.keys(itemRows[0]);
write('codebook.csv', '﻿' + csv(itemRows, itemCols), { kind: 'codebook', rows: itemRows.length });
write('codebook.xlsx', xlsx([
  { name: 'items', rows: [itemCols, ...itemRows.map((r) => itemCols.map((c) => r[c]))] },
  { name: 'wide', rows: [Object.keys(wideCodebook[0]), ...wideCodebook.map((r) => Object.values(r))] },
]), { kind: 'codebook', rows: itemRows.length + wideCodebook.length });
write('synthetic_events_long.csv', csv(eventsLong), { kind: 'long', rows: eventsLong.length });
write('synthetic_questions_long.csv', csv(questionsLong), { kind: 'long', rows: questionsLong.length });
write('synthetic_students_wide.csv', csv(wide, WIDE.map((v) => v.name)), { kind: 'wide', rows: wide.length });
for (const l of LANGS) write(`synthetic_labels_${l}.sps`, spss(l), { kind: 'spss', lang: l });
write('README.txt', README, { kind: 'readme' });

writeFileSync(join(DATA, 'downloads.json'), JSON.stringify({ files, wideVariables: WIDE.map((v) => ({ name: v.name, src: v.src })), itemVariables: itemRows.map((r) => ({ variable: r.variable, item_id: r.item_id })) }, null, 1) + '\n');
writeFileSync(join(SAMPLE, 'wide.json'), JSON.stringify(wide, null, 1) + '\n');
console.log(`codebook: ${itemRows.length} items, ${WIDE.length} wide variables, ${eventsLong.length} events, ${questionsLong.length} questions, ${wide.length} students`);
