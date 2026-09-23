import { useEffect, useId, useState } from 'react';
import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n/en';
import { useLive } from '../lib/live';
import { isoDay, PRESETS, resolvePreset, type RangePreset } from '../lib/range';

const PRESET_LABELS: Record<RangePreset, MessageKey> = {
  today: 'range.today',
  '7d': 'range.7d',
  '30d': 'range.30d',
  '90d': 'range.90d',
  all: 'range.all',
  custom: 'range.custom',
};

/** One row above the content it scopes: every figure below follows it. */
export function DateRangeFilter() {
  const { t } = useI18n();
  const { range, setRange } = useLive();
  const [customOpen, setCustomOpen] = useState(range.preset === 'custom');
  const [from, setFrom] = useState(range.from ?? isoDay(new Date()));
  const [to, setTo] = useState(range.to ?? isoDay(new Date()));
  const fromId = useId();
  const toId = useId();
  const today = isoDay(new Date());

  useEffect(() => {
    if (range.preset === 'custom') {
      setFrom(range.from ?? today);
      setTo(range.to ?? today);
    }
  }, [range, today]);

  const choose = (preset: RangePreset) => {
    if (preset === 'custom') {
      setCustomOpen(true);
      return;
    }
    setCustomOpen(false);
    setRange(resolvePreset(preset));
  };

  const applyCustom = () => {
    if (!from || !to) return;
    const [a, b] = from <= to ? [from, to] : [to, from];
    setRange({ preset: 'custom', from: a, to: b });
  };

  const selected = customOpen ? 'custom' : range.preset;

  return (
    <div className="filter-bar">
      <div className="filter-row" role="group" aria-label={t('range.label')}>
        <span className="filter-label">{t('range.label')}</span>
        <div className="segmented">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className={selected === p ? 'is-selected' : undefined}
              aria-pressed={selected === p}
              onClick={() => choose(p)}
            >
              {t(PRESET_LABELS[p])}
            </button>
          ))}
        </div>
        {customOpen && (
          <form
            className="custom-range"
            onSubmit={(e) => {
              e.preventDefault();
              applyCustom();
            }}
          >
            <label htmlFor={fromId}>{t('range.from')}</label>
            <input id={fromId} type="date" value={from} max={today} onChange={(e) => setFrom(e.target.value)} required />
            <label htmlFor={toId}>{t('range.to')}</label>
            <input id={toId} type="date" value={to} max={today} onChange={(e) => setTo(e.target.value)} required />
            <button type="submit" className="btn btn-small">
              {t('range.apply')}
            </button>
          </form>
        )}
      </div>
      <p className="filter-note">{t('range.note')}</p>
    </div>
  );
}
