import { useState } from 'react';
import { useNow } from '../hooks/usePolling';
import { useI18n, useResultMessage } from '../i18n';
import { fetchAiPause, ForbiddenError, setAiPause } from '../lib/api';
import { useApiErrorHandler, useSession } from '../lib/auth';
import { useLive, useLiveQuery } from '../lib/live';
import type { AiPauseStatus } from '../lib/types';
import { ConfirmDialog } from './ConfirmDialog';
import { useNotify } from './Toast';

// [AI-PAUSE]: switching the AI help off for every student (migrations/0026).
// The status reloads with every live refresh, and a pause or resume is
// broadcast like any other change, so every open dashboard sees it at once.

const MESSAGE_MAX = 300;

function useAiPause() {
  return useLiveQuery((token) => fetchAiPause(token), []);
}

/** A line above every tab while students get no answers. */
export function PauseBanner() {
  const { t, f } = useI18n();
  const { isAdmin } = useSession();
  const { data } = useAiPause();
  if (!data?.paused) return null;
  return (
    <div className="pause-banner" role="status">
      <span className="warning-icon" aria-hidden="true">
        !
      </span>
      <span>
        {data.resume_at ? t('pause.bannerUntil', { date: f.fullDateTime(data.resume_at) }) : t('pause.banner')}
      </span>
      {isAdmin && (
        <a className="link" href="#insights">
          {t('pause.manage')}
        </a>
      )}
    </div>
  );
}

/** System health: the state students are in, and the switch for admins. */
export function AiPauseCard() {
  const { t, f } = useI18n();
  const { isAdmin } = useSession();
  const now = useNow(30_000);
  const { data, error } = useAiPause();
  const [dialog, setDialog] = useState<'pause' | 'resume' | null>(null);

  return (
    <section className="card pause-card" aria-labelledby="pause-title">
      <header className="card-header">
        <div>
          <h3 id="pause-title">{t('pause.title')}</h3>
          <p className="card-subtitle">{t('pause.sub')}</p>
        </div>
        {isAdmin && data && (
          <div className="card-actions">
            {data.paused ? (
              <button type="button" className="btn btn-small" onClick={() => setDialog('resume')}>
                {t('pause.resume')}
              </button>
            ) : (
              <button type="button" className="btn btn-small btn-danger" onClick={() => setDialog('pause')}>
                {t('pause.pause')}
              </button>
            )}
          </div>
        )}
      </header>

      {data ? (
        <>
          <p className="pause-state">
            {data.paused ? (
              <span className="chip chip-warning">
                <span className="warning-icon" aria-hidden="true">
                  !
                </span>
                {t('pause.paused')}
              </span>
            ) : (
              <span className="chip chip-good">{t('pause.active')}</span>
            )}
          </p>
          {data.paused ? (
            <>
              <p className="muted">
                {data.updated_by && t('pause.pausedBy', { name: data.updated_by, time: f.relative(data.updated_at, now, t('common.never')) })}{' '}
                {data.resume_at ? t('pause.until', { date: f.fullDateTime(data.resume_at) }) : t('pause.untilManual')}
              </p>
              <h4>{t('pause.students')}</h4>
              {data.message ? <blockquote className="quote">{data.message}</blockquote> : <p className="muted">{t('pause.defaultNote')}</p>}
            </>
          ) : (
            data.auto_resumed &&
            data.resume_at && <p className="muted">{t('pause.autoResumed', { date: f.fullDateTime(data.resume_at) })}</p>
          )}
        </>
      ) : (
        <p className="empty">{error ? t('common.loadError') : t('common.loading')}</p>
      )}

      {isAdmin && (
        <>
          <PauseDialog open={dialog === 'pause'} onClose={() => setDialog(null)} />
          <ResumeDialog open={dialog === 'resume'} onClose={() => setDialog(null)} />
        </>
      )}
    </section>
  );
}

/** Runs one change and reports it, the way the other admin dialogs do. */
function useSetPause() {
  const { t } = useI18n();
  const { token } = useSession();
  const { refresh } = useLive();
  const handleError = useApiErrorHandler();
  const resultMessage = useResultMessage();
  const notify = useNotify();
  return async (paused: boolean, message: string | null, resumeAt: string | null): Promise<AiPauseStatus | null> => {
    let result;
    try {
      result = await setAiPause(token, paused, message, resumeAt);
    } catch (err) {
      if (handleError(err)) return null;
      throw new Error(err instanceof ForbiddenError ? t('common.noPermission') : t('common.error'));
    }
    if (!result.ok) throw new Error(resultMessage(result));
    notify(paused ? t('pause.pausedDone') : t('pause.resumedDone'));
    refresh();
    return result.status ?? null;
  };
}

function PauseDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const run = useSetPause();
  const [message, setMessage] = useState('');
  const [resumeAt, setResumeAt] = useState('');

  // datetime-local is the viewer's own time zone; the server gets an instant.
  const resumeInstant = resumeAt ? new Date(resumeAt) : null;
  const validTime = !resumeInstant || (!Number.isNaN(resumeInstant.getTime()) && resumeInstant.getTime() > Date.now());
  const tooLong = message.trim().length > MESSAGE_MAX;

  const close = () => {
    setMessage('');
    setResumeAt('');
    onClose();
  };

  return (
    <ConfirmDialog
      open={open}
      title={t('pause.pauseTitle')}
      confirmLabel={t('pause.pause')}
      canConfirm={validTime && !tooLong}
      onConfirm={async () => {
        await run(true, message.trim() || null, resumeInstant ? resumeInstant.toISOString() : null);
        close();
      }}
      onClose={close}
    >
      <p>{t('pause.pauseBody')}</p>
      <div className="field">
        <label htmlFor="pause-message">{t('pause.message')}</label>
        <textarea
          id="pause-message"
          rows={3}
          value={message}
          maxLength={MESSAGE_MAX + 50}
          onChange={(e) => setMessage(e.target.value)}
          aria-describedby="pause-message-hint"
        />
        <p id="pause-message-hint" className={`field-hint${tooLong ? ' is-error' : ''}`}>
          {t('pause.messageHint', { used: message.trim().length, max: MESSAGE_MAX })}
        </p>
      </div>
      <div className="field">
        <label htmlFor="pause-until">{t('pause.resumeAt')}</label>
        <input id="pause-until" type="datetime-local" value={resumeAt} onChange={(e) => setResumeAt(e.target.value)} aria-describedby="pause-until-hint" />
        <p id="pause-until-hint" className={`field-hint${validTime ? '' : ' is-error'}`}>
          {validTime ? t('pause.resumeAtHint') : t('error.resume_in_past')}
        </p>
      </div>
    </ConfirmDialog>
  );
}

function ResumeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const run = useSetPause();
  return (
    <ConfirmDialog
      open={open}
      title={t('pause.resumeTitle')}
      confirmLabel={t('pause.resume')}
      danger={false}
      onConfirm={async () => {
        await run(false, null, null);
        onClose();
      }}
      onClose={onClose}
    >
      <p>{t('pause.resumeBody')}</p>
    </ConfirmDialog>
  );
}
