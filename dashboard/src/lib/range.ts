// The date range every read follows. Days are yyyy-mm-dd in the viewer's
// own time zone; the server turns them into timestamps with the same zone.

export type RangePreset = 'today' | '7d' | '30d' | '90d' | 'all' | 'custom';

export interface DateRange {
  preset: RangePreset;
  /** null = since the first student joined. */
  from: string | null;
  to: string | null;
}

export const PRESETS: RangePreset[] = ['today', '7d', '30d', '90d', 'all', 'custom'];

const STORAGE_KEY = 'aicf-dashboard.range';

export function isoDay(date: Date): string {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((n) => String(n).padStart(2, '0')).join('-');
}

export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return isoDay(d);
}

/** Presets are re-evaluated against today, so "Last 7 days" keeps moving. */
export function resolvePreset(preset: Exclude<RangePreset, 'custom'>): DateRange {
  const today = isoDay(new Date());
  switch (preset) {
    case 'today':
      return { preset, from: today, to: today };
    case '7d':
      return { preset, from: daysAgo(6), to: today };
    case '30d':
      return { preset, from: daysAgo(29), to: today };
    case '90d':
      return { preset, from: daysAgo(89), to: today };
    case 'all':
      return { preset, from: null, to: today };
  }
}

export const DEFAULT_RANGE: DateRange = resolvePreset('7d');

// Remembered per browser as a convenience; unreadable storage just means
// starting from the default.
export function loadRange(): DateRange {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as DateRange | null;
    if (stored && PRESETS.includes(stored.preset)) {
      return stored.preset === 'custom' ? stored : resolvePreset(stored.preset);
    }
  } catch {
    // ignore
  }
  return DEFAULT_RANGE;
}

export function saveRange(range: DateRange): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(range));
  } catch {
    // ignore
  }
}
