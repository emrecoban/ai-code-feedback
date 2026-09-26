# dashboard

Web dashboard for monitoring the data the AI Code Feedback extension collects in Supabase. React + TypeScript, built with Vite. Interface in English, Türkçe and Español.

## What's in it

**Period filter.** Today, the last 7 / 30 / 90 days, all time, or a custom range. Everything on Overview and Insights follows it (except "Online now"). Charts switch to hourly columns for one or two days and to weekly columns past four months.

**Overview**
- *At a glance*: online now, active students, questions (vs. the previous period), active coding time, sessions without any question, how often the first hint was enough, how often the error went away after an explanation (and how fast), errors fixed without asking, helpful ratings, AI response time and failed requests.
- *Needs attention*: students matching simple, explainable rules. These are the same error asked 3+ times, "still stuck", needing the fix for 70%+ of 5+ questions, 8+ edits before asking, 2+ "not helpful" ratings, or no activity for 7+ days.
- Questions over time, how far students went into the hints (L0–L1 hint only, L2 rule, L3 fix), and the latest questions. Click a question to read the whole explanation (L0 · Decode to L3 · Fix), the context, where it was asked from, and what the student did next: when each step was opened, time on screen, going back to the code, the first edit after the fix (how close to the pointed line, how similar to the fix), when the error went away, copying, leaving.
- *Students*: a collapsible row per student with detail for the period (including a weekly independence trend) and, folded away, the same learning-behaviour breakdown as Insights for that student alone. Admins also get **Change password**, **Reset data** and **Delete student**, each behind a confirmation.
- *Export*: Excel (students, questions and a daily summary as three sheets) or CSV. Every export is written to the activity log.

**Insights**
- Class-wide independence trend: asked for help when offered, hint was enough, and sessions without help, week by week.
- Most-asked concepts and most common errors.
- *Learning behaviour*: whether the error went away after an explanation, by how far the student went (L0–L1 / L2 / L3) and how fast; how explanations are read (on screen when they arrive, time on screen, back to the code, time to open L2 and L3, left without acting, reopened, copied); the first edit after the fix and undos; what happened before asking (wait after the offer, edits, the same error again, closed question pickers); where questions start (CodeLens, lightbulb, shortcut…); work habits (session length, breaks, time away from VS Code, file switches, saves, debug and task runs, large pastes); terminal runs and how they ended; errors fixed alone, follow-on errors and error severity; and the latest files that became error-free.
- A weekday × hour heatmap of when students work.
- System health: tokens, cache hit rate, failure rate, response time, providers, the AI model in use, the **Limits** (AI requests per student per hour and per day, which admins can change here), failed requests by reason, and each student's use of those limits today.
- Whether "could you do this yourself now?" answers hold up.

**Activity log** (admins): sign-ins, failed sign-ins, exports, and every change to student data or accounts.

**Account**: change your password, turn on two-step verification (any authenticator app), and, for admins, manage dashboard accounts.

The page updates live: the database announces changes on a Realtime channel and the dashboard refetches (at most every 5 seconds). If Realtime is unavailable, it refreshes every 15 seconds instead. **Pause** stops both.

## Run

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # type-check + production build into dist/, with the docs site in dist/docs/
```

It talks to the same Supabase project as the extension by default. To point it at another one, copy `.env.example` to `.env.local` and fill it in.

The **Docs** link in the top bar opens the data documentation site (`docs/`) in the dashboard's language. `pnpm build` builds that site into `dist/docs/` (it needs npm, and installs the site's own dependencies), so deploying `dist/` publishes the dashboard and the docs together, and the link points at `/docs/`. To link to docs hosted somewhere else, set `VITE_DOCS_URL` at build time. In `pnpm dev` the link points at the docs dev server on port 5174.

## Accounts and security

Dashboard accounts are separate from student accounts. They live in the `dashboard` schema, which the REST API does not expose (see `supabase/migrations/0017`–`0023`). The browser only calls the `dashboard_*` RPC functions, and each one checks the session token before touching anything, so the publishable key alone opens nothing.

The AI model and the request limits are Edge Function secrets (`AI_MODEL`, `AI_PROVIDER`, `RATE_LIMIT_HOURLY`…), which the database can't read. The `dashboard-config` Edge Function returns them — names and numbers only, never keys or URLs — after checking the same session token. It is deployed with `verify_jwt: false`, because dashboard accounts are not Supabase Auth users.

- **Roles**: *admin* can change a student's password, reset or delete student data, change the request limits and manage accounts. *Viewer* can see everything (except the activity log) but change nothing. There is always at least one admin.
- **Passwords**: 6–128 characters, stored as bcrypt hashes. New accounts and admin resets get a temporary password, and the dashboard stays closed until its owner picks their own. Five wrong attempts lock an account for 15 minutes.
- **Two-step verification**: TOTP (RFC 6238). A used code can't be replayed. An admin can turn it off for someone who lost their phone.
- **Sessions** last 12 hours. Changing a password signs out every other session.
- There is no sign-up or "forgot password" in the UI.
- **Student passwords** (admins): 8–72 characters, typed twice. The new bcrypt hash is written to the student's Supabase Auth account and all their sessions are ended, so the extension signs them out everywhere. The password itself is never logged.
- **Request limits** (admins): stored in `public.rate_limits` (one row, readable only by the Edge Functions and these RPCs). While no value has been set in the dashboard, the `RATE_LIMIT_HOURLY` / `RATE_LIMIT_DAILY` secrets apply as before; once set, the dashboard's values win and apply from each student's next question. The dashboard does not write the secrets themselves: that would need a Supabase management token, which can change the whole project. Every change is in the activity log.

If the only admin is locked out, reset the password in the Supabase SQL editor. The owner is asked to choose a new one at next sign-in:

```sql
update dashboard.admins
set password_hash = extensions.crypt('a-temporary-password', extensions.gen_salt('bf', 10)),
    must_change_password = true, failed_attempts = 0, locked_until = null,
    totp_secret = null, totp_pending_secret = null, totp_last_step = null
where username = 'the-admin';
```

## Reset vs. delete

| | Reset data | Delete student |
|---|---|---|
| Questions, explanations, events, usage limits, AI summary | removed | removed |
| Coding sessions | removed, except the newest, which is kept with zeroed counters (the extension may still be writing to it) | removed |
| Account, consent record | kept | removed |

After a delete, signing in to the extension with the same username creates a new, empty account.
