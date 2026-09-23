import { Dashboard } from './components/Dashboard';
import { ForcePasswordChange } from './components/ForcePasswordChange';
import { LoginPage } from './components/LoginPage';
import { useI18n } from './i18n';
import { useAuth } from './lib/auth';

// Nothing behind the login is rendered until the server has confirmed the
// session -- and every data request re-checks the token server-side anyway.
export function App() {
  const { t } = useI18n();
  const { state } = useAuth();
  if (state.status === 'checking') return <p className="empty page-loading">{t('login.checking')}</p>;
  if (state.status === 'signed-out') return <LoginPage notice={state.notice} />;
  if (state.account.must_change_password) return <ForcePasswordChange />;
  return <Dashboard key={state.token} />;
}
