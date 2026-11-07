# AGENTS.md — WarungKu (root)

Entry point for AI coding assistants. Read it BEFORE modifying code. Folder
`AGENTS.md` files take PRIORITY over this one for their folder.

## 1. About the project

WarungKu is a multi-tenant digital catalog for Indonesian UMKM (micro, small
and medium businesses). Each shop gets a public page at `/warung/{slug}`.
Customers pick products and send a structured order via WhatsApp (`wa.me`);
owners manage their shop and catalog from a simple dashboard (`/mitra/*`).

Team: 2 part-time developers, web development competition. Priority:
**a clean, easy-to-use, easy-to-demo end-to-end flow**, not feature count.

## 2. Repository layout

| Folder | Contents | Read first |
|---|---|---|
| `web/` | Next.js App Router app (public marketplace, partner dashboard, auth) | [web/AGENTS.md](web/AGENTS.md) |
| `supabase/migrations/` | Database schema as ordered SQL files (Supabase CLI naming) | file headers |
| `supabase/seed.sql` | Demo data (3 shops, demo accounts) | file header |
| `docs/web/` | Product brief, design system, IA, flows, screen specs, `DECISIONS.md` | [docs/web/AGENTS.md](docs/web/AGENTS.md) |
| `docs/supabase/` | Supabase integration plan & setup guide | [guide-setup-supabase.md](docs/supabase/guide-setup-supabase.md) |

There is **no separate backend server**: `web/` talks to Supabase (Postgres +
Auth + Storage) directly; authorization is enforced by RLS policies.

## 3. Cross-folder rules

- **Docs are the source of truth for design.** Before changing UI, read the
  relevant documents in `docs/web/` (map in section 4). Record decisions in
  `docs/web/DECISIONS.md` (format: `date — decision — rationale`).
- **Database changes = new migration file.** Never edit an already-applied
  migration; add `supabase/migrations/<YYYYMMDDHHMMSS>_<name>.sql`, make it
  idempotent where possible, and update `web/lib/supabase/database.types.ts`.
  Every new table needs RLS enabled + policies.
- **Secrets:** only `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  may reach the browser. `web/.env.local` is git-ignored; never commit keys.
- **Verify after changes:** `bun run lint` and `bun run build` from `web/`.

## 4. Docs map (`docs/web/`)

Written in Indonesian; keep UI copy in Indonesian.

| Need | Read |
|---|---|
| Product context, personas, UX principles, scope | [01-product-brief.md](docs/web/01-product-brief.md) |
| Color tokens, typography, spacing, component styles | [02-design-system.md](docs/web/02-design-system.md) |
| Sitemap, route list, navigation, render strategy | [03-information-architecture.md](docs/web/03-information-architecture.md) |
| User flows & edge cases | [04-user-flows.md](docs/web/04-user-flows.md) |
| Per-screen specs (layout, states, actions) | [05-screen-specs.md](docs/web/05-screen-specs.md) |
| Decisions that override or extend the docs | [DECISIONS.md](docs/web/DECISIONS.md) |

Documents 06–11 referenced inside `docs/web/` were never written. Do NOT
invent their content — ask the user.

The docs were written for a "Phase 1, mock data only" frontend. Supabase
integration has since been approved (see `DECISIONS.md`), so the Phase-1
"no network calls / no Supabase" restrictions no longer apply.

## 5. Docs vs code conflicts

`docs/web/02-design-system.md` prescribes terracotta `#C2410C` + Plus Jakarta
Sans, while the code uses primary `#227BF3` + Poppins (`web/app/globals.css`).
This is still undecided: **if your task touches colors/fonts, ask the user**
and record the answer in `DECISIONS.md`.

## 6. Definition of done

Matches the relevant docs, passes `bun run lint` and `bun run build` in
`web/`, touches no file outside the task scope, and any new decision is
recorded in `docs/web/DECISIONS.md`.
