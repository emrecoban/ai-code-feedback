import type { Cell, Column } from 'write-excel-file/browser';
import type { MessageKey } from '../i18n/en';
import type { Lang } from '../i18n';
import { levelKey } from './labels';
import type { ExportData, StudentRow } from './types';

type T = (key: MessageKey, vars?: Record<string, string | number>) => string;
type Question = ExportData['questions'][number];
type Daily = ExportData['daily'][number];

// Excel dates carry no time zone and write-excel-file converts a Date by
// its UTC value, so shift by the local offset: the sheet then shows the
// same wall-clock time the dashboard does.
function localDate(iso: string): Date {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
}

function dateCell(iso: string | null, format: string): Cell {
  return iso ? { value: localDate(iso), type: Date, format } : null;
}

/** "2026-09-23 14:05" in local time, for CSV. */
function localStamp(iso: string | null): string {
  return iso ? localDate(iso).toISOString().slice(0, 16).replace('T', ' ') : '';
}

function labels(t: T) {
  const trigger = (s: string) => t(`trigger.${s}` as MessageKey);
  const qtype = (s: string | null) => (s ? t(`qtype.${s}` as MessageKey) : '');
  const rating = (r: number | null) => (r === 1 ? t('rating.up') : r === -1 ? t('rating.down') : '');
  const outcome = (o: string | null) => (o ? t(`outcome.${o}` as MessageKey) : '');
  const confidence = (c: string | null) => (c ? t(`confidence.${c}` as MessageKey) : '');
  return { trigger, qtype, rating, outcome, confidence, level: (n: number) => t(levelKey(n)) };
}

// ---------- Column definitions (shared by .xlsx and .csv) ----------

interface Col<R> {
  header: MessageKey;
  width: number;
  xlsx: (row: R) => Cell;
  csv: (row: R) => string | number;
}

function studentColumns(t: T, languageName: (code: string) => string): Col<StudentRow>[] {
  return [
    { header: 'xl.username', width: 18, xlsx: (s) => s.username, csv: (s) => s.username },
    { header: 'xl.joined', width: 12, xlsx: (s) => dateCell(s.created_at, 'yyyy-mm-dd'), csv: (s) => localStamp(s.created_at).slice(0, 10) },
    { header: 'xl.lastActive', width: 17, xlsx: (s) => dateCell(s.last_active, 'yyyy-mm-dd hh:mm'), csv: (s) => localStamp(s.last_active) },
    { header: 'xl.sessions', width: 10, xlsx: (s) => s.sessions, csv: (s) => s.sessions },
    { header: 'xl.activeDays', width: 11, xlsx: (s) => s.active_days, csv: (s) => s.active_days },
    { header: 'xl.activeMin', width: 11, xlsx: (s) => Math.round(s.active_seconds / 60), csv: (s) => Math.round(s.active_seconds / 60) },
    { header: 'xl.questions', width: 11, xlsx: (s) => s.questions, csv: (s) => s.questions },
    { header: 'xl.questionsTotal', width: 14, xlsx: (s) => s.questions_total, csv: (s) => s.questions_total },
    { header: 'xl.hintEnough', width: 12, xlsx: (s) => s.solved_alone, csv: (s) => s.solved_alone },
    {
      header: 'xl.hintEnoughPct',
      width: 13,
      xlsx: (s) => (s.questions > 0 ? { value: s.solved_alone / s.questions, format: '0%' } : null),
      csv: (s) => (s.questions > 0 ? Math.round((100 * s.solved_alone) / s.questions) : ''),
    },
    { header: 'xl.fixedAlone', width: 12, xlsx: (s) => s.fixed_unaided, csv: (s) => s.fixed_unaided },
    { header: 'xl.helpOffers', width: 12, xlsx: (s) => s.help_offers, csv: (s) => s.help_offers },
    { header: 'xl.linesAdded', width: 12, xlsx: (s) => s.lines_written, csv: (s) => s.lines_written },
    { header: 'xl.linesDeleted', width: 12, xlsx: (s) => s.lines_deleted, csv: (s) => s.lines_deleted },
    { header: 'xl.helpful', width: 9, xlsx: (s) => s.helpful_up, csv: (s) => s.helpful_up },
    { header: 'xl.notHelpful', width: 11, xlsx: (s) => s.helpful_down, csv: (s) => s.helpful_down },
    { header: 'xl.consent', width: 11, xlsx: (s) => t(`consent.${s.consent_status}`), csv: (s) => t(`consent.${s.consent_status}`) },
    { header: 'xl.language', width: 11, xlsx: (s) => languageName(s.feedback_language), csv: (s) => languageName(s.feedback_language) },
    { header: 'xl.version', width: 9, xlsx: (s) => s.extension_version ?? '', csv: (s) => s.extension_version ?? '' },
  ];
}

