import { useId, useState, type FormEvent } from 'react';
import { useI18n, useResultMessage } from '../i18n';
import { changePassword } from '../lib/api';
import { useApiErrorHandler, useAuth, useSession } from '../lib/auth';

/** Used on the Account tab and on the forced "choose a new password" screen. */
export function ChangePasswordForm({ onDone }: { onDone?: () => void }) {
  const { t } = useI18n();
  const { token, account } = useSession();
  const resultMessage = useResultMessage();
  const { updateAccount } = useAuth();
  const handleError = useApiErrorHandler();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [repeat, setRepeat] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const ids = { current: useId(), next: useId(), repeat: useId(), rules: useId() };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (next !== repeat) {
      setMessage({ ok: false, text: t('password.mismatch') });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const result = await changePassword(token, current, next);
      if (result.ok && result.account) {
        setCurrent('');
        setNext('');
        setRepeat('');
        setMessage({ ok: true, text: t('password.changed') });
        updateAccount(result.account);
        onDone?.();
      } else {
        setMessage({ ok: false, text: resultMessage(result) });
      }
    } catch (err) {
      if (!handleError(err)) setMessage({ ok: false, text: t('common.error') });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form-stack" onSubmit={onSubmit}>
      {/* Lets password managers attach the new password to the right account. */}
      <input type="text" name="username" autoComplete="username" value={account.username} readOnly hidden />
      <div className="field">
        <label htmlFor={ids.current}>{t('password.current')}</label>
        <input id={ids.current} type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required disabled={busy} />
      </div>
      <div className="field">
        <label htmlFor={ids.next}>{t('password.new')}</label>
        <input
          id={ids.next}
          type="password"
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          minLength={6}
          maxLength={128}
          aria-describedby={ids.rules}
          required
          disabled={busy}
        />
        <p id={ids.rules} className="field-hint">
          {t('password.rules')}
        </p>
      </div>
      <div className="field">
        <label htmlFor={ids.repeat}>{t('password.confirm')}</label>
        <input id={ids.repeat} type="password" autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} required disabled={busy} />
      </div>
      {message && (
        <p className={message.ok ? 'form-success' : 'form-error'} role={message.ok ? 'status' : 'alert'}>
          {message.text}
        </p>
      )}
      <div>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? t('common.working') : t('password.change')}
        </button>
      </div>
    </form>
  );
}
