-- ============ Identity ============
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique not null,
  display_name  text,
  ui_language   text not null default 'en'
                  check (ui_language in ('en','tr','es')),
  feedback_language text not null default 'en'
                  check (feedback_language in ('en','tr','es')),
  first_login_at   timestamptz,
  consent_status   text not null default 'pending'
                  check (consent_status in ('pending','granted','declined')),
  consent_at       timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============ Course context ============
create table courses (
  id             uuid primary key default gen_random_uuid(),
  code           text unique not null,
  name           text not null,
  prog_language  text not null,
  runtime_note   text,
  run_command    text,
  error_surface  text not null default 'both'
                   check (error_surface in ('diagnostics','runtime','both')),
  start_date     date not null,
  week_length_days int not null default 7,
  paused_days    int not null default 0,
  week_override  int,
  forbidden_concepts text[] not null default '{}',
  active         boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table course_weeks (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references courses(id) on delete cascade,
  week_no    int  not null,
  title      text not null,
  concepts   text[] not null default '{}',
  notes      text,
  unique (course_id, week_no)
);

create table enrollments (
  user_id    uuid not null references profiles(id) on delete cascade,
  course_id  uuid not null references courses(id) on delete cascade,
  role       text not null default 'student'
               check (role in ('student','instructor','researcher')),
  created_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

create table concept_vocabulary (
  id            text primary key,
  prog_language text not null,
  label_en text, label_tr text, label_es text
);

-- ============ Sessions and interactions ============
create table coding_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  course_id       uuid references courses(id) on delete set null,
  started_at      timestamptz not null default now(),
  last_seen_at    timestamptz not null default now(),
  ended_at        timestamptz,
  extension_version text,
  vscode_version    text,
  os                text
);

create table interactions (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null references coding_sessions(id) on delete cascade,
  user_id        uuid not null references profiles(id) on delete cascade,
  course_id      uuid references courses(id) on delete set null,
  trigger_source text not null
                   check (trigger_source in
                     ('diagnostic','runtime','selection','stuck','paste','success')),
  question_type  text,
  error_signature text,
  concepts_requested text[] default '{}',
  max_level_reached int not null default 0
                   check (max_level_reached between 0 and 3),
  followup_count int not null default 0,
  still_confused_count int not null default 0,
  resolved       boolean,
  resolved_at    timestamptz,
  time_to_first_edit_ms int,
  helpful_rating int check (helpful_rating between -1 and 1),
  cache_hit      boolean not null default false,
  model_used     text,
  prompt_tokens  int,
  completion_tokens int,
  latency_ms     int,
  created_at     timestamptz not null default now()
);

-- events.client_event_id closes a gap in the base spec: §10.3 requires
-- idempotency on a client-supplied event id, but no column held it.
create table events (
  id             bigserial primary key,
  session_id     uuid not null references coding_sessions(id) on delete cascade,
  user_id        uuid not null references profiles(id) on delete cascade,
  interaction_id uuid references interactions(id) on delete cascade,
  event_type     text not null,
  client_event_id text not null,
  payload        jsonb not null default '{}',
  client_ts      timestamptz not null,
  server_ts      timestamptz not null default now(),
  unique (user_id, client_event_id)
);
create index on events (user_id, server_ts desc);
create index on events (event_type, server_ts desc);
create index on interactions (user_id, created_at desc);

-- New table, see docs/SPEC_ADDENDUM.md §3: stores the bounded follow-up
-- thread that §10.2 requires but the base spec never gave a home to.
create table followup_turns (
  id             bigserial primary key,
  interaction_id uuid not null references interactions(id) on delete cascade,
  user_id        uuid not null references profiles(id) on delete cascade,
  turn_index     int not null,
  role           text not null check (role in ('student','assistant')),
  kind           text check (kind in ('still_confused','free_text')),
  representation text check (representation in ('analogy','trace','worked_example')),
  content        text not null,
  created_at     timestamptz not null default now(),
  unique (interaction_id, turn_index)
);
create index on followup_turns (interaction_id, turn_index);

-- ============ Generated content cache ============
create table explanations (
  id             uuid primary key default gen_random_uuid(),
  cache_key      text unique not null,
  course_id      uuid references courses(id) on delete cascade,
  week_no        int,
  language       text not null,
  error_signature text,
  payload        jsonb not null,
  model_used     text not null,
  source         text not null default 'generated'
                   check (source in ('generated','error_pack')),
  reuse_count    int not null default 0,
  created_at     timestamptz not null default now()
);
create index on explanations (course_id, week_no, language);

-- ============ Learner memory (rolling summary) ============
create table learner_profiles (
  user_id        uuid primary key references profiles(id) on delete cascade,
  course_id      uuid references courses(id) on delete set null,
  summary        text not null default '',
  struggle_concepts text[] not null default '{}',
  mastered_concepts text[] not null default '{}',
  interactions_since_update int not null default 0,
  updated_at     timestamptz not null default now()
);

-- ============ Quota ============
create table usage_counters (
  user_id      uuid not null references profiles(id) on delete cascade,
  window_start timestamptz not null,
  requests     int not null default 0,
  total_tokens int not null default 0,
  primary key (user_id, window_start)
);

-- ============ Consent audit ============
create table consent_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  status     text not null check (status in ('granted','declined','withdrawn')),
  version    text not null,
  created_at timestamptz not null default now()
);

