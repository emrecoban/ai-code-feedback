import { createClient } from '@supabase/supabase-js';
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '../config';
import type { DateRange } from './range';
import type {
  ActionResult,
  AiConfig,
  AuditEntry,
  Engagement,
  ExportData,
  Insights,
  LoginResult,
  ManagedAccount,
  Overview,
  QuestionDetail,
  Role,
  SessionInfo,
  StudentDetail,
  StudentRow,
} from './types';

// The dashboard never signs in to Supabase Auth -- its own session token is
// passed to each RPC instead -- so supabase-js's auth persistence is off.
export const client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

/** The token is missing, unknown or expired (SQLSTATE 28000). Sign out. */
export class SessionExpiredError extends Error {}
/** Signed in, but a new password must be chosen first (SQLSTATE 28P01). */
export class PasswordChangeRequiredError extends Error {}
/** Viewer accounts calling an admin-only function (SQLSTATE 42501). */
export class ForbiddenError extends Error {}

/** Day buckets on the server follow the viewer's clock. */
const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

async function call<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await client.rpc(fn, args);
  if (error) {
    if (error.code === '28000') throw new SessionExpiredError(error.message);
    if (error.code === '28P01') throw new PasswordChangeRequiredError(error.message);
    if (error.code === '42501') throw new ForbiddenError(error.message);
    throw new Error(error.message || 'Request failed');
  }
  return data as T;
}

const period = (range: DateRange) => ({ p_from: range.from, p_to: range.to, p_tz: TIME_ZONE });

// ---------- Sign-in and own account ----------

export const login = (username: string, password: string, otp?: string) =>
  call<LoginResult>('dashboard_login', { p_username: username, p_password: password, p_otp: otp ?? null });
export const checkSession = (token: string) => call<SessionInfo>('dashboard_session', { p_token: token });
export const logout = (token: string) => call<null>('dashboard_logout', { p_token: token });
export const changePassword = (token: string, current: string, next: string) =>
  call<ActionResult>('dashboard_change_password', { p_token: token, p_current: current, p_new: next });
export const totpBegin = (token: string) =>
  call<ActionResult & { secret?: string; uri?: string }>('dashboard_totp_begin', { p_token: token });
export const totpEnable = (token: string, code: string) =>
  call<ActionResult>('dashboard_totp_enable', { p_token: token, p_code: code });
export const totpDisable = (token: string, password: string) =>
  call<ActionResult>('dashboard_totp_disable', { p_token: token, p_password: password });

// ---------- Reading ----------

export const fetchOverview = (token: string, range: DateRange) =>
  call<Overview>('dashboard_overview', { p_token: token, ...period(range) });
export const fetchStudents = (token: string, range: DateRange) =>
  call<StudentRow[]>('dashboard_students', { p_token: token, ...period(range) });
export const fetchStudentDetail = (token: string, userId: string, range: DateRange) =>
  call<StudentDetail>('dashboard_student_detail', { p_token: token, p_user_id: userId, ...period(range) });
export const fetchQuestion = (token: string, id: string) =>
  call<QuestionDetail>('dashboard_question', { p_token: token, p_id: id });
export const fetchInsights = (token: string, range: DateRange) =>
  call<Insights>('dashboard_insights', { p_token: token, ...period(range) });
/** The whole class, or one student when userId is given. */
export const fetchEngagement = (token: string, range: DateRange, userId?: string) =>
  call<Engagement>('dashboard_engagement', { p_token: token, ...period(range), p_user_id: userId ?? null });
/** Audited: every export is written to the activity log. */
export const fetchExport = (token: string, range: DateRange) =>
  call<ExportData>('dashboard_export', { p_token: token, ...period(range) });
export const fetchAuditLog = (token: string, before?: number) =>
  call<{ entries: AuditEntry[]; has_more: boolean }>('dashboard_audit_log', {
    p_token: token,
    p_before: before ?? null,
    p_limit: 50,
  });

/** The AI model and quota come from Edge Function secrets, which the
 * database can't read -- so this one goes through a function. */
export async function fetchAiConfig(token: string): Promise<AiConfig> {
  const { data, error } = await client.functions.invoke<AiConfig>('dashboard-config', { body: { token } });
  if (error || !data) throw new Error(error?.message ?? 'Request failed');
  return data;
}

// ---------- Changing student data (admins) ----------

export const resetStudent = (token: string, userId: string) =>
  call<{ ok: boolean }>('dashboard_reset_student', { p_token: token, p_user_id: userId });
export const deleteStudent = (token: string, userId: string) =>
  call<{ ok: boolean }>('dashboard_delete_student', { p_token: token, p_user_id: userId });
/** Also signs the student out of the extension everywhere. */
export const setStudentPassword = (token: string, userId: string, password: string) =>
  call<ActionResult>('dashboard_student_set_password', { p_token: token, p_user_id: userId, p_password: password });

// ---------- AI request limits (admins) ----------

export const setRateLimits = (token: string, hourly: number, daily: number) =>
  call<ActionResult>('dashboard_set_rate_limits', { p_token: token, p_hourly: hourly, p_daily: daily });

// ---------- Managing accounts (admins) ----------

export const fetchAccounts = (token: string) => call<ManagedAccount[]>('dashboard_accounts', { p_token: token });
export const createAccount = (token: string, username: string, password: string, role: Role) =>
  call<ActionResult>('dashboard_account_create', { p_token: token, p_username: username, p_password: password, p_role: role });
export const setAccountRole = (token: string, id: string, role: Role) =>
  call<ActionResult>('dashboard_account_set_role', { p_token: token, p_id: id, p_role: role });
export const resetAccountPassword = (token: string, id: string, password: string) =>
  call<ActionResult>('dashboard_account_reset_password', { p_token: token, p_id: id, p_password: password });
export const resetAccountTotp = (token: string, id: string) =>
  call<ActionResult>('dashboard_account_reset_totp', { p_token: token, p_id: id });
export const deleteAccount = (token: string, id: string) =>
  call<ActionResult>('dashboard_account_delete', { p_token: token, p_id: id });
