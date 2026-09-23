import { useNow } from '../hooks/usePolling';
import { useI18n } from '../i18n';
import { editorLanguageName, osName } from '../i18n/format';
import type { MessageKey } from '../i18n/en';
import { fetchStudentDetail } from '../lib/api';
import { levelKey } from '../lib/labels';
import { useLive, useLiveQuery } from '../lib/live';
import type { StudentDetail as Detail } from '../lib/types';
import { StudentBehaviour } from './Behaviour';
import { BarList } from './charts/BarList';
import { ChartCard, useSlotLabels } from './charts/ChartCard';
import { ColumnChart } from './charts/ColumnChart';
import { LevelBar } from './charts/LevelBar';
import { useOpenQuestion } from './QuestionDialog';
import { StatTile } from './StatTile';
import { TrendCard } from './TrendCard';

export function StudentDetail({ userId }: { userId: string }) {
  const { t } = useI18n();
  const { range } = useLive();
  const { data, error, reload } = useLiveQuery((token) => fetchStudentDetail(token, userId, range), [
    userId,
    range.from,
    range.to,
  ]);

  if (!data) {
    return error ? (
      <p className="form-error" role="alert">
        {t('detail.loadError')}{' '}
        <button type="button" className="link" onClick={() => void reload()}>
          {t('common.retry')}
        </button>
      </p>
    ) : (
      <p className="empty">{t('common.loading')}</p>
    );
  }
  return <DetailBody detail={data} />;
}

