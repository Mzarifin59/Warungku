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
| `supabase/` | Migrations (ordered SQL, Supabase CLI naming), `seed.sql` (demo data: 3 shops, demo accounts), setup guide | [supabase/README.md](supabase/README.md) |
| `docs/web/` | `DECISIONS.md` — log of product/design decisions | [DECISIONS.md](docs/web/DECISIONS.md) |

There is **no separate backend server**: `web/` talks to Supabase (Postgres +
Auth + Storage) directly; authorization is enforced by RLS policies.

## 3. Cross-folder rules

- **The code is the source of truth for design.** Follow the existing tokens
  in `web/app/globals.css` (primary `#227BF3`, Poppins), existing components,
  and static copy in `web/lib/content/*`. Keep UI copy in Indonesian. Record
  product/design decisions in `docs/web/DECISIONS.md` (format:
  `date — decision — rationale`).
- **Database changes = new migration file.** Never edit an already-applied
  migration; add `supabase/migrations/<YYYYMMDDHHMMSS>_<name>.sql`, make it
  idempotent where possible, and update `web/lib/supabase/database.types.ts`.
  Every new table needs RLS enabled + policies.
- **Secrets:** only `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  may reach the browser. `web/.env.local` is git-ignored; never commit keys.
- **Verify after changes:** `bun run lint` and `bun run build` from `web/`.

## 4. Definition of done

Consistent with the existing UI, passes `bun run lint` and `bun run build` in
`web/`, touches no file outside the task scope, and any new decision is
recorded in `docs/web/DECISIONS.md`.
