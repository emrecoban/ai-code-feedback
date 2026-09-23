// Shapes returned by the dashboard_* RPC functions
// (supabase/migrations/0017-0024) and the dashboard-config Edge Function. Timestamps arrive as ISO strings,
// days as yyyy-mm-dd.
import type { Bucket } from '../i18n/format';

export type TriggerSource = 'diagnostic' | 'runtime' | 'selection' | 'stuck' | 'paste' | 'success';
export type ConsentStatus = 'pending' | 'granted' | 'declined';
export type Role = 'admin' | 'viewer';

export interface Account {
  id: string;
  username: string;
  role: Role;
  totp_enabled: boolean;
  must_change_password: boolean;
}

export interface LoginResult {
  ok: boolean;
  error?: 'invalid_credentials' | 'locked' | 'otp_required' | 'invalid_otp';
  locked_until?: string;
  token?: string;
  expires_at?: string;
  account?: Account;
}

export interface SessionInfo {
  account: Account;
  expires_at: string;
}

/** Account actions answer {ok:false, error:<code>} for expected refusals;
 * each code has an `error.<code>` message. */
export interface ActionResult {
  ok: boolean;
  error?: string;
  account?: Account;
}

export interface RangeInfo {
  from: string;
  to: string;
  bucket: Bucket;
}

/** How far into the hint ladder a student went. max_level_reached is 0
 * until the student opens the rule (2) or the fix (3); level 1 is shown
 * together with level 0 and never recorded on its own. */
export interface LevelCounts {
  hint: number;
  rule: number;
  fix: number;
}

export interface QuestionRow {
  id: string;
  created_at: string;
  title: string | null;
  trigger_source: TriggerSource;
  question_type: string | null;
  max_level_reached: number;
  file_name: string | null;
}

export type AttentionReason = 'repeat_error' | 'still_stuck' | 'needs_fix' | 'many_attempts' | 'unhelpful' | 'inactive';

export interface AttentionEntry {
  user_id: string;
  username: string;
  last_active: string | null;
  reasons: AttentionReason[];
  counts: {
    repeat: number;
    still_stuck: number;
    fix: number;
    questions: number;
    avg_edits: number;
    unhelpful: number;
    days_inactive: number | null;
  };
}

export interface Overview {
  generated_at: string;
  range: RangeInfo;
  students_total: number;
  online_now: number;
  active_students: number;
  new_students: number;
  questions: number;
  questions_previous: number;
  active_seconds: number;
  levels: LevelCounts;
  helpful_up: number;
  helpful_down: number;
  fixed_unaided: number;
  avg_latency_ms: number | null;
  failed_requests: number;
  /** Error questions, and how many of those errors later left the file. */
  resolution: { questions: number; resolved: number; median_ms: number | null };
  sessions: { total: number; without_help: number };
  series: { slot: string; questions: number; students: number }[];
  attention: AttentionEntry[];
  recent: (QuestionRow & { user_id: string; username: string })[];
}

export interface StudentRow {
  user_id: string;
  username: string;
  created_at: string;
  consent_status: ConsentStatus;
  feedback_language: string;
  extension_version: string | null;
  last_active: string | null;
  questions_total: number;
  sessions: number;
  active_days: number;
  active_seconds: number;
  lines_written: number;
  lines_deleted: number;
  fixed_unaided: number;
  help_offers: number;
  questions: number;
  solved_alone: number;
  helpful_up: number;
  helpful_down: number;
}

export interface TrendWeek {
  week: string;
  questions: number;
  from_errors: number;
  help_offers: number;
  fixed_unaided: number;
  sessions: number;
  sessions_without_help: number;
  pct_offers_taken: number | null;
  pct_hint_enough: number | null;
  pct_sessions_without_help: number | null;
}

export interface StudentDetail {
  range: RangeInfo;
  profile: {
    user_id: string;
    username: string;
    created_at: string;
    first_login_at: string | null;
    consent_status: ConsentStatus;
    consent_at: string | null;
    feedback_language: string;
    ui_language: string;
  };
  last_active: string | null;
  last_session: {
    started_at: string;
    last_seen_at: string;
    extension_version: string | null;
    vscode_version: string | null;
    os: string | null;
  } | null;
  activity: {
    sessions: number;
    active_days: number;
    active_seconds: number;
    lines_written: number;
    lines_deleted: number;
    files_created: number;
    saves: number;
    debug_runs: number;
    task_runs: number;
    large_pastes: number;
    focus_losses: number;
    help_offers: number;
    fixed_unaided: number;
    follow_on_errors: number;
  };
  help: LevelCounts & {
    questions: number;
    from_errors: number;
    from_selection: number;
    repeat_errors: number;
    avg_edits_before_ask: number | null;
    helpful_up: number;
    helpful_down: number;
    solved: number;
    still_stuck: number;
    confident_yes: number;
    confident_maybe: number;
    confident_no: number;
  };
  series: { slot: string; questions: number; minutes: number }[];
  languages: { language: string; edits: number }[];
  concepts: { concept: string; count: number }[];
  summary: {
    student_summary: string;
    suggested_practice: string;
    generated_at: string | null;
  } | null;
  trend: TrendWeek[];
  recent: (QuestionRow & {
    helpful_rating: number | null;
    self_reported_outcome: 'solved' | 'still_stuck' | null;
  })[];
}

/** The hint ladder as the model wrote it (Appendix A schema). Older rows
 * have no ladder at all; the level fields are strings or small objects. */
export interface Ladder {
  title?: string;
  concept?: string;
  l0_decode?: unknown;
  l1_locate?: unknown;
  l2_concept?: unknown;
  l3_fix?: unknown;
}

