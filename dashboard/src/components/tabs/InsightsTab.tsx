import { useCallback, useEffect, useState } from 'react';
import { useNow } from '../../hooks/usePolling';
import { useI18n, useResultMessage } from '../../i18n';
import { en, type MessageKey } from '../../i18n/en';
import { fetchAiConfig, fetchEngagement, fetchInsights, ForbiddenError, setRateLimits } from '../../lib/api';
import { useApiErrorHandler, useSession } from '../../lib/auth';
import { useLive, useLiveQuery } from '../../lib/live';
import type { AiConfig, Engagement, Insights } from '../../lib/types';
import { Behaviour, Metrics } from '../Behaviour';
import { ConfirmDialog } from '../ConfirmDialog';
import { useNotify } from '../Toast';
import { ChartCard, useSlotLabels } from '../charts/ChartCard';
import { ColumnChart } from '../charts/ColumnChart';
import { Heatmap } from '../charts/Heatmap';
import { StatTile } from '../StatTile';
import { TrendCard } from '../TrendCard';

export function InsightsTab() {
  const { t } = useI18n();
  const { range } = useLive();
  const { data, error, reload } = useLiveQuery((token) => fetchInsights(token, range), [range.from, range.to]);
  const engagement = useLiveQuery((token) => fetchEngagement(token, range), [range.from, range.to]);

  if (!data) {
    return error ? (
      <div className="card empty">
        <p>{t('common.loadError')}</p>
        <button type="button" className="btn" onClick={() => void reload()}>
          {t('common.retry')}
        </button>
      </div>
    ) : (
      <p className="empty">{t('common.loading')}</p>
    );
  }

  return (
    <div className="section insights">
      <TrendCard title={t('insights.trend')} subtitle={t('detail.trendSub')} weeks={data.trend} />
      <div className="chart-grid chart-grid-even">
        <ConceptTable data={data} />
        <ErrorTable data={data} />
      </div>
      <section className="section-block" aria-labelledby="behaviour-title">
        <div>
          <h2 id="behaviour-title" className="section-title">
            {t('behaviour.title')}
          </h2>
          <p className="card-subtitle">{t('behaviour.sub')}</p>
        </div>
        {engagement.data ? (
          <Behaviour data={engagement.data} />
        ) : engagement.error ? (
          <div className="card empty">
            <p>{t('common.loadError')}</p>
            <button type="button" className="btn" onClick={() => void engagement.reload()}>
              {t('common.retry')}
            </button>
          </div>
        ) : (
          <p className="empty">{t('common.loading')}</p>
        )}
      </section>
      <Rhythm data={data} />
      <Health data={data} engagement={engagement.data} engagementError={engagement.error} />
      <Calibration data={data} />
    </div>
  );
}

/** Ranked table with an inline bar: a table first (the labels are long
 * model-written phrases), the bar only as a reading aid. */
