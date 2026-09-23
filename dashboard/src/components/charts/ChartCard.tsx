import { useState, type ReactNode } from 'react';
import { useI18n } from '../../i18n';

interface Props {
  title: string;
  subtitle?: string;
  /** The same numbers as a table: the accessible twin of the chart. */
  table?: ReactNode;
  /** Controls shown next to the title (e.g. a metric toggle). */
  actions?: ReactNode;
  children: ReactNode;
}

export function ChartCard({ title, subtitle, table, actions, children }: Props) {
  const { t } = useI18n();
  const [showTable, setShowTable] = useState(false);
  return (
    <section className="card chart-card">
      <header className="card-header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        <div className="card-actions">
          {actions}
          {table && (
            <button type="button" className="btn btn-ghost btn-small" onClick={() => setShowTable((v) => !v)}>
              {showTable ? t('common.showChart') : t('common.showTable')}
            </button>
          )}
        </div>
      </header>
      {showTable && table ? <div className="table-scroll table-limit">{table}</div> : children}
    </section>
  );
}

/** Axis tick and tooltip label for a server bucket ('YYYY-MM-DD' or
 * 'YYYY-MM-DDTHH:00'); weeks read "Week of 22 Sep". */
export function useSlotLabels() {
  const { t, f } = useI18n();
  return {
    tick: (slot: string, bucket: 'hour' | 'day' | 'week') => f.slotTick(slot, bucket),
    long: (slot: string, bucket: 'hour' | 'day' | 'week') =>
      bucket === 'week' ? t('trend.weekOf', { date: f.slotLong(slot, bucket) }) : f.slotLong(slot, bucket),
  };
}
