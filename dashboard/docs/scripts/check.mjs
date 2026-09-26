// Coverage and safety checks for the documentation site (npm run docs:check).
//
//  1. every inventory item has a name in English, Turkish and Spanish, and is
//     listed on its page in all three languages
//  2. every table, column, function, trigger, storage bucket and research event
//     type of the Supabase schema is in the inventory (the migrations are
//     replayed in an in-memory PGlite, nothing connects to the real project)
//  3. every English page has a Turkish and a Spanish version, and the reverse
//  4. every codebook variable exists in the inventory, and the reverse
//  5. every derived metric has a formula version, a changelog row and a formula
//     block on its data page
//  6. every data page has the eight sections in order
//  7. the numbers quoted on data pages still match the sample (frontmatter "sample:")
//  8. no secrets or real values in docs/: JWTs, service keys, the project URL and
//     key from the repository config, .env values, and (when DOCS_ACCOUNTS_FILE
//     points to the local list) the usernames of test and teacher accounts
//  9. no em-dashes or semicolons in the prose
// 10. no English interface text on Turkish and Spanish pages
//
// Values found by the secret scan are never printed, only the file and the kind.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { items as names, ui } from '../.vitepress/data/terms.ts';
import { dataSections, dataTree, draftPages, endPages, referencePages, researchPages, topPages } from '../.vitepress/data/site.ts';
import { cleaning, matrix, questions } from '../.vitepress/data/research.ts';
import { openDb } from './lib/pg.mjs';

const DOCS = join(dirname(fileURLToPath(import.meta.url)), '..');
// The site lives in dashboard/docs, two levels below the repository root.
const REPO = join(DOCS, '../..');
const SRC = join(DOCS, 'src');
const DATA = join(DOCS, '.vitepress/data');
const LANGS = ['en', 'tr', 'es'];
const read = (p) => readFileSync(p, 'utf8');
const inv = JSON.parse(read(join(DATA, 'inventory.json')));
const ids = new Set(inv.items.map((i) => i.id));

const failures = [];
const notes = [];
let checks = 0;
function check(group, ok, message) {
  checks++;
  if (!ok) failures.push(`[${group}] ${message}`);
}

const walk = (dir, filter = () => true) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p, filter) : filter(p) ? [p] : [];
  });
const pageFile = (lang, page) => join(SRC, lang === 'en' ? '' : lang, `${page}.md`);

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  const out = { items: [], sample: [] };
  if (!m) return out;
  let list = null;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      list = kv[2] === '' ? kv[1] : null;
      if (kv[2] !== '') out[kv[1]] = kv[2];
      continue;
    }
    const li = line.match(/^\s+-\s+(.*)$/);
    if (li && list) (out[list] ??= []).push(li[1]);
  }
  return out;
}

