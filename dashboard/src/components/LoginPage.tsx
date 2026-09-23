import { useId, useState, type FormEvent } from 'react';
import { useI18n } from '../i18n';
import { useAuth, type AuthNotice, type SignInResult } from '../lib/auth';
import { LanguageSelect } from './LanguageSelect';

/** Username and password only: no sign-up, no password reset (accounts are
 * managed by admins). With two-step verification on, a second step asks
 * for the authenticator code. */
export function LoginPage({ notice }: { notice?: AuthNotice }) {
  const { t } = useI18n();
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'password' | 'code'>('password');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const codeId = useId();

  const explain = (result: SignInResult): string | null => {
    switch (result.status) {
      case 'ok':
      case 'otp_required':
        return null;
      case 'locked':
        return t('login.locked', { time: new Date(result.until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      case 'error':
        return result.reason === 'network'
          ? t('login.network')
          : result.reason === 'invalid_otp'
            ? t('login.invalidCode')
            : t('login.invalid');
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError(t('login.missing'));
      return;
    }
    setBusy(true);
    setError(null);
    const result = await signIn(username, password, step === 'code' ? code.replace(/\s/g, '') : undefined);
    // On success this component unmounts; everything else needs handling.
    if (result.status === 'otp_required') {
      setStep('code');
    } else if (result.status !== 'ok') {
      setError(explain(result));
      if (step === 'code') setCode('');
      else setPassword('');
      if (result.status === 'locked') setStep('password');
    }
    setBusy(false);
  };

  return (
    <main className="login-page">
      <form className="card login-card" onSubmit={onSubmit} noValidate>
        <div className="login-top">
          <div className="brand">
            <img src="/logo.png" alt="" width={36} height={36} />
            <span>
              <span className="brand-title">{t('app.title')}</span>
              <span className="brand-subtitle">{t('app.subtitle')}</span>
            </span>
          </div>
          <LanguageSelect className="compact" />
        </div>

        {notice && !error && <p className="form-notice">{t(notice === 'expired' ? 'login.expired' : 'login.network')}</p>}

        {step === 'password' ? (
          <>
            <div className="field">
              <label htmlFor="username">{t('login.username')}</label>
              <input
                id="username"
                name="username"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={busy}
              />
            </div>
            <div className="field">
              <label htmlFor="password">{t('login.password')}</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
              />
            </div>
          </>
        ) : (
          <div className="field">
            <label htmlFor={codeId}>{t('login.code')}</label>
            <input
              id={codeId}
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={7}
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={busy}
              className="code-input"
            />
            <p className="field-hint">{t('login.codeHint')}</p>
          </div>
        )}

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
          {busy ? t('login.signingIn') : step === 'code' ? t('login.verify') : t('login.signIn')}
        </button>
        {step === 'code' && (
          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={() => {
              setStep('password');
              setCode('');
              setPassword('');
              setError(null);
            }}
            disabled={busy}
          >
            {t('login.back')}
          </button>
        )}
      </form>
    </main>
  );
}
