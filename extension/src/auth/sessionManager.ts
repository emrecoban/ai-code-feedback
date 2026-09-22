import * as vscode from 'vscode';
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  AUTH_EMAIL_DOMAIN,
  USERNAME_PATTERN,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
} from '../constants';
import { SecretStore, type StoredSession } from './secretStore';
import { logger } from '../util/logger';

export interface AuthState {
  signedIn: boolean;
  username?: string;
}

export type SignInFailureReason =
  | 'invalid_username'
  | 'invalid_password'
  | 'wrong_password'
  | 'network'
  | 'rate_limited'
  | 'server_misconfigured'
  | 'unknown';

export type SignInResult =
  | { ok: true; username: string; isFirstLogin: boolean }
  | { ok: false; reason: SignInFailureReason };

export class SessionManager {
  private readonly client: SupabaseClient;
  private readonly onDidChangeAuthEmitter = new vscode.EventEmitter<AuthState>();
  readonly onDidChangeAuth = this.onDidChangeAuthEmitter.event;

  private currentUsername: string | undefined;

  constructor(private readonly secretStore: SecretStore) {
    this.client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    this.secretStore.onDidChange(() => {
      // A sign-out (or sign-in) in another window -- re-sync silently.
      void this.restore();
    });
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  getState(): AuthState {
    return { signedIn: !!this.currentUsername, username: this.currentUsername };
  }

  /** Called once at activation. Must never block activation -- call lazily. */
  async restore(): Promise<AuthState> {
    const stored = await this.secretStore.getSession();
    if (!stored) {
      this.currentUsername = undefined;
      this.onDidChangeAuthEmitter.fire(this.getState());
      return this.getState();
    }

    const { error } = await this.client.auth.setSession({
      access_token: stored.access_token,
      refresh_token: stored.refresh_token,
    });

    if (error) {
      logger.info('Stored session was rejected on restore; signing out silently.');
      await this.secretStore.clearSession();
      this.currentUsername = undefined;
    } else {
      this.currentUsername = stored.username;
    }
    this.onDidChangeAuthEmitter.fire(this.getState());
    return this.getState();
  }

  /** Refreshes proactively when near expiry (base spec §4.5). */
  async getAccessToken(): Promise<string | undefined> {
    const { data, error } = await this.client.auth.getSession();
    if (error || !data.session) return undefined;

    const expiresAt = data.session.expires_at ?? 0;
    if (expiresAt - Date.now() / 1000 < 120) {
      const { data: refreshed, error: refreshErr } = await this.client.auth.refreshSession();
      if (refreshErr || !refreshed.session) {
        await this.signOut();
        return undefined;
      }
      await this.persist(refreshed.session, this.currentUsername!);
      return refreshed.session.access_token;
    }
    return data.session.access_token;
  }

  async signIn(rawUsername: string, password: string): Promise<SignInResult> {
    const username = normalizeUsername(rawUsername);
    if (!USERNAME_PATTERN.test(username)) {
      return { ok: false, reason: 'invalid_username' };
    }
    if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
      return { ok: false, reason: 'invalid_password' };
    }
    const email = `${username}@${AUTH_EMAIL_DOMAIN}`;

    try {
      const signInRes = await this.client.auth.signInWithPassword({ email, password });
      if (!signInRes.error && signInRes.data.session) {
        return this.completeSignIn(signInRes.data.session, username, false);
      }
      if (signInRes.error?.status === 429) {
        return { ok: false, reason: 'rate_limited' };
      }

      // Supabase returns the same "invalid credentials" shape whether the
      // account doesn't exist or the password is wrong -- disambiguate by
      // attempting registration (base spec §4.3).
      const signUpRes = await this.client.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      if (!signUpRes.error && signUpRes.data.session) {
        return this.completeSignIn(signUpRes.data.session, username, true);
      }
      if (!signUpRes.error && !signUpRes.data.session) {
        logger.error('signUp succeeded without a session -- email confirmation is likely enabled on this project.');
        return { ok: false, reason: 'server_misconfigured' };
      }
      const code = signUpRes.error?.code;
      const message = signUpRes.error?.message?.toLowerCase() ?? '';
      if (code === 'user_already_exists' || message.includes('already registered')) {
        return { ok: false, reason: 'wrong_password' };
      }
      if (code === 'weak_password') {
        return { ok: false, reason: 'invalid_password' };
      }
      if (code === 'email_address_invalid' || code === 'over_email_send_rate_limit' || code === 'email_provider_disabled') {
        // All three mean the project's Auth configuration is wrong, not
        // that the student did anything wrong -- most commonly, "Confirm
        // email" is still on, so GoTrue tries (and fails) to send a
        // confirmation email on every signup. See docs/SPEC_ADDENDUM.md §12.
        logger.error('signUp failed due to Auth project configuration', signUpRes.error);
        return { ok: false, reason: 'server_misconfigured' };
      }
      logger.error('signUp failed', signUpRes.error);
      return { ok: false, reason: 'unknown' };
    } catch (err) {
      logger.error('Sign-in network failure', err);
      return { ok: false, reason: 'network' };
    }
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
    await this.secretStore.clearSession();
    this.currentUsername = undefined;
    this.onDidChangeAuthEmitter.fire(this.getState());
  }

  private async completeSignIn(
    session: Session,
    username: string,
    isNewAccount: boolean,
  ): Promise<SignInResult> {
    await this.persist(session, username);
    this.currentUsername = username;

    const profileFirstLogin = await this.ensureProfileAndCheckFirstLogin(session.user.id, username);
    const isFirstLogin = isNewAccount || profileFirstLogin;
    this.onDidChangeAuthEmitter.fire(this.getState());
    return { ok: true, username, isFirstLogin };
  }

  private async persist(session: Session, username: string): Promise<void> {
    const stored: StoredSession = {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at ?? 0,
      user_id: session.user.id,
      username,
    };
    await this.secretStore.setSession(stored);
  }

  /** Defensive: the DB trigger normally creates this row (base spec §5.2). */
  private async ensureProfileAndCheckFirstLogin(userId: string, username: string): Promise<boolean> {
    const { data, error } = await this.client
      .from('profiles')
      .select('first_login_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      logger.error('Could not read profile after sign-in', error);
      return false;
    }
    if (!data) {
      const { error: insertErr } = await this.client.from('profiles').insert({ id: userId, username });
      if (insertErr) logger.error('Defensive profile insert failed', insertErr);
      return true;
    }
    if (!data.first_login_at) {
      await this.client
        .from('profiles')
        .update({ first_login_at: new Date().toISOString() })
        .eq('id', userId);
      return true;
    }
    return false;
  }
}

function normalizeUsername(raw: string): string {
  // Usernames are constrained to ASCII by USERNAME_PATTERN, so plain
  // toLowerCase() is safe here -- the Turkish dotted-i locale concern
  // (base spec §11.3) applies to user-facing text, not this identifier.
  return raw.trim().normalize('NFC').toLowerCase();
}
