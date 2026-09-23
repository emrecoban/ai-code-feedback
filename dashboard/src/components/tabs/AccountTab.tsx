import { useId, useState, type FormEvent } from 'react';
import { useNow } from '../../hooks/usePolling';
import { useI18n, useResultMessage } from '../../i18n';
import {
  createAccount,
  deleteAccount,
  fetchAccounts,
  ForbiddenError,
  resetAccountPassword,
  resetAccountTotp,
  setAccountRole,
  totpBegin,
  totpDisable,
  totpEnable,
} from '../../lib/api';
import { useApiErrorHandler, useAuth, useSession } from '../../lib/auth';
import { useLiveQuery } from '../../lib/live';
import type { ActionResult, ManagedAccount, Role } from '../../lib/types';
import { ChangePasswordForm } from '../ChangePasswordForm';
import { ConfirmDialog } from '../ConfirmDialog';
import { QrCode } from '../QrCode';
import { useNotify } from '../Toast';

export function AccountTab() {
  const { t } = useI18n();
  const { account, isAdmin } = useSession();

  return (
    <div className="section account">
      <section className="card">
        <h2 className="card-title">{t('account.title')}</h2>
        <dl className="facts">
          <div>
            <dt>{t('login.username')}</dt>
            <dd>{account.username}</dd>
          </div>
          <div>
            <dt>{t('account.role')}</dt>
            <dd>
              {t(account.role === 'admin' ? 'role.admin' : 'role.viewer')}
              <span className="field-hint">{t(account.role === 'admin' ? 'role.adminDesc' : 'role.viewerDesc')}</span>
            </dd>
          </div>
        </dl>
      </section>

      <div className="chart-grid chart-grid-even">
        <section className="card">
          <h2 className="card-title">{t('password.change')}</h2>
          <ChangePasswordForm />
        </section>
        <TwoStep />
      </div>

      {isAdmin && <Accounts />}
    </div>
  );
}

function TwoStep() {
  const { t } = useI18n();
  const { token, account } = useSession();
  const { updateAccount } = useAuth();
  const handleError = useApiErrorHandler();
  const resultMessage = useResultMessage();
  const [setup, setSetup] = useState<{ secret: string; uri: string } | null>(null);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [disabling, setDisabling] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const codeId = useId();
  const passwordId = useId();

  const guard = async (action: () => Promise<void>) => {
    setBusy(true);
    setMessage(null);
    try {
      await action();
    } catch (err) {
      if (!handleError(err)) setMessage({ ok: false, text: t('common.error') });
    } finally {
      setBusy(false);
    }
  };

  const begin = () =>
    guard(async () => {
      const result = await totpBegin(token);
      if (result.ok && result.secret && result.uri) setSetup({ secret: result.secret, uri: result.uri });
      else setMessage({ ok: false, text: resultMessage(result) });
    });

  const enable = (e: FormEvent) => {
    e.preventDefault();
    void guard(async () => {
      const result = await totpEnable(token, code.replace(/\s/g, ''));
      if (result.ok && result.account) {
        updateAccount(result.account);
        setSetup(null);
        setCode('');
        setMessage({ ok: true, text: t('totp.enabled') });
      } else {
        setMessage({ ok: false, text: resultMessage(result) });
      }
    });
  };

  const disable = (e: FormEvent) => {
    e.preventDefault();
    void guard(async () => {
      const result = await totpDisable(token, password);
      if (result.ok && result.account) {
        updateAccount(result.account);
        setDisabling(false);
        setPassword('');
        setMessage({ ok: true, text: t('totp.disabled') });
      } else {
        setMessage({ ok: false, text: resultMessage(result) });
      }
    });
  };

  return (
    <section className="card">
      <header className="card-header">
        <h2 className="card-title">{t('totp.title')}</h2>
        <span className={`status-pill${account.totp_enabled ? ' is-on' : ''}`}>
          {account.totp_enabled ? t('totp.on') : t('totp.off')}
        </span>
      </header>
      <p className="muted">{t('totp.intro')}</p>

      {!account.totp_enabled && !setup && (
        <button type="button" className="btn btn-primary" onClick={() => void begin()} disabled={busy}>
          {t('totp.setup')}
        </button>
      )}

      {!account.totp_enabled && setup && (
        <form className="form-stack totp-setup" onSubmit={enable}>
          <p>{t('totp.scan')}</p>
          <div className="totp-qr">
            <QrCode value={setup.uri} label={t('totp.scan')} />
            <div>
              <p className="field-hint">{t('totp.key')}</p>
              <code className="secret">{setup.secret.replace(/(.{4})/g, '$1 ').trim()}</code>
            </div>
          </div>
          <div className="field">
            <label htmlFor={codeId}>{t('totp.enterCode')}</label>
            <input
              id={codeId}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9 ]{6,7}"
              maxLength={7}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              disabled={busy}
              className="code-input"
            />
          </div>
          <div className="button-row">
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {t('totp.confirm')}
            </button>
            <button type="button" className="btn" onClick={() => setSetup(null)} disabled={busy}>
              {t('common.cancel')}
            </button>
          </div>
        </form>
      )}

      {account.totp_enabled && !disabling && (
        <button type="button" className="btn" onClick={() => setDisabling(true)}>
          {t('totp.disable')}
        </button>
      )}

      {account.totp_enabled && disabling && (
        <form className="form-stack" onSubmit={disable}>
          <input type="text" name="username" autoComplete="username" value={account.username} readOnly hidden />
          <div className="field">
            <label htmlFor={passwordId}>{t('totp.disableBody')}</label>
            <input
              id={passwordId}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={busy}
            />
          </div>
          <div className="button-row">
            <button type="submit" className="btn btn-danger" disabled={busy}>
              {t('totp.disable')}
            </button>
            <button type="button" className="btn" onClick={() => setDisabling(false)} disabled={busy}>
              {t('common.cancel')}
            </button>
          </div>
        </form>
      )}

      {message && (
        <p className={message.ok ? 'form-success' : 'form-error'} role={message.ok ? 'status' : 'alert'}>
          {message.text}
        </p>
      )}
    </section>
  );
}

