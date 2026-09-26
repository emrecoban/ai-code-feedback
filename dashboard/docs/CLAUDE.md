# dashboard/docs: data documentation site

VitePress 1.6.4 site that documents every data item the system collects, what it means and how
research can use it. English at `/`, Turkish at `/tr/`, Spanish at `/es/`. It has its own `package.json`
(npm) and needs nothing else at build time. The scripts read `supabase/`, `extension/` and
`dashboard/src/config.ts` two levels up (`REPO` in `scripts/sample.mjs` and `scripts/check.mjs`).

**Published with the dashboard.** The dashboard's `pnpm build` runs `build:docs`: `npm ci` here, then
`docs:build:dashboard`, which builds the site with base `/docs/` into `../dist/docs/`. In that build the
links end in `.html` (no clean URLs), so any static host serves the pages without rewrite rules. The
dashboard's Docs link points to `/docs/` unless `VITE_DOCS_URL` is set.

## Commands (run in `dashboard/docs/`)

| Command | What it does |
|---|---|
| `npm run docs:dev` | Dev server. Also shows draft pages (the ethics page) |
| `npm run docs:build` | Standalone build to `.vitepress/dist/` (site at the root). Fails on dead links |
| `npm run docs:build:dashboard` | Build under `/docs/` into the dashboard's `dist/docs/` (`DOCS_BASE`, `DOCS_OUT_DIR`) |
| `npm run docs:sample` | `scripts/sample.mjs` then `scripts/codebook.mjs`: synthetic cohort, dashboard metrics, views, codebook and downloads. Deterministic (fixed seed and clock) |
| `npm run docs:check` | `scripts/check.mjs`: all coverage, schema, secret, style and language checks. Set `DOCS_ACCOUNTS_FILE` to the local list of test and teacher accounts to scan for those usernames |

After a change to the sample or to page texts, run `docs:sample`, then the page generator (below),
then `docs:build` and `docs:check`.

## Layout

| Path | What it is |
|---|---|
| `.vitepress/data/inventory.json` | Every data item (id, kind, table, column, formula, formula version, page, anchor) and the code issues I-01 to I-34. Source of truth for the site |
| `.vitepress/data/terms.ts` | EN/TR/ES names of every item (dashboard labels verbatim), value labels, category names, all interface strings |
| `.vitepress/data/{project,research,site,reference,flow}.ts` | Home page facts, research questions + matrix + cleaning rules C1–C14, page tree, table reference texts, data flow texts |
| `.vitepress/data/sample/` | Generated synthetic data: `raw/`, `external/` (tests, TAM, key table), `views/` (one per data page), `snippets/`, `derived.json`, `wide.json` |
| `.vitepress/data/{purposes,downloads}.json` | Generated: page purposes for "Data at a glance", download list |
| `.vitepress/theme/` | Theme extension and Vue components (charts are hand-rolled SVG like the dashboard) |
| `scripts/lib/` | PGlite replay of `supabase/migrations`, PRNG, stats, views, XLSX writer |
| `scripts/authoring/` | Page generator: `node run.mjs p1-accounts-asking.mjs … p5-indicators-system.mjs` writes the 62 generated data pages in three languages. The trend page is hand-written |
| `src/` | English pages, `src/tr/` and `src/es/` mirrors with the same file names, `src/public/downloads/` |

## Rules

- **Synthetic data only.** Never connect to the live Supabase project, never copy real data, and never
  put URLs, keys or values from `.env` or config files into this folder. `docs:check` scans for them.
- **Every page in all three languages**, same file names. No English interface text on TR/ES pages.
- **Style:** short plain sentences, no em-dashes, no semicolons (checked). Metric names match the
  dashboard labels in `terms.ts`.
- **Numbers in page texts come from the sample views.** The generator records each used fact in the page
  frontmatter (`sample:`), and `docs:check` fails when the sample no longer matches.
- **Data pages have eight sections** in order: what, example, visual, purpose, raw, research, limits, teacher.
- **The ethics page** stays out of the build until `ethicsPagePublished` is true in `project.ts`.
