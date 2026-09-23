import type { Lang } from './index';

const LOCALES: Record<Lang, string> = { en: 'en', tr: 'tr-TR', es: 'es-ES' };

export type Bucket = 'hour' | 'day' | 'week';

/** `day` is a plain yyyy-mm-dd, already in the viewer's zone. */
function parseDay(day: string): Date {
  const [y, m, d] = day.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Bucket labels from the server: 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:00'. */
function parseSlot(slot: string): Date {
  const date = parseDay(slot);
  const hour = slot.length > 10 ? Number(slot.slice(11, 13)) : 0;
  date.setHours(hour);
  return date;
}

export function makeFormatters(lang: Lang) {
  const locale = LOCALES[lang];
  const number = new Intl.NumberFormat(locale);
  const decimal = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const compact = new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 });
  const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 });
  const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  const dateTime = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const fullDateTime = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' });
  const shortDay = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' });
  const longDay = new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short' });
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const unit = (u: string, n: number, digits = 0) =>
    new Intl.NumberFormat(locale, { style: 'unit', unit: u, unitDisplay: 'short', maximumFractionDigits: digits }).format(n);
  const languageNames = new Intl.DisplayNames([locale], { type: 'language' });

  return {
    locale,
    number: (n: number) => number.format(n),
    decimal: (n: number) => decimal.format(n),
    compact: (n: number) => compact.format(n),
    /** Whole percent of part/whole, or an em dash when there is nothing to divide by. */
    percent: (part: number, whole: number) => (whole > 0 ? percent.format(part / whole) : '—'),
    /** A value that is already 0-100. */
    pct: (value: number) => percent.format(value / 100),

    relative(iso: string | null, now: number, never: string): string {
      if (!iso) return never;
      const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
      const abs = Math.abs(seconds);
      if (abs < 60) return relative.format(0, 'second');
      if (abs < 3600) return relative.format(Math.round(seconds / 60), 'minute');
      if (abs < 86_400) return relative.format(Math.round(seconds / 3600), 'hour');
      if (abs < 30 * 86_400) return relative.format(Math.round(seconds / 86_400), 'day');
      return date.format(new Date(iso));
    },
    date: (iso: string | null) => (iso ? date.format(new Date(iso)) : '—'),
    dateTime: (iso: string | null) => (iso ? dateTime.format(new Date(iso)) : '—'),
    fullDateTime: (iso: string | null) => (iso ? fullDateTime.format(new Date(iso)) : '—'),
    time: (iso: string) => time.format(new Date(iso)),
    day: (day: string) => date.format(parseDay(day)),
    shortDay: (day: string) => shortDay.format(parseDay(day)),

    /** Axis tick for a series bucket. */
    slotTick(slot: string, bucket: Bucket): string {
      return bucket === 'hour' ? time.format(parseSlot(slot)) : shortDay.format(parseDay(slot));
    },
    /** Tooltip / table label for a series bucket (weeks are wrapped by the caller). */
    slotLong(slot: string, bucket: Bucket): string {
      const d = parseSlot(slot);
      return bucket === 'hour' ? `${longDay.format(d)}, ${time.format(d)}` : bucket === 'week' ? shortDay.format(d) : longDay.format(d);
    },

    /** Minutes and hours of active time. */
    duration(seconds: number): string {
      const minutes = Math.round(seconds / 60);
      if (minutes < 60) return unit('minute', minutes);
      const hours = Math.floor(minutes / 60);
      const rest = minutes % 60;
      return rest ? `${unit('hour', hours)} ${unit('minute', rest)}` : unit('hour', hours);
    },
    /** Short spans measured in milliseconds (time on screen, time before asking). */
    span(ms: number): string {
      const seconds = Math.round(ms / 1000);
      if (seconds < 60) return unit('second', seconds);
      if (seconds < 3600) return unit('minute', Math.round(seconds / 60));
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.round((seconds % 3600) / 60);
      return minutes ? `${unit('hour', hours)} ${unit('minute', minutes)}` : unit('hour', hours);
    },
    latency(ms: number | null): string {
      if (ms == null) return '—';
      return ms < 1000 ? unit('millisecond', Math.round(ms)) : unit('second', ms / 1000, 1);
    },

    languageName(code: string | null | undefined): string {
      if (!code) return '—';
      try {
        return languageNames.of(code) ?? code;
      } catch {
        return code;
      }
    },
    /** ISO weekday 1 (Monday) - 7 (Sunday). 2024-01-01 was a Monday. */
    weekday: (isoDow: number) => weekday.format(new Date(2024, 0, isoDow)),
    hour: (h: number) => `${String(h).padStart(2, '0')}:00`,
  };
}

export type Formatters = ReturnType<typeof makeFormatters>;

// VS Code languageIds (coding_sessions.language_counts keys). Proper names
// are the same in every UI language; only "plaintext" is translated.
const EDITOR_LANGUAGES: Record<string, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  javascriptreact: 'JavaScript (JSX)',
  typescriptreact: 'TypeScript (TSX)',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
  ruby: 'Ruby',
  kotlin: 'Kotlin',
  swift: 'Swift',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  json: 'JSON',
  jsonc: 'JSON',
  markdown: 'Markdown',
  sql: 'SQL',
  shellscript: 'Shell',
  xml: 'XML',
  yaml: 'YAML',
};
export const editorLanguageName = (id: string): string | null => EDITOR_LANGUAGES[id] ?? null;

const OS_NAMES: Record<string, string> = { darwin: 'macOS', win32: 'Windows', linux: 'Linux' };
export const osName = (os: string | null) => (os ? (OS_NAMES[os] ?? os) : '—');
