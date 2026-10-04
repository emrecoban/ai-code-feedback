-- [FINE-TUNING-DATA]: keep every newly generated answer in a form that can
-- be used as fine-tuning data without rebuilding anything (addendum §19).
--
-- explain receives everything a training example needs -- the redacted code,
-- every diagnostic with its line, the focus line, the learner notes -- but
-- kept only the answer, so earlier questions cannot be turned back into
-- (input, output) pairs. training_samples keeps exactly what the model was
-- sent and what it said, one row per generated answer.
--
-- Labels are deliberately not stored with it. They arrive later (the error
-- going away minutes on, the same concept coming back within a week) and
-- their rules will be refined, so dashboard.training_record() derives them,
-- together with the training views, each time a record is read. The
-- dashboard's per-question preview and the JSONL export both go through that
-- one function: what an admin inspects is exactly what gets exported.

create table public.training_samples (
  interaction_id  uuid primary key references public.interactions(id) on delete cascade,
  -- Shape of this row: CAPTURE_VERSION in functions/_shared/trainingCapture.ts.
  capture_version smallint not null,
  -- Hash of the prompt templates, so it changes exactly when their wording or
  -- the output schema does.
  prompt_version  text not null,
  -- {provider, model, temperature, max_output_tokens}
  generation      jsonb not null,
  -- [{role, content}]: the system and user messages exactly as sent on the
  -- first pass. A repair pass appends a note to the user message; the note is
  -- not kept, because the answer it led to answers the original question.
  messages        jsonb not null,
  -- The same request as fields (code, focus line, diagnostics, languages,
  -- question, learner notes...), for prompt layouts other than production's.
  context         jsonb not null,
  -- The model's raw text for the accepted answer.
  response_text   text not null,
  -- {accepted_pass, first_pass_errors, soft_issues, hard_issues,
  --  gating_degraded, finished_cleanly}
  validation      jsonb not null,
  created_at      timestamptz not null default now()
);

-- No policies: explain writes it with the service role, and only the
-- definer functions below read it. It holds student code and the private
-- learner notes, so not even the student's own JWT can see it.
alter table public.training_samples enable row level security;
revoke all on public.training_samples from anon, authenticated;

-- training_record() (and dashboard_question) look events up per question.
create index if not exists events_interaction_idx on public.events (interaction_id);

-- ============ Helpers ============

-- A JSON object as compact text with its keys in the given order, from
-- values that are already JSON text. jsonb would reorder the keys (it sorts
-- them by length, which puts l3_fix before l0_decode), and json_build_object
-- pads every colon; this matches what JSON.stringify writes, which is the
-- form the model produces in production.
create or replace function dashboard.json_text(p_keys text[], p_values text[])
returns text language sql immutable set search_path = '' as $$
  select '{' || coalesce(string_agg(to_json(k)::text || ':' || coalesce(v, 'null'), ',' order by n), '') || '}'
  from unnest(p_keys, p_values) with ordinality as u(k, v, n);
$$;

