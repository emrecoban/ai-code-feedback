import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  /** Only for values that mean something is wrong; always shown with an icon and text. */
  warning?: boolean;
  size?: 'normal' | 'small';
}

export function StatTile({ label, value, sub, warning, size = 'normal' }: Props) {
  return (
    <div className={`stat-tile stat-${size}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && (
        <div className={`stat-sub${warning ? ' is-warning' : ''}`}>
          {warning && (
            <span className="warning-icon" aria-hidden="true">
              !
            </span>
          )}
          {sub}
        </div>
      )}
    </div>
  );
}
