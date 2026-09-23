import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as api from './api';
import type { Account } from './types';

const TOKEN_KEY = 'aicf-dashboard.token';

export type AuthNotice = 'expired' | 'network';

type AuthState =
  | { status: 'checking' }
  | { status: 'signed-out'; notice?: AuthNotice }
  | { status: 'signed-in'; token: string; account: Account };

export type SignInResult =
  | { status: 'ok' }
  | { status: 'otp_required' }
  | { status: 'error'; reason: 'invalid_credentials' | 'invalid_otp' | 'network' }
  | { status: 'locked'; until: string };

interface AuthContextValue {
  state: AuthState;
  signIn: (username: string, password: string, otp?: string) => Promise<SignInResult>;
  signOut: () => void;
  /** For any request that failed with SessionExpiredError. */
  expire: () => void;
  /** After a password change or a two-step verification change. */
  updateAccount: (account: Account) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Storage can throw (private mode, blocked site data); the dashboard still
// works without it, the session just doesn't survive a reload.
function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // see readToken
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() =>
    readToken() ? { status: 'checking' } : { status: 'signed-out' },
  );

  // A stored token is only trusted once the server confirms it is still live.
  useEffect(() => {
    const token = readToken();
    if (!token) return;
    let cancelled = false;
    api
      .checkSession(token)
      .then((info) => {
        if (!cancelled) setState({ status: 'signed-in', token, account: info.account });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof api.SessionExpiredError) {
          writeToken(null);
          setState({ status: 'signed-out' });
        } else {
          setState({ status: 'signed-out', notice: 'network' });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (username: string, password: string, otp?: string): Promise<SignInResult> => {
    try {
      const result = await api.login(username, password, otp);
      if (result.ok && result.token && result.account) {
        writeToken(result.token);
        setState({ status: 'signed-in', token: result.token, account: result.account });
        return { status: 'ok' };
      }
      if (result.error === 'otp_required') return { status: 'otp_required' };
      if (result.error === 'locked' && result.locked_until) return { status: 'locked', until: result.locked_until };
      return { status: 'error', reason: result.error === 'invalid_otp' ? 'invalid_otp' : 'invalid_credentials' };
    } catch {
      return { status: 'error', reason: 'network' };
    }
  }, []);

  const signOut = useCallback(() => {
    // Ends the session server-side too, so the token is useless even if it
    // was copied somewhere; the local sign-out doesn't wait for it.
    if (state.status === 'signed-in') void api.logout(state.token).catch(() => undefined);
    writeToken(null);
    setState({ status: 'signed-out' });
  }, [state]);

  const expire = useCallback(() => {
    writeToken(null);
    setState({ status: 'signed-out', notice: 'expired' });
  }, []);

  const updateAccount = useCallback((account: Account) => {
    setState((current) => (current.status === 'signed-in' ? { ...current, account } : current));
  }, []);

  const value = useMemo(
    () => ({ state, signIn, signOut, expire, updateAccount }),
    [state, signIn, signOut, expire, updateAccount],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

/** The signed-in session. Only for components rendered behind the login gate. */
export function useSession(): { token: string; account: Account; isAdmin: boolean } {
  const { state } = useAuth();
  if (state.status !== 'signed-in') throw new Error('useSession requires a signed-in user');
  return { token: state.token, account: state.account, isAdmin: state.account.role === 'admin' };
}

/** Turns the errors every request can hit into app-wide state changes.
 * Returns true when the error was handled here (the caller should stop). */
export function useApiErrorHandler(): (err: unknown) => boolean {
  const { expire, updateAccount, state } = useAuth();
  return useCallback(
    (err: unknown) => {
      if (err instanceof api.SessionExpiredError) {
        expire();
        return true;
      }
      if (err instanceof api.PasswordChangeRequiredError && state.status === 'signed-in') {
        updateAccount({ ...state.account, must_change_password: true });
        return true;
      }
      return false;
    },
    [expire, updateAccount, state],
  );
}
