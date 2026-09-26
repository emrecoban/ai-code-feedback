// Page views: the chart data and the numbers each data page shows, built from
// the synthetic rows and from the dashboard's own SQL output (sample.mjs).
// Only descriptive summaries are computed here (counts, bins, medians of
// synthetic rows); every metric of the dashboard comes from its SQL.
//
// Labels in a view are references, resolved in the page's language by
// .vitepress/theme/components/SampleVisual.vue:
//   {ui: key} · {item: inventoryId} · {val: [namespace, code]} · {en, tr, es}
//   or a plain string for language-neutral text (codes, file names, numbers).

const median = (xs) => {
  const s = xs.filter((x) => x != null).sort((a, b) => a - b);
  if (!s.length) return null;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const mean = (xs) => {
  const s = xs.filter((x) => x != null);
  return s.length ? s.reduce((a, b) => a + b, 0) / s.length : null;
};
const quantile = (xs, q) => {
  const s = xs.filter((x) => x != null).sort((a, b) => a - b);
  if (!s.length) return null;
  const pos = (s.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return s[lo] + (s[hi] - s[lo]) * (pos - lo);
};
const r1 = (x) => (x == null ? null : Math.round(x * 10) / 10);
const pct = (part, whole) => (whole ? r1((100 * part) / whole) : null);
const T = (en, tr, es) => ({ en, tr, es });
const pick = (o, keys) => Object.fromEntries(keys.map((k) => [k, o[k]]));

export function buildViews(ctx) {
  const { rows, clean, panel, question, analytics, withoutEmpty, summaryHistory, FEATURED, weekStart, WEEKS, OFFSET_H } = ctx;
  const F = FEATURED;
  const cohort = ctx.students.map((s) => s.code);
  const idOf = Object.fromEntries(ctx.students.map((s) => [s.code, s.userId]));
  // Raw rows of the cohort only, with the typo account merged into S12 (rules C1-C3).
  const codeOfUser = new Map(ctx.students.map((s) => [s.userId, s.code]));
  codeOfUser.set(ctx.s12x.userId, 'S12');
  const cohortRows = (table) =>
    rows[table].filter((r) => codeOfUser.has(r.user_id)).map((r) => ({ ...r, code: codeOfUser.get(r.user_id) }));
  const I = cohortRows('interactions');
  const S = cohortRows('coding_sessions');
  const E = cohortRows('events');
  const byCode = (list, code) => list.filter((r) => r.code === code);
  const weekOf = (iso) => Math.floor((Date.parse(iso) - weekStart(1)) / (7 * 86_400_000)) + 1;
  const localHM = (iso) => new Date(Date.parse(iso) + OFFSET_H * 3_600_000).toISOString().slice(11, 16);
  const localDay = (iso) => new Date(Date.parse(iso) + OFFSET_H * 3_600_000).toISOString().slice(0, 10);
  const weeks = Array.from({ length: WEEKS }, (_, k) => k + 1);
  const stu = (code) => clean.byStudent[code];
  const W = (code, f) => stu(code).weeks.map(f);
  const classMean = (f) => weeks.map((_, k) => r1(mean(cohort.map((c) => f(stu(c).weeks[k])))));
  const band = (f) => ({
    lo: weeks.map((_, k) => r1(quantile(cohort.map((c) => f(stu(c).weeks[k])), 0.25))),
    hi: weeks.map((_, k) => r1(quantile(cohort.map((c) => f(stu(c).weeks[k])), 0.75))),
  });
  const weekly = (unit, f, opts = {}) => ({
    type: 'weekly', unit, featured: W(F, f).map(r1), class: classMean(f), band: band(f), classLabel: 'classMean', ...opts,
  });
  const hist = (values, edges, labels, featuredValue, unit = 'count') => {
    const bins = labels.map((label) => ({ label, count: 0 }));
    const idx = (v) => edges.findIndex((e, i) => v >= e && (i === edges.length - 1 || v < edges[i + 1]));
    for (const v of values) if (v != null && idx(v) >= 0) bins[idx(v)].count++;
    if (featuredValue != null && idx(featuredValue) >= 0) bins[idx(featuredValue)].featured = true;
    return { type: 'hist', unit, bins };
  };
  const perStudent = (f) => cohort.map((c) => f(c));
  const eventsOf = (type, list = E) => list.filter((e) => e.event_type === type);
  const snippets = {};
  const snip = (name, list, keys) => (snippets[name] = list.map((r) => (keys ? pick(r, keys) : r)));
  const views = {};
  const fI = byCode(I, F);
  const fS = byCode(S, F);
  const fE = byCode(E, F);
  const fDetail = stu(F);
  const classEng = clean.engagement;
  const fEng = fDetail.engagement;
  const sessionKeys = ['id', 'user_id', 'started_at', 'last_seen_at'];
  const questionKeys = ['id', 'session_id', 'user_id', 'created_at'];
  const eventKeys = ['id', 'session_id', 'user_id', 'interaction_id', 'event_type', 'client_event_id', 'payload', 'client_ts', 'server_ts'];
  const withIds = (list) => list.map((e, k) => ({ id: 1000 + rows.events.indexOf(rows.events.find((x) => x.client_event_id === e.client_event_id)), ...e }));

  // ---------------------------------------------------------------- accounts
  {
    const profiles = rows.profiles;
    const count = (s) => profiles.filter((p) => p.consent_status === s).length;
    const p = rows.profiles.find((x) => x.id === idOf[F]);
    views['consent-status'] = {
      visual: { type: 'bars', unit: 'count', series: ['class'], rows: ['granted', 'declined', 'pending'].map((c) => ({ label: { val: ['consent_status', c] }, class: count(c) })) },
      facts: { accounts: profiles.length, granted: count('granted'), declined: count('declined'), pending: count('pending'), featuredTime: localHM(p.consent_at), version: '2026-08-v1' },
    };
    snip('consent-status.profiles', [p], ['id', 'username', 'consent_status', 'consent_at']);
    snip('consent-status.consent_log', rows.consent_log.filter((c) => c.user_id === idOf[F]));
  }
  {
    const final = cohort.map((c) => rows.profiles.find((p) => p.id === idOf[c]).feedback_language);
    const changes = eventsOf('feedback_language_changed');
    views['feedback-language'] = {
      visual: { type: 'bars', unit: 'count', series: ['class'], rows: ['tr', 'en', 'es'].map((lang) => ({ label: { val: ['language', lang] }, class: final.filter((x) => x === lang).length })) },
      facts: { tr: final.filter((x) => x === 'tr').length, en: final.filter((x) => x === 'en').length, es: final.filter((x) => x === 'es').length, changes: changes.length, exampleStudent: changes[0].code, exampleWeek: weekOf(changes[0].server_ts), exampleFrom: changes[0].payload.from, exampleTo: changes[0].payload.to, featuredLanguage: rows.profiles.find((p) => p.id === idOf[F]).feedback_language },
    };
    snip('feedback-language.profiles', [rows.profiles.find((p) => p.id === idOf[F])], ['id', 'username', 'feedback_language']);
    snip('feedback-language.event', withIds([changes[0]]), eventKeys);
  }

  // ---------------------------------------------------------------- asking
  {
    const share = (list, src) => pct(list.filter((q) => q.trigger_source === src).length, list.length);
    views['trigger-source'] = {
      visual: { type: 'bars', unit: 'pct', series: ['featured', 'class'], rows: ['diagnostic', 'selection'].map((src) => ({ label: { val: ['trigger_source', src] }, featured: share(fI, src), class: share(I, src) })) },
      facts: { featuredQuestions: fI.length, featuredDiagnostic: fI.filter((q) => q.trigger_source === 'diagnostic').length, featuredSelection: fI.filter((q) => q.trigger_source === 'selection').length, classDiagnosticPct: share(I, 'diagnostic'), classQuestions: I.length },
    };
    snip('trigger-source', [fI.find((q) => q.trigger_source === 'diagnostic'), fI.find((q) => q.trigger_source === 'selection')], [...questionKeys, 'trigger_source', 'question_type', 'trigger_surface']);
  }
  {
    const surfaces = classEng.surfaces.filter((s) => s.surface !== 'unknown');
    const total = classEng.surfaces.reduce((a, s) => a + s.questions, 0);
    const fTotal = fEng.surfaces.reduce((a, s) => a + s.questions, 0);
    const fOf = (surface) => fEng.surfaces.find((s) => s.surface === surface)?.questions ?? 0;
    views['trigger-surface'] = {
      visual: { type: 'bars', unit: 'pct', series: ['featured', 'class'], rows: surfaces.map((s) => ({ label: { val: ['trigger_surface', s.surface] }, featured: pct(fOf(s.surface), fTotal), class: pct(s.questions, total) })) },
      facts: { topSurface: surfaces[0].surface, topPct: pct(surfaces[0].questions, total), keybindingPct: pct(surfaces.find((s) => s.surface === 'selection_keybinding')?.questions ?? 0, total), featuredTop: [...fEng.surfaces].sort((a, b) => b.questions - a.questions)[0].surface },
    };
    snip('trigger-surface', [fI.find((q) => q.trigger_surface === 'diagnostic_codelens'), fI.find((q) => q.trigger_source === 'selection')], [...questionKeys, 'trigger_source', 'trigger_surface']);
  }
  {
    const rep = analytics.question_type_resolution;
    views['question-type'] = {
      visual: {
        type: 'table',
        columns: [{ item: 'interactions.question_type' }, { ui: 'colQuestions' }, { item: 'metric.hint_enough_pct' }, { val: ['max_level_reached', 'rule'] }, { val: ['max_level_reached', 'fix'] }],
        rows: rep.map((r) => [{ val: ['question_type', r.question_type] }, Number(r.total_interactions), { pct: Number(r.pct_resolved_independently) }, Number(r.needed_rule), Number(r.needed_fix)]),
      },
      facts: {
        whatDoesThisMean: Number(rep.find((r) => r.question_type === 'what_does_this_mean')?.total_interactions ?? 0),
        whatsWrongHintPct: Number(rep.find((r) => r.question_type === 'whats_wrong')?.pct_resolved_independently ?? 0),
        whyWorksHintPct: Number(rep.find((r) => r.question_type === 'why_works')?.pct_resolved_independently ?? 0),
        sidebarDefault: I.filter((q) => q.trigger_surface === 'sidebar_button' || q.trigger_surface === 'command_palette').length,
        whatDoesThisDo: I.filter((q) => q.question_type === 'what_does_this_do').length,
        ...Object.fromEntries(['what_does_this_mean', 'what_does_this_do', 'why_works', 'whats_wrong', 'simpler_example', 'free_text'].map((t) => [`featured_${t}`, fI.filter((q) => q.question_type === t).length])),
        featuredSidebar: fI.filter((q) => q.trigger_surface === 'sidebar_button' || q.trigger_surface === 'command_palette').length,
      },
    };
    snip('question-type', [fI.find((q) => q.question_type === 'what_does_this_mean'), fI.find((q) => q.trigger_source === 'selection')], [...questionKeys, 'trigger_source', 'question_type']);
  }
  {
    const free = I.filter((q) => q.question_type === 'free_text');
    const examples = ['en', 'tr', 'es'].map((lang) => free.find((q) => q._lang === lang)).filter(Boolean);
    views['own-question'] = {
      visual: {
        type: 'table',
        columns: [{ ui: 'student' }, { item: 'interactions.free_text' }, { ui: 'characters' }, { item: 'interactions.max_level_reached' }],
        rows: examples.map((q) => [q.code, q.free_text, q.free_text.length, { val: ['max_level_reached', q.max_level_reached >= 3 ? 'fix' : q.max_level_reached === 2 ? 'rule' : 'hint'] }]),
      },
      facts: { exampleStudent: examples[0].code, exampleText: examples[0].free_text, exampleLength: examples[0].free_text.length, freeText: free.length, selection: I.filter((q) => q.trigger_source === 'selection').length, pctOfSelection: pct(free.length, I.filter((q) => q.trigger_source === 'selection').length), meanLength: Math.round(mean(free.map((q) => q.free_text.length))), featured: byCode(free, F).length },
    };
    snip('own-question', [examples[0]], [...questionKeys, 'trigger_source', 'question_type', 'free_text']);
  }
  {
    const sel = I.filter((q) => q.trigger_source === 'selection');
    const lines = sel.map((q) => q.selection_line_count);
    const fLines = byCode(sel, F).map((q) => q.selection_line_count);
    views['selection-size'] = {
      visual: hist(lines, [1, 2, 4, 7, 16, 41], ['1', '2–3', '4–6', '7–15', '16–40', '41+'], median(fLines)),
      facts: { selection: sel.length, measured: lines.filter((x) => x != null).length, missing: lines.filter((x) => x == null).length, classMedian: median(lines), featuredMedian: median(fLines), featuredSelections: fLines.length },
    };
    snip('selection-size', sel.filter((q) => q.code === F && q.selection_line_count != null).slice(0, 2), [...questionKeys, 'trigger_source', 'selection_line_count', 'selection_char_count']);
  }
  {
    const errs = clean.insights.errors.slice(0, 8);
    const sev = classEng.errors.severity;
    views['error-type'] = {
      visual: { type: 'bars', unit: 'count', series: ['class'], rows: errs.map((e) => ({ label: e.label, class: e.questions })) },
      facts: { featuredMessage: fI.find((q) => q.trigger_source === 'diagnostic' && q.error_code).error_signature, featuredCode: fI.find((q) => q.trigger_source === 'diagnostic' && q.error_code).error_code, featuredSeverity: fI.find((q) => q.trigger_source === 'diagnostic' && q.error_code).error_severity, top: errs[0].label, topQuestions: errs[0].questions, topStudents: errs[0].students, errors: sev.error ?? 0, warnings: sev.warning ?? 0, withoutCode: I.filter((q) => q.trigger_source === 'diagnostic' && !q.error_code).length },
    };
    snip('error-type', [fI.find((q) => q.trigger_source === 'diagnostic' && q.error_code)], [...questionKeys, 'error_signature', 'error_source', 'error_code', 'error_severity', 'file_name']);
  }
  {
    const ab = eventsOf('question_picker_abandoned');
    const fab = byCode(ab, F);
    views['question-picker-abandoned'] = {
      visual: { type: 'bars', unit: 'count', series: ['featured', 'class'], rows: ['preset', 'free_text'].map((st) => ({ label: { val: ['picker_stage', st] }, featured: fab.filter((e) => e.payload.stage === st).length, class: ab.filter((e) => e.payload.stage === st).length })) },
      facts: { preset: classEng.before.picker_abandoned.preset, freeText: classEng.before.picker_abandoned.free_text, featured: fab.length, selection: I.filter((q) => q.trigger_source === 'selection').length },
    };
    snip('question-picker-abandoned', withIds(ab.slice(0, 1)), eventKeys);
  }

  // ---------------------------------------------------------------- before asking
  {
    views['help-offers'] = {
      visual: weekly('count', (w) => w.activity.help_offers),
      facts: { featuredTotal: fDetail.activity.help_offers, featuredWeek1: fDetail.weeks[0].activity.help_offers, featuredWeek8: fDetail.weeks[7].activity.help_offers, classMeanTotal: Math.round(mean(cohort.map((c) => stu(c).activity.help_offers))) },
    };
    snip('help-offers', fS.slice(0, 2), [...sessionKeys, 'diagnostics_offered']);
  }
  {
    const lat = (w) => (w.before.median_help_latency_ms == null ? null : w.before.median_help_latency_ms / 1000);
    views['help-latency'] = {
      visual: { type: 'weekly', unit: 'sec', featured: W(F, lat).map(r1), class: clean.weekly.map((w) => r1(lat(w.engagement))), classLabel: 'class' },
      facts: { classMedianSec: Math.round(classEng.before.median_help_latency_ms / 1000), featuredMedianSec: Math.round(fEng.before.median_help_latency_ms / 1000), withLatency: classEng.before.with_latency, questions: I.length },
    };
    snip('help-latency', fI.filter((q) => q.help_latency_ms != null).slice(0, 2), [...questionKeys, 'trigger_surface', 'help_latency_ms', 'edits_before_ask']);
  }
  {
    const edits = I.map((q) => q.edits_before_ask);
    views['edits-before-asking'] = {
      visual: hist(edits, [0, 1, 2, 3, 5, 8], ['0', '1', '2', '3–4', '5–7', '8+'], fDetail.help.avg_edits_before_ask),
      facts: { classMedian: classEng.before.median_edits_before_ask, featuredAvg: fDetail.help.avg_edits_before_ask, measured: edits.filter((x) => x != null).length, eightPlus: edits.filter((x) => x != null && x >= 8).length },
    };
    snip('edits-before-asking', fI.filter((q) => q.edits_before_ask != null).slice(0, 2), [...questionKeys, 'help_latency_ms', 'edits_before_ask']);
  }
  {
    const share = (w) => pct(w.help.repeat_errors, w.help.questions);
    const pair = (() => {
      for (const q of fI) {
        const later = fI.find((x) => x.error_signature_normalized && x.error_signature_normalized === q.error_signature_normalized && x.recurring_error_count === 1 && q.recurring_error_count === 0);
        if (later) return [q, later];
      }
      return fI.slice(0, 2);
    })();
    views['repeated-error'] = {
      visual: { type: 'weekly', unit: 'pct', featured: W(F, share), class: clean.weekly.map((w) => pct(w.engagement.before.repeats, w.overview.questions)), classLabel: 'class' },
      facts: { pairMessage: pair[0].error_signature, pairNormalized: pair[0].error_signature_normalized, pairWeek1: weekOf(pair[0].created_at), pairWeek2: weekOf(pair[1].created_at), featuredRepeats: fDetail.help.repeat_errors, featuredQuestions: fDetail.help.questions, classRepeats: classEng.before.repeats, classQuestions: I.length, maxRepeat: Math.max(...I.map((q) => q.recurring_error_count)) },
    };
    snip('repeated-error', pair, [...questionKeys, 'error_signature', 'error_signature_normalized', 'recurring_error_count']);
  }
  {
    const since = I.filter((q) => q.ms_since_previous_same_error != null).map((q) => q.ms_since_previous_same_error / 60_000);
    const fSince = byCode(I, F).filter((q) => q.ms_since_previous_same_error != null).map((q) => q.ms_since_previous_same_error / 60_000);
    const edges = [0, 10, 60, 1440, 10080];
    const bins = [T('under 10 min', '10 dk altı', 'menos de 10 min'), T('10–60 min', '10–60 dk', '10–60 min'), T('1–24 h', '1–24 sa', '1–24 h'), T('1–7 days', '1–7 gün', '1–7 días'), T('over 7 days', '7 günden fazla', 'más de 7 días')];
    const count = (list, i) => list.filter((m) => m >= edges[i] && (i === edges.length - 1 || m < edges[i + 1])).length;
    views['time-since-same-error'] = {
      visual: { type: 'bars', unit: 'pct', series: ['featured', 'class'], rows: bins.map((label, i) => ({ label, featured: pct(count(fSince, i), fSince.length), class: pct(count(since, i), since.length) })) },
      facts: { repeats: since.length, quick: classEng.before.quick_repeats, quickPct: pct(classEng.before.quick_repeats, since.length), featuredRepeats: fSince.length, featuredQuick: fSince.filter((m) => m < 10).length },
    };
    snip('time-since-same-error', fI.filter((q) => q.ms_since_previous_same_error != null).slice(0, 1), [...questionKeys, 'error_signature_normalized', 'recurring_error_count', 'ms_since_previous_same_error']);
  }
  {
    const concepts = fDetail.concepts;
    const classConcepts = clean.insights.concepts;
    // The same idea, written by the model in three feedback languages.
    const spellings = ['type conversion', 'tür dönüşümü', 'conversión de tipos'].map((c) => ({ concept: c, n: I.filter((q) => q.concept.toLowerCase() === c).length }));
    void classConcepts;
    views['recurring-concept'] = {
      visual: { type: 'bars', unit: 'count', series: ['featured'], rows: concepts.map((c) => ({ label: c.concept, featured: c.count })) },
      facts: { featuredTop: concepts[0].concept, featuredTopCount: concepts[0].count, typeConversionEn: spellings[0].n, typeConversionTr: spellings[1].n, typeConversionEs: spellings[2].n, maxRecurring: Math.max(...fI.map((q) => q.recurring_concept_count)) },
    };
    snip('recurring-concept', fI.filter((q) => q.recurring_concept_count > 0).slice(0, 1), [...questionKeys, 'title', 'concept', 'recurring_concept_count']);
  }

  // ---------------------------------------------------------------- hint ladder
  {
    const lv = (h) => ({ hint: h.hint, rule: h.rule, fix: h.fix });
    const classLevels = clean.overview.levels;
    views['hint-depth'] = {
      visual: { type: 'stacked', parts: ['hint', 'rule', 'fix'].map((k) => ({ key: k, label: { val: ['max_level_reached', k] } })), rows: [{ label: F, values: lv(fDetail.help) }, { label: { ui: 'class' }, values: lv(classLevels) }] },
      facts: { classHint: classLevels.hint, classRule: classLevels.rule, classFix: classLevels.fix, classQuestions: clean.overview.questions, classFixPct: pct(classLevels.fix, clean.overview.questions), featuredHint: fDetail.help.hint, featuredRule: fDetail.help.rule, featuredFix: fDetail.help.fix, featuredQuestions: fDetail.help.questions, levelOne: I.filter((q) => q.max_level_reached === 1).length },
    };
    snip('hint-depth', [fI.find((q) => q.max_level_reached === 0), fI.find((q) => q.max_level_reached === 3)], [...questionKeys, 'trigger_source', 'max_level_reached']);
  }
  {
    const created = Date.parse(question.created_at);
    const labels = {
      level_reached: (p) => ({ item: `event.level_reached`, suffix: `L${p.level}` }),
    };
    const events = question.events.map((e) => ({ ms: Date.parse(e.at) - created, type: e.type, level: e.payload.level ?? null }));
    const levelEvents = question.events.filter((e) => e.type === 'level_reached');
    views['level-timing'] = {
      visual: { type: 'timeline', events: [{ ms: 0, type: 'asked' }, ...events].sort((a, b) => a.ms - b.ms) },
      facts: {
        toRuleSec: Math.round(levelEvents.find((e) => e.payload.level === 2).payload.msSinceCreated / 1000),
        toFixSec: Math.round(levelEvents.find((e) => e.payload.level === 3).payload.msSinceCreated / 1000),
        classToRuleSec: Math.round(classEng.reading.median_ms_to_rule / 1000),
        classToFixSec: Math.round(classEng.reading.median_ms_to_fix / 1000),
        title: question.title,
      },
    };
    void labels;
    snip('level-timing', withIds(E.filter((e) => e.interaction_id === question.id && e.event_type === 'level_reached')), eventKeys);
  }
  {
    const q = rows.interactions.find((x) => x.id === question.id);
    const degraded = I.filter((x) => x._degraded).length;
    views['explanation'] = {
      visual: { type: 'card', title: question.title, blocks: ['L0', 'L1', 'L2', 'L3'].map((lv) => ({ label: { val: ['ladder', lv] }, text: lv === 'L0' ? q.ladder_payload.l0_decode : lv === 'L1' ? q.ladder_payload.l1_locate : lv === 'L2' ? `${q.ladder_payload.l2_concept.rule}\n${q.ladder_payload.l2_concept.example}` : `${q.ladder_payload.l3_fix.change}\n${q.ladder_payload.l3_fix.why}` })) },
      facts: { title: question.title, degraded, questions: I.length, cacheHits: I.filter((x) => x.cache_hit).length },
    };
    snip('explanation', [{ ...pick(q, ['id', 'title', 'concept']), ladder_payload: q.ladder_payload }]);
  }

  // ---------------------------------------------------------------- reading and acting
  {
    const vis = eventsOf('explanation_visibility');
    const secs = vis.map((e) => e.payload.visibleMs / 1000);
    const fSecs = byCode(vis, F).map((e) => e.payload.visibleMs / 1000);
    views['time-on-screen'] = {
      visual: hist(secs, [0, 10, 30, 60, 120, 300], [T('under 10 s', '10 sn altı', 'menos de 10 s'), '10–30 s', '30–60 s', T('1–2 min', '1–2 dk', '1–2 min'), T('2–5 min', '2–5 dk', '2–5 min'), T('over 5 min', '5 dk üstü', 'más de 5 min')], median(fSecs)),
      facts: { classMedianSec: Math.round(classEng.reading.median_visible_ms / 1000), featuredMedianSec: Math.round(median(fSecs)), measured: classEng.reading.measured, explanations: classEng.reading.explanations, onScreenPct: pct(classEng.reading.visible_at_delivery, classEng.reading.measured) },
    };
    snip('time-on-screen', withIds(byCode(vis, F).slice(0, 1)), eventKeys);
  }
  {
    const ret = eventsOf('returned_to_code');
    const med = (list, lv) => r1(median(list.filter((e) => e.payload.level === lv).map((e) => e.payload.msToReturn / 1000)));
    views['back-to-code'] = {
      visual: { type: 'bars', unit: 'sec', series: ['featured', 'class'], rows: [1, 2, 3].map((lv) => ({ label: { val: ['shown_level', String(lv)] }, featured: med(byCode(ret, F), lv), class: med(ret, lv) })) },
      facts: { classMedianSec: Math.round(classEng.reading.median_ms_to_return / 1000), featuredMedianSec: Math.round(fEng.reading.median_ms_to_return / 1000), returns: ret.length, explanations: I.length },
    };
    snip('back-to-code', withIds(byCode(ret, F).slice(0, 1)), eventKeys);
  }
  {
    const ab = eventsOf('feedback_abandoned');
    views['left-without-acting'] = {
      visual: { type: 'bars', unit: 'count', series: ['featured', 'class'], rows: ['timeout', 'session_end'].map((r) => ({ label: { val: ['abandon_reason', r] }, featured: byCode(ab, F).filter((e) => e.payload.reason === r).length, class: ab.filter((e) => e.payload.reason === r).length })) },
      facts: { classAbandoned: classEng.reading.abandoned, explanations: classEng.reading.explanations, abandonedPct: pct(classEng.reading.abandoned, classEng.reading.explanations), featuredAbandoned: fEng.reading.abandoned },
    };
    snip('left-without-acting', withIds(ab.slice(0, 1)), eventKeys);
  }
  {
    const ed = eventsOf('post_feedback_edit');
    const fed = byCode(ed, F);
    views['edit-after-fix'] = {
      visual: hist(ed.map((e) => e.payload.overlapRatio), [0, 0.2, 0.4, 0.6, 0.8], ['0–0.2', '0.2–0.4', '0.4–0.6', '0.6–0.8', '0.8–1'], mean(fed.map((e) => e.payload.overlapRatio)), 'count'),
      facts: { edited: classEng.after.edited, onLinePct: pct(classEng.after.on_line, classEng.after.edited), overlapPct: classEng.after.avg_overlap_pct, fixQuestions: clean.overview.levels.fix, featuredEdited: fEng.after.edited, featuredOverlapPct: fEng.after.avg_overlap_pct },
    };
    snip('edit-after-fix', withIds(fed.slice(0, 1)), eventKeys);
  }
  {
    views['fix-undone'] = {
      visual: {
        type: 'table',
        columns: ['', { item: 'metric.after_edited' }, { item: 'metric.after_undone' }],
        rows: [[{ ui: 'class' }, classEng.after.edited, classEng.after.undone], [F, fEng.after.edited, fEng.after.undone]],
      },
      facts: { undone: classEng.after.undone, edited: classEng.after.edited, featuredUndone: fEng.after.undone },
    };
    snip('fix-undone', withIds(eventsOf('fix_undone').slice(0, 1)), eventKeys);
  }
  {
    const byLevel = classEng.reading.copied_by_level;
    const cp = eventsOf('explanation_copied');
    views['copied'] = {
      visual: { type: 'bars', unit: 'count', series: ['class'], rows: ['L0', 'L1', 'L2', 'L3', 'unknown'].map((lv) => ({ label: lv === 'unknown' ? { val: ['misc', 'unknown'] } : { val: ['ladder', lv] }, class: byLevel[lv] ?? 0 })) },
      facts: { copiedQuestions: classEng.reading.copied, copyEvents: cp.length, fromFix: byLevel.L3 ?? 0, featured: fEng.reading.copied },
    };
    snip('copied', withIds(cp.filter((e) => e.payload.level === 'L3').slice(0, 1)), eventKeys);
  }
  {
    const re = eventsOf('explanation_reopened');
    const days = re.map((e) => (Date.parse(e.server_ts) - Date.parse(I.find((q) => q.id === e.interaction_id).created_at)) / 86_400_000);
    views['reopened'] = {
      visual: hist(days, [0, 1, 2, 4, 8], [T('same day', 'aynı gün', 'el mismo día'), T('1 day', '1 gün', '1 día'), T('2–3 days', '2–3 gün', '2–3 días'), T('4–7 days', '4–7 gün', '4–7 días'), T('over 7 days', '7 günden fazla', 'más de 7 días')], null),
      facts: { reopened: classEng.reading.reopened, events: re.length, explanations: classEng.reading.explanations, featured: fEng.reading.reopened },
    };
    snip('reopened', withIds(re.slice(0, 1)), eventKeys);
  }

  // ---------------------------------------------------------------- outcomes
  {
    const lvLabel = { 1: 'hint', 2: 'rule', 3: 'fix' };
    const row = (res, lv) => res.by_level.find((x) => x.level === lv);
    views['error-gone'] = {
      visual: { type: 'bars', unit: 'pct', series: ['featured', 'class'], rows: [1, 2, 3].map((lv) => ({ label: { val: ['max_level_reached', lvLabel[lv]] }, featured: row(fEng.resolution, lv) ? pct(row(fEng.resolution, lv).resolved, row(fEng.resolution, lv).questions) : null, class: pct(row(classEng.resolution, lv).resolved, row(classEng.resolution, lv).questions) })) },
      facts: { classResolved: classEng.resolution.resolved, classQuestions: classEng.resolution.questions, classPct: pct(classEng.resolution.resolved, classEng.resolution.questions), classMedianSec: Math.round(classEng.resolution.median_ms / 1000), featuredResolved: fEng.resolution.resolved, featuredQuestions: fEng.resolution.questions },
    };
    snip('error-gone', withIds(byCode(eventsOf('diagnostic_resolved'), F).slice(0, 1)), eventKeys);
  }
  {
    views['fixed-without-asking'] = {
      visual: weekly('count', (w) => w.activity.fixed_unaided),
      facts: { featuredTotal: fDetail.activity.fixed_unaided, featuredWeek1: fDetail.weeks[0].activity.fixed_unaided, featuredWeek8: fDetail.weeks[7].activity.fixed_unaided, classMean: Math.round(mean(cohort.map((c) => stu(c).activity.fixed_unaided))), panelValue: panel[F].errorsFixedWithoutAsking, workedOut: panel[F].errorsWorkedOutYourself },
    };
    snip('fixed-without-asking', fS.filter((c) => c.active_seconds > 0).slice(0, 2), [...sessionKeys, 'diagnostics_offered', 'errors_resolved_without_asking']);
  }
  {
    const epf = (e) => (e.fixed_unaided ? r1(e.silent_edits / e.fixed_unaided) : null);
    views['edits-per-unaided-fix'] = {
      visual: { type: 'bars', unit: 'count', series: ['featured', 'class'], rows: [
        { label: { item: 'metric.edits_per_unaided_fix' }, featured: epf(fEng.errors), class: epf(classEng.errors) },
        { label: { item: 'metric.avg_edits_before_ask' }, featured: fDetail.help.avg_edits_before_ask, class: r1(mean(I.map((q) => q.edits_before_ask))) },
      ] },
      facts: { classEpf: epf(classEng.errors), featuredEpf: epf(fEng.errors), classFixed: classEng.errors.fixed_unaided, classEdits: classEng.errors.silent_edits },
    };
    snip('edits-per-unaided-fix', fS.filter((c) => c.errors_resolved_without_asking > 0).slice(0, 2), [...sessionKeys, 'errors_resolved_without_asking', 'silent_resolution_edits']);
  }
  {
    views['follow-on-errors'] = {
      visual: weekly('count', (w) => w.activity.follow_on_errors),
      facts: { featuredTotal: fDetail.activity.follow_on_errors, classTotal: classEng.errors.follow_on, classFixed: classEng.errors.fixed_unaided },
    };
    snip('follow-on-errors', fS.filter((c) => c.follow_on_error_count > 0).slice(0, 2), [...sessionKeys, 'errors_resolved_without_asking', 'follow_on_error_count']);
  }
  {
    const fc = byCode(eventsOf('file_cleared'), F).slice(-5).reverse();
    views['files-worked-through'] = {
      visual: {
        type: 'table',
        columns: [{ item: 'event.file_cleared.fileName' }, { item: 'event.file_cleared.msWithErrors' }, { item: 'event.file_cleared.editsWhileErrors' }, { item: 'event.file_cleared.diagnosticsSeen' }, { item: 'event.file_cleared.diagnosticsAsked' }],
        rows: fc.map((e) => [e.payload.fileName, { min: e.payload.msWithErrors / 60_000 }, e.payload.editsWhileErrors, e.payload.diagnosticsSeen, e.payload.diagnosticsAsked]),
      },
      facts: { exFile: fc[0].payload.fileName, exMin: r1(fc[0].payload.msWithErrors / 60_000), exEdits: fc[0].payload.editsWhileErrors, exSeen: fc[0].payload.diagnosticsSeen, exAsked: fc[0].payload.diagnosticsAsked, featuredEpisodes: byCode(eventsOf('file_cleared'), F).length, classEpisodes: eventsOf('file_cleared').length, medianMin: r1(median(eventsOf('file_cleared').map((e) => e.payload.msWithErrors / 60_000))) },
    };
    snip('files-worked-through', withIds(fc.slice(0, 1)), eventKeys);
  }
  {
    const r = classEng.runs;
    const fr = fEng.runs;
    views['running-code'] = {
      visual: {
        type: 'table',
        columns: ['', { item: 'event.run_finished' }, { item: 'event.run_finished.success' }, { val: ['misc', 'afterExplanation'] }],
        rows: [[{ ui: 'class' }, r.total, r.success, r.after_explanation], [F, fr.total, fr.success, fr.after_explanation]],
      },
      facts: { runs: r.total, success: r.success, after: r.after_explanation, debugRuns: classEng.habits.debug_runs, taskRuns: classEng.habits.task_runs, featuredRuns: fr.total },
    };
    snip('running-code', withIds(eventsOf('run_finished').slice(0, 1)), eventKeys);
  }

  // ---------------------------------------------------------------- self-report
  {
    const counts = (list) => ({ up: list.filter((q) => q.helpful_rating === 1).length, down: list.filter((q) => q.helpful_rating === -1).length, none: list.filter((q) => q.helpful_rating == null).length, n: list.length });
    const c = counts(I);
    const f = counts(fI);
    views['helpful-rating'] = {
      visual: { type: 'bars', unit: 'pct', series: ['featured', 'class'], rows: [['up', 'rating', 'up'], ['down', 'rating', 'down'], ['none', 'misc', 'notAnswered']].map(([k, ns, code]) => ({ label: { val: [ns, code] }, featured: pct(f[k], f.n), class: pct(c[k], c.n) })) },
      facts: { up: c.up, down: c.down, none: c.none, n: c.n, answeredPct: pct(c.up + c.down, c.n), ratedHelpfulPct: pct(c.up, c.up + c.down), featuredUp: f.up, featuredDown: f.down },
    };
    snip('helpful-rating', fI.filter((q) => q.helpful_rating != null).slice(0, 2), [...questionKeys, 'helpful_rating']);
  }
  {
    const byLv = (k) => I.filter((q) => (k === 'hint' ? q.max_level_reached <= 1 : k === 'rule' ? q.max_level_reached === 2 : q.max_level_reached >= 3));
    views['outcome'] = {
      visual: { type: 'stacked', parts: [['solved', 'outcome', 'solved'], ['still_stuck', 'outcome', 'still_stuck'], ['none', 'misc', 'notAnswered']].map(([key, ns, code]) => ({ key, label: { val: [ns, code] } })), rows: ['hint', 'rule', 'fix'].map((k) => ({ label: { val: ['max_level_reached', k] }, values: { solved: byLv(k).filter((q) => q.self_reported_outcome === 'solved').length, still_stuck: byLv(k).filter((q) => q.self_reported_outcome === 'still_stuck').length, none: byLv(k).filter((q) => q.self_reported_outcome == null).length } })) },
      facts: { solved: I.filter((q) => q.self_reported_outcome === 'solved').length, stuck: I.filter((q) => q.self_reported_outcome === 'still_stuck').length, answeredPct: pct(I.filter((q) => q.self_reported_outcome != null).length, I.length), featuredSolved: fDetail.help.solved, featuredStuck: fDetail.help.still_stuck },
    };
    snip('outcome', fI.filter((q) => q.self_reported_outcome != null).slice(0, 2), [...questionKeys, 'max_level_reached', 'self_reported_outcome']);
  }
  {
    const cal = clean.insights.calibration;
    views['confidence'] = {
      visual: { type: 'bars', unit: 'pct', series: ['class'], rows: cal.map((c) => ({ label: { val: ['confidence', c.answer] }, class: pct(c.asked_again, c.total) })) },
      facts: Object.fromEntries(cal.flatMap((c) => [[`${c.answer}Total`, c.total], [`${c.answer}AgainPct`, pct(c.asked_again, c.total)]]).concat([['featuredYes', fDetail.help.confident_yes], ['featuredMaybe', fDetail.help.confident_maybe], ['featuredNo', fDetail.help.confident_no]])),
    };
    snip('confidence', fI.filter((q) => q.post_confidence != null).slice(0, 2), [...questionKeys, 'post_confidence']);
  }

  // ---------------------------------------------------------------- coding activity
  const emptySessions = S.filter((c) => c.active_seconds === 0);
  {
    views['sessions'] = {
      visual: weekly('count', (w) => w.activity.sessions),
      facts: { featuredSessions: fDetail.activity.sessions, classMeanSessions: r1(mean(cohort.map((c) => stu(c).activity.sessions))), avgMinutes: classEng.habits.avg_session_minutes, emptySessions: emptySessions.length, allSessions: S.length, featuredEmpty: byCode(emptySessions, F).length },
    };
    snip('sessions', fS.slice(0, 2), ['id', 'user_id', 'course_id', 'started_at', 'last_seen_at', 'ended_at', 'extension_version', 'vscode_version', 'os']);
  }
  {
    const days = perStudent((c) => stu(c).activity.active_days);
    views['active-days'] = {
      visual: hist(days, [0, 6, 9, 12, 15, 18], ['1–5', '6–8', '9–11', '12–14', '15–17', '18+'], fDetail.activity.active_days),
      facts: { featured: fDetail.activity.active_days, panel: panel[F].daysUsingThis, classMedian: median(days), labs: 8 },
    };
    snip('active-days', fS.slice(0, 3), ['id', 'user_id', 'started_at']);
  }
  {
    views['active-time'] = {
      visual: weekly('min', (w) => w.activity.active_seconds / 60),
      facts: { featuredHours: r1(fDetail.activity.active_seconds / 3600), classMeanHours: r1(mean(cohort.map((c) => stu(c).activity.active_seconds / 3600))), panelHours: panel[F].totalActiveHours },
    };
    snip('active-time', fS.filter((c) => c.active_seconds > 0).slice(0, 2), [...sessionKeys, 'active_seconds']);
  }
  {
    views['lines'] = {
      visual: weekly('count', (w) => w.activity.lines_written),
      facts: { featuredWritten: fDetail.activity.lines_written, featuredDeleted: fDetail.activity.lines_deleted, classMeanWritten: Math.round(mean(cohort.map((c) => stu(c).activity.lines_written))) },
    };
    snip('lines', fS.filter((c) => c.active_seconds > 0).slice(0, 2), [...sessionKeys, 'lines_written', 'lines_deleted']);
  }
  {
    const files = perStudent((c) => stu(c).activity.files_created);
    views['files-created'] = {
      visual: hist(files, [0, 3, 6, 9, 12], ['0–2', '3–5', '6–8', '9–11', '12+'], fDetail.activity.files_created),
      facts: { featured: fDetail.activity.files_created, classMedian: median(files) },
    };
    snip('files-created', fS.filter((c) => c.files_created > 0).slice(0, 2), [...sessionKeys, 'files_created']);
  }
  {
    const langs = fDetail.languages;
    const total = langs.reduce((a, x) => a + Number(x.edits), 0);
    views['languages-edited'] = {
      visual: { type: 'bars', unit: 'count', series: ['featured'], rows: langs.map((x) => ({ label: x.language, featured: Number(x.edits) })) },
      facts: { pythonPct: pct(Number(langs.find((x) => x.language === 'python')?.edits ?? 0), total), languages: langs.length },
    };
    {
      // One session with several languages and one other session, never the same row twice.
      const multi = fS.find((c) => Object.keys(c.language_counts).length > 1);
      const other = fS.find((c) => c !== multi && c.active_seconds > 0);
      snip('languages-edited', [multi, other].filter(Boolean), [...sessionKeys, 'language_counts']);
    }
  }
  {
    const pastes = perStudent((c) => stu(c).activity.large_pastes);
    views['large-pastes'] = {
      visual: hist(pastes, [0, 1, 2, 4, 7], ['0', '1', '2–3', '4–6', '7+'], fDetail.activity.large_pastes),
      facts: { featured: fDetail.activity.large_pastes, withAny: pastes.filter((x) => x > 0).length, maxStudent: Math.max(...pastes), lines: classEng.habits.large_paste_lines },
    };
    snip('large-pastes', S.filter((c) => c.large_paste_count > 0).slice(0, 1), [...sessionKeys, 'large_paste_count', 'large_paste_lines', 'lines_written']);
  }
  {
    views['left-vscode'] = {
      visual: weekly('count', (w) => w.habits.focus_losses),
      facts: { featuredLosses: fEng.habits.focus_losses, featuredAwayMin: Math.round(fEng.habits.unfocused_seconds / 60), classMeanLosses: Math.round(mean(cohort.map((c) => stu(c).engagement.habits.focus_losses))) },
    };
    snip('left-vscode', fS.filter((c) => c.active_seconds > 0).slice(0, 2), [...sessionKeys, 'focus_loss_count', 'unfocused_seconds']);
  }
  {
    views['saves'] = {
      visual: weekly('count', (w) => w.activity.saves),
      facts: { featured: fDetail.activity.saves, classMean: Math.round(mean(cohort.map((c) => stu(c).activity.saves))) },
    };
    snip('saves', fS.filter((c) => c.active_seconds > 0).slice(0, 2), [...sessionKeys, 'save_count']);
  }
  {
    views['debug-and-task-runs'] = {
      visual: weekly('count', (w) => w.activity.debug_runs),
      facts: { featuredDebug: fDetail.activity.debug_runs, featuredTasks: fDetail.activity.task_runs, classTasks: classEng.habits.task_runs, classDebug: classEng.habits.debug_runs },
    };
    snip('debug-and-task-runs', fS.filter((c) => c.active_seconds > 0).slice(0, 2), [...sessionKeys, 'debug_session_count', 'task_run_count']);
  }
  {
    const gaps = S.filter((c) => c.active_seconds > 0).map((c) => c.idle_gap_count);
    views['breaks'] = {
      visual: hist(gaps, [0, 1, 2, 3, 4, 6], ['0', '1', '2', '3', '4–5', '6+'], median(byCode(S, F).filter((c) => c.active_seconds > 0).map((c) => c.idle_gap_count))),
      facts: { classAvg: classEng.habits.avg_breaks, featuredAvg: fEng.habits.avg_breaks, sessions: gaps.length },
    };
    snip('breaks', fS.filter((c) => c.active_seconds > 0).slice(0, 2), [...sessionKeys, 'idle_gap_count', 'active_seconds']);
  }
  {
    views['file-switches'] = {
      visual: weekly('count', (w) => w.habits.editor_switches),
      facts: { featuredSwitches: fEng.habits.editor_switches, featuredFiles: fEng.habits.files_visited, classMeanSwitches: Math.round(mean(cohort.map((c) => stu(c).engagement.habits.editor_switches))) },
    };
    snip('file-switches', fS.filter((c) => c.active_seconds > 0).slice(0, 2), [...sessionKeys, 'editor_switch_count', 'files_visited']);
  }

  // ---------------------------------------------------------------- learner summaries
  {
    const lp = rows.learner_profiles.find((x) => x.user_id === idOf[F]);
    views['ai-learning-summary'] = {
      visual: { type: 'card', blocks: [{ label: { item: 'learner_profiles.student_summary' }, text: lp.student_summary }] },
      facts: { writtenDay: localDay(lp.summary_generated_at), language: rows.profiles.find((p) => p.id === idOf[F]).feedback_language, withSummary: rows.learner_profiles.filter((x) => codeOfUser.has(x.user_id) && x.student_summary).length },
    };
    snip('ai-learning-summary', [pick(lp, ['user_id', 'student_summary', 'summary_generated_at'])]);
    views['suggested-practice'] = {
      visual: { type: 'card', blocks: [{ label: { item: 'learner_profiles.suggested_practice' }, text: lp.suggested_practice }] },
      facts: { writtenDay: localDay(lp.summary_generated_at) },
    };
    snip('suggested-practice', [pick(lp, ['user_id', 'suggested_practice', 'summary_generated_at'])]);
    const hist = summaryHistory[idOf[F]];
    views['private-notes'] = {
      visual: { type: 'table', columns: [{ ui: 'rewrite' }, { ui: 'date' }, { item: 'learner_profiles.interactions_since_update' }], rows: hist.map((h, k) => [k + 1, localDay(h.at), h.newQuestions]) },
      facts: { rewrites: hist.length, current: lp.interactions_since_update, featuredQuestions: fI.length, cacheHits: fI.filter((q) => q.cache_hit).length },
    };
    snip('private-notes', [pick(lp, ['user_id', 'summary', 'interactions_since_update', 'summary_generated_at', 'updated_at'])]);
  }

  // ---------------------------------------------------------------- indicators
  {
    const values = clean.students.map((s) => (s.questions ? pct(s.solved_alone, s.questions) : null));
    const fRow = clean.students.find((s) => s.user_id === F);
    views['hint-was-enough'] = {
      visual: hist(values, [0, 20, 40, 60, 80], ['0–20%', '20–40%', '40–60%', '60–80%', '80–100%'], pct(fRow.solved_alone, fRow.questions)),
      facts: { classPct: pct(clean.overview.levels.hint, clean.overview.questions), featuredPct: pct(fRow.solved_alone, fRow.questions), featuredSolvedAlone: fRow.solved_alone, featuredQuestions: fRow.questions },
    };
    snip('hint-was-enough', [fRow].map((r) => pick(r, ['user_id', 'username', 'questions', 'solved_alone'])));
  }
  {
    const pc = (h) => pct(h.without_help, h.sessions);
    views['sessions-without-help'] = {
      visual: { type: 'bars', unit: 'pct', series: ['featured', 'class'], rows: [
        { label: { val: ['misc', 'allSessions'] }, featured: pc(fEng.habits), class: pc(classEng.habits) },
        { label: { val: ['misc', 'withoutEmpty'] }, featured: pc(withoutEmpty.featured), class: pc(withoutEmpty.class) },
      ] },
      facts: { classPct: pc(classEng.habits), classPctNoEmpty: pc(withoutEmpty.class), featuredPct: pc(fEng.habits), featuredPctNoEmpty: pc(withoutEmpty.featured), sessions: classEng.habits.sessions, sessionsNoEmpty: withoutEmpty.class.sessions },
    };
    snip('sessions-without-help', fS.filter((c) => c.active_seconds === 0).slice(0, 1).concat(fS.filter((c) => c.active_seconds > 0).slice(0, 1)), [...sessionKeys, 'active_seconds']);
  }
  {
    const att = clean.overview.attention.filter((a) => cohort.includes(a.user_id));
    const last = clean.weekly[7].attention.filter((a) => cohort.includes(a.user_id));
    const reasons = ['repeat_error', 'still_stuck', 'needs_fix', 'many_attempts', 'unhelpful', 'inactive'];
    views['needs-attention'] = {
      // Students per reason over the whole range and in the last week alone:
      // the rule flags almost everyone over eight weeks, far fewer in one week.
      visual: { type: 'table', columns: [{ ui: 'reasons' }, { ui: 'allWeeks' }, { ui: 'lastWeekOnly' }], rows: reasons.map((r) => [{ val: ['attention', r] }, att.filter((a) => a.reasons.includes(r)).length, last.filter((a) => a.reasons.includes(r)).length]) },
      facts: { flagged: att.length, cohort: cohort.length, stillStuck: att.filter((a) => a.reasons.includes('still_stuck')).length, featuredFlagged: att.some((a) => a.user_id === F) ? 1 : 0, lastWeekFlagged: last.length, featuredLastWeek: last.some((a) => a.user_id === F) ? 1 : 0 },
    };
    snip('needs-attention', att.slice(0, 1));
  }
  {
    views['online-and-active'] = {
      visual: { type: 'columns', unit: 'count', x: weeks.map(String), values: clean.weekly.map((w) => w.overview.active_students), xLabel: { ui: 'week' } },
      facts: { active: clean.overview.active_students, total: clean.overview.students_total, week1: clean.weekly[0].overview.active_students, week8: clean.weekly[7].overview.active_students },
    };
    snip('online-and-active', [pick(clean.students.find((s) => s.user_id === F), ['user_id', 'username', 'last_active'])]);
  }
  {
    views['questions-over-time'] = {
      visual: { type: 'columns', unit: 'count', x: weeks.map(String), values: clean.weekly.map((w) => w.overview.questions), featured: W(F, (w) => w.help.questions), xLabel: { ui: 'week' } },
      facts: { total: clean.overview.questions, week1: clean.weekly[0].overview.questions, week8: clean.weekly[7].overview.questions, featured: fDetail.help.questions, featuredWeek1: fDetail.weeks[0].help.questions, featuredWeek8: fDetail.weeks[7].help.questions },
    };
    snip('questions-over-time', clean.overview.series.filter((s) => s.questions > 0).slice(0, 2));
  }
  {
    const cs = clean.insights.concepts.slice(0, 8);
    views['concepts-and-errors'] = {
      visual: { type: 'bars', unit: 'count', series: ['class'], rows: cs.map((c) => ({ label: c.concept, class: c.questions })) },
      facts: {
        top: cs[0].concept, topQuestions: cs[0].questions, topStudents: cs[0].students,
        topError: clean.insights.errors[0].label, topErrorQuestions: clean.insights.errors[0].questions, topErrorStudents: clean.insights.errors[0].students,
        trStudents: cohort.filter((c) => rows.profiles.find((p) => p.id === idOf[c]).feedback_language === 'tr').length,
      },
    };
    snip('concepts-and-errors', clean.insights.concepts.slice(0, 2));
  }
  {
    const cells = clean.insights.rhythm.questions;
    const peak = [...cells].sort((a, b) => b[2] - a[2])[0];
    const labHours = cells.filter(([d, h]) => d === 2 && h >= 10 && h <= 11).reduce((a, c) => a + c[2], 0);
    views['work-rhythm'] = {
      visual: { type: 'heatmap', cells },
      facts: { peakDay: peak[0], peakHour: peak[1], labPct: pct(labHours, clean.overview.questions) },
    };
    snip('work-rhythm', cells.slice(0, 3));
  }
  {
    const p = panel[F];
    const keys = [['explanationsAskedFor', 'metric.ext_explanations_asked'], ['errorsWorkedOutYourself', 'metric.ext_errors_worked_out'], ['daysUsingThis', 'metric.ext_days_using'], ['totalActiveHours', 'metric.ext_activity_totals'], ['linesWritten', 'coding_sessions.lines_written'], ['linesDeleted', 'coding_sessions.lines_deleted'], ['filesCreated', 'coding_sessions.files_created'], ['errorsFixedWithoutAsking', 'coding_sessions.errors_resolved_without_asking']];
    views['student-panel'] = {
      visual: { type: 'table', columns: [{ ui: 'panelNumber' }, F], rows: keys.map(([k, id]) => [{ val: ['panel', k] }, k === 'totalActiveHours' ? { hour: p[k] } : p[k]]) },
      facts: { ...p },
    };
    snippets['student-panel'] = null;
  }

  // ---------------------------------------------------------------- AI service
  {
    const h = clean.insights.health;
    const lat = I.filter((q) => q.latency_ms != null).map((q) => q.latency_ms / 1000);
    views['response-time'] = {
      visual: hist(lat, [0, 2, 3, 4, 5, 6, 8], ['0–2 s', '2–3 s', '3–4 s', '4–5 s', '5–6 s', '6–8 s', '8+ s'].slice(0, 7), null),
      facts: { avgSec: r1(h.latency_avg / 1000), p50Sec: r1(h.latency_p50 / 1000), p95Sec: r1(h.latency_p95 / 1000), measured: lat.length, cacheHits: h.cache_hits },
    };
    snip('response-time', fI.filter((q) => !q.cache_hit).slice(0, 1).concat(fI.filter((q) => q.cache_hit).slice(0, 1)), [...questionKeys, 'cache_hit', 'model_used', 'latency_ms']);
  }
  {
    const h = clean.insights.health;
    views['tokens'] = {
      visual: { type: 'columns', unit: 'count', x: weeks.map(String), values: clean.weekly.map((w) => w.health.prompt_tokens + w.health.completion_tokens), xLabel: { ui: 'week' } },
      facts: { prompt: h.prompt_tokens, completion: h.completion_tokens, total: h.prompt_tokens + h.completion_tokens, perAnswer: Math.round((h.prompt_tokens + h.completion_tokens) / (h.questions - h.cache_hits)) },
    };
    snip('tokens', fI.filter((q) => !q.cache_hit).slice(0, 1), [...questionKeys, 'prompt_tokens', 'completion_tokens']);
  }
  {
    const h = clean.insights.health;
    const reused = rows.explanations.filter((x) => x.reuse_count > 0);
    views['cache'] = {
      visual: { type: 'table', columns: [{ item: 'metric.questions' }, { item: 'interactions.cache_hit' }, { item: 'metric.cache_rate' }, { item: 'explanations.reuse_count' }], rows: [[h.questions, h.cache_hits, { pct: pct(h.cache_hits, h.questions) }, reused.reduce((a, x) => a + x.reuse_count, 0)]] },
      facts: { questions: h.questions, hits: h.cache_hits, ratePct: pct(h.cache_hits, h.questions), cacheRows: rows.explanations.length, reusedRows: reused.length },
    };
    snip('cache', rows.explanations.filter((x) => x.reuse_count > 0).slice(0, 1).map(({ payload, ...x }) => x));
  }
  {
    const fails = classEng.failures;
    views['failed-requests'] = {
      visual: { type: 'bars', unit: 'count', series: ['class'], rows: fails.map((f) => ({ label: f.code ? { val: ['failureCode', f.code] } : { val: ['failure', f.kind] }, class: f.n })) },
      facts: { failures: clean.insights.health.failures, questions: clean.insights.health.questions, ratePct: pct(clean.insights.health.failures, clean.insights.health.questions + clean.insights.health.failures) },
    };
    snip('failed-requests', withIds(eventsOf('request_failed').slice(0, 1)), eventKeys);
  }
  {
    const uc = rows.usage_counters.filter((u) => codeOfUser.has(u.user_id));
    views['usage-limits'] = {
      visual: hist(uc.map((u) => u.requests), [1, 3, 5, 8, 12, 20], ['1–2', '3–4', '5–7', '8–11', '12–19', '20+'], null),
      facts: { hours: uc.length, maxPerHour: Math.max(...uc.map((u) => u.requests)), defaultHourly: 40, defaultDaily: 200 },
    };
    snip('usage-limits', uc.filter((u) => u.user_id === idOf[F]).slice(0, 2));
  }

  return { views, snippets };
}