function RankTable({
  rows,
  labelHeader,
}: {
  rows: { key: string; label: string; sub?: string | null; questions: number; students: number; fix: number }[];
  labelHeader: string;
}) {
  const { t, f } = useI18n();
  const max = rows.reduce((m, r) => Math.max(m, r.questions), 0);
  return (
    <div className="table-scroll">
      <table className="data-table rank-table">
        <thead>
          <tr>
            <th scope="col">{labelHeader}</th>
            <th scope="col" className="num">{t('col.questions')}</th>
            <th scope="col" className="num">{t('col.students')}</th>
            <th scope="col" className="num">{t('col.neededFix')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <td className="wrap">
                <span className="rank-label">{r.label}</span>
                {r.sub && <span className="file-name">{r.sub}</span>}
                <span className="rank-bar" aria-hidden="true">
                  <span style={{ width: `${max ? (100 * r.questions) / max : 0}%` }} />
                </span>
              </td>
              <td className="num">{f.number(r.questions)}</td>
              <td className="num">{f.number(r.students)}</td>
              <td className="num">{f.percent(r.fix, r.questions)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConceptTable({ data }: { data: Insights }) {
  const { t } = useI18n();
  return (
    <section className="card">
      <header className="card-header">
        <div>
          <h3>{t('insights.concepts')}</h3>
          <p className="card-subtitle">{t('insights.mapSub')}</p>
        </div>
      </header>
      {data.concepts.length === 0 ? (
        <p className="empty">{t('insights.noConcepts')}</p>
      ) : (
        <RankTable
          labelHeader={t('col.concept')}
          rows={data.concepts.map((c) => ({ key: c.concept, label: c.concept, questions: c.questions, students: c.students, fix: c.fix }))}
        />
      )}
    </section>
  );
}

function ErrorTable({ data }: { data: Insights }) {
  const { t } = useI18n();
  return (
    <section className="card">
      <header className="card-header">
        <div>
          <h3>{t('insights.errors')}</h3>
          <p className="card-subtitle">{t('insights.mapSub')}</p>
        </div>
      </header>
      {data.errors.length === 0 ? (
        <p className="empty">{t('insights.noErrors')}</p>
      ) : (
        <RankTable
          labelHeader={t('col.error')}
          rows={data.errors.map((e, i) => ({
            key: `${i}-${e.label}`,
            label: e.label,
            // A linter code alone says little; show one of its messages too.
            sub: e.has_code && e.message !== e.label ? e.message : null,
            questions: e.questions,
            students: e.students,
            fix: e.fix,
          }))}
        />
      )}
    </section>
  );
}

function Rhythm({ data }: { data: Insights }) {
  const { t, tp, f } = useI18n();
  const [metric, setMetric] = useState<'questions' | 'sessions'>('questions');
  const cells = data.rhythm[metric];
  const format = (n: number) => (metric === 'questions' ? tp('count.question', n) : f.number(n));
  const title = metric === 'questions' ? t('rhythm.questions') : t('rhythm.sessions');

  return (
    <ChartCard
      title={t('insights.rhythm')}
      subtitle={t('insights.rhythmSub')}
      actions={
        <div className="segmented segmented-small" role="group" aria-label={t('insights.rhythm')}>
          {(['questions', 'sessions'] as const).map((m) => (
            <button key={m} type="button" className={metric === m ? 'is-selected' : undefined} aria-pressed={metric === m} onClick={() => setMetric(m)}>
              {m === 'questions' ? t('rhythm.questions') : t('rhythm.sessions')}
            </button>
          ))}
        </div>
      }
      table={
        cells.length === 0 ? undefined : (
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">{t('col.day')}</th>
                <th scope="col">{t('col.hour')}</th>
                <th scope="col" className="num">{title}</th>
              </tr>
            </thead>
            <tbody>
              {[...cells]
                .sort((a, b) => a[0] - b[0] || a[1] - b[1])
                .map(([d, h, n]) => (
                  <tr key={`${d}-${h}`}>
                    <td>{f.weekday(d)}</td>
                    <td>{f.hour(h)}</td>
                    <td className="num">{f.number(n)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )
      }
    >
      {cells.length === 0 ? <p className="empty">{t('rhythm.empty')}</p> : <Heatmap cells={cells} formatValue={format} ariaLabel={`${t('insights.rhythm')}: ${title}`} />}
    </ChartCard>
  );
}

/** The AI settings from Edge Function secrets and the request limits.
 * Read once per visit to this tab, and again after the limits are
 * changed here: neither moves with student activity. */
function useAiConfig() {
  const { token } = useSession();
  const [state, setState] = useState<{ data: AiConfig | null; error: boolean }>({ data: null, error: false });
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let cancelled = false;
    fetchAiConfig(token)
      .then((data) => !cancelled && setState({ data, error: false }))
      .catch(() => !cancelled && setState((s) => ({ data: s.data, error: true })));
    return () => {
      cancelled = true;
    };
  }, [token, version]);
  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { ...state, reload };
}

function Health({
  data,
  engagement,
  engagementError,
}: {
  data: Insights;
  engagement: Engagement | null;
  engagementError: boolean;
}) {
  const { t, tp, f } = useI18n();
  const slot = useSlotLabels();
  const ai = useAiConfig();
  const h = data.health;
  const bucket = data.range.bucket;
  const tokens = h.prompt_tokens + h.completion_tokens;
  const attempts = h.questions + h.failures;

  return (
    <section className="section-block" aria-labelledby="health-title">
      <h2 id="health-title" className="section-title">
        {t('insights.health')}
      </h2>
      <div className="tile-grid">
        <StatTile
          label={t('health.tokens')}
          value={f.compact(tokens)}
          sub={t('health.tokensSub', { prompt: f.compact(h.prompt_tokens), completion: f.compact(h.completion_tokens) })}
        />
        <StatTile
          label={t('health.cache')}
          value={f.percent(h.cache_hits, h.questions)}
          sub={t('health.cacheSub', { part: f.number(h.cache_hits), whole: f.number(h.questions) })}
        />
        <StatTile
          label={t('health.failures')}
          value={f.percent(h.failures, attempts)}
          warning={h.failures > 0}
          sub={tp('health.failuresSub', h.failures)}
        />
        <StatTile
          label={t('health.latency')}
          value={f.latency(h.latency_p50)}
          sub={h.latency_p95 != null ? t('health.latencySub', { p95: f.latency(h.latency_p95) }) : undefined}
        />
      </div>
      <div className="chart-grid">
        <ChartCard
          title={t('health.tokensOverTime')}
          subtitle={t(`chart.bucket.${bucket}`)}
          table={
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">{t('col.time')}</th>
                  <th scope="col" className="num">{t('col.tokens')}</th>
                  <th scope="col" className="num">{t('col.questions')}</th>
                </tr>
              </thead>
              <tbody>
                {[...h.series].reverse().map((d) => (
                  <tr key={d.slot}>
                    <td>{slot.long(d.slot, bucket)}</td>
                    <td className="num">{f.number(d.prompt_tokens + d.completion_tokens)}</td>
                    <td className="num">{f.number(d.questions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        >
          <ColumnChart
            ariaLabel={t('health.tokensOverTime')}
            formatValue={(n) => tp('count.token', n)}
            data={h.series.map((d) => ({
              key: d.slot,
              tick: slot.tick(d.slot, bucket),
              label: slot.long(d.slot, bucket),
              value: d.prompt_tokens + d.completion_tokens,
              detail: t('health.tokensDetail', { prompt: f.number(d.prompt_tokens), completion: f.number(d.completion_tokens) }),
            }))}
          />
        </ChartCard>
        <section className="card">
          <h3>{t('health.models')}</h3>
          {h.models.length === 0 ? (
            <p className="empty">{t('tile.noQuestions')}</p>
          ) : (
            <div className="table-scroll">
              <table className="data-table compact">
                <thead>
                  <tr>
                    <th scope="col">{t('col.model')}</th>
                    <th scope="col" className="num">{t('col.questions')}</th>
                    <th scope="col" className="num">{t('col.tokens')}</th>
                    <th scope="col" className="num">{t('col.cacheHits')}</th>
                  </tr>
                </thead>
                <tbody>
                  {h.models.map((m) => (
                    <tr key={m.model}>
                      <td className="mono">{m.model}</td>
                      <td className="num">{f.number(m.questions)}</td>
                      <td className="num">{f.compact(m.tokens)}</td>
                      <td className="num">{f.percent(m.cache_hits, m.questions)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
      <div className="chart-grid chart-grid-even">
        <AiModelCard config={ai.data} error={ai.error} />
        <LimitsCard config={ai.data} error={ai.error} onChanged={ai.reload} />
      </div>
      <div className="chart-grid chart-grid-even">
        <FailuresCard failures={engagement?.failures ?? null} loadFailed={engagementError} />
        <QuotaCard quota={engagement?.quota ?? null} limits={ai.data?.limits ?? null} loadFailed={engagementError} />
      </div>
    </section>
  );
}

function AiModelCard({ config, error }: { config: AiConfig | null; error: boolean }) {
  const { t } = useI18n();
  return (
    <section className="card">
      <h3>{t('health.aiTitle')}</h3>
      {config ? (
        <>
          <p className="model-name">{config.model ?? '—'}</p>
          <Metrics
            rows={[
              { label: t('health.aiProvider'), value: <span className="mono">{config.provider ?? '—'}</span> },
              {
                label: t('health.aiFallback'),
                value: config.fallback ? (
                  <span className="mono">{[config.fallback.provider, config.fallback.model].filter(Boolean).join(' · ')}</span>
                ) : (
                  t('health.aiNone')
                ),
              },
            ]}
          />
          <p className="chart-note">{t('health.aiNote')}</p>
        </>
      ) : (
        <p className="empty">{error ? t('health.aiError') : t('common.loading')}</p>
      )}
    </section>
  );
}

/** The per-student AI request limits: shown to everyone, changed by
 * admins. A value set here overrides the RATE_LIMIT_* secrets. */
function LimitsCard({ config, error, onChanged }: { config: AiConfig | null; error: boolean; onChanged: () => void }) {
  const { t, f } = useI18n();
  const { token, isAdmin } = useSession();
  const handleError = useApiErrorHandler();
  const resultMessage = useResultMessage();
  const notify = useNotify();
  const now = useNow(60_000);
  const [open, setOpen] = useState(false);
  const [hourly, setHourly] = useState('');
  const [daily, setDaily] = useState('');

  const limits = config?.limits;
  const h = Number(hourly);
  const d = Number(daily);
  // The same bounds the database enforces (migrations/0024).
  const valid = Number.isInteger(h) && Number.isInteger(d) && h >= 1 && h <= 1000 && d >= 1 && d <= 10000 && d >= h;
  const changed = !!limits && (h !== limits.hourly || d !== limits.daily);

  const startEditing = () => {
    if (!limits) return;
    setHourly(String(limits.hourly));
    setDaily(String(limits.daily));
    setOpen(true);
  };

  const save = async () => {
    let result;
    try {
      result = await setRateLimits(token, h, d);
    } catch (err) {
      if (handleError(err)) return;
      throw new Error(err instanceof ForbiddenError ? t('common.noPermission') : t('common.error'));
    }
    if (!result.ok) throw new Error(resultMessage(result));
    setOpen(false);
    notify(t('limits.saved'));
    onChanged();
  };

  return (
    <section className="card" aria-labelledby="limits-title">
      <header className="card-header">
        <div>
          <h3 id="limits-title">{t('limits.title')}</h3>
          <p className="card-subtitle">{t('limits.sub')}</p>
        </div>
        {isAdmin && limits && (
          <div className="card-actions">
            <button type="button" className="btn btn-small" onClick={startEditing}>
              {t('limits.change')}
            </button>
          </div>
        )}
      </header>
      {limits && config ? (
        <>
          <div className="limit-values">
            <div>
              <span className="stat-label">{t('limits.hourly')}</span>
              <span className="stat-value">{f.number(limits.hourly)}</span>
            </div>
            <div>
              <span className="stat-label">{t('limits.daily')}</span>
              <span className="stat-value">{f.number(limits.daily)}</span>
            </div>
          </div>
          <p className="chart-note">
            {limits.source === 'dashboard'
              ? t('limits.fromDashboard', {
                  name: limits.updated_by ?? '—',
                  time: f.relative(limits.updated_at, now, t('common.never')),
                })
              : t('limits.fromSecrets')}{' '}
            {limits.source === 'dashboard' &&
              t('limits.defaults', {
                hourly: f.number(config.default_limits.hourly),
                daily: f.number(config.default_limits.daily),
              })}
          </p>
        </>
      ) : (
        <p className="empty">{error ? t('common.loadError') : t('common.loading')}</p>
      )}

      {isAdmin && limits && (
        <ConfirmDialog
          open={open}
          title={t('limits.dialogTitle')}
          confirmLabel={t('limits.save')}
          danger={false}
          canConfirm={valid && changed}
          onConfirm={save}
          onClose={() => setOpen(false)}
        >
          <p>{t('limits.dialogBody')}</p>
          <p>{t('limits.current', { hourly: f.number(limits.hourly), daily: f.number(limits.daily) })}</p>
          <div className="field-pair">
            <div className="field">
              <label htmlFor="limit-hourly">{t('limits.hourly')}</label>
              <input
                id="limit-hourly"
                type="number"
                inputMode="numeric"
                min={1}
                max={1000}
                step={1}
                value={hourly}
                onChange={(e) => setHourly(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="limit-daily">{t('limits.daily')}</label>
              <input
                id="limit-daily"
                type="number"
                inputMode="numeric"
                min={1}
                max={10000}
                step={1}
                value={daily}
                onChange={(e) => setDaily(e.target.value)}
              />
            </div>
          </div>
          <p className={`field-hint${hourly !== '' && daily !== '' && !valid ? ' is-error' : ''}`} role="status">
            {t('limits.range')}
          </p>
        </ConfirmDialog>
      )}
    </section>
  );
}

function FailuresCard({ failures, loadFailed }: { failures: Engagement['failures'] | null; loadFailed: boolean }) {
  const { t, f } = useI18n();
  const kindLabel = (kind: string) => {
    const key = `failure.${kind}`;
    return key in en ? t(key as MessageKey) : kind;
  };
  return (
    <section className="card">
      <header className="card-header">
        <div>
          <h3>{t('health.failTitle')}</h3>
          <p className="card-subtitle">{t('health.failSub')}</p>
        </div>
      </header>
      {failures == null ? (
        <p className="empty">{loadFailed ? t('common.loadError') : t('common.loading')}</p>
      ) : failures.length === 0 ? (
        <p className="empty">{t('health.failNone')}</p>
      ) : (
        <div className="table-scroll">
          <table className="data-table compact">
            <thead>
              <tr>
                <th scope="col">{t('col.reason')}</th>
                <th scope="col">{t('col.code')}</th>
                <th scope="col" className="num">{t('col.count')}</th>
              </tr>
            </thead>
            <tbody>
              {failures.map((x) => (
                <tr key={`${x.kind}-${x.code ?? ''}`}>
                  <td>{kindLabel(x.kind)}</td>
                  <td className="mono">{x.code ?? '—'}</td>
                  <td className="num">{f.number(x.n)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/** Near = 80% of either limit; flagged with an icon and text, never colour alone. */
function QuotaCard({
  quota,
  limits,
  loadFailed,
}: {
  quota: Engagement['quota'];
  limits: AiConfig['limits'] | null;
  loadFailed: boolean;
}) {
  const { t, f } = useI18n();
  const ofLimit = (n: number, limit: number | undefined) => (limit ? `${f.number(n)} / ${f.number(limit)}` : f.number(n));
  const near = (row: NonNullable<Engagement['quota']>[number]) =>
    limits != null && (row.hour_requests >= 0.8 * limits.hourly || row.day_requests >= 0.8 * limits.daily);
  return (
    <section className="card">
      <header className="card-header">
        <div>
          <h3>{t('health.quotaTitle')}</h3>
          <p className="card-subtitle">{t('health.quotaSub')}</p>
        </div>
      </header>
      {quota == null ? (
        <p className="empty">{loadFailed ? t('common.loadError') : t('common.loading')}</p>
      ) : quota.length === 0 ? (
        <p className="empty">{t('health.quotaNone')}</p>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">{t('col.student')}</th>
                <th scope="col" className="num">{t('col.thisHour')}</th>
                <th scope="col" className="num">{t('col.today')}</th>
                <th scope="col" className="num">{t('col.tokensToday')}</th>
              </tr>
            </thead>
            <tbody>
              {quota.map((row) => (
                <tr key={row.username}>
                  <td>
                    {row.username}
                    {near(row) && (
                      <span className="chip chip-warning chip-inline">
                        <span className="warning-icon" aria-hidden="true">
                          !
                        </span>
                        {t('health.quotaNear')}
                      </span>
                    )}
                  </td>
                  <td className="num">{ofLimit(row.hour_requests, limits?.hourly)}</td>
                  <td className="num">{ofLimit(row.day_requests, limits?.daily)}</td>
                  <td className="num">{f.compact(row.day_tokens)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Calibration({ data }: { data: Insights }) {
  const { t, f } = useI18n();
  return (
    <section className="card">
      <header className="card-header">
        <div>
          <h3>{t('insights.calibration')}</h3>
          <p className="card-subtitle">{t('calibration.sub')}</p>
        </div>
      </header>
      {data.calibration.length === 0 ? (
        <p className="empty">{t('calibration.empty')}</p>
      ) : (
        <div className="table-scroll">
          <table className="data-table rank-table">
            <thead>
              <tr>
                <th scope="col">{t('col.answer')}</th>
                <th scope="col" className="num">{t('col.answers')}</th>
                <th scope="col" className="num">{t('col.askedAgain')}</th>
              </tr>
            </thead>
            <tbody>
              {data.calibration.map((c) => (
                <tr key={c.answer}>
                  <td>
                    <span className="rank-label">{t(`confidence.${c.answer}`)}</span>
                    <span className="rank-bar" aria-hidden="true">
                      <span style={{ width: `${c.total ? (100 * c.asked_again) / c.total : 0}%` }} />
                    </span>
                  </td>
                  <td className="num">{f.number(c.total)}</td>
                  <td className="num">
                    {f.percent(c.asked_again, c.total)} <span className="muted">({f.number(c.asked_again)})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
