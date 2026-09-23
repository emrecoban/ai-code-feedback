import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en, type MessageKey } from './en';
import { es } from './es';
import { makeFormatters, type Formatters } from './format';
import { tr } from './tr';

export type Lang = 'en' | 'tr' | 'es';

/** Same three languages the extension offers (profiles.ui_language). */
export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'es', label: 'Español' },
];

const DICTS = { en, tr, es };
const STORAGE_KEY = 'aicf-dashboard.lang';

/** Keys that exist in _one/_other pairs, without the suffix. */
export type PluralKey = MessageKey extends infer K ? (K extends `${infer Base}_one` ? Base : never) : never;
type Vars = Record<string, string | number>;

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: MessageKey, vars?: Vars) => string;
  /** Picks key_one / key_other for n and fills {n} with the formatted number. */
  tp: (key: PluralKey, n: number, vars?: Vars) => string;
  f: Formatters;
}

const I18nContext = createContext<I18nValue | null>(null);

// A per-viewer convenience only, so storage failures just fall back to
// the browser language.
function initialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'tr' || stored === 'es') return stored;
  } catch {
    // ignore
  }
  const browser = navigator.language.slice(0, 2).toLowerCase();
  return browser === 'tr' || browser === 'es' ? browser : 'en';
}

const fill = (text: string, vars?: Vars) =>
  vars ? text.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match)) : text;

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<I18nValue>(() => {
    const dict = DICTS[lang];
    const f = makeFormatters(lang);
    const plural = new Intl.PluralRules(f.locale);
    // Unknown keys (e.g. a server error code with no message yet) come back
    // as the key itself, so callers can detect and replace them.
    const t = (key: MessageKey, vars?: Vars) => fill(dict[key] ?? en[key] ?? key, vars);
    const tp = (key: PluralKey, n: number, vars?: Vars) =>
      t(`${key}_${plural.select(n) === 'one' ? 'one' : 'other'}` as MessageKey, { n: f.number(n), ...vars });
    return { lang, setLang, t, tp, f };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** Message for an {ok:false, error:<code>} answer; codes without an
 * `error.<code>` message fall back to a generic one. */
export function useResultMessage(): (result: { error?: string }) => string {
  const { t } = useI18n();
  return useCallback(
    (result: { error?: string }) => {
      const key = `error.${result.error}`;
      return key in en ? t(key as MessageKey) : t('common.error');
    },
    [t],
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
