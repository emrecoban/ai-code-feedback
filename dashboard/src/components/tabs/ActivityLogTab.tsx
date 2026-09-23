import { useState } from 'react';
import { useI18n } from '../../i18n';
import { en, type MessageKey } from '../../i18n/en';
import { fetchAuditLog } from '../../lib/api';
import { useApiErrorHandler, useSession } from '../../lib/auth';
import { useLiveQuery } from '../../lib/live';
import type { AuditEntry } from '../../lib/types';

/** Newest first. The first page follows the live refresh; "Load more"
 * appends older pages, deduplicated by id when new entries push the first
 * page down. */
export function ActivityLogTab() {
  const { t } = useI18n();
  const { token } = useSession();
  const handleError = useApiErrorHandler();
  const first = useLiveQuery((tk) => fetchAuditLog(tk), []);
  const [older, setOlder] = useState<AuditEntry[]>([]);
  const [olderHasMore, setOlderHasMore] = useState<boolean | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  if (!first.data) {
    return first.error ? (
      <div className="card empty">
        <p>{t('common.loadError')}</p>
        <button type="button" className="btn" onClick={() => void first.reload()}>
          {t('common.retry')}
        </button>
      </div>
    ) : (
      <p className="empty">{t('common.loading')}</p>
    );
  }

  const seen = new Set(first.data.entries.map((e) => e.id));
  const entries = [...first.data.entries, ...older.filter((e) => !seen.has(e.id))];
  const hasMore = olderHasMore ?? first.data.has_more;

  const loadMore = async () => {
    const last = entries[entries.length - 1];
    if (!last) return;
    setLoadingMore(true);
    setError(false);
    try {
      const page = await fetchAuditLog(token, last.id);
      setOlder((current) => [...current, ...page.entries]);
      setOlderHasMore(page.has_more);
    } catch (err) {
      if (!handleError(err)) setError(true);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section className="section" aria-labelledby="log-title">
      <div className="section-heading">
        <div>
          <h2 id="log-title" className="section-title">
            {t('nav.log')}
          </h2>
          <p className="card-subtitle">{t('log.subtitle')}</p>
        </div>
      </div>
      <div className="card">
        {entries.length === 0 ? (
          <p className="empty">{t('log.empty')}</p>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">{t('col.time')}</th>
                  <th scope="col">{t('col.who')}</th>
                  <th scope="col">{t('col.action')}</th>
                  <th scope="col">{t('col.target')}</th>
                  <th scope="col">{t('col.details')}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <LogRow key={e.id} entry={e} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {error && (
          <p className="form-error" role="alert">
            {t('common.loadError')}
          </p>
        )}
        {hasMore && (
          <div className="load-more">
            <button type="button" className="btn" onClick={() => void loadMore()} disabled={loadingMore}>
              {loadingMore ? t('common.loading') : t('log.loadMore')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

const WARNING_ACTIONS = new Set(['login_failed', 'login_locked', 'student_deleted', 'account_deleted']);

function LogRow({ entry }: { entry: AuditEntry }) {
  const { t, tp, f } = useI18n();
  const actionKey = `action.${entry.action}`;
  const d = entry.details ?? {};

  let details = '';
  switch (entry.action) {
    case 'login_failed':
    case 'login_locked':
      details = d.reason === 'code' ? t('logDetail.wrongCode') : t('logDetail.wrongPassword');
      break;
    case 'account_role_changed':
      details = `${t(d.from === 'admin' ? 'role.admin' : 'role.viewer')} → ${t(d.to === 'admin' ? 'role.admin' : 'role.viewer')}`;
      break;
    case 'account_created':
    case 'account_deleted':
      details = d.role ? t(d.role === 'admin' ? 'role.admin' : 'role.viewer') : '';
      break;
    case 'student_reset':
      details = tp('logDetail.questionsRemoved', Number(d.questions_removed ?? 0));
      break;
    case 'rate_limits_changed': {
      const limits = (hourly: unknown, daily: unknown) =>
        t('logDetail.limits', { hourly: f.number(Number(hourly)), daily: f.number(Number(daily)) });
      // previous_* are null while the secrets' defaults were in force.
      details =
        d.previous_hourly != null
          ? `${limits(d.previous_hourly, d.previous_daily)} → ${limits(d.hourly, d.daily)}`
          : limits(d.hourly, d.daily);
      break;
    }
    case 'export':
      details = t('logDetail.export', {
        from: f.day(String(d.from)),
        to: f.day(String(d.to)),
        students: tp('count.student', Number(d.students ?? 0)),
        questions: tp('count.question', Number(d.questions ?? 0)),
      });
      break;
  }

  return (
    <tr>
      <td className="nowrap">{f.fullDateTime(entry.created_at)}</td>
      <td className="nowrap">{entry.admin_username ?? '—'}</td>
      <td className="nowrap">
        {WARNING_ACTIONS.has(entry.action) && (
          <span className="warning-icon" aria-hidden="true">
            !
          </span>
        )}
        {actionKey in en ? t(actionKey as MessageKey) : entry.action}
      </td>
      <td>{entry.target_label ?? ''}</td>
      <td className="muted">{details}</td>
    </tr>
  );
}