type AccountDialog = { kind: 'password' | 'totp' | 'delete'; account: ManagedAccount } | null;

function Accounts() {
  const { t, f } = useI18n();
  const { token } = useSession();
  const handleError = useApiErrorHandler();
  const notify = useNotify();
  const resultMessage = useResultMessage();
  const now = useNow(30_000);
  const { data, error, reload } = useLiveQuery((tk) => fetchAccounts(tk), []);
  const [dialog, setDialog] = useState<AccountDialog>(null);

  // Refusals ({ok:false}) and failures surface in the dialog or as a notice.
  const act = async (action: () => Promise<ActionResult>, done: string) => {
    let result: ActionResult;
    try {
      result = await action();
    } catch (err) {
      if (handleError(err)) return;
      throw new Error(err instanceof ForbiddenError ? t('common.noPermission') : t('common.error'));
    }
    if (!result.ok) throw new Error(resultMessage(result));
    setDialog(null);
    notify(done);
    void reload();
  };

  const changeRole = async (a: ManagedAccount) => {
    const role: Role = a.role === 'admin' ? 'viewer' : 'admin';
    try {
      await act(() => setAccountRole(token, a.id, role), t('accounts.roleChanged', { name: a.username }));
    } catch (err) {
      notify(err instanceof Error ? err.message : t('common.error'));
    }
  };

  return (
    <section className="card" aria-labelledby="accounts-title">
      <header className="card-header">
        <div>
          <h2 id="accounts-title" className="card-title">
            {t('accounts.title')}
          </h2>
          <p className="card-subtitle">{t('accounts.subtitle')}</p>
        </div>
      </header>

      {!data ? (
        error ? (
          <p className="form-error">{t('common.loadError')}</p>
        ) : (
          <p className="empty">{t('common.loading')}</p>
        )
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">{t('col.username')}</th>
                <th scope="col">{t('col.role')}</th>
                <th scope="col">{t('col.twoStep')}</th>
                <th scope="col">{t('col.lastLogin')}</th>
                <th scope="col">
                  <span className="visually-hidden">{t('col.action')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((a) => (
                <tr key={a.id}>
                  <td>
                    <strong>{a.username}</strong>
                    {a.is_self && <span className="muted"> ({t('accounts.you')})</span>}
                    <span className="chips">
                      {a.locked && <span className="chip chip-warning">{t('accounts.locked')}</span>}
                      {a.must_change_password && <span className="chip">{t('accounts.mustChange')}</span>}
                    </span>
                  </td>
                  <td>{t(a.role === 'admin' ? 'role.admin' : 'role.viewer')}</td>
                  <td>{a.totp_enabled ? t('totp.on') : t('totp.off')}</td>
                  <td className="nowrap">{f.relative(a.last_login_at, now, t('common.never'))}</td>
                  <td>
                    {!a.is_self && (
                      <div className="row-actions">
                        <button type="button" className="btn btn-small" onClick={() => void changeRole(a)}>
                          {a.role === 'admin' ? t('accounts.makeViewer') : t('accounts.makeAdmin')}
                        </button>
                        <button type="button" className="btn btn-small" onClick={() => setDialog({ kind: 'password', account: a })}>
                          {t('accounts.resetPassword')}
                        </button>
                        {a.totp_enabled && (
                          <button type="button" className="btn btn-small" onClick={() => setDialog({ kind: 'totp', account: a })}>
                            {t('accounts.resetTotp')}
                          </button>
                        )}
                        <button type="button" className="btn btn-small btn-danger-outline" onClick={() => setDialog({ kind: 'delete', account: a })}>
                          {t('accounts.delete')}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddAccount onCreated={() => void reload()} />

      {dialog && (
        <>
          <ConfirmDialog
            open={dialog.kind === 'password'}
            title={t('accounts.resetPwTitle', { name: dialog.account.username })}
            confirmLabel={t('accounts.resetPassword')}
            input={{ label: t('accounts.tempPassword'), type: 'password', hint: t('password.rules'), minLength: 6 }}
            onConfirm={(pw) =>
              act(() => resetAccountPassword(token, dialog.account.id, pw), t('accounts.resetPwDone', { name: dialog.account.username }))
            }
            onClose={() => setDialog(null)}
          >
            <p>{t('accounts.resetPwBody', { name: dialog.account.username })}</p>
          </ConfirmDialog>
          <ConfirmDialog
            open={dialog.kind === 'totp'}
            title={t('accounts.resetTotpTitle', { name: dialog.account.username })}
            confirmLabel={t('accounts.resetTotp')}
            onConfirm={() =>
              act(() => resetAccountTotp(token, dialog.account.id), t('accounts.resetTotpDone', { name: dialog.account.username }))
            }
            onClose={() => setDialog(null)}
          >
            <p>{t('accounts.resetTotpBody')}</p>
          </ConfirmDialog>
          <ConfirmDialog
            open={dialog.kind === 'delete'}
            title={t('accounts.deleteTitle', { name: dialog.account.username })}
            confirmLabel={t('accounts.delete')}
            confirmText={dialog.account.username}
            onConfirm={() => act(() => deleteAccount(token, dialog.account.id), t('accounts.deleteDone', { name: dialog.account.username }))}
            onClose={() => setDialog(null)}
          >
            <p>{t('accounts.deleteBody', { name: dialog.account.username })}</p>
          </ConfirmDialog>
        </>
      )}
    </section>
  );
}

function AddAccount({ onCreated }: { onCreated: () => void }) {
  const { t } = useI18n();
  const { token } = useSession();
  const handleError = useApiErrorHandler();
  const notify = useNotify();
  const resultMessage = useResultMessage();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('viewer');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ids = { username: useId(), password: useId(), role: useId() };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await createAccount(token, username, password, role);
      if (result.ok) {
        notify(t('accounts.created', { name: username.trim().toLowerCase() }));
        setUsername('');
        setPassword('');
        setOpen(false);
        onCreated();
      } else {
        setError(resultMessage(result));
      }
    } catch (err) {
      if (!handleError(err)) setError(t('common.error'));
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <div className="load-more">
        <button type="button" className="btn" onClick={() => setOpen(true)}>
          {t('accounts.add')}
        </button>
      </div>
    );
  }

  return (
    <form className="add-account" onSubmit={submit}>
      <h3>{t('accounts.add')}</h3>
      <div className="form-grid">
        <div className="field">
          <label htmlFor={ids.username}>{t('col.username')}</label>
          <input
            id={ids.username}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            required
            disabled={busy}
          />
        </div>
        <div className="field">
          <label htmlFor={ids.password}>{t('accounts.tempPassword')}</label>
          <input
            id={ids.password}
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
            disabled={busy}
          />
          <p className="field-hint">{t('accounts.tempHint')}</p>
        </div>
        <div className="field">
          <label htmlFor={ids.role}>{t('col.role')}</label>
          <select id={ids.role} value={role} onChange={(e) => setRole(e.target.value as Role)} disabled={busy}>
            <option value="viewer">{t('role.viewer')}</option>
            <option value="admin">{t('role.admin')}</option>
          </select>
          <p className="field-hint">{t(role === 'admin' ? 'role.adminDesc' : 'role.viewerDesc')}</p>
        </div>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="button-row">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? t('common.working') : t('accounts.create')}
        </button>
        <button type="button" className="btn" onClick={() => setOpen(false)} disabled={busy}>
          {t('common.cancel')}
        </button>
      </div>
    </form>
  );
}
