import { run } from './gen.mjs';
const files = process.argv.slice(2);
const pages = [];
for (const f of files) pages.push(...(await import(`./${f}`)).default);
const { anchors, matrix, purposes } = run(pages);
import { writeFileSync, readFileSync } from 'node:fs';
const prev = (() => { try { return JSON.parse(readFileSync('./out.json', 'utf8')); } catch { return { anchors: {}, matrix: {} }; } })();
writeFileSync('./out.json', JSON.stringify({ anchors: { ...prev.anchors, ...anchors }, matrix: { ...prev.matrix, ...matrix } }, null, 1));
// What each data page is for (the researcher question), for "Data at a glance".
// The trend page is written by hand, so its purpose is kept here.
purposes['data/indicators/independence-trend'] = {
  en: 'Does help-seeking fall, and does the first hint suffice more often over the weeks, for the class and for each student?',
  tr: 'Yardım isteme haftalar içinde azalıyor mu ve ilk ipucu daha sık yeterli oluyor mu? Bu, sınıf için ve her öğrenci için nasıl değişiyor?',
  es: '¿Disminuye la búsqueda de ayuda y basta la primera pista más a menudo con el tiempo, en la clase y en cada estudiante?',
};
writeFileSync(new URL('../../.vitepress/data/purposes.json', import.meta.url), JSON.stringify(purposes, null, 1) + '\n');
console.log('pages', pages.length);
