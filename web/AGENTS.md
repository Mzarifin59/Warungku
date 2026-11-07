<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — WarungKu Web

Read this file BEFORE changing anything inside the `web/` folder.
Cross-folder rules (project context, database migrations, secrets,
docs-vs-code conflicts) live in [the root AGENTS.md](../AGENTS.md).

## 1. About the app

A Next.js App Router + React app (installed versions: see `package.json` —
currently Next `16.4.3`, React 19) containing:

- Public marketplace: home, explore (`/warung`), shop detail
  (`/warung/[slug]`), search (`/cari`), info pages
- Partner dashboard (`/mitra/*`): shop profile & publish, products,
  categories, preview
- Auth: login, register, email confirmation callback (`/auth/confirm`)

Data & auth come from **Supabase** (browser + server clients in
`lib/supabase/`), authorized by RLS. Supabase integration was approved
after the docs were written — see `../docs/web/DECISIONS.md`. The
"FORBIDDEN in Phase 1" list in `../docs/web/AGENTS.md` no longer applies to
network calls / Supabase; its UI and accessibility rules still do.

## 2. Design docs — read before changing UI

| Need | Read |
|---|---|
| Product context, personas, UX principles | [01-product-brief.md](../docs/web/01-product-brief.md) |
| Color tokens, typography, spacing, component styles | [02-design-system.md](../docs/web/02-design-system.md) |
| Sitemap, route list, render strategy | [03-information-architecture.md](../docs/web/03-information-architecture.md) |
| User flows & edge cases | [04-user-flows.md](../docs/web/04-user-flows.md) |
| Per-screen specs (layout, states, actions) | [05-screen-specs.md](../docs/web/05-screen-specs.md) |
| Decisions overriding / extending the docs | [DECISIONS.md](../docs/web/DECISIONS.md) |

Docs 06–11 referenced elsewhere were never written — do NOT invent their
content; ask the user. Color/font conflict between docs and code: see root
`AGENTS.md` section 5 (ask before touching).

## 3. Conventions

- Read the installed Next.js guides in `node_modules/next/dist/docs/01-app/`
  before using or changing any App Router feature (e.g. `middleware.ts` is
  now `proxy.ts`; Cache Components is enabled).
- `app/` routes only render `components/view/*`; reusable UI in
  `components/ui`, `components/layout`, `components/mitra`.
- Static copy/links live in `lib/content/*` — never hard-code catalog or
  marketing content inside components.
- Supabase access goes through `lib/repos/*` (public pages, search,
  checkout, auth) or `lib/supabase/mutations.ts` (dashboard). Map rows with
  `lib/supabase/mappers.ts`.
- Never trust client state for orders: checkout re-reads prices/availability
  from the DB (`lib/checkout.ts`), and free text in WhatsApp messages goes
  through `toSingleLine`.
- Tailwind utilities + tokens in `app/globals.css`; icons from
  `lucide-react`. Semantic HTML, accessible labels, strict TypeScript,
  Indonesian UI copy.
- Run `bun run lint` and `bun run build` from this folder after changes.

## 4. Definition of done

Matches `../docs/web/05-screen-specs.md` (or a recorded decision), handles
loading / empty / error / filled states, responsive at 360/768/1280px,
accessible labels, and `bun run lint` + `bun run build` pass.
