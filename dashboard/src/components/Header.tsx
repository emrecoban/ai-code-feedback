import { DOCS_URL } from '../config';
import { useNow } from '../hooks/usePolling';
import { useI18n, type Lang } from '../i18n';
import type { MessageKey } from '../i18n/en';
import { useAuth, useSession } from '../lib/auth';
import { useLive } from '../lib/live';
import { LanguageSelect } from './LanguageSelect';

export type Tab = 'overview' | 'insights' | 'log' | 'account';

const TAB_LABELS: Record<Tab, MessageKey> = {
  overview: 'nav.overview',
  insights: 'nav.insights',
  log: 'nav.log',
  account: 'nav.account',
};

/** The docs home in the viewer's language: English at the site root, the
 * others under /tr/ and /es/ (docs/.vitepress/config.ts). */
function docsHome(lang: Lang): string {
  const base = DOCS_URL.endsWith('/') ? DOCS_URL : `${DOCS_URL}/`;
  return lang === 'en' ? base : `${base}${lang}/`;
}

export function Header({ tab, tabs }: { tab: Tab; tabs: Tab[] }) {
  const { t, f, lang } = useI18n();
  const { account } = useSession();
  const { signOut } = useAuth();
  const { paused, setPaused, refresh, realtime, lastUpdated, failing } = useLive();
  const now = useNow(5_000);

  const since = lastUpdated ? f.relative(new Date(lastUpdated).toISOString(), now, t('common.never')) : null;
  const mode = paused ? t('live.paused') : realtime ? t('live.live') : t('live.auto');
  let status: string;
  if (failing) status = since ? t('live.problemSince', { time: since }) : t('live.problem');
  else if (!since) status = t('live.loading');
  else status = t('live.updated', { status: mode, time: since });

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="#overview">
          <img src="/logo.png" alt="" width={28} height={28} />
          <span>
            <span className="brand-title">{t('app.title')}</span>
            <span className="brand-subtitle">{t('app.subtitle')}</span>
          </span>
        </a>

        <nav className="tabs" aria-label={t('app.title')}>
          {tabs.map((id) => (
            <a key={id} href={`#${id}`} className="tab" aria-current={tab === id ? 'page' : undefined}>
              {t(TAB_LABELS[id])}
            </a>
          ))}
          {DOCS_URL && (
            <a
              href={docsHome(lang)}
              className="tab"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t('nav.docs')} (${t('nav.newTab')})`}
              title={t('nav.newTab')}
            >
              {t('nav.docs')}
              <span className="tab-external" aria-hidden="true">
                ↗
              </span>
            </a>
          )}
        </nav>

        <div className="topbar-actions">
          <span
            className={`live-status${failing ? ' is-error' : paused ? '' : ' is-live'}`}
            aria-live="polite"
            title={realtime ? t('live.realtimeTitle') : t('live.pollTitle')}
          >
            <span className="dot" aria-hidden="true" />
            {status}
          </span>
          <button type="button" className="btn btn-ghost btn-small" onClick={() => setPaused(!paused)} aria-pressed={paused}>
            {paused ? t('live.resume') : t('live.pause')}
          </button>
          <button type="button" className="btn btn-ghost btn-small" onClick={refresh}>
            {t('live.refresh')}
          </button>
          <LanguageSelect className="compact" />
          <span className="user">
            {account.username}
            <span className="role-badge">{t(account.role === 'admin' ? 'role.admin' : 'role.viewer')}</span>
          </span>
          <button type="button" className="btn btn-small" onClick={signOut}>
            {t('header.signOut')}
          </button>
        </div>
      </div>
    </header>
  );
}
