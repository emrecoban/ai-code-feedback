import { lazy, Suspense, useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { useSession } from '../lib/auth';
import { LiveProvider } from '../lib/live';
import { DateRangeFilter } from './DateRangeFilter';
import { Header, type Tab } from './Header';
import { QuestionProvider } from './QuestionDialog';
import { OverviewTab } from './tabs/OverviewTab';
import { NoticeProvider } from './Toast';

// Loaded when first opened; the overview is what most visits need.
const InsightsTab = lazy(() => import('./tabs/InsightsTab').then((m) => ({ default: m.InsightsTab })));
const ActivityLogTab = lazy(() => import('./tabs/ActivityLogTab').then((m) => ({ default: m.ActivityLogTab })));
const AccountTab = lazy(() => import('./tabs/AccountTab').then((m) => ({ default: m.AccountTab })));

/** The tab lives in the URL hash, so reloading or sharing a link keeps it. */
function useHashTab(tabs: Tab[]): Tab {
  const read = (): Tab => {
    const hash = window.location.hash.slice(1) as Tab;
    return tabs.includes(hash) ? hash : 'overview';
  };
  const [tab, setTab] = useState<Tab>(read);
  useEffect(() => {
    const onChange = () => setTab(read());
    window.addEventListener('hashchange', onChange);
    onChange();
    return () => window.removeEventListener('hashchange', onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs.join()]);
  return tab;
}

export function Dashboard() {
  return (
    <LiveProvider>
      <NoticeProvider>
        <QuestionProvider>
          <Shell />
        </QuestionProvider>
      </NoticeProvider>
    </LiveProvider>
  );
}

function Shell() {
  const { t } = useI18n();
  const { isAdmin } = useSession();
  // Viewers have no activity log: it records admin actions on accounts.
  const tabs: Tab[] = isAdmin ? ['overview', 'insights', 'log', 'account'] : ['overview', 'insights', 'account'];
  const tab = useHashTab(tabs);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tab]);

  return (
    <div className="app">
      <Header tab={tab} tabs={tabs} />
      <main className="content">
        {(tab === 'overview' || tab === 'insights') && <DateRangeFilter />}
        <Suspense fallback={<p className="empty">{t('common.loading')}</p>}>
          {tab === 'overview' && <OverviewTab />}
          {tab === 'insights' && <InsightsTab />}
          {tab === 'log' && isAdmin && <ActivityLogTab />}
          {tab === 'account' && <AccountTab />}
        </Suspense>
      </main>
    </div>
  );
}
