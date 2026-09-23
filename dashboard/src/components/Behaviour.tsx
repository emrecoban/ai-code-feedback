import { useState, type ReactNode } from 'react';
import { useNow } from '../hooks/usePolling';
import { useI18n } from '../i18n';
import { en, type MessageKey } from '../i18n/en';
import { fetchEngagement } from '../lib/api';
import { useLive, useLiveQuery } from '../lib/live';
import type { Engagement } from '../lib/types';
import { BarList } from './charts/BarList';

/** Label-value rows for a card; every value is printed, nothing is hidden
 * behind a hover. */
export function Metrics({ rows }: { rows: { label: string; value: ReactNode; sub?: ReactNode }[] }) {
  return (
    <dl className="metrics">
      {rows.map((r) => (
        <div key={r.label}>
          <dt>{r.label}</dt>
          <dd>
            {r.value}
            {r.sub != null && r.sub !== '' && <span className="muted"> · {r.sub}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** A message key for a value the extension sends, or null for one this
 * dashboard has no label for yet. */
function knownKey(prefix: string, value: string): MessageKey | null {
  const key = `${prefix}.${value}`;
  return key in en ? (key as MessageKey) : null;
}

const LEVEL_KEYS: Record<1 | 2 | 3, MessageKey> = { 1: 'level.hint', 2: 'level.rule', 3: 'level.fix' };
const LEVEL_CLASSES: Record<1 | 2 | 3, string> = { 1: 'level-hint', 2: 'level-rule', 3: 'level-fix' };
const SEVERITIES = ['error', 'warning', 'information', 'hint', 'unknown'];

/** Behaviour around explanations for the whole class (no student) or one
 * student: whether errors went away, how explanations were read, what
 * happened before and after, and how students work. */
export function Behaviour({ data, student }: { data: Engagement; student?: boolean }) {
  return (
    <>
      <div className="chart-grid chart-grid-even">
        <EffectCard data={data} />
        <ReadingCard data={data} />
      </div>
      <div className="detail-grid">
        <BeforeCard data={data} />
        <AfterCard data={data} />
        <SurfacesCard data={data} />
      </div>
      <div className="detail-grid">
        <HabitsCard data={data} />
        <RunsCard data={data} />
        <FixingCard data={data} />
      </div>
      <FilesCard data={data} student={student} />
    </>
  );
}

/** Folded away in a student's panel, and loaded only once opened. */
export function StudentBehaviour({ userId }: { userId: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <details className="behaviour-details" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{t('behaviour.show')}</summary>
      {open && <StudentBehaviourBody userId={userId} />}
    </details>
  );
}

function StudentBehaviourBody({ userId }: { userId: string }) {
  const { t } = useI18n();
  const { range } = useLive();
  const { data, error, reload } = useLiveQuery((token) => fetchEngagement(token, range, userId), [
    userId,
    range.from,
    range.to,
  ]);
  if (!data) {
    return error ? (
      <p className="form-error" role="alert">
        {t('common.loadError')}{' '}
        <button type="button" className="link" onClick={() => void reload()}>
          {t('common.retry')}
        </button>
      </p>
    ) : (
      <p className="empty">{t('common.loading')}</p>
    );
  }
  return (
    <div className="student-detail behaviour-body">
      <Behaviour data={data} student />
    </div>
  );
}

function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="card-header">
      <div>
        <h3>{title}</h3>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
    </header>
  );
}

function EffectCard({ data }: { data: Engagement }) {
  const { t, f } = useI18n();
  const r = data.resolution;
  const rows = ([1, 2, 3] as const).map(
    (level) => r.by_level.find((x) => x.level === level) ?? { level, questions: 0, resolved: 0, median_ms: null },
  );
  const span = (ms: number | null) => (ms != null ? f.span(ms) : '—');

  return (
    <section className="card">
      <CardHeader title={t('effect.title')} subtitle={t('effect.sub')} />
      {r.questions === 0 ? (
        <p className="empty">{t('effect.none')}</p>
      ) : (
        <>
          <div className="table-scroll">
            <table className="data-table rank-table">
              <thead>
                <tr>
                  <th scope="col">{t('col.level')}</th>
                  <th scope="col" className="num">{t('col.questions')}</th>
                  <th scope="col" className="num">{t('col.errorGone')}</th>
                  <th scope="col" className="num">{t('col.medianTime')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.level}>
                    <td>
                      <span className="level-name">
                        <span className={`swatch ${LEVEL_CLASSES[row.level]}`} aria-hidden="true" />
                        {t(LEVEL_KEYS[row.level])}
                      </span>
                      <span className="rank-bar" aria-hidden="true">
                        <span style={{ width: `${row.questions ? (100 * row.resolved) / row.questions : 0}%` }} />
                      </span>
                    </td>
                    <td className="num">{f.number(row.questions)}</td>
                    <td className="num">
                      {f.percent(row.resolved, row.questions)} <span className="muted">({f.number(row.resolved)})</span>
                    </td>
                    <td className="num">{span(row.median_ms)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">{t('effect.total')}</th>
                  <td className="num">{f.number(r.questions)}</td>
                  <td className="num">
                    {f.percent(r.resolved, r.questions)} <span className="muted">({f.number(r.resolved)})</span>
                  </td>
                  <td className="num">{span(r.median_ms)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="chart-note">{t('effect.note')}</p>
        </>
      )}
    </section>
  );
}

function ReadingCard({ data }: { data: Engagement }) {
  const { t, f } = useI18n();
  const r = data.reading;
  const span = (ms: number | null) => (ms != null ? f.span(ms) : '—');
  const partOf = (part: number, whole: number) =>
    whole > 0 ? t('common.partOf', { part: f.number(part), whole: f.number(whole) }) : undefined;
  // Keys are the rung labels ("L0".."L3") or "unknown".
  const copiedLevels = Object.entries(r.copied_by_level)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([level, n]) => `${level === 'unknown' ? '?' : level} ×${f.number(n)}`)
    .join(', ');

  return (
    <section className="card">
      <CardHeader
        title={t('reading.title')}
        subtitle={t('reading.sub', { measured: f.number(r.measured), total: f.number(r.explanations) })}
      />
      {r.explanations === 0 ? (
        <p className="empty">{t('reading.none')}</p>
      ) : (
        <Metrics
          rows={[
            {
              label: t('reading.onScreen'),
              value: f.percent(r.visible_at_delivery, r.measured),
              sub: partOf(r.visible_at_delivery, r.measured),
            },
            { label: t('reading.visibleFor'), value: span(r.median_visible_ms) },
            { label: t('reading.backToCode'), value: span(r.median_ms_to_return) },
            { label: t('reading.toRule'), value: span(r.median_ms_to_rule) },
            { label: t('reading.toFix'), value: span(r.median_ms_to_fix) },
            { label: t('reading.abandoned'), value: f.number(r.abandoned), sub: partOf(r.abandoned, r.explanations) },
            { label: t('reading.reopened'), value: f.number(r.reopened) },
            { label: t('reading.copied'), value: f.number(r.copied), sub: copiedLevels },
          ]}
        />
      )}
    </section>
  );
}

function BeforeCard({ data }: { data: Engagement }) {
  const { t, f } = useI18n();
  const b = data.before;
  return (
    <section className="card">
      <CardHeader title={t('before.title')} subtitle={t('before.sub')} />
      <Metrics
        rows={[
          { label: t('before.wait'), value: b.median_help_latency_ms != null ? f.span(b.median_help_latency_ms) : '—' },
          { label: t('before.edits'), value: b.median_edits_before_ask != null ? f.decimal(b.median_edits_before_ask) : '—' },
          { label: t('before.repeats'), value: f.number(b.repeats) },
          { label: t('before.quickRepeats'), value: f.number(b.quick_repeats) },
          { label: t('before.pickerPreset'), value: f.number(b.picker_abandoned.preset) },
          { label: t('before.pickerFree'), value: f.number(b.picker_abandoned.free_text) },
        ]}
      />
    </section>
  );
}

function AfterCard({ data }: { data: Engagement }) {
  const { t, f } = useI18n();
  const a = data.after;
  const partOf = (part: number, whole: number) =>
    whole > 0 ? t('common.partOf', { part: f.number(part), whole: f.number(whole) }) : undefined;
  return (
    <section className="card">
      <CardHeader title={t('after.title')} subtitle={t('after.sub')} />
      {a.edited === 0 && a.undone === 0 ? (
        <p className="empty">{t('after.none')}</p>
      ) : (
        <Metrics
          rows={[
            { label: t('after.edited'), value: f.number(a.edited) },
            { label: t('after.onLine'), value: f.percent(a.on_line, a.edited), sub: partOf(a.on_line, a.edited) },
            { label: t('after.overlap'), value: a.avg_overlap_pct != null ? f.pct(a.avg_overlap_pct) : '—' },
            { label: t('after.undone'), value: f.number(a.undone) },
          ]}
        />
      )}
    </section>
  );
}

function SurfacesCard({ data }: { data: Engagement }) {
  const { t } = useI18n();
  return (
    <section className="card">
      <CardHeader title={t('surfaces.title')} subtitle={t('surfaces.sub')} />
      {data.surfaces.length === 0 ? (
        <p className="empty">{t('surfaces.none')}</p>
      ) : (
        <BarList
          ariaLabel={t('surfaces.title')}
          items={data.surfaces.map((s) => {
            const key = knownKey('surface', s.surface);
            return { key: s.surface, label: key ? t(key) : s.surface, value: s.questions };
          })}
        />
      )}
    </section>
  );
}

function HabitsCard({ data }: { data: Engagement }) {
  const { t, f } = useI18n();
  const h = data.habits;
  return (
    <section className="card">
      <CardHeader title={t('habits.title')} subtitle={t('habits.sub')} />
      {h.sessions === 0 ? (
        <p className="empty">{t('habits.none')}</p>
      ) : (
        <Metrics
          rows={[
            {
              label: t('habits.sessions'),
              value: f.number(h.sessions),
              sub: t('habits.withoutHelp', { pct: f.percent(h.without_help, h.sessions) }),
            },
            { label: t('habits.length'), value: h.avg_session_minutes != null ? f.duration(h.avg_session_minutes * 60) : '—' },
            { label: t('habits.breaks'), value: h.avg_breaks != null ? f.decimal(h.avg_breaks) : '—' },
            { label: t('habits.focusLosses'), value: f.number(h.focus_losses) },
            { label: t('habits.unfocused'), value: f.duration(h.unfocused_seconds) },
            { label: t('habits.editorSwitches'), value: f.number(h.editor_switches) },
            { label: t('habits.filesVisited'), value: f.number(h.files_visited) },
            { label: t('habits.filesCreated'), value: f.number(h.files_created) },
            { label: t('habits.saves'), value: f.number(h.saves) },
            { label: t('habits.debugRuns'), value: f.number(h.debug_runs) },
            { label: t('habits.taskRuns'), value: f.number(h.task_runs) },
            {
              label: t('habits.largePastes'),
              value: f.number(h.large_pastes),
              sub: h.large_pastes > 0 ? t('habits.largePastesLines', { n: f.number(h.large_paste_lines) }) : undefined,
            },
            { label: t('habits.languageChanges'), value: f.number(h.language_changes) },
          ]}
        />
      )}
    </section>
  );
}

function RunsCard({ data }: { data: Engagement }) {
  const { t, f } = useI18n();
  const r = data.runs;
  const partOf = (part: number, whole: number) =>
    whole > 0 ? t('common.partOf', { part: f.number(part), whole: f.number(whole) }) : undefined;
  return (
    <section className="card">
      <CardHeader title={t('runs.title')} subtitle={t('runs.sub')} />
      {r.total === 0 ? (
        <p className="empty">{t('runs.none')}</p>
      ) : (
        <Metrics
          rows={[
            { label: t('runs.total'), value: f.number(r.total) },
            { label: t('runs.success'), value: f.percent(r.success, r.total), sub: partOf(r.success, r.total) },
            { label: t('runs.after'), value: f.number(r.after_explanation) },
            {
              label: t('runs.afterSuccess'),
              value: f.percent(r.after_explanation_success, r.after_explanation),
              sub: partOf(r.after_explanation_success, r.after_explanation),
            },
          ]}
        />
      )}
    </section>
  );
}

function FixingCard({ data }: { data: Engagement }) {
  const { t, f } = useI18n();
  const e = data.errors;
  const severities = Object.entries(e.severity)
    .filter(([, n]) => n > 0)
    .sort(([a], [b]) => {
      const ia = SEVERITIES.indexOf(a);
      const ib = SEVERITIES.indexOf(b);
      return (ia < 0 ? SEVERITIES.length : ia) - (ib < 0 ? SEVERITIES.length : ib);
    });
  return (
    <section className="card">
      <CardHeader title={t('fixing.title')} subtitle={t('fixing.sub')} />
      <Metrics
        rows={[
          { label: t('fixing.unaided'), value: f.number(e.fixed_unaided) },
          { label: t('fixing.editsPerFix'), value: e.fixed_unaided > 0 ? f.decimal(e.silent_edits / e.fixed_unaided) : '—' },
          { label: t('fixing.followOn'), value: f.number(e.follow_on) },
        ]}
      />
      {severities.length > 0 && (
        <>
          <h4>{t('fixing.severity')}</h4>
          <BarList
            ariaLabel={t('fixing.severity')}
            items={severities.map(([severity, n]) => {
              const key = knownKey('severity', severity);
              return { key: severity, label: key ? t(key) : severity, value: n };
            })}
          />
        </>
      )}
    </section>
  );
}

function FilesCard({ data, student }: { data: Engagement; student?: boolean }) {
  const { t, f } = useI18n();
  const now = useNow(10_000);
  const num = (n: number | null) => (n != null ? f.number(n) : '—');
  return (
    <section className="card">
      <CardHeader title={t('files.title')} subtitle={t('files.sub')} />
      {data.files.length === 0 ? (
        <p className="empty">{t('files.none')}</p>
      ) : (
        <div className="table-scroll table-limit">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">{t('col.when')}</th>
                {!student && <th scope="col">{t('col.student')}</th>}
                <th scope="col">{t('col.file')}</th>
                <th scope="col" className="num">{t('col.withErrors')}</th>
                <th scope="col" className="num">{t('col.edits')}</th>
                <th scope="col" className="num">{t('col.errorsSeen')}</th>
                <th scope="col" className="num">{t('col.errorsAsked')}</th>
              </tr>
            </thead>
            <tbody>
              {data.files.map((file, i) => (
                <tr key={`${file.at}-${i}`}>
                  <td className="nowrap" title={f.fullDateTime(file.at)}>
                    {f.relative(file.at, now, t('common.never'))}
                  </td>
                  {!student && <td>{file.username}</td>}
                  <td className="mono">{file.file_name ?? '—'}</td>
                  <td className="num">{file.ms_with_errors != null ? f.span(file.ms_with_errors) : '—'}</td>
                  <td className="num">{num(file.edits)}</td>
                  <td className="num">{num(file.seen)}</td>
                  <td className="num">{num(file.asked)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
