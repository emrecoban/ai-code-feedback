import { useState, type KeyboardEvent, type PointerEvent } from 'react';
import { useElementWidth } from '../../hooks/usePolling';
import { useI18n } from '../../i18n';

export interface LineSeries {
  key: string;
  label: string;
  /** CSS class that sets the stroke / fill colour (.series-1, .series-2). */
  className: string;
  /** null leaves a gap: "no data that week" is not 0%. */
  values: (number | null)[];
}

interface Props {
  /** Point labels along the x axis. */
  ticks: string[];
  /** Tooltip heading per point. */
  labels: string[];
  series: LineSeries[];
  ariaLabel: string;
  height?: number;
}

const MARGIN = { top: 14, right: 12, bottom: 24, left: 40 };
const Y_TICKS = [0, 25, 50, 75, 100];
const TICK_LABEL_WIDTH = 48;

/** Percentages (0-100) over time, one shared axis. Only for series that
 * share that unit -- never two different scales on one chart. */
export function LineChart({ ticks, labels, series, ariaLabel, height = 200 }: Props) {
  const { t, f } = useI18n();
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const n = ticks.length;
  const plotW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const plotH = height - MARGIN.top - MARGIN.bottom;
  const step = n > 1 ? plotW / (n - 1) : 0;
  const x = (i: number) => MARGIN.left + (n > 1 ? step * i : plotW / 2);
  const y = (v: number) => MARGIN.top + plotH - (v / 100) * plotH;
  const tickEvery = step > 0 ? Math.max(1, Math.ceil(TICK_LABEL_WIDTH / step)) : 1;

  // Separate path segments around null values.
  const segments = (values: (number | null)[]) => {
    const parts: string[] = [];
    let current = '';
    values.forEach((v, i) => {
      if (v == null) {
        if (current) parts.push(current);
        current = '';
      } else {
        current += `${current ? 'L' : 'M'}${x(i)},${y(v)}`;
      }
    });
    if (current) parts.push(current);
    return parts;
  };

  const onPointerMove = (e: PointerEvent<SVGRectElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const i = step > 0 ? Math.round((e.clientX - box.left) / step) : 0;
    setActive(Math.min(n - 1, Math.max(0, i)));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    setActive((current) => Math.min(n - 1, Math.max(0, (current ?? n - 1) + (e.key === 'ArrowLeft' ? -1 : 1))));
  };

  const tooltipX = active != null ? Math.min(Math.max(x(active), 90), width - 90) : 0;

  return (
    <div className="line-chart">
      <ul className="legend legend-inline">
        {series.map((s) => (
          <li key={s.key}>
            <span className={`line-key ${s.className}`} aria-hidden="true" />
            <span className="legend-label">{s.label}</span>
          </li>
        ))}
      </ul>
      <div
        ref={ref}
        className="column-chart"
        tabIndex={0}
        role="group"
        aria-label={`${ariaLabel}. ${t('chart.keyboardHint')}`}
        onKeyDown={onKeyDown}
        onFocus={() => setActive((current) => current ?? n - 1)}
        onBlur={() => setActive(null)}
        style={{ height }}
      >
        {width > 0 && (
          <svg width={width} height={height} aria-hidden="true">
            {Y_TICKS.map((v) => (
              <g key={v}>
                <line className={v === 0 ? 'chart-baseline' : 'chart-gridline'} x1={MARGIN.left} x2={width - MARGIN.right} y1={y(v)} y2={y(v)} />
                <text className="chart-tick" x={MARGIN.left - 8} y={y(v)} dy="0.32em" textAnchor="end">
                  {f.pct(v)}
                </text>
              </g>
            ))}
            {ticks.map((tick, i) =>
              (n - 1 - i) % tickEvery === 0 ? (
                <text
                  key={i}
                  className="chart-tick"
                  x={x(i)}
                  y={height - 6}
                  textAnchor={i === n - 1 ? 'end' : i === 0 ? 'start' : 'middle'}
                >
                  {tick}
                </text>
              ) : null,
            )}
            {active != null && <line className="chart-crosshair" x1={x(active)} x2={x(active)} y1={MARGIN.top} y2={y(0)} />}
            {series.map((s) => (
              <g key={s.key} className={s.className}>
                {segments(s.values).map((d, i) => (
                  <path key={i} className="chart-line" d={d} />
                ))}
                {s.values.map((v, i) =>
                  // Points with no neighbour would be invisible as a line.
                  v != null && (active === i || s.values[i - 1] == null && s.values[i + 1] == null) ? (
                    <circle key={i} className="chart-dot" cx={x(i)} cy={y(v)} r={4} />
                  ) : null,
                )}
              </g>
            ))}
            <rect
              className="chart-hit"
              x={MARGIN.left - step / 2}
              y={MARGIN.top}
              width={plotW + step}
              height={plotH}
              onPointerMove={onPointerMove}
              onPointerLeave={() => setActive(null)}
            />
          </svg>
        )}
        {active != null && (
          <div className="chart-tooltip" style={{ left: tooltipX, top: MARGIN.top }} role="status">
            <span>{labels[active]}</span>
            {series.map((s) => (
              <span key={s.key} className="tooltip-row">
                <span className={`line-key ${s.className}`} aria-hidden="true" />
                <strong>{s.values[active] != null ? f.pct(s.values[active]!) : t('trend.noValue')}</strong>
                <span>{s.label}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
