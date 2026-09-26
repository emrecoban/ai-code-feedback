// Writes the data pages (EN/TR/ES) from the page definitions in this folder.
// Numbers in the text come from the sample views; every number used is
// listed in the page frontmatter so docs:check can detect drift.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DOCS = fileURLToPath(new URL('../..', import.meta.url)).replace(/\/$/, '');
const SRC = join(DOCS, 'src');
const LANGS = ['en', 'tr', 'es'];
const anchorOf = (id) => id.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();

// Locale helpers the page texts use: dec(x, l) and pc(x, l).
export const dec = (x, l, d = 1) =>
  new Intl.NumberFormat({ en: 'en-US', tr: 'tr-TR', es: 'es-ES' }[l], { maximumFractionDigits: d, useGrouping: l !== 'es' || Math.abs(x) >= 10000 }).format(x);
export const pc = (x, l) => (l === 'tr' ? `%${dec(x, l)}` : `${dec(x, l)}%`);

const H = {
  example: { en: 'Example with one student', tr: 'Bir öğrenciyle örnek', es: 'Ejemplo con un estudiante' },
  visual: { en: 'On the sample data', tr: 'Örnek veride', es: 'En los datos de muestra' },
  purpose: { en: 'What it is for', tr: 'Ne işe yarar?', es: 'Para qué sirve' },
  raw: { en: 'Raw data sample', tr: 'Ham veri örneği', es: 'Muestra de datos brutos' },
  research: { en: 'Use in research', tr: 'Araştırmada kullanım', es: 'Uso en la investigación' },
  limits: { en: 'What this data does not show', tr: 'Bu verinin göstermedikleri', es: 'Lo que estos datos no muestran' },
  teacher: { en: 'For the teacher', tr: 'Öğretmen için', es: 'Para el profesorado' },
};
const L = {
  teacher: { en: 'Teacher', tr: 'Öğretmen', es: 'Profesorado' },
  researcher: { en: 'Researcher', tr: 'Araştırmacı', es: 'Investigación' },
  stage: { en: 'Stage', tr: 'Aşama', es: 'Etapa' },
  spss: { en: 'One value per student for SPSS', tr: 'SPSS için öğrenci başına tek değer', es: 'Un valor por estudiante para SPSS' },
  analysis: { en: 'Example analysis', tr: 'Örnek analiz', es: 'Análisis de ejemplo' },
  rqs: { en: 'Research questions', tr: 'Araştırma soruları', es: 'Preguntas de investigación' },
  noRq: {
    en: 'No draft research question uses this item as a variable yet.',
    tr: 'Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.',
    es: 'Todavía ninguna pregunta de investigación en borrador usa este dato como variable.',
  },
  sentence: { en: 'Example sentence (Method)', tr: 'Örnek cümle (Yöntem)', es: 'Frase de ejemplo (Método)' },
  inClass: { en: 'In class', tr: 'Derste', es: 'En clase' },
};
const q = { en: ['"', '"'], tr: ['"', '"'], es: ['«', '»'] };

function factsProxy(slug, used) {
  const view = JSON.parse(readFileSync(join(DOCS, '.vitepress/data/sample/views', `${slug}.json`), 'utf8'));
  return new Proxy(view.facts, {
    get(target, key) {
      if (!(key in target)) throw new Error(`${slug}: unknown fact ${String(key)}`);
      used.set(String(key), target[key]);
      return target[key];
    },
  });
}

const text = (v, l, f) => (typeof v === 'function' ? v(f, l) : typeof v?.[l] === 'function' ? v[l](f) : v[l]);

export function writePage(p) {
  const used = new Map();
  const f = factsProxy(p.view ?? p.slug, used);
  const bodies = {};
  for (const l of LANGS) {
    const out = [];
    out.push(`# ${p.title[l]}`, '');
    out.push(`## ${text(p.what.heading, l, f)} {#what}`, '', text(p.what.text, l, f), '');
    out.push(`## ${H.example[l]} {#example}`, '', text(p.example, l, f), '');
    out.push(`## ${H.visual[l]} {#visual}`, '', '<Figure>', `<ClientOnly><SampleVisual view="${p.view ?? p.slug}" /></ClientOnly>`, `<template #takeaway>${text(p.takeaway, l, f)}</template>`, '</Figure>', '');
    out.push(`## ${H.purpose[l]} {#purpose}`, '', `- **${L.teacher[l]}:** ${text(p.purpose.teacher, l, f)}`, `- **${L.researcher[l]}:** ${text(p.purpose.researcher, l, f)}`, '');
    out.push(`## ${H.raw[l]} {#raw}`, '', text(p.raw.intro, l, f), '');
    for (const sn of p.raw.snippets) {
      out.push(`${text(sn.caption, l, f)}:`, '', `<<< @/../.vitepress/data/sample/snippets/${sn.name}.json`, '');
    }
    for (const fm of p.formulas ?? []) {
      out.push(`### ${text(fm.heading, l, f)} {#${fm.anchor ?? anchorOf(fm.id)}}`, '', text(fm.text, l, f), '', `<FormulaVersion ids="${fm.id}" />`, '');
    }
    out.push(`## ${H.research[l]} {#research}`, '');
    out.push(`- **${L.stage[l]}:** ${text(p.research.stage, l, f)}`);
    out.push(`- **${L.spss[l]}:** ${text(p.research.spss, l, f)}`);
    out.push(`- **${L.analysis[l]}:** ${text(p.research.analysis, l, f)}`, '');
    const rqIds = Object.keys(p.rq ?? {});
    out.push(`**${L.rqs[l]}**`, '');
    out.push(rqIds.length ? `<RqList ids="${rqIds.join(',')}" />` : L.noRq[l], '');
    out.push(`**${L.sentence[l]}:** ${q[l][0]}${text(p.research.sentence, l, f)}${q[l][1]}`, '');
    out.push(`## ${H.limits[l]} {#limits}`, '', text(p.limits, l, f), '');
    out.push(`## ${H.teacher[l]} {#teacher}`, '', `::: tip ${L.inClass[l]}`, text(p.teacher, l, f), ':::', '');
    bodies[l] = out.join('\n');
  }
  for (const l of LANGS) {
    const fmLines = ['---', `title: ${p.title[l]}`, 'items:', ...p.items.map((i) => `  - ${i}`)];
    if (used.size) fmLines.push('sample:', ...[...used].map(([k, v]) => `  - views/${p.view ?? p.slug}.json#facts.${k} = ${v}`));
    fmLines.push('---', '', '');
    const file = join(SRC, l === 'en' ? '' : l, 'data', p.category, `${p.slug}.md`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, fmLines.join('\n') + bodies[l]);
  }
  return {
    anchors: Object.fromEntries((p.formulas ?? []).map((fm) => [fm.id, fm.anchor ?? anchorOf(fm.id)])),
    rq: p.rq ?? {},
    purpose: Object.fromEntries(LANGS.map((l) => [l, text(p.purpose.researcher, l, f)])),
  };
}

export function run(pages) {
  const anchors = {};
  const matrix = {};
  const purposes = {};
  for (const p of pages) {
    const r = writePage(p);
    Object.assign(anchors, r.anchors);
    Object.assign(matrix, r.rq);
    purposes[`data/${p.category}/${p.slug}`] = r.purpose;
  }
  return { anchors, matrix, purposes };
}