-- ============ Profile auto-creation (§5.2) ============
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Usernames are immutable once created (docs/SPEC_ADDENDUM.md §1): RLS
-- can't express "this column may not change" directly in an UPDATE policy
-- because WITH CHECK only sees the new row, not the old one.
create or replace function prevent_username_change()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.username is distinct from old.username then
    raise exception 'username is immutable';
  end if;
  return new;
end;
$$;
create trigger profiles_lock_username
  before update on profiles
  for each row execute function prevent_username_change();

-- ============ Row Level Security ============
alter table profiles           enable row level security;
alter table enrollments        enable row level security;
alter table courses            enable row level security;
alter table course_weeks       enable row level security;
alter table coding_sessions    enable row level security;
alter table interactions       enable row level security;
alter table events             enable row level security;
alter table followup_turns     enable row level security;
alter table explanations       enable row level security;
alter table learner_profiles   enable row level security;
alter table usage_counters     enable row level security;
alter table consent_log        enable row level security;

-- profiles
create policy own_profile_select on profiles
  for select to authenticated using (auth.uid() = id);
create policy own_profile_insert on profiles
  for insert to authenticated with check (auth.uid() = id);
create policy own_profile_update on profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- courses / course_weeks: enrolled-read only
create policy enrolled_course_read on courses
  for select to authenticated using (
    exists (select 1 from enrollments e
            where e.course_id = courses.id and e.user_id = auth.uid())
  );
create policy enrolled_week_read on course_weeks
  for select to authenticated using (
    exists (select 1 from enrollments e
            where e.course_id = course_weeks.course_id and e.user_id = auth.uid())
  );

-- enrollments: a student can see their own enrollment rows
create policy own_enrollment_select on enrollments
  for select to authenticated using (auth.uid() = user_id);

-- coding_sessions: client owns its own session bookkeeping (no cost/quota
-- risk in this table -- see docs/SPEC_ADDENDUM.md §1)
create policy own_session_select on coding_sessions
  for select to authenticated using (auth.uid() = user_id);
create policy own_session_insert on coding_sessions
  for insert to authenticated with check (auth.uid() = user_id);
create policy own_session_update on coding_sessions
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- interactions: read-only from the client; all writes go through Edge
-- Functions with the service role (docs/SPEC_ADDENDUM.md §1 -- the base
-- spec's own example policy contradicted its own prose rule here).
create policy own_interactions_select on interactions
  for select to authenticated using (auth.uid() = user_id);

-- events: no client policies. Client only ever posts through /events,
-- which uses the service role; it never reads events back.

-- followup_turns: read-only from the client; writes via /followup only.
create policy own_followup_select on followup_turns
  for select to authenticated using (auth.uid() = user_id);

-- explanations: readable if enrolled in the owning course, or course-agnostic
create policy explanation_read on explanations
  for select to authenticated using (
    course_id is null or exists (
      select 1 from enrollments e
      where e.course_id = explanations.course_id and e.user_id = auth.uid())
  );

-- learner_profiles: service role only, no client policies
-- usage_counters: service role only, no client policies

-- consent_log: client records its own consent decisions directly (low
-- risk, not cost-bearing -- see docs/SPEC_ADDENDUM.md §1). Withdrawal
-- rows are written by the withdraw-consent Edge Function with the
-- service role instead, so no update/delete policy is needed here.
create policy own_consent_select on consent_log
  for select to authenticated using (auth.uid() = user_id);
create policy own_consent_insert on consent_log
  for insert to authenticated with check (auth.uid() = user_id);
