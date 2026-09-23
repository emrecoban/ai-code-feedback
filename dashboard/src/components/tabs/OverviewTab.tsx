import { useCallback, useState } from 'react';
import { useNow } from '../../hooks/usePolling';
import { useI18n } from '../../i18n';
import { fetchOverview, fetchStudents } from '../../lib/api';
import { levelKey } from '../../lib/labels';
import { useLive, useLiveQuery } from '../../lib/live';
import type { AttentionEntry, Overview } from '../../lib/types';
import { ChartCard, useSlotLabels } from '../charts/ChartCard';
import { ColumnChart } from '../charts/ColumnChart';
import { LevelBar } from '../charts/LevelBar';
import { useOpenQuestion } from '../QuestionDialog';
import { StatTile } from '../StatTile';
import { StudentList } from '../StudentList';

export function OverviewTab() {
  const { t } = useI18n();
  const { range } = useLive();
  const overview = useLiveQuery((token) => fetchOverview(token, range), [range.from, range.to]);
  const students = useLiveQuery((token) => fetchStudents(token, range), [range.from, range.to]);
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());

  const toggle = useCallback((userId: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }, []);

  const openStudent = useCallback((userId: string) => {
    setExpanded((current) => new Set(current).add(userId));
    // After the panel has rendered.
    requestAnimationFrame(() =>
      document.getElementById(`student-${userId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  }, []);

  const onRemoved = useCallback((userId: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      next.delete(userId);
      return next;
    });
  }, []);

  if (!overview.data || !students.data) {
    return overview.error || students.error ? (
      <div className="card empty">
        <p>{t('common.loadError')}</p>
        <button
          type="button"
          className="btn"
          onClick={() => {
            void overview.reload();
            void students.reload();
          }}
        >
          {t('common.retry')}
        </button>
      </div>
    ) : (
      <p className="empty">{t('common.loading')}</p>
    );
  }

  return (
    <>
      <AtAGlance data={overview.data} onOpenStudent={openStudent} />
      <StudentList
        students={students.data}
        expanded={expanded}
        onToggle={toggle}
        onRemoved={onRemoved}
      />
    </>
  );
}

function AtAGlance({ data, onOpenStudent }: { data: Overview; onOpenStudent: (userId: string) => void }) {
  const { t, tp, f } = useI18n();
  const slot = useSlotLabels();
  const openQuestion = useOpenQuestion();
  const now = useNow(10_000);
  const rated = data.helpful_up + data.helpful_down;
  const { resolution, sessions } = data;
  const bucket = data.range.bucket;

  return (
    <section aria-labelledby="overview-title" className="section">
      <h2 id="overview-title" className="section-title">
        {t('overview.title')}
      </h2>

      {/* Five across on wide screens: activity on the first row, whether
          help worked on the second. */}
      <div className="tile-grid tile-grid-5">
        <StatTile
          label={t('tile.online')}
          value={f.number(data.online_now)}
          sub={t('tile.onlineSub', { students: tp('count.student', data.students_total) })}
        />
        <StatTile
          label={t('tile.active')}
          value={f.number(data.active_students)}
          sub={data.new_students > 0 ? tp('tile.activeSub', data.new_students) : t('tile.activeSubNone')}
        />
        <StatTile
          label={t('tile.questions')}
          value={f.number(data.questions)}
          sub={t('tile.questionsSub', { n: f.number(data.questions_previous) })}
        />
        <StatTile label={t('tile.activeTime')} value={f.duration(data.active_seconds)} sub={t('tile.activeTimeSub')} />
        <StatTile
          label={t('tile.noHelp')}
          value={f.percent(sessions.without_help, sessions.total)}
          sub={
            sessions.total > 0
              ? t('tile.noHelpSub', { part: f.number(sessions.without_help), whole: f.number(sessions.total) })
              : t('tile.noSessions')
          }
        />
        <StatTile
          label={t('tile.hint')}
          value={f.percent(data.levels.hint, data.questions)}
          sub={
            data.questions > 0
              ? t('tile.hintSub', { part: f.number(data.levels.hint), whole: f.number(data.questions) })
              : t('tile.noQuestions')
          }
        />
        <StatTile
          label={t('tile.resolved')}
          value={f.percent(resolution.resolved, resolution.questions)}
          sub={
            resolution.questions === 0
              ? t('tile.noErrorQuestions')
              : t(resolution.median_ms != null ? 'tile.resolvedSub' : 'tile.resolvedSubNoTime', {
                  part: f.number(resolution.resolved),
                  whole: f.number(resolution.questions),
                  time: resolution.median_ms != null ? f.span(resolution.median_ms) : '',
                })
          }
        />
        <StatTile label={t('tile.fixed')} value={f.number(data.fixed_unaided)} sub={t('tile.fixedSub')} />
        <StatTile
          label={t('tile.helpful')}
          value={f.percent(data.helpful_up, rated)}
          sub={rated > 0 ? t('tile.helpfulSub', { part: f.number(data.helpful_up), whole: f.number(rated) }) : t('tile.noRatings')}
        />
        <StatTile
          label={t('tile.latency')}
          value={f.latency(data.avg_latency_ms)}
          warning={data.failed_requests > 0}
          sub={data.failed_requests > 0 ? tp('tile.failures', data.failed_requests) : t('tile.noFailures')}
        />
      </div>

      <NeedsAttention entries={data.attention} onOpenStudent={onOpenStudent} />

      <div className="chart-grid">
        <ChartCard
          title={t('chart.questionsOverTime')}
          subtitle={t(`chart.bucket.${bucket}`)}
          table={
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">{t('col.time')}</th>
                  <th scope="col" className="num">{t('col.questions')}</th>
                  <th scope="col" className="num">{t('col.activeStudents')}</th>
                </tr>
              </thead>
              <tbody>
                {[...data.series].reverse().map((d) => (
                  <tr key={d.slot}>
                    <td>{slot.long(d.slot, bucket)}</td>
                    <td className="num">{f.number(d.questions)}</td>
                    <td className="num">{f.number(d.students)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        >
          <ColumnChart
            ariaLabel={t('chart.questionsOverTime')}
            formatValue={(n) => tp('count.question', n)}
            data={data.series.map((d) => ({
              key: d.slot,
              tick: slot.tick(d.slot, bucket),
              label: slot.long(d.slot, bucket),
              value: d.questions,
              detail: tp('chart.activeDetail', d.students),
            }))}
          />
        </ChartCard>

        <ChartCard title={t('chart.depth')} subtitle={t('chart.depthSub')}>
          <LevelBar counts={data.levels} />
        </ChartCard>
      </div>

      <section className="card" aria-labelledby="latest-title">
        <header className="card-header">
          <div>
            <h3 id="latest-title">{t('latest.title')}</h3>
            <p className="card-subtitle">{t('latest.subtitle')}</p>
          </div>
        </header>
        {data.recent.length === 0 ? (
          <p className="empty">{t('latest.empty')}</p>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">{t('col.when')}</th>
                  <th scope="col">{t('col.student')}</th>
                  <th scope="col">{t('col.question')}</th>
                  <th scope="col">{t('col.source')}</th>
                  <th scope="col">{t('col.wentTo')}</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((q) => (
                  <tr key={q.id}>
                    <td className="nowrap" title={f.fullDateTime(q.created_at)}>
                      {f.relative(q.created_at, now, t('common.never'))}
                    </td>
                    <td>
                      <button type="button" className="link" onClick={() => onOpenStudent(q.user_id)}>
                        {q.username}
                      </button>
                    </td>
                    <td className="wrap">
                      <button type="button" className="link link-plain" onClick={() => openQuestion(q.id)}>
                        {q.title ?? t('common.untitled')}
                      </button>
                      {q.file_name && <span className="file-name">{q.file_name}</span>}
                    </td>
                    <td className="nowrap">{t(`trigger.${q.trigger_source}`)}</td>
                    <td className="nowrap">{t(levelKey(q.max_level_reached))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}

function NeedsAttention({ entries, onOpenStudent }: { entries: AttentionEntry[]; onOpenStudent: (id: string) => void }) {
  const { t, tp, f } = useI18n();

  const reasonText = (entry: AttentionEntry, reason: AttentionEntry['reasons'][number]) => {
    const c = entry.counts;
    switch (reason) {
      case 'repeat_error':
        return t('attention.repeat_error', { n: f.number(c.repeat) });
      case 'still_stuck':
        return tp('attention.still_stuck', c.still_stuck);
      case 'needs_fix':
        return t('attention.needs_fix', { fix: f.number(c.fix), questions: f.number(c.questions) });
      case 'many_attempts':
        return t('attention.many_attempts', { n: f.decimal(c.avg_edits) });
      case 'unhelpful':
        return t('attention.unhelpful', { n: f.number(c.unhelpful) });
      case 'inactive':
        return tp('attention.inactive', c.days_inactive ?? 0);
    }
  };

  return (
    <section className="card attention" aria-labelledby="attention-title">
      <header className="card-header">
        <div>
          <h3 id="attention-title">
            {t('attention.title')}
            {entries.length > 0 && <span className="count">{f.number(entries.length)}</span>}
          </h3>
          <p className="card-subtitle">{t('attention.subtitle')}</p>
        </div>
      </header>
      {entries.length === 0 ? (
        <p className="empty">{t('attention.empty')}</p>
      ) : (
        <ul className="attention-list">
          {entries.map((entry) => (
            <li key={entry.user_id}>
              <button type="button" className="link" onClick={() => onOpenStudent(entry.user_id)}>
                {entry.username}
              </button>
              <span className="chips">
                {entry.reasons.map((r) => (
                  <span key={r} className="chip chip-warning">
                    <span className="warning-icon" aria-hidden="true">
                      !
                    </span>
                    {reasonText(entry, r)}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      )}
      <details className="rules">
        <summary>{t('attention.rulesTitle')}</summary>
        <p>{t('attention.rules')}</p>
      </details>
    </section>
  );
}
