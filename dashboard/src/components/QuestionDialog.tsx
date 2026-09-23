import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n';
import { en, type MessageKey } from '../i18n/en';
import { fetchQuestion } from '../lib/api';
import { useApiErrorHandler, useSession } from '../lib/auth';
import { levelKey } from '../lib/labels';
import type { QuestionDetail } from '../lib/types';

const OpenQuestionContext = createContext<((id: string) => void) | null>(null);

/** Lets any list open a question in the shared dialog. */
export function QuestionProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = useCallback((id: string) => setOpenId(id), []);
  return (
    <OpenQuestionContext.Provider value={open}>
      {children}
      <QuestionDialog id={openId} onClose={() => setOpenId(null)} />
    </OpenQuestionContext.Provider>
  );
}

export function useOpenQuestion(): (id: string) => void {
  const ctx = useContext(OpenQuestionContext);
  if (!ctx) throw new Error('useOpenQuestion must be used inside QuestionProvider');
  return ctx;
}

function QuestionDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { t } = useI18n();
  const { token } = useSession();
  const handleError = useApiErrorHandler();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [state, setState] = useState<{ id: string; data: QuestionDetail | null; error: boolean } | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (id && !dialog.open) dialog.showModal();
    if (!id && dialog.open) dialog.close();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setState({ id, data: null, error: false });
    fetchQuestion(token, id)
      .then((data) => !cancelled && setState({ id, data, error: false }))
      .catch((err: unknown) => {
        if (cancelled || handleError(err)) return;
        setState({ id, data: null, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [id, token, handleError]);

  const data = state?.id === id ? state.data : null;

  return (
    <dialog
      ref={dialogRef}
      className="dialog dialog-wide"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // A click on the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-header">
        <h2 id={titleId}>{data ? (data.title ?? t('common.untitled')) : t('question.loading')}</h2>
        <button type="button" className="btn btn-ghost btn-small" onClick={onClose}>
          {t('common.close')}
        </button>
      </div>
      {state?.error ? (
        <p className="form-error">{t('question.notFound')}</p>
      ) : data ? (
        <QuestionBody q={data} />
      ) : (
        <p className="empty">{t('question.loading')}</p>
      )}
    </dialog>
  );
}

function QuestionBody({ q }: { q: QuestionDetail }) {
  const i18n = useI18n();
  const { t, tp, f } = i18n;
  const level = q.max_level_reached;
  const ladder = q.ladder;

  const levelLabel = t(levelKey(level));
  const before = [
    q.edits_before_ask != null ? tp('question.beforeEdits', q.edits_before_ask) : null,
    q.help_latency_ms != null ? t('question.beforeWait', { time: f.span(q.help_latency_ms) }) : null,
  ].filter(Boolean);
  const ai = [
    q.model_used,
    q.latency_ms != null ? f.latency(q.latency_ms) : null,
    q.prompt_tokens != null || q.completion_tokens != null
      ? tp('count.token', (q.prompt_tokens ?? 0) + (q.completion_tokens ?? 0))
      : null,
    q.cache_hit ? t('question.cached') : null,
  ].filter(Boolean);

  return (
    <div className="question">
      <p className="question-meta">
        <strong>{q.username}</strong> · {f.fullDateTime(q.created_at)}
        {q.concept && <span className="chip">{q.concept}</span>}
      </p>

      <dl className="facts">
        <div>
          <dt>{t('question.type')}</dt>
          <dd>{q.question_type ? t(`qtype.${q.question_type}` as MessageKey) : '—'}</dd>
        </div>
        <div>
          <dt>{t('question.source')}</dt>
          <dd>
            {t(`trigger.${q.trigger_source}`)}
            {q.trigger_surface && <span className="muted"> · {labelFor('surface', q.trigger_surface, t)}</span>}
            {q.selection_line_count != null && (
              <span className="muted"> · {tp('question.selection', q.selection_line_count)}</span>
            )}
          </dd>
        </div>
        {q.file_name && (
          <div>
            <dt>{t('question.file')}</dt>
            <dd className="mono">{q.file_name}</dd>
          </div>
        )}
        <div>
          <dt>{t('question.wentTo')}</dt>
          <dd>{levelLabel}</dd>
        </div>
        {before.length > 0 && (
          <div>
            <dt>{t('question.before')}</dt>
            <dd>{before.join(' · ')}</dd>
          </div>
        )}
        {q.recurring_error_count > 0 && (
          <div>
            <dt>{t('question.seenBefore')}</dt>
            <dd>{tp('question.seenBeforeValue', q.recurring_error_count)}</dd>
          </div>
        )}
        {q.helpful_rating != null && q.helpful_rating !== 0 && (
          <div>
            <dt>{t('question.rating')}</dt>
            <dd>{q.helpful_rating > 0 ? t('rating.up') : t('rating.down')}</dd>
          </div>
        )}
        {q.self_reported_outcome && (
          <div>
            <dt>{t('question.outcome')}</dt>
            <dd>{t(`outcome.${q.self_reported_outcome}`)}</dd>
          </div>
        )}
        {q.post_confidence && (
          <div>
            <dt>{t('question.confidence')}</dt>
            <dd>{t(`confidence.${q.post_confidence}`)}</dd>
          </div>
        )}
        {ai.length > 0 && (
          <div>
            <dt>{t('question.ai')}</dt>
            <dd>{ai.join(' · ')}</dd>
          </div>
        )}
      </dl>

      {q.error_message && (
        <section>
          <h3>
            {t('question.error')}
            {q.error_severity && (
              <span className="chip">{t('question.severity', { severity: labelFor('severity', q.error_severity.toLowerCase(), t) })}</span>
            )}
          </h3>
          <pre className="code-block">
            {[q.error_source, q.error_code].filter(Boolean).join(' ')}
            {(q.error_source || q.error_code) && '\n'}
            {q.error_message}
          </pre>
        </section>
      )}
      {q.free_text && (
        <section>
          <h3>{t('question.ownWords')}</h3>
          <blockquote className="quote">{q.free_text}</blockquote>
        </section>
      )}

      <section>
        <h3>{t('ladder.title')}</h3>
        {ladder ? (
          <ol className="ladder">
            <LadderStep title={t('ladder.decode')} value={ladder.l0_decode} opened />
            <LadderStep title={t('ladder.locate')} value={ladder.l1_locate} opened />
            <LadderStep title={t('ladder.concept')} value={ladder.l2_concept} opened={level >= 2} />
            <LadderStep title={t('ladder.fix')} value={ladder.l3_fix} opened={level >= 3} />
          </ol>
        ) : (
          <p className="empty">{t('ladder.missing')}</p>
        )}
      </section>

      {q.events.length > 0 && (
        <section>
          <h3>{t('timeline.title')}</h3>
          <ol className="timeline">
            {q.events.map((e, i) => (
              <li key={i}>
                <span className="timeline-time">{f.time(e.at)}</span>
                <span>{describeEvent(e, i18n)}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

/** A level is a string, or an object like {rule, example} / {change, why}. */
function LadderStep({ title, value, opened }: { title: string; value: unknown; opened: boolean }) {
  const { t } = useI18n();
  if (value == null || value === '') return null;
  const obj = typeof value === 'object' ? (value as Record<string, unknown>) : null;
  const text = (v: unknown) => (typeof v === 'string' ? v : JSON.stringify(v, null, 2));

  return (
    <li className={`ladder-step${opened ? '' : ' is-unopened'}`}>
      <h4>{title}</h4>
      {!opened && <p className="ladder-note">{t('ladder.notOpened')}</p>}
      {obj ? (
        <>
          {'rule' in obj && <p className="prose">{text(obj.rule)}</p>}
          {'change' in obj && <p className="prose">{text(obj.change)}</p>}
          {'example' in obj && (
            <>
              <h5>{t('ladder.example')}</h5>
              <pre className="code-block">{text(obj.example)}</pre>
            </>
          )}
          {'why' in obj && (
            <>
              <h5>{t('ladder.why')}</h5>
              <p className="prose">{text(obj.why)}</p>
            </>
          )}
          {Object.entries(obj)
            .filter(([k]) => !['rule', 'change', 'example', 'why'].includes(k))
            .map(([k, v]) => (
              <p key={k} className="prose">
                {text(v)}
              </p>
            ))}
        </>
      ) : (
        <p className="prose">{text(value)}</p>
      )}
    </li>
  );
}

type Translate = (key: MessageKey, vars?: Record<string, string | number>) => string;

/** The label for a value the extension sends (surface, severity), or the
 * raw value when this dashboard has no label for it yet. */
function labelFor(prefix: string, value: string, t: Translate): string {
  const key = `${prefix}.${value}`;
  return key in en ? t(key as MessageKey) : value;
}

/** Payload numbers are client-written: anything that isn't a number is
 * treated as missing. */
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);

function describeEvent(e: QuestionDetail['events'][number], { t, tp, f }: ReturnType<typeof useI18n>): string {
  const p = e.payload ?? {};
  const level = num(p.level);
  switch (e.type) {
    case 'level_reached': {
      // Stored levels are 0-3, the same numbers as the L0-L3 labels.
      const ms = num(p.msSinceCreated);
      return ms != null
        ? t('event.level_reachedAfter', { level: level ?? 0, time: f.span(ms) })
        : t('event.level_reached', { level: level ?? 0 });
    }
    case 'explanation_visibility':
      return t('event.explanation_visibility', { time: f.span(num(p.visibleMs) ?? 0) });
    case 'returned_to_code': {
      const ms = num(p.msToReturn);
      return ms != null
        ? t('event.returned_to_codeAfter', { time: f.span(ms), level: level ?? 0 })
        : t('event.returned_to_code');
    }
    case 'diagnostic_resolved': {
      const ms = num(p.msToResolution);
      return ms != null ? t('event.diagnostic_resolvedAfter', { time: f.span(ms) }) : t('event.diagnostic_resolved');
    }
    case 'post_feedback_edit': {
      const distance = num(p.editedLineDistance);
      const overlap = num(p.overlapRatio);
      return [
        t('event.post_feedback_edit'),
        distance == null ? null : distance === 0 ? t('event.onLine') : tp('event.linesAway', distance),
        overlap == null ? null : t('event.overlap', { pct: f.pct(overlap * 100) }),
      ]
        .filter(Boolean)
        .join(' · ');
    }
    case 'feedback_abandoned':
      return level != null && typeof p.reason === 'string'
        ? t('event.feedback_abandonedAt', { level, reason: labelFor('abandon', p.reason, t) })
        : t('event.feedback_abandoned');
    case 'explanation_copied': {
      // The sidebar sends the rung's label ("L3"), not a number.
      const rung = typeof p.level === 'string' ? p.level.replace(/^L/i, '') : level;
      return rung != null && rung !== '' ? t('event.explanation_copiedAt', { level: rung }) : t('event.explanation_copied');
    }
    default:
      return labelFor('event', e.type, t);
  }
}
