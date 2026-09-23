import { LANGUAGES, useI18n, type Lang } from '../i18n';

export function LanguageSelect({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <label className={`select-label ${className ?? ''}`}>
      <span className="visually-hidden">{t('header.language')}</span>
      <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} aria-label={t('header.language')}>
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
