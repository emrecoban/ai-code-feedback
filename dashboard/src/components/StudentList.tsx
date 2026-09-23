import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { fetchExport } from '../lib/api';
import { useApiErrorHandler, useSession } from '../lib/auth';
import { writeExport, type ExportKind } from '../lib/exportData';
import { useLive } from '../lib/live';
import type { StudentRow } from '../lib/types';
import { StudentItem } from './StudentItem';

type SortKey = 'active' | 'questions' | 'name';

interface Props {
  students: StudentRow[];
  expanded: ReadonlySet<string>;
  onToggle: (userId: string) => void;
  onRemoved: (userId: string) => void;
}

const byLastActive = (a: StudentRow, b: StudentRow) =>
  (b.last_active ? Date.parse(b.last_active) : 0) - (a.last_active ? Date.parse(a.last_active) : 0);

export function StudentList({ students, expanded, onToggle, onRemoved }: Props) {
  const { t, f } = useI18n();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('active');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? students.filter((s) => s.username.toLowerCase().includes(q)) : [...students];
    if (sort === 'name') filtered.sort((a, b) => a.username.localeCompare(b.username));
    else if (sort === 'questions') filtered.sort((a, b) => b.questions - a.questions || byLastActive(a, b));
    else filtered.sort(byLastActive);
    return filtered;
  }, [students, query, sort]);

  return (
    <section aria-labelledby="students-title" className="section">
      <div className="section-heading">
        <h2 id="students-title" className="section-title">
          {t('students.title')} <span className="count">{f.number(students.length)}</span>
        </h2>
        <div className="toolbar">
          <input
            type="search"
            className="search"
            placeholder={t('students.search')}
            aria-label={t('students.search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="select-label">
            <span className="visually-hidden">{t('students.sortBy')}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label={t('students.sortBy')}>
              <option value="active">{t('students.sort.active')}</option>
              <option value="questions">{t('students.sort.questions')}</option>
              <option value="name">{t('students.sort.name')}</option>
            </select>
          </label>
          <ExportMenu usernames={query.trim() ? new Set(rows.map((r) => r.username)) : null} disabled={rows.length === 0} />
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="card empty">{students.length === 0 ? t('students.empty') : t('students.noMatch')}</p>
      ) : (
        <ul className="student-list">
          {rows.map((s) => (
            <StudentItem
              key={s.user_id}
              student={s}
              expanded={expanded.has(s.user_id)}
              onToggle={() => onToggle(s.user_id)}
              onRemoved={onRemoved}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

/** Exports go through dashboard_export, which records them in the activity log. */
function ExportMenu({ usernames, disabled }: { usernames: Set<string> | null; disabled: boolean }) {
  const { t, lang, f } = useI18n();
  const { token } = useSession();
  const { range } = useLive();
  const handleError = useApiErrorHandler();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  const run = async (kind: ExportKind) => {
    setOpen(false);
    setBusy(true);
    setError(null);
    try {
      const data = await fetchExport(token, range);
      await writeExport({ kind, data, usernames, t, lang, languageName: f.languageName });
    } catch (err) {
      if (!handleError(err)) setError(t('export.failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="menu" ref={ref}>
      <button
        type="button"
        className="btn"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled || busy}
        onClick={() => setOpen((v) => !v)}
      >
        {busy ? t('export.working') : t('export.button')}
        <span className="caret" aria-hidden="true" />
      </button>
      {open && (
        <div className="menu-list" role="menu">
          <button type="button" role="menuitem" onClick={() => void run('xlsx')}>
            <strong>{t('export.xlsx')}</strong>
            <span>{t('export.xlsxHint')}</span>
          </button>
          <button type="button" role="menuitem" onClick={() => void run('csv-students')}>
            <strong>{t('export.csvStudents')}</strong>
          </button>
          <button type="button" role="menuitem" onClick={() => void run('csv-questions')}>
            <strong>{t('export.csvQuestions')}</strong>
          </button>
          <p className="menu-note">{t('export.scope')}</p>
        </div>
      )}
      {error && (
        <p className="form-error menu-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
