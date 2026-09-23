import { useState } from 'react';
import { ONLINE_WINDOW_MS } from '../config';
import { useNow } from '../hooks/usePolling';
import { useI18n, useResultMessage } from '../i18n';
import { deleteStudent, ForbiddenError, resetStudent, setStudentPassword } from '../lib/api';
import { useApiErrorHandler, useSession } from '../lib/auth';
import { useLive } from '../lib/live';
import type { StudentRow } from '../lib/types';
import { ConfirmDialog } from './ConfirmDialog';
import { StudentDetail } from './StudentDetail';
import { useNotify } from './Toast';

interface Props {
  student: StudentRow;
  expanded: boolean;
  onToggle: () => void;
  onRemoved: (userId: string) => void;
}

export function StudentItem({ student, expanded, onToggle, onRemoved }: Props) {
  const { t, f } = useI18n();
  const { token, isAdmin } = useSession();
  const { refresh } = useLive();
  const handleError = useApiErrorHandler();
  const notify = useNotify();
  const resultMessage = useResultMessage();
  const now = useNow(10_000);
  const [dialog, setDialog] = useState<'password' | 'reset' | 'delete' | null>(null);

  const online = student.last_active != null && now - Date.parse(student.last_active) < ONLINE_WINDOW_MS;
  const panelId = `student-panel-${student.user_id}`;
  const name = student.username;

  // Errors other than an expired session are shown inside the dialog, and
  // so are refusals the server explains ({ok: false, error}).
  const run = async (action: () => Promise<{ ok: boolean; error?: string }>, done: string, removed = false) => {
    let result: { ok: boolean; error?: string };
    try {
      result = await action();
    } catch (err) {
      if (handleError(err)) return;
      throw new Error(err instanceof ForbiddenError ? t('common.noPermission') : t('common.error'));
    }
    if (!result.ok) throw new Error(resultMessage(result));
    setDialog(null);
    notify(done);
    if (removed) onRemoved(student.user_id);
    refresh();
  };

  return (
    <li className={`student-item${expanded ? ' is-open' : ''}`} id={`student-${student.user_id}`}>
      <button type="button" className="student-summary" aria-expanded={expanded} aria-controls={panelId} onClick={onToggle}>
        <span className="chevron" aria-hidden="true" />
        <span className="student-name">
          {name}
          {online && (
            <span className="badge badge-online">
              <span className="dot" aria-hidden="true" />
              {t('students.online')}
            </span>
          )}
        </span>
        <span className="student-meta">
          <span>
            <span className="meta-label">{t('students.lastActive')}</span> {f.relative(student.last_active, now, t('common.never'))}
          </span>
          <span>
            <span className="meta-label">{t('students.questions')}</span> {f.number(student.questions)}
          </span>
          <span>
            <span className="meta-label">{t('students.active')}</span> {f.duration(student.active_seconds)}
          </span>
          <span>
            <span className="meta-label">{t('students.sessions')}</span> {f.number(student.sessions)}
          </span>
        </span>
      </button>

      {expanded && (
        <div className="student-panel" id={panelId}>
          <StudentDetail userId={student.user_id} />
          {isAdmin && (
            <div className="danger-zone">
              <div>
                <strong>{t('danger.title')}</strong>
                <p className="muted">{t('danger.body')}</p>
              </div>
              <div className="danger-actions">
                <button type="button" className="btn" onClick={() => setDialog('password')}>
                  {t('danger.password')}
                </button>
                <button type="button" className="btn btn-danger" onClick={() => setDialog('reset')}>
                  {t('danger.reset')}
                </button>
                <button type="button" className="btn btn-danger-outline" onClick={() => setDialog('delete')}>
                  {t('danger.delete')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <>
          <ConfirmDialog
            open={dialog === 'password'}
            title={t('studentPw.title', { name })}
            confirmLabel={t('danger.password')}
            danger={false}
            input={{
              label: t('password.new'),
              type: 'password',
              hint: t('studentPw.rules'),
              minLength: 8,
              repeatLabel: t('password.confirm'),
            }}
            onConfirm={(pw) =>
              run(() => setStudentPassword(token, student.user_id, pw), t('studentPw.done', { name }))
            }
            onClose={() => setDialog(null)}
          >
            <p>{t('studentPw.body1', { name })}</p>
            <p>{t('studentPw.body2')}</p>
          </ConfirmDialog>

          <ConfirmDialog
            open={dialog === 'reset'}
            title={t('reset.title', { name })}
            confirmLabel={t('danger.reset')}
            onConfirm={() => run(() => resetStudent(token, student.user_id), t('reset.done', { name }))}
            onClose={() => setDialog(null)}
          >
            <p>{t('reset.body1', { name })}</p>
            <p>{t('reset.body2')}</p>
          </ConfirmDialog>

          <ConfirmDialog
            open={dialog === 'delete'}
            title={t('delete.title', { name })}
            confirmLabel={t('danger.delete')}
            confirmText={name}
            onConfirm={() => run(() => deleteStudent(token, student.user_id), t('delete.done', { name }), true)}
            onClose={() => setDialog(null)}
          >
            <p>{t('delete.body1', { name })}</p>
            <p>{t('delete.body2')}</p>
          </ConfirmDialog>
        </>
      )}
    </li>
  );
}
