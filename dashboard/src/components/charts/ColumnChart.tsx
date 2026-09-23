import { useState, type KeyboardEvent, type PointerEvent } from 'react';
import { useElementWidth } from '../../hooks/usePolling';
import { useI18n } from '../../i18n';

export interface ColumnDatum {
  key: string;
  /** Axis tick text, e.g. "22 Sep" or "14:00". */
  tick: string;
  /** Tooltip heading, e.g. "Tue, 22 Sep". */
  label: string;
  value: number;
  /** Extra tooltip line, e.g. "2 students active". */
  detail?: string;
}

interface Props {
  data: ColumnDatum[];
  /** The tooltip's headline, e.g. n => "3 questions". */
  formatValue: (n: number) => string;
  ariaLabel: string;
  height?: number;
}

const MARGIN = { top: 18, right: 6, bottom: 24, left: 40 };
const MAX_BAR = 24;
const RADIUS = 4;
const TICK_LABEL_WIDTH = 44;

/** Clean integer ticks (every series here counts something). */
function niceScale(max: number): { top: number; ticks: number[] } {
  if (max <= 0) return { top: 4, ticks: [0, 2, 4] };
  const rough = max / 3;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const step = Math.max(1, Math.round([1, 2, 5, 10].map((m) => m * pow).find((s) => s >= rough) ?? pow * 10));
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let t = 0; t <= top; t += step) ticks.push(t);
  return { top, ticks };
}

/** A column with a rounded data end and a square foot on the baseline. */
function columnPath(x: number, yTop: number, w: number, h: number): string {
  const r = Math.min(RADIUS, w / 2, h);
  return `M${x},${yTop + h}V${yTop + r}Q${x},${yTop} ${x + r},${yTop}H${x + w - r}Q${x + w},${yTop} ${x + w},${yTop + r}V${yTop + h}Z`;
}

export function ColumnChart({ data, formatValue, ariaLabel, height = 180 }: Props) {
  const { t, f } = useI18n();
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const plotW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const plotH = height - MARGIN.top - MARGIN.bottom;
  const n = data.length;
  const max = data.reduce((m, d) => Math.max(m, d.value), 0);
  const { top, ticks } = niceScale(max);
  const band = n ? plotW / n : 0;
  const barW = Math.max(1, Math.min(MAX_BAR, band - 2));
  const y = (v: number) => MARGIN.top + plotH - (v / top) * plotH;
  const centerX = (i: number) => MARGIN.left + band * i + band / 2;

  // Label only the most recent peak -- the axis and tooltip carry the rest.
  let peak = -1;
  if (max > 0) data.forEach((d, i) => d.value === max && (peak = i));

  // Thin the ticks so they never collide; count back from the newest
  // column so it is always labelled. The newest label is right-aligned to
  // stay inside the plot, so any tick too close to it is dropped as well.
  const tickEvery = band > 0 ? Math.max(1, Math.ceil(TICK_LABEL_WIDTH / band)) : 1;
  const showTick = (i: number) => {
    const fromEnd = n - 1 - i;
    if (fromEnd % tickEvery !== 0) return false;
    return fromEnd === 0 || fromEnd * band >= TICK_LABEL_WIDTH * 1.5 - barW / 2;
  };

  const onPointerMove = (e: PointerEvent<SVGRectElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const i = Math.floor((e.clientX - box.left) / band);
    setActive(i >= 0 && i < n ? i : null);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    setActive((current) => {
      const from = current ?? n - 1;
      if (e.key === 'Home') return 0;
      if (e.key === 'End') return n - 1;
      return Math.min(n - 1, Math.max(0, from + (e.key === 'ArrowLeft' ? -1 : 1)));
    });
  };

  const activeDatum = active != null ? data[active] : null;
  const tooltipX = active != null ? Math.min(Math.max(centerX(active), 80), width - 80) : 0;

  return (
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
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                className={tick === 0 ? 'chart-baseline' : 'chart-gridline'}
                x1={MARGIN.left}
                x2={width - MARGIN.right}
                y1={y(tick)}
                y2={y(tick)}
              />
              <text className="chart-tick" x={MARGIN.left - 8} y={y(tick)} dy="0.32em" textAnchor="end">
                {f.compact(tick)}
              </text>
            </g>
          ))}

          {data.map((d, i) => {
            const h = y(0) - y(d.value);
            const x = centerX(i) - barW / 2;
            return (
              <g key={d.key}>
                {d.value > 0 && (
                  <path className={`chart-column${active === i ? ' is-active' : ''}`} d={columnPath(x, y(d.value), barW, h)} />
                )}
                {i === peak && active !== i && (
                  <text className="chart-value" x={centerX(i)} y={y(d.value) - 6} textAnchor="middle">
                    {f.compact(d.value)}
                  </text>
                )}
                {showTick(i) && (
                  <text
                    className="chart-tick"
                    x={i === n - 1 ? centerX(i) + barW / 2 : centerX(i)}
                    y={height - 6}
                    textAnchor={i === n - 1 ? 'end' : 'middle'}
                  >
                    {d.tick}
                  </text>
                )}
              </g>
            );
          })}

          {active != null && (
            <line className="chart-crosshair" x1={centerX(active)} x2={centerX(active)} y1={MARGIN.top} y2={y(0)} />
          )}

          {/* One hit area per column band, much wider than the bar itself. */}
          <rect
            className="chart-hit"
            x={MARGIN.left}
            y={MARGIN.top}
            width={plotW}
            height={plotH}
            onPointerMove={onPointerMove}
            onPointerLeave={() => setActive(null)}
          />
        </svg>
      )}

      {activeDatum && (
        <div className="chart-tooltip" style={{ left: tooltipX, top: MARGIN.top }} role="status">
          <strong>{formatValue(activeDatum.value)}</strong>
          <span>{activeDatum.label}</span>
          {activeDatum.detail && <span>{activeDatum.detail}</span>}
        </div>
      )}
    </div>
  );
}
