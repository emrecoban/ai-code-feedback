// An in-memory Postgres (PGlite) with every migration from supabase/migrations
// applied, so the sample script can call the dashboard's own SQL functions on
// synthetic rows. Nothing here connects to the real Supabase project.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Supabase-only objects the migrations refer to, reduced to what they need.
const STUBS = `
set time zone 'UTC';
create schema auth;
create table auth.users (
  id uuid primary key, email text, raw_user_meta_data jsonb,
  encrypted_password text, created_at timestamptz default now(), updated_at timestamptz
);
create table auth.sessions (id uuid primary key default gen_random_uuid(), user_id uuid);
create table auth.refresh_tokens (id bigserial primary key, user_id text);
create function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
create schema extensions;
create extension pgcrypto with schema extensions;
create schema storage;
create table storage.buckets (id text primary key, name text, public boolean);
create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text);
alter table storage.objects enable row level security;
create schema realtime;
create function realtime.send(payload jsonb, event text, topic text, private boolean)
returns void language sql as $$ select $$;
`;

/**
 * Opens the database with the clock set to `asOf`, so every now() in the
 * dashboard functions is the same on every run (plus a few milliseconds).
 */
export async function openDb(migrationsDir, asOf) {
  const realNow = Date.now.bind(Date);
  const start = realNow();
  Date.now = () => asOf + (realNow() - start);

  const { PGlite } = await import('@electric-sql/pglite');
  const { pgcrypto } = await import('@electric-sql/pglite/contrib/pgcrypto');
  const db = await PGlite.create({ extensions: { pgcrypto } });
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  // Every API role the migrations grant to or write policies for (Supabase
  // creates them itself; here they only need to exist).
  const roles = new Set();
  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), 'utf8').replace(/--.*$/gm, '');
    for (const m of sql.matchAll(/\bto\s+([a-z_]+(?:\s*,\s*[a-z_]+)*)\s*(?=;|\busing\b|\bwith\b)/gi)) {
      for (const role of m[1].split(',').map((r) => r.trim().toLowerCase())) if (role !== 'public') roles.add(role);
    }
  }
  for (const role of roles) await db.exec(`create role ${role}`);
  await db.exec(STUBS);
  for (const file of files) {
    try {
      await db.exec(readFileSync(join(migrationsDir, file), 'utf8'));
    } catch (e) {
      throw new Error(`Migration ${file} failed in PGlite: ${e.message}`);
    }
  }
  return {
    db,
    migrations: files,
    async close() {
      await db.close();
      Date.now = realNow;
    },
  };
}

/** Inserts plain objects through json_populate_recordset. Only the keys of
 * the first row are written, so omitted columns keep their defaults. */
export async function insertRows(db, table, rows, chunk = 500) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]).join(', ');
  for (let i = 0; i < rows.length; i += chunk) {
    const part = rows.slice(i, i + chunk);
    await db.query(
      `insert into ${table} (${cols}) select ${cols} from json_populate_recordset(null::${table}, $1::json)`,
      [JSON.stringify(part)],
    );
  }
}