function questionColumns(t: T): Col<Question>[] {
  const l = labels(t);
  const text = (v: string | null) => v ?? '';
  return [
    { header: 'xl.time', width: 17, xlsx: (q) => dateCell(q.created_at, 'yyyy-mm-dd hh:mm'), csv: (q) => localStamp(q.created_at) },
    { header: 'xl.student', width: 16, xlsx: (q) => q.username, csv: (q) => q.username },
    { header: 'xl.title', width: 36, xlsx: (q) => text(q.title), csv: (q) => text(q.title) },
    { header: 'xl.concept', width: 22, xlsx: (q) => text(q.concept), csv: (q) => text(q.concept) },
    { header: 'xl.type', width: 20, xlsx: (q) => l.qtype(q.question_type), csv: (q) => l.qtype(q.question_type) },
    { header: 'xl.ownWords', width: 30, xlsx: (q) => text(q.free_text), csv: (q) => text(q.free_text) },
    { header: 'xl.source', width: 11, xlsx: (q) => l.trigger(q.trigger_source), csv: (q) => l.trigger(q.trigger_source) },
    { header: 'xl.file', width: 18, xlsx: (q) => text(q.file_name), csv: (q) => text(q.file_name) },
    { header: 'xl.error', width: 36, xlsx: (q) => text(q.error), csv: (q) => text(q.error) },
    { header: 'xl.wentTo', width: 13, xlsx: (q) => l.level(q.max_level_reached), csv: (q) => l.level(q.max_level_reached) },
    { header: 'xl.rating', width: 12, xlsx: (q) => l.rating(q.helpful_rating), csv: (q) => l.rating(q.helpful_rating) },
    { header: 'xl.outcome', width: 12, xlsx: (q) => l.outcome(q.self_reported_outcome), csv: (q) => l.outcome(q.self_reported_outcome) },
    { header: 'xl.confidence', width: 11, xlsx: (q) => l.confidence(q.post_confidence), csv: (q) => l.confidence(q.post_confidence) },
    { header: 'xl.responseMs', width: 12, xlsx: (q) => q.latency_ms, csv: (q) => q.latency_ms ?? '' },
    { header: 'xl.cached', width: 9, xlsx: (q) => (q.cache_hit ? t('common.yes') : t('common.no')), csv: (q) => (q.cache_hit ? t('common.yes') : t('common.no')) },
  ];
}

function dailyColumns(): Col<Daily>[] {
  return [
    { header: 'xl.day', width: 12, xlsx: (d) => ({ value: localDate(`${d.day}T00:00:00`), type: Date, format: 'yyyy-mm-dd' }), csv: (d) => d.day },
    { header: 'xl.questions', width: 11, xlsx: (d) => d.questions, csv: (d) => d.questions },
    { header: 'xl.activeStudents', width: 16, xlsx: (d) => d.active_students, csv: (d) => d.active_students },
    { header: 'xl.activeMin', width: 11, xlsx: (d) => Math.round(d.active_seconds / 60), csv: (d) => Math.round(d.active_seconds / 60) },
  ];
}

// ---------- Writers ----------

function toXlsxColumns<R>(cols: Col<R>[], t: T): Column<R>[] {
  return cols.map((c) => ({ header: { value: t(c.header), fontWeight: 'bold' }, width: c.width, cell: c.xlsx }));
}

// Excel opens a .csv with the list separator of the OS locale: a comma in
// English, a semicolon in Turkish and Spanish (which use the comma as the
// decimal mark). Matching it lets the file open straight into columns.
const CSV_SEPARATOR: Record<Lang, string> = { en: ',', tr: ';', es: ';' };

function toCsv<R>(rows: R[], cols: Col<R>[], t: T, lang: Lang): string {
  const sep = CSV_SEPARATOR[lang];
  const escape = (value: string | number) => {
    const s = String(value);
    return /["\r\n]/.test(s) || s.includes(sep) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [cols.map((c) => escape(t(c.header))), ...rows.map((r) => cols.map((c) => escape(c.csv(r))))];
  // The BOM tells Excel the file is UTF-8 (ş, ğ, ñ ...).
  return '﻿' + lines.map((l) => l.join(sep)).join('\r\n');
}

function download(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export type ExportKind = 'xlsx' | 'csv-students' | 'csv-questions';

interface ExportOptions {
  kind: ExportKind;
  data: ExportData;
  /** Only these students (the list's current search); null = everyone. */
  usernames: Set<string> | null;
  t: T;
  lang: Lang;
  languageName: (code: string) => string;
}

export async function writeExport({ kind, data, usernames, t, lang, languageName }: ExportOptions): Promise<void> {
  const students = usernames ? data.students.filter((s) => usernames.has(s.username)) : data.students;
  const questions = usernames ? data.questions.filter((q) => usernames.has(q.username)) : data.questions;
  const stamp = `${data.range.from}_${data.range.to}`;

  if (kind === 'csv-students') {
    const csv = toCsv(students, studentColumns(t, languageName), t, lang);
    return download(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `students_${stamp}.csv`);
  }
  if (kind === 'csv-questions') {
    const csv = toCsv(questions, questionColumns(t), t, lang);
    return download(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `questions_${stamp}.csv`);
  }

  // Loaded on demand: the library is only needed when someone exports.
  const { default: writeXlsxFile, getSheetData } = await import('write-excel-file/browser');
  const sheet = <R,>(rows: R[], cols: Col<R>[], name: MessageKey) => {
    const columns = toXlsxColumns(cols, t);
    return { data: getSheetData(rows, columns), columns, sheet: t(name), stickyRowsCount: 1 };
  };
  await writeXlsxFile([
    sheet(students, studentColumns(t, languageName), 'xl.sheetStudents'),
    sheet(questions, questionColumns(t), 'xl.sheetQuestions'),
    sheet(data.daily, dailyColumns(), 'xl.sheetDaily'),
  ]).toFile(`ai-code-feedback_${stamp}.xlsx`);
}
