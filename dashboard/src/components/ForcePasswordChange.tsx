import { useI18n } from '../i18n';
import { useAuth } from '../lib/auth';
import { ChangePasswordForm } from './ChangePasswordForm';
import { LanguageSelect } from './LanguageSelect';

/** Shown after signing in with a password someone else chose (a new
 * account, or an admin reset). The server refuses every data request
 * until the password is changed, so this is the only way forward. */
export function ForcePasswordChange() {
  const { t } = useI18n();
  const { signOut } = useAuth();
  return (
    <main className="login-page">
      <section className="card login-card">
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
        <div>
          <h1 className="card-title">{t('forcePw.title')}</h1>
          <p className="muted">{t('forcePw.body')}</p>
        </div>
        <ChangePasswordForm />
        <button type="button" className="btn btn-ghost btn-block" onClick={signOut}>
          {t('header.signOut')}
        </button>
      </section>
    </main>
  );
}
