import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { fetchTrainingExport, ForbiddenError } from '../lib/api';
import { useApiErrorHandler, useSession } from '../lib/auth';
import { download } from '../lib/exportData';
import { useLive } from '../lib/live';
import { toJsonl } from '../lib/trainingData';
import type { TrainingView } from '../lib/types';
import { ConfirmDialog } from './ConfirmDialog';
import { useNotify } from './Toast';

const VIEWS: TrainingView[] = ['sft', 'levels', 'kto'];

/** [FINE-TUNING-DATA]: the period's training data as a JSONL file, one
 * example per line, in the chosen view. Covers the selected period and the
 * student list's search, like the other exports, and is audited. */
export function TrainingExportDialog({ open, usernames, onClose }: { open: boolean; usernames: Set<string> | null; onClose: () => void }) {
  const { t, f } = useI18n();
  const { token } = useSession();
  const { range } = useLive();
  const handleError = useApiErrorHandler();
  const notify = useNotify();
  const [view, setView] = useState<TrainingView>('sft');
  const [withReduced, setWithReduced] = useState(false);
  const [finalOnly, setFinalOnly] = useState(true);
  const [withMetadata, setWithMetadata] = useState(true);

  useEffect(() => {
    if (!open) return;
    setView('sft');
    setWithReduced(false);
    setFinalOnly(true);
    setWithMetadata(true);
  }, [open]);

  const run = async () => {
    let data;
    try {
      data = await fetchTrainingExport(token, range, view, {
        // Per-level examples exist only for questions with the stored request.
        capture: withReduced && view !== 'levels' ? 'all' : 'full',
        finalOnly,
        usernames: usernames ? [...usernames] : null,
      });
    } catch (err) {
      if (handleError(err)) return;
      throw new Error(err instanceof ForbiddenError ? t('common.noPermission') : t('common.error'));
    }
    if (data.records.length === 0) throw new Error(t('trainingExport.empty'));
    download(
      new Blob([toJsonl(data.records, withMetadata)], { type: 'application/x-ndjson;charset=utf-8' }),
      `fine-tuning_${view}_${range.from ?? 'all'}_${range.to ?? 'today'}.jsonl`,
    );
    onClose();
    notify(t('trainingExport.done', { lines: f.number(data.records.length), questions: f.number(data.questions) }));
  };

  return (
    <ConfirmDialog
      open={open}
      title={t('trainingExport.title')}
      confirmLabel={t('trainingExport.confirm')}
      danger={false}
      onConfirm={run}
      onClose={onClose}
    >
      <p>{t('trainingExport.body')}</p>
      <fieldset className="field choice-list">
        <legend>{t('trainingExport.view')}</legend>
        {VIEWS.map((v) => (
          <label key={v} className="choice">
            <input type="radio" name="training-view" value={v} checked={view === v} onChange={() => setView(v)} />
            <span>
              <strong>{t(`training.view.${v}`)}</strong>
              <span className="field-hint">{t(`trainingExport.viewHint.${v}`)}</span>
            </span>
          </label>
        ))}
      </fieldset>
      {view !== 'levels' && (
        <label className="choice">
          <input type="checkbox" checked={withReduced} onChange={(e) => setWithReduced(e.target.checked)} />
          <span>{t('trainingExport.reduced')}</span>
        </label>
      )}
      {view === 'kto' && (
        <label className="choice">
          <input type="checkbox" checked={finalOnly} onChange={(e) => setFinalOnly(e.target.checked)} />
          <span>{t('trainingExport.finalOnly')}</span>
        </label>
      )}
      <label className="choice">
        <input type="checkbox" checked={withMetadata} onChange={(e) => setWithMetadata(e.target.checked)} />
        <span>
          {t('trainingExport.metadata')}
          <span className="field-hint">{t('trainingExport.metadataHint')}</span>
        </span>
      </label>
    </ConfirmDialog>
  );
}