// ---------------------------------------------------------------- 3. pages in three languages
const enPages = walk(SRC, (p) => p.endsWith('.md') && !relative(SRC, p).match(/^(tr|es|public)\//)).map((p) => relative(SRC, p).replace(/\.md$/, ''));
for (const lang of ['tr', 'es']) {
  for (const page of enPages) check('languages', existsSync(pageFile(lang, page)), `${page}.md has no ${lang} version`);
  for (const p of walk(join(SRC, lang), (f) => f.endsWith('.md'))) {
    const page = relative(join(SRC, lang), p).replace(/\.md$/, '');
    check('languages', enPages.includes(page), `${lang}/${page}.md has no English version`);
  }
}
const sitePages = [...topPages, ...dataTree.flatMap((g) => g.pages.map((p) => `data/${g.category}/${p}`)), ...referencePages.map((p) => `reference/${p}`), ...researchPages, ...draftPages, ...endPages];
for (const page of sitePages) check('languages', enPages.includes(page), `page ${page} is in site.ts but has no file`);
for (const page of enPages) check('languages', sitePages.includes(page), `${page}.md is not in the sidebar (site.ts)`);

// ---------------------------------------------------------------- 1. items in three languages
for (const i of inv.items) {
  for (const l of LANGS) check('items', typeof names[i.id]?.[l] === 'string' && names[i.id][l].length > 0, `${i.id} has no ${l} name in terms.ts`);
  check('items', !!i.page, `${i.id} has no page`);
  if (i.page) for (const l of LANGS) check('items', existsSync(pageFile(l, i.page)), `${i.id}: page ${i.page} missing in ${l}`);
}
const dataPages = dataTree.flatMap((g) => g.pages.map((p) => `data/${g.category}/${p}`));
for (const page of dataPages) {
  const expected = inv.items.filter((i) => i.page === page).map((i) => i.id).sort();
  for (const l of LANGS) {
    const f = pageFile(l, page);
    if (!existsSync(f)) continue;
    const listed = (frontmatter(read(f)).items ?? []).slice().sort();
    for (const id of expected) check('items', listed.includes(id), `${l}/${page}: item ${id} is not listed in the frontmatter`);
    for (const id of listed) check('items', ids.has(id), `${l}/${page}: frontmatter item ${id} is not in the inventory`);
  }
}
for (const id of Object.keys(matrix)) check('items', ids.has(id), `research.ts matrix: unknown item ${id}`);
check('items', questions.length > 0 && cleaning.length === 14, 'research.ts: research questions or cleaning rules C1 to C14 missing');

// ---------------------------------------------------------------- 2. schema ⊆ inventory
{
  const { db, close } = await openDb(join(REPO, 'supabase/migrations'), Date.parse('2030-04-29T06:00:00Z'));
  const q = async (sql) => (await db.query(sql)).rows;
  const cols = await q(`select table_schema s, table_name t, column_name c from information_schema.columns
    where table_schema in ('public', 'dashboard') order by 1, 2, ordinal_position`);
  for (const r of cols) {
    const id = r.s === 'public' ? `${r.t}.${r.c}` : `${r.s}.${r.t}.${r.c}`;
    check('schema', ids.has(id), `column ${r.s}.${r.t}.${r.c} is not in the inventory`);
  }
  const tables = new Set(cols.map((r) => (r.s === 'public' ? r.t : `${r.s}.${r.t}`)));
  const invTables = new Set(inv.tables.map((t) => (t.schema === 'public' ? t.id : `${t.schema}.${t.id}`)));
  for (const t of tables) check('schema', invTables.has(t), `table ${t} is not in inventory.tables`);
  const fns = await q(`select n.nspname s, p.proname f from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname in ('public', 'dashboard')`);
  for (const r of fns) check('schema', ids.has(`function.${r.s}.${r.f}`), `function ${r.s}.${r.f} is not in the inventory`);
  const trg = await q(`select tgname t from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace
    where not t.tgisinternal and n.nspname in ('public', 'dashboard', 'auth')`);
  for (const r of trg) check('schema', ids.has(`function.trigger.${r.t}`), `trigger ${r.t} is not in the inventory`);
  const buckets = await q('select id from storage.buckets');
  for (const r of buckets) check('schema', ids.has(`storage.${r.id}`), `storage bucket ${r.id} is not in the inventory`);
  const views = await q(`select table_schema s, table_name t from information_schema.views where table_schema in ('public', 'dashboard')`);
  for (const r of views) check('schema', ids.has(`view.${r.s}.${r.t}`), `view ${r.s}.${r.t} is not in the inventory`);
  await close();
  // Research event types, as the extension sends them and log-event accepts them.
  const extTypes = [...read(join(REPO, 'extension/src/backend/researchEvents.ts')).matchAll(/\|\s*'([a-z_]+)'/g)].map((m) => m[1]);
  const fnBlock = read(join(REPO, 'supabase/functions/log-event/index.ts')).match(/ALLOWED_EVENT_TYPES = new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? '';
  const fnTypes = [...fnBlock.matchAll(/'([a-z_]+)'/g)].map((m) => m[1]);
  check('schema', extTypes.length > 0 && fnTypes.length > 0, 'could not read the research event types from the code');
  for (const t of new Set([...extTypes, ...fnTypes])) check('schema', ids.has(`event.${t}`), `event type ${t} is not in the inventory`);
  notes.push(`schema: ${cols.length} columns, ${tables.size} tables, ${fns.length} functions, ${trg.length} triggers, ${buckets.length} buckets, ${new Set([...extTypes, ...fnTypes]).size} event types`);
}

// ---------------------------------------------------------------- 4. codebook ↔ inventory
{
  const dl = JSON.parse(read(join(DATA, 'downloads.json')));
  const cb = new Set(dl.itemVariables.map((v) => v.item_id));
  for (const id of ids) check('codebook', cb.has(id), `inventory item ${id} is not in the codebook (run npm run docs:sample)`);
  for (const id of cb) check('codebook', ids.has(id), `codebook item ${id} is not in the inventory`);
  for (const v of dl.wideVariables) for (const s of v.src) check('codebook', ids.has(s), `wide variable ${v.name}: source ${s} is not in the inventory`);
  for (const f of dl.files) check('codebook', existsSync(join(SRC, 'public/downloads', f.file)), `download ${f.file} is missing`);
  const csv = read(join(SRC, 'public/downloads/codebook.csv')).replace(/^﻿/, '').split(/\r\n/).filter(Boolean);
  check('codebook', csv.length - 1 === ids.size, `codebook.csv has ${csv.length - 1} rows, the inventory has ${ids.size} items`);
}

// ---------------------------------------------------------------- 5. formula versions and changelog
{
  const changelog = LANGS.map((l) => read(pageFile(l, 'changelog')));
  for (const [k, text] of changelog.entries()) check('changelog', text.includes('<ChangelogTable'), `${LANGS[k]}/changelog.md does not render the changelog table`);
  for (const i of inv.items.filter((x) => x.kind === 'derived')) {
    check('changelog', /^\d+\.\d+$/.test(i.formula_version ?? ''), `${i.id} has no formula version`);
    if (!i.page) continue;
    for (const l of LANGS) {
      const f = pageFile(l, i.page);
      if (!existsSync(f)) continue;
      const blocks = [...read(f).matchAll(/<FormulaVersion ids="([^"]+)"/g)].flatMap((m) => m[1].split(','));
      check('changelog', blocks.includes(i.id), `${l}/${i.page}: derived item ${i.id} has no formula block`);
    }
  }
}

// ---------------------------------------------------------------- 6. eight sections, 7. sample drift
{
  const viewCache = {};
  const view = (name) => (viewCache[name] ??= JSON.parse(read(join(DATA, 'sample', `${name}.json`))));
  for (const page of dataPages) {
    for (const l of LANGS) {
      const f = pageFile(l, page);
      if (!existsSync(f)) continue;
      const text = read(f);
      const order = [...text.matchAll(/^## .*\{#([a-z-]+)\}\s*$/gm)].map((m) => m[1]).filter((id) => dataSections.includes(id));
      check('sections', JSON.stringify(order) === JSON.stringify(dataSections), `${l}/${page}: sections are [${order.join(', ')}]`);
      for (const line of frontmatter(text).sample ?? []) {
        const m = line.match(/^(views\/[\w.-]+)\.json#([\w.]+) = (.*)$/);
        if (!m) { check('sample', false, `${l}/${page}: cannot read sample line "${line}"`); continue; }
        const actual = m[2].split('.').reduce((o, k) => o?.[k], view(m[1]));
        check('sample', String(actual) === m[3], `${l}/${page}: ${m[1]}#${m[2]} is ${actual}, the page text uses ${m[3]} (run the page generator again)`);
      }
    }
  }
}

// ---------------------------------------------------------------- 8. secret scan
{
  const skip = /\/(node_modules|\.vitepress\/cache|\.vitepress\/dist)\//;
  const self = fileURLToPath(import.meta.url);
  const files = walk(DOCS, (p) => !skip.test(p) && p !== self && !/\.(png|jpg|ico|woff2?|xlsx)$/.test(p));
  // The xlsx is a zip of plain XML (stored, not compressed), so its text is scanned too.
  files.push(join(SRC, 'public/downloads/codebook.xlsx'));
  // The start of every JWT, built from pieces so that this file does not match a plain search.
  const JWT = ['ey', 'J'].join('');
  const secrets = [];
  const add = (kind, value) => value && value.length >= 6 && secrets.push({ kind, value });
  // Values from the repository config (public by design, but they must not be copied into docs/).
  for (const f of ['extension/src/constants.ts', 'dashboard/src/config.ts']) {
    const p = join(REPO, f);
    if (!existsSync(p)) continue;
    const text = read(p);
    for (const m of text.matchAll(/https:\/\/([a-z0-9]{12,})\.supabase\.co/g)) { add(`project URL (${f})`, m[0]); add(`project ref (${f})`, m[1]); }
    for (const m of text.matchAll(new RegExp(`['"\`](sb_publishable_[\\w-]+|${JWT}[\\w.-]{20,})['"\`]`, 'g'))) add(`key (${f})`, m[1]);
  }
  for (const f of ['.env', '.env.local', 'dashboard/.env', 'dashboard/.env.local', 'extension/.env', 'supabase/.env', 'supabase/functions/.env']) {
    const p = join(REPO, f);
    if (!existsSync(p)) continue;
    for (const m of read(p).matchAll(/^\s*[A-Z0-9_]+\s*=\s*["']?([^"'\s#]+)/gm)) add(`value from ${f}`, m[1]);
  }
  let accounts = 0;
  if (process.env.DOCS_ACCOUNTS_FILE && existsSync(process.env.DOCS_ACCOUNTS_FILE)) {
    for (const u of read(process.env.DOCS_ACCOUNTS_FILE).split(/[\s,;]+/).filter((x) => /^[a-z0-9][a-z0-9._-]{2,31}$/.test(x))) {
      secrets.push({ kind: 'test or teacher username', value: u, word: true });
      accounts++;
    }
  }
  const patterns = [
    ['JWT', new RegExp(`${JWT}[A-Za-z0-9_-]{10,}`)],
    ['service role', new RegExp(['service', 'role'].join('_'))],
    ['secret key', /sb_secret_[\w-]{6,}|sk-[A-Za-z0-9]{16,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}/],
    ['publishable key', /sb_publishable_[\w-]{6,}/],
    ['Supabase project URL', /https:\/\/[a-z0-9]{16,}\.supabase\.co/],
    ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ];
  for (const f of files) {
    const text = read(f);
    const rel = relative(DOCS, f);
    for (const [kind, re] of patterns) check('secrets', !re.test(text), `${rel}: contains a ${kind}`);
    for (const s of secrets) {
      const hit = s.word ? new RegExp(`(^|[^A-Za-z0-9._-])${s.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^A-Za-z0-9._-])`).test(text) : text.includes(s.value);
      check('secrets', !hit, `${rel}: contains a ${s.kind}`);
    }
  }
  notes.push(`secret scan: ${files.length} files, ${secrets.length} known values${accounts ? ` (${accounts} usernames)` : ''}`);
  if (!process.env.DOCS_ACCOUNTS_FILE) notes.push('secret scan: set DOCS_ACCOUNTS_FILE to the local list of test and teacher accounts to scan for those usernames too');
}

// ---------------------------------------------------------------- 9. style: no em-dashes, no semicolons
{
  const prose = (text) =>
    text
      .replace(/^---\n[\s\S]*?\n---\n/, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`\n]*`/g, '')
      .replace(/<[^>\n]+>/g, '')
      .replace(/&[a-z#0-9]+;/gi, '');
  for (const f of walk(SRC, (p) => p.endsWith('.md'))) {
    const text = prose(read(f));
    const rel = relative(SRC, f);
    check('style', !text.includes('—'), `${rel}: contains an em-dash`);
    check('style', !/;/.test(text), `${rel}: contains a semicolon`);
  }
  // Strings in the data files are page text too.
  for (const f of ['terms.ts', 'project.ts', 'research.ts', 'reference.ts', 'flow.ts']) {
    const strings = [...read(join(DATA, f)).matchAll(/'((?:[^'\\\n]|\\.)*)'/g)].map((m) => m[1]);
    for (const s of strings) {
      check('style', !s.includes('—'), `${f}: string contains an em-dash: ${s.slice(0, 50)}`);
      check('style', !s.includes(';'), `${f}: string contains a semicolon: ${s.slice(0, 50)}`);
    }
  }
}

// ---------------------------------------------------------------- 10. no English interface text on TR and ES pages
{
  // Section headings of the English pages must not appear on the other pages.
  for (const page of enPages) {
    const en = read(pageFile('en', page));
    const heads = [...en.matchAll(/^#{2,3} (.+?)(?:\s*\{#[\w-]+\})?\s*$/gm)].map((m) => m[1].trim()).filter((h) => /[a-z]{3}/i.test(h.replace(/`[^`]*`/g, '')));
    for (const l of ['tr', 'es']) {
      const f = pageFile(l, page);
      if (!existsSync(f)) continue;
      const other = new Set([...read(f).matchAll(/^#{2,3} (.+?)(?:\s*\{#[\w-]+\})?\s*$/gm)].map((m) => m[1].trim()));
      for (const h of heads) check('english', !other.has(h), `${l}/${page}: English heading "${h}"`);
      const title = frontmatter(read(f)).title;
      const enTitle = frontmatter(en).title;
      check('english', title !== enTitle || /^[a-z_]+$/.test(title) || page === 'index', `${l}/${page}: English title "${title}"`);
    }
  }
  // Interface strings in the built HTML (only when the site has been built).
  const dist = join(DOCS, '.vitepress/dist');
  if (existsSync(dist)) {
    const english = Object.values(ui).map((t) => t.en).filter((s, _, all) => s.length > 6 && /[a-z]/.test(s) && !Object.values(ui).some((t) => t.tr === s || t.es === s));
    const fixed = ['On this page', 'Copy Code', 'Permalink to', 'Previous page', 'Next page', 'Return to top', 'Skip to content', 'Main Navigation', 'Sidebar Navigation', 'Synthetic sample data'];
    for (const l of ['tr', 'es']) {
      for (const f of walk(join(dist, l), (p) => p.endsWith('.html'))) {
        const html = read(f).replace(/<script[\s\S]*?<\/script>/g, '').replace(/<code[\s\S]*?<\/code>/g, '').replace(/<pre[\s\S]*?<\/pre>/g, '');
        for (const s of new Set([...fixed, ...english])) {
          if (html.includes(`>${s}<`) || html.includes(`"${s}"`)) check('english', false, `${relative(dist, f)}: English text "${s}"`);
        }
      }
    }
    checks++;
  } else {
    notes.push('english: .vitepress/dist not found, run npm run docs:build first to check the built pages too');
  }
}

// ---------------------------------------------------------------- report
for (const n of notes) console.log(`  ${n}`);
if (failures.length) {
  console.error(`\ndocs:check found ${failures.length} problem(s) in ${checks} checks:`);
  for (const f of failures.slice(0, 200)) console.error(`  ${f}`);
  if (failures.length > 200) console.error(`  … and ${failures.length - 200} more`);
  process.exit(1);
}
console.log(`\ndocs:check passed: ${checks} checks.`);
