import { useState } from 'react';
import type { MessageKey } from '../../i18n/en';
import { useI18n } from '../../i18n';
import type { LevelCounts } from '../../lib/types';

// Ordered, so one hue stepped light -> dark: the further a student went
// down the hint ladder, the darker the segment.
const SEGMENTS: { key: keyof LevelCounts; label: MessageKey; hint: MessageKey }[] = [
  { key: 'hint', label: 'level.hint', hint: 'level.hintDesc' },
  { key: 'rule', label: 'level.rule', hint: 'level.ruleDesc' },
  { key: 'fix', label: 'level.fix', hint: 'level.fixDesc' },
];

/** Part-to-whole bar for how deep students went into the hint ladder. */
export function LevelBar({ counts }: { counts: LevelCounts }) {
  const { t, f } = useI18n();
  const [active, setActive] = useState<keyof LevelCounts | null>(null);
  const total = counts.hint + counts.rule + counts.fix;

  if (total === 0) return <p className="empty">{t('level.empty')}</p>;

  return (
    <div className="level-bar">
      <div
        className={`level-track${active ? ' has-active' : ''}`}
        role="img"
        aria-label={SEGMENTS.map((s) => `${t(s.label)}: ${f.number(counts[s.key])}`).join(', ')}
      >
        {SEGMENTS.filter((s) => counts[s.key] > 0).map((s) => (
          <span
            key={s.key}
            className={`level-segment level-${s.key}${active === s.key ? ' is-active' : ''}`}
            style={{ flexGrow: counts[s.key] }}
            onPointerEnter={() => setActive(s.key)}
            onPointerLeave={() => setActive(null)}
          />
        ))}
      </div>
      <ul className="legend">
        {SEGMENTS.map((s) => (
          <li
            key={s.key}
            className={active === s.key ? 'is-active' : undefined}
            title={t(s.hint)}
            onPointerEnter={() => setActive(s.key)}
            onPointerLeave={() => setActive(null)}
          >
            <span className={`swatch level-${s.key}`} aria-hidden="true" />
            <span className="legend-label">{t(s.label)}</span>
            <span className="legend-value">
              {f.number(counts[s.key])} <span className="muted">· {f.percent(counts[s.key], total)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
