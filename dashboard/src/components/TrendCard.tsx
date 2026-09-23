import { useI18n } from '../i18n';
import type { TrendWeek } from '../lib/types';
import { ChartCard } from './charts/ChartCard';
import { LineChart } from './charts/LineChart';

/** Weekly independence trend (dashboard.weekly_trend): three rates on one
 * 0-100% axis, so the same unit -- never two scales. */
export function TrendCard({ title, subtitle, weeks }: { title: string; subtitle: string; weeks: TrendWeek[] }) {
  const { t, f } = useI18n();
  const hasData = weeks.some(
    (w) => w.pct_offers_taken != null || w.pct_hint_enough != null || w.pct_sessions_without_help != null,
  );
  const pct = (v: number | null) => (v != null ? f.pct(v) : '—');

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      table={
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{t('col.week')}</th>
              <th scope="col" className="num">{t('col.questions')}</th>
              <th scope="col" className="num">{t('col.helpOffers')}</th>
              <th scope="col" className="num">{t('col.fromErrors')}</th>
              <th scope="col" className="num">{t('col.sessions')}</th>
              <th scope="col" className="num">{t('trend.offersTaken')}</th>
              <th scope="col" className="num">{t('trend.hintEnough')}</th>
              <th scope="col" className="num">{t('trend.noHelp')}</th>
            </tr>
          </thead>
          <tbody>
            {[...weeks].reverse().map((w) => (
              <tr key={w.week}>
                <td>{t('trend.weekOf', { date: f.shortDay(w.week) })}</td>
                <td className="num">{f.number(w.questions)}</td>
                <td className="num">{f.number(w.help_offers)}</td>
                <td className="num">{f.number(w.from_errors)}</td>
                <td className="num">{f.number(w.sessions)}</td>
                <td className="num">{pct(w.pct_offers_taken)}</td>
                <td className="num">{pct(w.pct_hint_enough)}</td>
                <td className="num">{pct(w.pct_sessions_without_help)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      {hasData ? (
        <>
          <LineChart
            ariaLabel={title}
            ticks={weeks.map((w) => f.shortDay(w.week))}
            labels={weeks.map((w) => t('trend.weekOf', { date: f.shortDay(w.week) }))}
            series={[
              { key: 'offers', label: t('trend.offersTaken'), className: 'series-1', values: weeks.map((w) => w.pct_offers_taken) },
              { key: 'hint', label: t('trend.hintEnough'), className: 'series-2', values: weeks.map((w) => w.pct_hint_enough) },
              {
                key: 'no-help',
                label: t('trend.noHelp'),
                className: 'series-3',
                values: weeks.map((w) => w.pct_sessions_without_help),
              },
            ]}
          />
          <p className="chart-note">{t('trend.read')}</p>
        </>
      ) : (
        <p className="empty">{t('trend.empty')}</p>
      )}
    </ChartCard>
  );
}