export interface QuestionDetail {
  id: string;
  user_id: string;
  username: string;
  created_at: string;
  title: string | null;
  concept: string | null;
  trigger_source: TriggerSource;
  trigger_surface: string | null;
  question_type: string | null;
  free_text: string | null;
  file_name: string | null;
  error_message: string | null;
  error_source: string | null;
  error_code: string | null;
  error_severity: string | null;
  selection_line_count: number | null;
  help_latency_ms: number | null;
  edits_before_ask: number | null;
  recurring_error_count: number;
  recurring_concept_count: number;
  max_level_reached: number;
  helpful_rating: number | null;
  self_reported_outcome: 'solved' | 'still_stuck' | null;
  post_confidence: 'yes' | 'maybe' | 'no' | null;
  cache_hit: boolean;
  model_used: string | null;
  latency_ms: number | null;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  ladder: Ladder | null;
  events: { type: string; at: string; payload: Record<string, unknown> }[];
}

export interface Insights {
  range: RangeInfo;
  trend: TrendWeek[];
  concepts: { concept: string; questions: number; students: number; fix: number }[];
  errors: { has_code: boolean; label: string; message: string | null; questions: number; students: number; fix: number }[];
  rhythm: {
    questions: [number, number, number][];
    sessions: [number, number, number][];
  };
  health: {
    questions: number;
    cache_hits: number;
    prompt_tokens: number;
    completion_tokens: number;
    failures: number;
    latency_avg: number | null;
    latency_p50: number | null;
    latency_p95: number | null;
    models: { model: string; questions: number; tokens: number; cache_hits: number }[];
    series: { slot: string; prompt_tokens: number; completion_tokens: number; questions: number; failures: number }[];
  };
  calibration: { answer: 'yes' | 'maybe' | 'no'; total: number; asked_again: number }[];
}

/** dashboard_engagement: behaviour around explanations, for the class
 * or one student. Medians are null when nothing was measured. */
export interface Engagement {
  range: RangeInfo;
  resolution: {
    questions: number;
    resolved: number;
    median_ms: number | null;
    /** 1 = stopped at L0-L1, 2 = opened the rule (L2), 3 = the fix (L3). */
    by_level: { level: 1 | 2 | 3; questions: number; resolved: number; median_ms: number | null }[];
  };
  reading: {
    explanations: number;
    measured: number;
    visible_at_delivery: number;
    median_visible_ms: number | null;
    median_ms_to_return: number | null;
    median_ms_to_rule: number | null;
    median_ms_to_fix: number | null;
    abandoned: number;
    reopened: number;
    copied: number;
    /** Keyed by rung label ("L0"-"L3") or "unknown". */
    copied_by_level: Record<string, number>;
  };
  after: { edited: number; on_line: number; avg_overlap_pct: number | null; undone: number };
  before: {
    with_latency: number;
    median_help_latency_ms: number | null;
    with_edits: number;
    median_edits_before_ask: number | null;
    repeats: number;
    quick_repeats: number;
    picker_abandoned: { preset: number; free_text: number };
  };
  surfaces: { surface: string; questions: number }[];
  habits: {
    sessions: number;
    without_help: number;
    avg_session_minutes: number | null;
    avg_breaks: number | null;
    focus_losses: number;
    unfocused_seconds: number;
    editor_switches: number;
    files_visited: number;
    files_created: number;
    saves: number;
    debug_runs: number;
    task_runs: number;
    large_pastes: number;
    large_paste_lines: number;
    language_changes: number;
  };
  runs: { total: number; success: number; after_explanation: number; after_explanation_success: number };
  errors: {
    fixed_unaided: number;
    silent_edits: number;
    follow_on: number;
    severity: Record<string, number>;
  };
  files: {
    at: string;
    username: string;
    file_name: string | null;
    ms_with_errors: number | null;
    edits: number | null;
    seen: number | null;
    asked: number | null;
  }[];
  failures: { kind: string; code: string | null; n: number }[];
  /** Class view only (null for one student). */
  quota: { username: string; hour_requests: number; day_requests: number; day_tokens: number }[] | null;
}

/** dashboard-config: settings that live only in Edge Function secrets,
 * and the request limits explain enforces. */
export interface AiConfig {
  provider: string | null;
  model: string | null;
  fallback: { provider: string; model: string | null } | null;
  /** Set by an admin in the dashboard, or else the secrets' defaults. */
  limits: {
    hourly: number;
    daily: number;
    source: 'dashboard' | 'secrets';
    updated_at: string | null;
    updated_by: string | null;
  };
  /** RATE_LIMIT_HOURLY / RATE_LIMIT_DAILY. */
  default_limits: { hourly: number; daily: number };
}

export interface ExportData {
  range: { from: string; to: string };
  students: StudentRow[];
  questions: {
    created_at: string;
    username: string;
    title: string | null;
    concept: string | null;
    question_type: string | null;
    free_text: string | null;
    trigger_source: TriggerSource;
    file_name: string | null;
    error: string | null;
    max_level_reached: number;
    helpful_rating: number | null;
    self_reported_outcome: string | null;
    post_confidence: string | null;
    latency_ms: number | null;
    cache_hit: boolean;
  }[];
  daily: { day: string; questions: number; active_students: number; active_seconds: number }[];
}

export interface AuditEntry {
  id: number;
  created_at: string;
  admin_username: string | null;
  action: string;
  target_type: 'student' | 'account' | null;
  target_label: string | null;
  details: Record<string, unknown>;
}

export interface ManagedAccount {
  id: string;
  username: string;
  role: Role;
  totp_enabled: boolean;
  must_change_password: boolean;
  locked: boolean;
  last_login_at: string | null;
  created_at: string;
  is_self: boolean;
}
