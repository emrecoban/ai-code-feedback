import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n/en';
import { fetchTrainingRecord } from '../lib/api';
import { useApiErrorHandler, useSession } from '../lib/auth';
import { lineFor, toJsonl, type TrainingStep } from '../lib/trainingData';
import type { ChatMessage, TrainingLabels, TrainingRecord } from '../lib/types';
import { Metrics } from './Behaviour';

/** [FINE-TUNING-DATA]: how one question is represented as training data.
 * Admins only (the record holds the student's code and the private learner
 * notes), and loaded only once opened. The record comes from the same
 * database function as the JSONL export, so this is exactly what an export
 * would contain. */
export function TrainingPreview({ questionId }: { questionId: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <details className="training" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{t('training.title')}</summary>
      {open && <TrainingBody questionId={questionId} />}
    </details>
  );
}

function TrainingBody({ questionId }: { questionId: string }) {
  const { t } = useI18n();
  const { token } = useSession();
  const handleError = useApiErrorHandler();
  const [state, setState] = useState<{ record: TrainingRecord | null; error: boolean }>({ record: null, error: false });

  useEffect(() => {
    let cancelled = false;
    fetchTrainingRecord(token, questionId)
      .then((record) => !cancelled && setState({ record, error: false }))
      .catch((err: unknown) => {
        if (cancelled || handleError(err)) return;
        setState({ record: null, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [token, questionId, handleError]);

  if (state.error) return <p className="form-error">{t('common.loadError')}</p>;
  if (!state.record) return <p className="empty">{t('training.loading')}</p>;
  return <RecordView record={state.record} />;
}

function RecordView({ record }: { record: TrainingRecord }) {
  const { t, f } = useI18n();
  const { metadata, status, validation, views } = record;
  const steps = availableSteps(record);
  const [step, setStep] = useState<TrainingStep | null>(steps[0] ?? null);
  const knownBad = metadata.labels.quality === false && status.reasons.length === 0;

  const inclusion = (view: 'sft' | 'levels' | 'kto', label: MessageKey) => (
    <span className={`chip${status[view] ? ' chip-good' : ''}`}>
      {t(label)}: {status[view] ? t('training.included') : t('training.excluded')}
    </span>
  );

  return (
    <div className="training-body">
      <p className="training-capture">
        <strong>{t(`training.capture.${metadata.capture}`)}</strong>
        {metadata.capture !== 'none' && (
          <span className="muted">
            {' · '}
            {[metadata.model ?? metadata.provider, metadata.prompt_version && t('training.prompt', { version: metadata.prompt_version }), t(`training.split.${metadata.split}`), metadata.group]
              .filter(Boolean)
              .join(' · ')}
          </span>
        )}
      </p>

      <div className="chips">
        {inclusion('sft', 'training.view.sft')}
        {inclusion('levels', 'training.view.levels')}
        {inclusion('kto', 'training.view.kto')}
      </div>
      {(status.reasons.length > 0 || knownBad) && (
        <ul className="training-reasons">
          {status.reasons.map((r) => (
            <li key={r}>{t(`training.reason.${r}`)}</li>
          ))}
          {knownBad && <li>{t('training.badOutcome')}</li>}
        </ul>
      )}

      {metadata.capture !== 'none' && (
        <>
          <h4>{t('training.labels')}</h4>
          <LabelList labels={metadata.labels} />
          <p className="chart-note">
            {status.labels_final ? t('training.final') : t('training.pending', { date: f.fullDateTime(status.labels_final_at) })}
          </p>
        </>
      )}

      {validation && (
        <>
          <h4>{t('training.checks')}</h4>
          <Metrics
            rows={[
              {
                label: t('training.check.pass'),
                value: validation.accepted_pass === 1 ? t('training.check.firstTry') : t('training.check.repaired'),
                sub: validation.first_pass_errors.join(' · '),
              },
              { label: t('training.check.soft'), value: validation.soft_issues.length ? validation.soft_issues.join(' · ') : '—' },
              { label: t('training.check.degraded'), value: validation.gating_degraded ? t('common.yes') : t('common.no') },
            ]}
          />
        </>
      )}

      {steps.length > 0 && step && (
        <>
          <div className="segmented segmented-small training-steps" role="group" aria-label={t('training.example')}>
            {steps.map((s) => {
              const selected = sameStep(s, step);
              // Shown even when left out, so it can still be inspected.
              const included = status[s.view === 'level' ? 'levels' : s.view];
              return (
                <button
                  key={stepKey(s)}
                  type="button"
                  className={[selected && 'is-selected', !included && 'is-excluded'].filter(Boolean).join(' ') || undefined}
                  aria-pressed={selected}
                  title={included ? undefined : t('training.excluded')}
                  onClick={() => setStep(s)}
                >
                  {stepLabel(s, t)}
                </button>
              );
            })}
          </div>
          <Example record={record} step={step} />
        </>
      )}
      {views.sft === null && <p className="empty">{t('training.noExample')}</p>}
    </div>
  );
}

function LabelList({ labels }: { labels: TrainingLabels }) {
  const { t, f } = useI18n();
  const yesNo = (v: boolean | null) => (v == null ? t('training.unknown') : v ? t('common.yes') : t('common.no'));
  const span = (ms: number | null) => (ms != null ? f.span(ms) : undefined);
  return (
    <Metrics
      rows={[
        { label: t('training.label.read'), value: yesNo(labels.read), sub: span(labels.visible_ms) },
        { label: t('training.label.resolved'), value: yesNo(labels.error_resolved), sub: span(labels.ms_to_resolution) },
        { label: t('training.label.repeat'), value: yesNo(labels.repeat_within_10_min) },
        { label: t('training.label.conceptBack'), value: yesNo(labels.concept_back_within_7_days) },
        {
          label: t('training.label.student'),
          value:
            [
              labels.helpful === 1 ? t('rating.up') : labels.helpful === -1 ? t('rating.down') : null,
              labels.outcome && t(`outcome.${labels.outcome}`),
              labels.confidence && `${t('question.confidence')}: ${t(`confidence.${labels.confidence}`)}`,
            ]
              .filter(Boolean)
              .join(' · ') || '—',
        },
        { label: t('training.label.undone'), value: yesNo(labels.fix_undone) },
        { label: t('training.label.sufficient'), value: labels.sufficient_level ?? '—' },
        {
          label: t('training.label.quality'),
          value: labels.quality == null ? t('training.unknown') : labels.quality ? t('training.quality.good') : t('training.quality.bad'),
        },
      ]}
    />
  );
}

/** The exact training text of one step, message by message, and the JSONL
 * line the export would write for it. */
function Example({ record, step }: { record: TrainingRecord; step: TrainingStep }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const line = lineFor(record, step);
  if (!line) return null;
  const kto = step.view === 'kto' && record.views.kto;
  const messages: ChatMessage[] = kto ? [...kto.prompt, ...kto.completion] : (line.messages as ChatMessage[]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toJsonl([line], true));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_000);
    } catch {
      // Clipboard access denied: nothing to do, the text is on screen.
    }
  };

  return (
    <div className="training-example">
      <div className="training-example-head">
        {kto && (
          <span className={`chip${kto.label ? ' chip-good' : ' chip-warning'}`}>
            {t('training.label.quality')}: {kto.label ? t('training.quality.good') : t('training.quality.bad')}
          </span>
        )}
        <button type="button" className="btn btn-small" onClick={() => void copy()}>
          {copied ? t('training.copied') : t('training.copy')}
        </button>
      </div>
      {messages.map((m, i) =>
        m.role === 'system' ? (
          <details key={i} className="training-message">
            <summary>
              <code>system</code> <span className="muted">{t('training.systemNote')}</span>
            </summary>
            <pre className="code-block">{m.content}</pre>
          </details>
        ) : (
          <div key={i} className="training-message">
            <code>{m.role}</code>
            <pre className="code-block">{m.content}</pre>
          </div>
        ),
      )}
    </div>
  );
}

function availableSteps(record: TrainingRecord): TrainingStep[] {
  const steps: TrainingStep[] = [];
  if (record.views.sft) steps.push({ view: 'sft' });
  for (const l of record.views.levels) steps.push({ view: 'level', level: l.level });
  if (record.views.kto) steps.push({ view: 'kto' });
  return steps;
}

const stepKey = (s: TrainingStep) => (s.view === 'level' ? `level-${s.level}` : s.view);
const sameStep = (a: TrainingStep, b: TrainingStep) => stepKey(a) === stepKey(b);

function stepLabel(s: TrainingStep, t: ReturnType<typeof useI18n>['t']): string {
  if (s.view === 'level') return `L${s.level}`;
  return s.view === 'sft' ? t('training.view.sft') : t('training.view.kto');
}
