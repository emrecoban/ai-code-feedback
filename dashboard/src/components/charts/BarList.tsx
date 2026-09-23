import { useI18n } from '../../i18n';

interface Item {
  key: string;
  label: string;
  value: number;
}

/** Labelled horizontal bars for a short ranked list; every value is printed,
 * so nothing depends on hovering. */
export function BarList({ items, ariaLabel }: { items: Item[]; ariaLabel: string }) {
  const { f } = useI18n();
  const max = items.reduce((m, it) => Math.max(m, it.value), 0);
  return (
    <ul className="bar-list" aria-label={ariaLabel}>
      {items.map((it) => (
        <li key={it.key}>
          <span className="bar-list-label" title={it.label}>
            {it.label}
          </span>
          <span className="bar-list-track" aria-hidden="true">
            <span className="bar-list-fill" style={{ width: `${max ? (100 * it.value) / max : 0}%` }} />
          </span>
          <span className="bar-list-value">{f.number(it.value)}</span>
        </li>
      ))}
    </ul>
  );
}
