// Offline, instructor-side ingestion (base spec §7.2): turns ONE markdown
// file into a full course record -- courses, course_weeks, and the
// controlled concept_vocabulary rows those weeks reference. This is
// deliberately not a runtime feature of the extension; it's a script the
// instructor (or a TA with backend access) runs once per course, and
// re-runs whenever the .md file changes.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
//     node supabase/scripts/import-course.ts supabase/seed/sample-course.md
//
// Re-running for the same course code REPLACES that course's weeks
// entirely (idempotent on the .md file's content, not additive) -- edit
// the file and re-run rather than trying to patch the database by hand.

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

interface CourseMeta {
  code: string;
  name: string;
  prog_language: string;
  runtime_note: string | null;
  run_command: string | null;
  error_surface: 'diagnostics' | 'runtime' | 'both';
  start_date: string;
  week_length_days: number;
  forbidden_concepts: string[];
}

interface ParsedWeek {
  weekNo: number;
  title: string;
  concepts: Array<{ id: string; label: string }>;
  notes: string | null;
}

const CONCEPT_ID_PATTERN = /^[a-z][a-z0-9_]*$/;

function main(): void {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    fail('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables first.\n' +
      'Find them at https://supabase.com/dashboard/project/<ref>/settings/api -- use the\n' +
      'service_role key, not the publishable/anon key (this script needs to bypass RLS).');
  }

  const filePath = process.argv[2];
  if (!filePath) {
    fail('Usage: node supabase/scripts/import-course.ts <path-to-course.md>');
  }

  const raw = readFileSync(filePath, 'utf8');
  const { frontmatter, body } = splitFrontmatter(raw);
  const course = parseFrontmatter(frontmatter);
  const weeks = parseWeeks(body);
  validate(course, weeks);

  void run(SUPABASE_URL!, SERVICE_ROLE_KEY!, course, weeks);
}

async function run(url: string, serviceRoleKey: string, course: CourseMeta, weeks: ParsedWeek[]): Promise<void> {
  const client = createClient(url, serviceRoleKey);

  const { data: courseRow, error: courseErr } = await client
    .from('courses')
    .upsert(course, { onConflict: 'code' })
    .select('id')
    .single();
  if (courseErr || !courseRow) fail(`Could not upsert course: ${courseErr?.message}`);
  const courseId = courseRow!.id as string;

  const { error: deleteErr } = await client.from('course_weeks').delete().eq('course_id', courseId);
  if (deleteErr) fail(`Could not clear existing weeks: ${deleteErr.message}`);

  for (const week of weeks) {
    const { error } = await client.from('course_weeks').insert({
      course_id: courseId,
      week_no: week.weekNo,
      title: week.title,
      concepts: week.concepts.map((c) => c.id),
      notes: week.notes,
    });
    if (error) fail(`Could not insert Week ${week.weekNo}: ${error.message}`);
  }

  const seenConceptIds = new Set<string>();
  for (const week of weeks) {
    for (const concept of week.concepts) {
      if (seenConceptIds.has(concept.id)) continue;
      seenConceptIds.add(concept.id);
      // Upserts label_en only -- label_tr/label_es aren't in this file
      // format and are left alone if an instructor has filled them in
      // separately, rather than being overwritten with null each import.
      const { error } = await client
        .from('concept_vocabulary')
        .upsert({ id: concept.id, prog_language: course.prog_language, label_en: concept.label }, { onConflict: 'id' });
      if (error) fail(`Could not upsert concept "${concept.id}": ${error.message}`);
    }
  }

  console.log(`Imported "${course.name}" (${course.code}): ${weeks.length} weeks, ${seenConceptIds.size} concepts.`);
}

function splitFrontmatter(raw: string): { frontmatter: string; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) fail('Missing a --- frontmatter block at the top of the file (see the sample course.md).');
  return { frontmatter: match![1], body: match![2] };
}

function parseFrontmatter(text: string): CourseMeta {
  const fields: Record<string, string> = {};
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(':');
    if (idx === -1) fail(`Malformed frontmatter line (expected "key: value"): "${line}"`);
    fields[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }

  for (const key of ['code', 'name', 'prog_language', 'start_date']) {
    if (!fields[key]) fail(`Frontmatter is missing required field "${key}".`);
  }
  const errorSurface = fields.error_surface ?? 'both';
  if (!['diagnostics', 'runtime', 'both'].includes(errorSurface)) {
    fail(`error_surface must be "diagnostics", "runtime", or "both" -- got "${errorSurface}".`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.start_date)) {
    fail(`start_date must be YYYY-MM-DD -- got "${fields.start_date}".`);
  }

  return {
    code: fields.code,
    name: fields.name,
    prog_language: fields.prog_language,
    runtime_note: fields.runtime_note ?? null,
    run_command: fields.run_command ?? null,
    error_surface: errorSurface as CourseMeta['error_surface'],
    start_date: fields.start_date,
    week_length_days: fields.week_length_days ? Number(fields.week_length_days) : 7,
    forbidden_concepts: splitList(fields.forbidden_concepts),
  };
}

function parseWeeks(body: string): ParsedWeek[] {
  const sections = body.split(/\n(?=## )/g).filter((s) => s.trim().startsWith('## '));
  if (sections.length === 0) fail('No "## Week N: Title" sections found.');

  const weeks = sections.map((section) => {
    const heading = section.match(/^## Week (\d+):\s*(.+)$/m);
    if (!heading) fail(`Could not parse a week heading in:\n${section.slice(0, 80)}`);
    const weekNo = Number(heading![1]);
    const title = heading![2].trim();

    const concepts: Array<{ id: string; label: string }> = [];
    const conceptsBlock = section.match(/Concepts:\s*\n((?:\s*-\s*.+\n?)+)/);
    if (conceptsBlock) {
      for (const line of conceptsBlock[1].split('\n')) {
        const item = line.trim().replace(/^-\s*/, '');
        if (!item) continue;
        const [idPart, ...labelParts] = item.split(':');
        const id = idPart.trim();
        const label = labelParts.join(':').trim() || id;
        if (!CONCEPT_ID_PATTERN.test(id)) {
          fail(`Invalid concept id "${id}" in Week ${weekNo} -- use lowercase_with_underscores, starting with a letter.`);
        }
        concepts.push({ id, label });
      }
    }

    const notesMatch = section.match(/Notes:\s*([\s\S]*?)(?=\n##|\n?$)/);
    const notes = notesMatch ? notesMatch[1].trim() || null : null;

    return { weekNo, title, concepts, notes };
  });

  weeks.sort((a, b) => a.weekNo - b.weekNo);
  return weeks;
}

function validate(course: CourseMeta, weeks: ParsedWeek[]): void {
  const weekNumbers = weeks.map((w) => w.weekNo);
  const duplicates = weekNumbers.filter((n, i) => weekNumbers.indexOf(n) !== i);
  if (duplicates.length > 0) fail(`Duplicate week numbers in the file: ${[...new Set(duplicates)].join(', ')}`);

  const allConceptIds = new Set(weeks.flatMap((w) => w.concepts.map((c) => c.id)));
  const forbiddenOverlap = course.forbidden_concepts.filter((c) => allConceptIds.has(c));
  if (forbiddenOverlap.length > 0) {
    fail(`These concepts are both taught in a week AND listed as forbidden: ${forbiddenOverlap.join(', ')}`);
  }
}

function splitList(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

function fail(message: string): never {
  console.error(`import-course: ${message}`);
  process.exit(1);
}

main();
