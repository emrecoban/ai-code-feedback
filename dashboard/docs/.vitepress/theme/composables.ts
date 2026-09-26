import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { items, langOf, ui, values, type Lang, type T3, type UiKey } from '../data/terms'

const LOCALES: Record<Lang, string> = { en: 'en-US', tr: 'tr-TR', es: 'es-ES' }

/** Current language, formatters and translated strings for components. */
export function useLang() {
  const { lang } = useData()
  const l = computed<Lang>(() => langOf(lang.value))
  const locale = computed(() => LOCALES[l.value])

  const tr = (key: UiKey, vars: Record<string, string | number> = {}) =>
    Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), ui[key][l.value])

  /** Name of an inventory item in the current language. Never falls back to English. */
  const name = (id: string) => items[id]?.[l.value] ?? `⟨${id}⟩`

  const pct = (value: number | null | undefined, digits = 0) =>
    value == null
      ? '–'
      : new Intl.NumberFormat(locale.value, { style: 'percent', maximumFractionDigits: digits }).format(value / 100)

  const num = (value: number | null | undefined, digits = 0) =>
    value == null ? '–' : new Intl.NumberFormat(locale.value, { maximumFractionDigits: digits }).format(value)

  /** Resolves a label reference from a sample view (see scripts/lib/views.mjs). */
  const label = (ref: unknown): string => {
    if (ref == null) return ''
    if (typeof ref === 'string' || typeof ref === 'number') return String(ref)
    const r = ref as Record<string, unknown>
    if ('ui' in r) return tr(r.ui as UiKey)
    if ('item' in r) return name(r.item as string)
    if ('val' in r) {
      const [ns, code] = r.val as [string, string]
      return values[ns]?.[code]?.[l.value] ?? code
    }
    if ('en' in r) return (r as T3)[l.value]
    return ''
  }

  /** Formats a number in a unit: pct, count, min, sec, hour. */
  const fmt = (value: number | null | undefined, unit = 'count') => {
    if (value == null) return '–'
    if (unit === 'pct') return pct(value, 1)
    if (unit === 'min') return `${num(value, 0)} ${ui.unitMin[l.value]}`
    if (unit === 'sec') return `${num(value, 0)} ${ui.unitSec[l.value]}`
    if (unit === 'hour') return `${num(value, 1)} ${ui.unitHour[l.value]}`
    return num(value, 1)
  }

  /** A site path in the current language, e.g. localPath('changelog'). */
  const localPath = (path: string) => withBase(`/${l.value === 'en' ? '' : `${l.value}/`}${path}`)

  return { l, locale, tr, name, pct, num, label, fmt, localPath }
}

/** Anchor used for an inventory item on the changelog and matrix pages. */
export const anchorOf = (id: string) => id.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()