-- The hint ladder as the training target: the production output schema's
-- keys, in its order (functions/_shared/hintLadder.ts HINT_LADDER_SCHEMA).
create or replace function dashboard.ladder_text(p jsonb)
returns text language sql immutable set search_path = '' as $$
  select dashboard.json_text(
    array['title', 'concept', 'confidence', 'needsMoreContext', 'l0_decode', 'l1_locate', 'l2_concept', 'l3_fix'],
    array[
      (p -> 'title')::text, (p -> 'concept')::text, (p -> 'confidence')::text, (p -> 'needsMoreContext')::text,
      (p -> 'l0_decode')::text, (p -> 'l1_locate')::text,
      dashboard.json_text(array['rule', 'example'], array[(p #> '{l2_concept,rule}')::text, (p #> '{l2_concept,example}')::text]),
      dashboard.json_text(array['change', 'why'], array[(p #> '{l3_fix,change}')::text, (p #> '{l3_fix,why}')::text])
    ]
  );
$$;

-- ============ One question as training data ============

-- Everything about one question as training data: whether it can be used and
-- why not, the labels known so far, and the record in each training view.
--
-- capture
--   full     explain stored the request (training_samples): the production
--            prompt and answer, plus one example per hint level.
--   reduced  asked before capture started, so the code is gone. An error
--            question can still teach the two code-free levels, L0 and L2,
--            from the error message alone.
--   none     nothing to train on (a cache hit, or a question about a
--            selection asked before capture started).
--
-- views
--   sft      {messages: [system, user, assistant]} -- the whole answer.
--   levels   one {level, messages} per hint level, each given the levels the
--            student had already been shown (full capture only).
--   kto      {prompt, completion, label} when the outcome gives a label.
--
-- The labels change as signals arrive. labels_final is true once the
-- 7-day "same concept came back" window has closed.
create or replace function dashboard.training_record(p_id uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  -- Bump when a view's format or a label rule changes.
  c_export_version constant int := 1;
  c_levels constant text[] := array['l0_decode', 'l1_locate', 'l2_concept', 'l3_fix'];
  i public.interactions;
  s public.training_samples;
  v_has_sample boolean;
  v_consent text;
  v_ladder jsonb;
  v_capture text;
  v_language text;
  v_prog text;
  v_reasons text[] := '{}';
  v_age interval;
  -- labels
  v_visible_ms numeric;
  v_return_ms numeric;
  v_read boolean;
  v_resolution_ms numeric;
  v_resolved boolean;
  v_repeat boolean;
  v_concept_back boolean;
  v_undone boolean;
  v_edit jsonb;
  v_opened jsonb;
  v_sufficient text;
  v_quality boolean;
  v_labels jsonb;
  -- views
  v_system text;
  v_user text;
  v_values text[];
  v_answer text;
  v_sft jsonb;
  v_kto jsonb;
  v_levels jsonb := '[]';
  v_level_user text;
  k int;
begin
  select * into i from public.interactions where id = p_id;
  if not found then
    return null;
  end if;
  select * into s from public.training_samples where interaction_id = p_id;
  v_has_sample := found;
  select consent_status into v_consent from public.profiles where id = i.user_id;
  v_ladder := i.ladder_payload;
  v_age := now() - i.created_at;

  v_capture := case
    when i.cache_hit or v_ladder is null then 'none'
    when v_has_sample then 'full'
    when i.trigger_source = 'diagnostic' and nullif(i.error_signature, '') is not null then 'reduced'
    else 'none'
  end;

  -- ---------- Why this question can't be used ----------
  if v_consent is distinct from 'granted' then v_reasons := array_append(v_reasons, 'no_consent'); end if;
  if i.cache_hit then v_reasons := array_append(v_reasons, 'cache_hit');
  elsif v_ladder is null then v_reasons := array_append(v_reasons, 'no_answer');
  elsif v_capture = 'none' then v_reasons := array_append(v_reasons, 'not_captured');
  end if;
  if v_ladder is not null and not i.cache_hit then
    -- The model said the context was not enough to answer from.
    if (v_ladder ->> 'needsMoreContext') = 'true' or (v_ladder ->> 'confidence') = 'low' then
      v_reasons := array_append(v_reasons, 'needs_more_context');
    end if;
    -- L2 and L3 emptied after two hard validation failures (gatingDegraded).
    if coalesce(v_ladder #>> '{l2_concept,rule}', '') = '' or coalesce(v_ladder #>> '{l3_fix,change}', '') = '' then
      v_reasons := array_append(v_reasons, 'degraded');
    end if;
  end if;

  -- ---------- Labels, from what happened after the answer ----------
  -- Read: on screen for at least 5 s, or the student went back to the code.
  -- Unknown (null) when the extension reported neither.
  select max(dashboard.num(payload, 'visibleMs')) into v_visible_ms
  from public.events where interaction_id = p_id and event_type = 'explanation_visibility';
  select min(dashboard.num(payload, 'msToReturn')) into v_return_ms
  from public.events where interaction_id = p_id and event_type = 'returned_to_code';
  v_read := case
    when v_visible_ms >= 5000 or v_return_ms is not null then true
    when v_visible_ms is not null then false
  end;

  -- The error the question was about left the file. Only error questions
  -- have one; "no" is only said once a day has passed without it.
  select dashboard.num(payload, 'msToResolution') into v_resolution_ms
  from public.events where interaction_id = p_id and event_type = 'diagnostic_resolved'
  order by server_ts limit 1;
  v_resolved := case
    when i.trigger_source <> 'diagnostic' then null
    when found then true
    when v_age >= interval '1 day' then false
  end;

  -- Asked about the same error again within 10 minutes: the answer did not land.
  v_repeat := case
    when i.error_signature_normalized is null then false
    when exists (
      select 1 from public.interactions n
      where n.user_id = i.user_id and n.id <> i.id
        and n.error_signature_normalized = i.error_signature_normalized
        and n.created_at > i.created_at and n.created_at <= i.created_at + interval '10 minutes'
    ) then true
    when v_age >= interval '10 minutes' then false
  end;

  -- The same concept came back within a week: understanding did not last.
  v_concept_back := case
    when nullif(trim(i.concept), '') is null or lower(i.concept) = 'unspecified' then null
    when exists (
      select 1 from public.interactions n
      where n.user_id = i.user_id and n.id <> i.id
        and lower(trim(n.concept)) = lower(trim(i.concept))
        and n.created_at > i.created_at and n.created_at <= i.created_at + interval '7 days'
    ) then true
    when v_age >= interval '7 days' then false
  end;

  v_undone := exists (select 1 from public.events where interaction_id = p_id and event_type = 'fix_undone');

  select jsonb_build_object(
           'overlap', dashboard.num(payload, 'overlapRatio'),
           'line_distance', dashboard.num(payload, 'editedLineDistance'))
  into v_edit
  from public.events where interaction_id = p_id and event_type = 'post_feedback_edit'
  order by server_ts limit 1;

  select coalesce(jsonb_agg(jsonb_build_object(
           'level', dashboard.num(payload, 'level'),
           'ms_after_answer', dashboard.num(payload, 'msSinceCreated'))
         order by dashboard.num(payload, 'level')), '[]')
  into v_opened
  from public.events where interaction_id = p_id and event_type = 'level_reached';

  -- The lowest level that was enough: the error went away after it, with no
  -- quick repeat and no undo. L0 and L1 are always shown together.
  v_sufficient := case
    when v_resolved and v_repeat is false and not v_undone
      then 'L' || greatest(least(i.max_level_reached, 3), 1)
  end;

  -- One good/bad label for KTO. Explicit bad signals win, then explicit good
  -- ones. The error going away only counts when the answer was not
  -- known to be skipped, because an unread answer can't take the credit.
  v_quality := case
    when i.helpful_rating = -1 or i.self_reported_outcome = 'still_stuck' or v_repeat or v_undone then false
    when i.helpful_rating = 1 or i.self_reported_outcome = 'solved' then true
    when v_read is not false and v_resolved and v_repeat is false then true
  end;

  v_labels := jsonb_build_object(
    'max_level', i.max_level_reached,
    'levels_opened', v_opened,
    'read', v_read,
    'visible_ms', v_visible_ms,
    'returned_to_code_ms', v_return_ms,
    'error_resolved', v_resolved,
    'ms_to_resolution', v_resolution_ms,
    'repeat_within_10_min', v_repeat,
    'concept_back_within_7_days', v_concept_back,
    'helpful', nullif(i.helpful_rating, 0),
    'outcome', i.self_reported_outcome,
    'confidence', i.post_confidence,
    'fix_undone', v_undone,
    'edit_after_fix', v_edit,
    'copied', exists (select 1 from public.events where interaction_id = p_id and event_type = 'explanation_copied'),
    'abandoned', exists (select 1 from public.events where interaction_id = p_id and event_type = 'feedback_abandoned'),
    'sufficient_level', v_sufficient,
    'quality', v_quality
  );

  -- ---------- The training views ----------
  if v_capture = 'full' then
    v_language := s.context ->> 'feedback_language';
    v_prog := s.context ->> 'prog_language';
    v_system := s.messages -> 0 ->> 'content';
    v_user := s.messages -> 1 ->> 'content';
    v_answer := dashboard.ladder_text(v_ladder);
    v_sft := jsonb_build_object('messages', jsonb_build_array(
      jsonb_build_object('role', 'system', 'content', v_system),
      jsonb_build_object('role', 'user', 'content', v_user),
      jsonb_build_object('role', 'assistant', 'content', v_answer)));

    -- One example per level, given the levels already shown. The production
    -- system message stays as it is (it holds the rules for every level),
    -- and the user message names the one level to write.
    v_values := array[
      (v_ladder -> 'l0_decode')::text,
      (v_ladder -> 'l1_locate')::text,
      dashboard.json_text(array['rule', 'example'], array[(v_ladder #> '{l2_concept,rule}')::text, (v_ladder #> '{l2_concept,example}')::text]),
      dashboard.json_text(array['change', 'why'], array[(v_ladder #> '{l3_fix,change}')::text, (v_ladder #> '{l3_fix,why}')::text])
    ];
    for k in 1 .. 4 loop
      continue when k <= 2 and coalesce(v_ladder ->> c_levels[k], '') = '';
      continue when k = 3 and coalesce(v_ladder #>> '{l2_concept,rule}', '') = '';
      continue when k = 4 and coalesce(v_ladder #>> '{l3_fix,change}', '') = '';
      v_level_user := v_user || E'\n\nSTEP: write only ' || c_levels[k]
        || '. Respond with a JSON object whose only key is "' || c_levels[k] || '".'
        || case when k > 1
             then E'\nALREADY SHOWN TO THE STUDENT:\n' || dashboard.json_text(c_levels[1:k - 1], v_values[1:k - 1])
             else '' end;
      v_levels := v_levels || jsonb_build_array(jsonb_build_object(
        'level', k - 1,
        'messages', jsonb_build_array(
          jsonb_build_object('role', 'system', 'content', v_system),
          jsonb_build_object('role', 'user', 'content', v_level_user),
          jsonb_build_object('role', 'assistant', 'content',
            dashboard.json_text(array[c_levels[k]], array[v_values[k]])))));
    end loop;
  elsif v_capture = 'reduced' then
    -- The answer's language: the cache row that holds the same answer, or
    -- else the student's current setting.
    select e.language into v_language from public.explanations e where e.payload = v_ladder limit 1;
    if v_language is null then
      select feedback_language into v_language from public.profiles where id = i.user_id;
    end if;
    -- VS Code language ids, from the file extension (the only trace left).
    v_prog := case lower(substring(i.file_name from '\.([A-Za-z0-9]+)$'))
      when 'py' then 'python' when 'js' then 'javascript' when 'mjs' then 'javascript' when 'cjs' then 'javascript'
      when 'jsx' then 'javascriptreact' when 'ts' then 'typescript' when 'tsx' then 'typescriptreact'
      when 'java' then 'java' when 'c' then 'c' when 'h' then 'c'
      when 'cpp' then 'cpp' when 'cc' then 'cpp' when 'cxx' then 'cpp' when 'hpp' then 'cpp'
      when 'cs' then 'csharp' when 'go' then 'go' when 'rs' then 'rust' when 'php' then 'php' when 'rb' then 'ruby'
      when 'kt' then 'kotlin' when 'swift' then 'swift' when 'html' then 'html' when 'css' then 'css' when 'sql' then 'sql'
      else 'unknown'
    end;
    v_system := 'You are a programming tutor embedded in a university student''s code editor.' || E'\n'
      || 'Respond ONLY with a JSON object with the keys concept, l0_decode and l2_concept. Write every string field entirely in '
      || case v_language when 'tr' then 'Turkish' when 'es' then 'Spanish' else 'English' end || '.' || E'\n\n'
      || 'PEDAGOGICAL RULES' || E'\n'
      || '- concept: 2-5 words naming the general programming concept behind the error.' || E'\n'
      || '- l0_decode: restate what the error means in plain language. It must NOT contain the solution and must NOT contain code.' || E'\n'
      || '- l2_concept: {rule, example}. State the underlying rule and give a short example that uses identifiers and a scenario of its own.';
    v_user := 'PROGRAMMING LANGUAGE: ' || v_prog || E'\n'
      || 'QUESTION: ' || coalesce(i.question_type, 'unspecified') || E'\n'
      || 'DIAGNOSTIC [' || coalesce(i.error_severity, 'error') || ']'
      || coalesce(' (' || nullif(concat_ws(' ', i.error_source, i.error_code), '') || ')', '')
      || ': ' || i.error_signature;
    v_answer := dashboard.json_text(
      array['concept', 'l0_decode', 'l2_concept'],
      array[(v_ladder -> 'concept')::text, (v_ladder -> 'l0_decode')::text,
            dashboard.json_text(array['rule', 'example'], array[(v_ladder #> '{l2_concept,rule}')::text, (v_ladder #> '{l2_concept,example}')::text])]);
    v_sft := jsonb_build_object('messages', jsonb_build_array(
      jsonb_build_object('role', 'system', 'content', v_system),
      jsonb_build_object('role', 'user', 'content', v_user),
      jsonb_build_object('role', 'assistant', 'content', v_answer)));
  end if;

  if v_sft is not null and v_quality is not null then
    v_kto := jsonb_build_object(
      'prompt', jsonb_build_array(v_sft -> 'messages' -> 0, v_sft -> 'messages' -> 1),
      'completion', jsonb_build_array(v_sft -> 'messages' -> 2),
      'label', v_quality);
  end if;

  return jsonb_build_object(
    -- Travels with every exported line, so a line can always be traced back
    -- and split without opening the database.
    'metadata', jsonb_build_object(
      'id', i.id,
      'export_version', c_export_version,
      'capture', v_capture,
      -- A stable pseudonym, so a split never puts one student on both sides.
      'group', 's_' || left(md5(i.user_id::text), 10),
      'split', case
        when ('x' || substr(md5(i.user_id::text || ':split'), 1, 7))::bit(28)::int % 10 < 8 then 'train'
        when ('x' || substr(md5(i.user_id::text || ':split'), 1, 7))::bit(28)::int % 10 = 8 then 'validation'
        else 'test'
      end,
      'created_at', i.created_at,
      'trigger_source', i.trigger_source,
      'question_type', i.question_type,
      'feedback_language', v_language,
      'prog_language', v_prog,
      'prompt_version', s.prompt_version,
      'provider', coalesce(s.generation ->> 'provider', i.model_used),
      'model', s.generation ->> 'model',
      'labels', v_labels),
    -- Which views this question goes into. An answer that is known to have
    -- failed (quality = false) is never an example to imitate, so it stays
    -- out of sft and levels, but it is exactly what KTO needs as a negative.
    'status', jsonb_build_object(
      'reasons', to_jsonb(v_reasons),
      'sft', cardinality(v_reasons) = 0 and v_quality is distinct from false,
      -- The per-level examples only need the levels that exist.
      'levels', v_capture = 'full' and v_reasons <@ array['degraded'] and v_quality is distinct from false,
      'kto', cardinality(v_reasons) = 0 and v_kto is not null,
      'labels_final', v_age >= interval '7 days',
      'labels_final_at', i.created_at + interval '7 days'),
    'validation', case when v_has_sample then s.validation end,
    'views', jsonb_build_object('sft', v_sft, 'levels', v_levels, 'kto', v_kto)
  );
end;
$$;

-- ============ Dashboard RPCs (admins) ============

-- One question's training record, for the preview in the question dialog.
-- Admins only: it contains the student's code and the private learner notes.
create or replace function public.dashboard_training_record(p_token text, p_id uuid)
returns json language plpgsql stable security definer set search_path = '' as $$
declare
  v jsonb;
begin
  perform dashboard.require_admin(p_token);
  v := dashboard.training_record(p_id);
  if v is null then
    raise exception 'Question not found' using errcode = 'P0002';
  end if;
  return v::json;
end;
$$;

-- The training data of a period as JSONL-ready objects, one per line:
--   sft     {messages, metadata}               every usable question
--   levels  {messages, metadata + level}        one line per hint level
--   kto     {prompt, completion, label, metadata} questions with a label
-- p_capture 'full' keeps only questions with the stored request; 'all' adds
-- the reduced records of earlier error questions (sft and kto only).
-- p_final_only (kto) skips labels that can still change. p_usernames limits
-- the export to the students matching the dashboard's search. Audited.
create or replace function public.dashboard_training_export(
  p_token text, p_from date, p_to date, p_tz text,
  p_view text, p_capture text default 'full', p_final_only boolean default true,
  p_usernames text[] default null
) returns json language plpgsql volatile security definer set search_path = '' as $$
declare
  v_admin uuid := dashboard.require_admin(p_token);
  r record;
  v_lines jsonb;
  v_considered int;
begin
  if p_view is null or p_view not in ('sft', 'levels', 'kto') then
    raise exception 'Unknown training view %', p_view using errcode = '22023';
  end if;
  if p_capture is null or p_capture not in ('full', 'all') then
    raise exception 'Unknown capture filter %', p_capture using errcode = '22023';
  end if;
  select * into r from dashboard.resolve_range(p_from, p_to, p_tz);

  with recs as (
    select dashboard.training_record(i.id) as rec, i.created_at
    from public.interactions i
    join public.profiles p on p.id = i.user_id
    where i.created_at >= r.from_ts and i.created_at < r.to_ts
      and (p_usernames is null or p.username = any(p_usernames))
  ),
  usable as (
    select rec, created_at, rec -> 'metadata' as metadata
    from recs
    where rec #>> '{metadata,capture}' = any(case p_capture when 'full' then array['full'] else array['full', 'reduced'] end)
  ),
  lines as (
    select u.created_at, 0 as level, (u.rec -> 'views' -> 'sft') || jsonb_build_object('metadata', u.metadata) as line
    from usable u
    where p_view = 'sft' and (u.rec #>> '{status,sft}')::boolean
    union all
    select u.created_at, (l ->> 'level')::int,
           jsonb_build_object('messages', l -> 'messages',
                              'metadata', u.metadata || jsonb_build_object('level', l -> 'level'))
    from usable u, jsonb_array_elements(u.rec -> 'views' -> 'levels') l
    where p_view = 'levels' and (u.rec #>> '{status,levels}')::boolean
    union all
    select u.created_at, 0, (u.rec -> 'views' -> 'kto') || jsonb_build_object('metadata', u.metadata)
    from usable u
    where p_view = 'kto' and (u.rec #>> '{status,kto}')::boolean
      and (not p_final_only or (u.rec #>> '{status,labels_final}')::boolean)
  )
  select coalesce(jsonb_agg(line order by created_at, level), '[]'), (select count(*) from recs)
  into v_lines, v_considered
  from lines;

  perform dashboard.audit(v_admin, 'training_export', null, null, null, jsonb_build_object(
    'from', r.from_day, 'to', r.to_day, 'view', p_view, 'capture', p_capture,
    'questions', v_considered, 'records', jsonb_array_length(v_lines)
  ));

  return json_build_object(
    'view', p_view,
    'capture', p_capture,
    'questions', v_considered,
    'records', v_lines
  );
end;
$$;

-- ============ Grants ============

revoke all on all functions in schema dashboard from public, anon, authenticated;

revoke all on function public.dashboard_training_record(text, uuid) from public;
revoke all on function public.dashboard_training_export(text, date, date, text, text, text, boolean, text[]) from public;
grant execute on function public.dashboard_training_record(text, uuid) to anon, authenticated;
grant execute on function public.dashboard_training_export(text, date, date, text, text, text, boolean, text[]) to anon, authenticated;
