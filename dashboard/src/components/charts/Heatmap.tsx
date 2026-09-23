import { useState } from 'react';
import { useI18n } from '../../i18n';

interface Props {
  /** [ISO weekday 1-7, hour 0-23, count] triples; missing cells are 0. */
  cells: [number, number, number][];
  /** Tooltip value, e.g. n => "3 questions". */
  formatValue: (n: number) => string;
  ariaLabel: string;
}

const DAYS = [1, 2, 3, 4, 5, 6, 7];
const HOURS = Array.from({ length: 24 }, (_, h) => h);
// Five steps of one blue, light to dark; empty cells stay neutral gray so
// "nothing" never reads as "a little".
const STEPS = 5;

/** Weekday × hour grid. Magnitude is one hue, so the busiest times are
 * simply the darkest; exact numbers are in the tooltip and table view. */
export function Heatmap({ cells, formatValue, ariaLabel }: Props) {
  const { t, f } = useI18n();
  const [active, setActive] = useState<{ d: number; h: number } | null>(null);

  const counts = new Map<string, number>();
  let max = 0;
  for (const [d, h, n] of cells) {
    counts.set(`${d}-${h}`, n);
    max = Math.max(max, n);
  }
  const level = (n: number) => (n <= 0 || max === 0 ? 0 : Math.min(STEPS, Math.ceil((n / max) * STEPS)));
  const value = (d: number, h: number) => counts.get(`${d}-${h}`) ?? 0;

  return (
    <div className="heatmap" role="img" aria-label={ariaLabel}>
      <div className="heatmap-grid" onPointerLeave={() => setActive(null)}>
        <span />
        {HOURS.map((h) => (
          <span key={h} className="heatmap-hour" aria-hidden="true">
            {h % 3 === 0 ? String(h).padStart(2, '0') : ''}
          </span>
        ))}
        {DAYS.map((d) => (
          <div key={d} className="heatmap-row">
            <span className="heatmap-day">{f.weekday(d)}</span>
            {HOURS.map((h) => {
              const n = value(d, h);
              return (
                <span
                  key={h}
                  className={`heatmap-cell heat-${level(n)}${active?.d === d && active.h === h ? ' is-active' : ''}`}
                  onPointerEnter={() => setActive({ d, h })}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="heatmap-footer">
        <span className="heatmap-readout" aria-live="polite">
          {active ? (
            <>
              <strong>{formatValue(value(active.d, active.h))}</strong>{' '}
              {t('rhythm.cell', { day: f.weekday(active.d), hour: f.hour(active.h) })}
            </>
          ) : (
            ' '
          )}
        </span>
        <span className="heatmap-scale" aria-hidden="true">
          {t('rhythm.less')}
          {Array.from({ length: STEPS + 1 }, (_, i) => (
            <span key={i} className={`heatmap-cell heat-${i}`} />
          ))}
          {t('rhythm.more')}
        </span>
      </div>
    </div>
  );
}