function DetailBody({ detail }: { detail: Detail }) {
  const { t, tp, f } = useI18n();
  const slot = useSlotLabels();
  const openQuestion = useOpenQuestion();
  const now = useNow(10_000);
  const { profile, last_session: session, activity, help, summary } = detail;
  const bucket = detail.range.bucket;
  const selfReports =
    help.helpful_up + help.helpful_down + help.solved + help.still_stuck + help.confident_yes + help.confident_maybe + help.confident_no;

  return (
    <div className="student-detail">
      <dl className="facts">
        <div>
          <dt>{t('detail.joined')}</dt>
          <dd>{f.date(profile.created_at)}</dd>
        </div>
        <div>
          <dt>{t('detail.lastSession')}</dt>
          <dd>{session ? f.dateTime(session.last_seen_at) : '—'}</dd>
        </div>
        <div>
          <dt>{t('detail.consent')}</dt>
          <dd>{t(`consent.${profile.consent_status}`)}</dd>
        </div>
        <div>
          <dt>{t('detail.feedbackLanguage')}</dt>
          <dd>{f.languageName(profile.feedback_language)}</dd>
        </div>
        <div>
          <dt>{t('detail.extension')}</dt>
          <dd>{session?.extension_version ?? '—'}</dd>
        </div>
        <div>
          <dt>{t('detail.vscode')}</dt>
          <dd>{session?.vscode_version ?? '—'}</dd>
        </div>
        <div>
          <dt>{t('detail.system')}</dt>
          <dd>{osName(session?.os ?? null)}</dd>
        </div>
      </dl>

      <div className="tile-grid">
        <StatTile size="small" label={t('detail.sessions')} value={f.number(activity.sessions)} sub={tp('detail.activeDays', activity.active_days)} />
        <StatTile size="small" label={t('detail.activeTime')} value={f.duration(activity.active_seconds)} sub={tp('detail.saves', activity.saves)} />
        <StatTile
          size="small"
          label={t('detail.lines')}
          value={`${f.number(activity.lines_written)} / ${f.number(activity.lines_deleted)}`}
          sub={tp('detail.pastes', activity.large_pastes)}
        />
        <StatTile
          size="small"
          label={t('detail.questions')}
          value={f.number(help.questions)}
          sub={t('detail.questionsSub', { errors: f.number(help.from_errors), selections: f.number(help.from_selection) })}
        />
        <StatTile
          size="small"
          label={t('detail.hint')}
          value={f.percent(help.hint, help.questions)}
          sub={help.questions ? t('detail.hintSub', { part: f.number(help.hint), whole: f.number(help.questions) }) : t('detail.noQuestions')}
        />
        <StatTile size="small" label={t('detail.fixed')} value={f.number(activity.fixed_unaided)} sub={tp('detail.offers', activity.help_offers)} />
        <StatTile size="small" label={t('detail.repeat')} value={f.number(help.repeat_errors)} sub={t('detail.repeatSub')} />
        <StatTile
          size="small"
          label={t('detail.edits')}
          value={help.avg_edits_before_ask != null ? f.decimal(help.avg_edits_before_ask) : '—'}
          sub={t('detail.editsSub')}
        />
      </div>

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
                  <th scope="col" className="num">{t('col.activeMin')}</th>
                </tr>
              </thead>
              <tbody>
                {[...detail.series].reverse().map((d) => (
                  <tr key={d.slot}>
                    <td>{slot.long(d.slot, bucket)}</td>
                    <td className="num">{f.number(d.questions)}</td>
                    <td className="num">{f.number(d.minutes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        >
          {help.questions === 0 ? (
            <p className="empty">{t('detail.noQuestions')}</p>
          ) : (
            <ColumnChart
              height={150}
              ariaLabel={`${t('chart.questionsOverTime')} · ${profile.username}`}
              formatValue={(n) => tp('count.question', n)}
              data={detail.series.map((d) => ({
                key: d.slot,
                tick: slot.tick(d.slot, bucket),
                label: slot.long(d.slot, bucket),
                value: d.questions,
                detail: d.minutes ? t('chart.minutesDetail', { n: f.number(d.minutes) }) : undefined,
              }))}
            />
          )}
        </ChartCard>

        <ChartCard title={t('chart.depthStudent')} subtitle={t('chart.depthSub')}>
          <LevelBar counts={help} />
        </ChartCard>
      </div>

      <TrendCard title={t('detail.trend')} subtitle={t('detail.trendSub')} weeks={detail.trend} />

      <div className="detail-grid">
        <section className="card">
          <h3>{t('detail.languages')}</h3>
          {detail.languages.length === 0 ? (
            <p className="empty">{t('detail.noLanguages')}</p>
          ) : (
            <BarList
              ariaLabel={t('detail.languages')}
              items={detail.languages.map((l) => ({
                key: l.language,
                label: editorLanguageName(l.language) ?? (l.language === 'plaintext' ? t('editorLang.plaintext') : l.language),
                value: l.edits,
              }))}
            />
          )}
        </section>
        <section className="card">
          <h3>{t('detail.concepts')}</h3>
          {detail.concepts.length === 0 ? (
            <p className="empty">{t('detail.noConcepts')}</p>
          ) : (
            <BarList
              ariaLabel={t('detail.concepts')}
              items={detail.concepts.map((c) => ({ key: c.concept, label: c.concept, value: c.count }))}
            />
          )}
        </section>
        <section className="card">
          <h3>{t('detail.feedback')}</h3>
          {selfReports === 0 ? (
            <p className="empty">{t('detail.noFeedback')}</p>
          ) : (
            <dl className="facts facts-compact">
              <div>
                <dt>{t('detail.helpfulPair')}</dt>
                <dd>
                  {f.number(help.helpful_up)} / {f.number(help.helpful_down)}
                </dd>
              </div>
              <div>
                <dt>{t('detail.solvedPair')}</dt>
                <dd>
                  {f.number(help.solved)} / {f.number(help.still_stuck)}
                </dd>
              </div>
              <div>
                <dt>{t('detail.confidence')}</dt>
                <dd>
                  {f.number(help.confident_yes)} / {f.number(help.confident_maybe)} / {f.number(help.confident_no)}
                </dd>
              </div>
            </dl>
          )}
        </section>
      </div>

      {summary && (summary.student_summary || summary.suggested_practice) && (
        <section className="card">
          <header className="card-header">
            <div>
              <h3>{t('detail.summary')}</h3>
              {summary.generated_at && (
                <p className="card-subtitle">
                  {t('detail.summaryWritten', { time: f.relative(summary.generated_at, now, t('common.never')) })}
                </p>
              )}
            </div>
          </header>
          {summary.student_summary && <p className="prose">{summary.student_summary}</p>}
          {summary.suggested_practice && (
            <>
              <h4>{t('detail.practice')}</h4>
              <p className="prose">{summary.suggested_practice}</p>
            </>
          )}
        </section>
      )}

      <section className="card">
        <h3>{t('detail.recent')}</h3>
        {detail.recent.length === 0 ? (
          <p className="empty">{t('detail.noQuestions')}</p>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">{t('col.when')}</th>
                  <th scope="col">{t('col.question')}</th>
                  <th scope="col">{t('col.asked')}</th>
                  <th scope="col">{t('col.source')}</th>
                  <th scope="col">{t('col.wentTo')}</th>
                </tr>
              </thead>
              <tbody>
                {detail.recent.map((q) => (
                  <tr key={q.id}>
                    <td className="nowrap" title={f.fullDateTime(q.created_at)}>
                      {f.relative(q.created_at, now, t('common.never'))}
                    </td>
                    <td className="wrap">
                      <button type="button" className="link link-plain" onClick={() => openQuestion(q.id)}>
                        {q.title ?? t('common.untitled')}
                      </button>
                      {q.file_name && <span className="file-name">{q.file_name}</span>}
                    </td>
                    <td className="nowrap">{q.question_type ? t(`qtype.${q.question_type}` as MessageKey) : '—'}</td>
                    <td className="nowrap">{t(`trigger.${q.trigger_source}`)}</td>
                    <td className="nowrap">{t(levelKey(q.max_level_reached))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <StudentBehaviour userId={profile.user_id} />
    </div>
  );
}
