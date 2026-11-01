<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — WarungKu Frontend

Read this file BEFORE changing anything inside the `frontend/` folder.
Cross-folder rules (project context, shared rules, docs-vs-code conflicts)
live in [the root AGENTS.md](../AGENTS.md).

## 1. About the frontend

A Next.js App Router + React app (installed versions: see `package.json` —
currently Next `16.4.3`, React 19) containing:

- Public marketplace (home, explore, shop detail)
- Partner dashboard (partner, products, etc.)
- Auth UI (login, register)
- Info pages (help, about)

All data is MOCK right now — no Supabase / Phase-2 backend integration.
The Phase-1 forbidden list (no network calls, no new dependencies, etc.) and
required rules are in
[the docs/frontend/AGENTS.md](../docs/frontend/AGENTS.md) ("FORBIDDEN in
Phase 1" and "REQUIRED" sections) — **follow them without exception.**

## 2. Design docs — MUST read before coding

All design decisions are written in `docs/frontend/`. The file in this folder
only covers tooling conventions; the **source of truth** for design system,
colors, fonts, copy, data structure, and screen specs lives in the docs:

| Need | Read |
|---|---|
| Product context, personas, UX principles | [../docs/frontend/01-product-brief.md](../docs/frontend/01-product-brief.md) |
| Color tokens, typography, spacing, component styles | [../docs/frontend/02-design-system.md](../docs/frontend/02-design-system.md) |
| Sitemap, route list, render strategy | [../docs/frontend/03-information-architecture.md](../docs/frontend/03-information-architecture.md) |
| User flows & edge cases | [../docs/frontend/04-user-flows.md](../docs/frontend/04-user-flows.md) |
| Per-screen specs (layout, states, actions) | [../docs/frontend/05-screen-specs.md](../docs/frontend/05-screen-specs.md) |
| Component inventory & props | [../docs/frontend/06-components.md](../docs/frontend/06-components.md) |
| Folder structure, conventions, data layer, state | [../docs/frontend/07-frontend-architecture.md](../docs/frontend/07-frontend-architecture.md) |
| UI text, error messages, WhatsApp templates | [../docs/frontend/08-content-and-copy.md](../docs/frontend/08-content-and-copy.md) |
| Domain types, validation rules, mock data | [../docs/frontend/09-types-and-mock-data.md](../docs/frontend/09-types-and-mock-data.md) |
| Accessibility, responsive, QA, DoD | [../docs/frontend/10-a11y-responsive-qa.md](../docs/frontend/10-a11y-responsive-qa.md) |
| Implementation order & prompt templates | [../docs/frontend/11-implementation-order.md](../docs/frontend/11-implementation-order.md) |
| How to use this docs package | [../docs/frontend/AGENTS.md](../docs/frontend/AGENTS.md) |

> `docs/frontend/` currently has documents 01–05, `AGENTS.md`, and
> `README.md`. Documents 06–11 are not written yet. If a table row above
> points at a missing file, do NOT invent its content — report it to the user
> first (see `docs/frontend/AGENTS.md`, "if the docs are ambiguous, ask").

### Docs vs code conflicts

The docs prescribe a terracotta orange brand (`#C2410C`) + Plus Jakarta Sans,
while the current code uses different tokens in `app/globals.css`
(primary `#227BF3`, Poppins). **If your task touches colors / fonts /
typography, ask the user which one governs — do not pick on your own.**
Record the decision in `docs/frontend/DECISIONS.md`
(format: `date — decision — rationale`).

## 3. Frontend tooling conventions

- Read the installed Next.js guides in `node_modules/next/dist/docs/01-app/`
  before using or changing any App Router feature. The installed version is
  authoritative.
- `app/` for routes, `components/` for reusable UI, `lib/` for typed mock
  data and non-UI helpers. Homepage mock data lives in `lib/home-data.ts`;
  partner dashboard data lives in `lib/mitra-data.ts` — do NOT embed catalog
  content inside presentational components.
- Style with Tailwind utility classes + tokens in `app/globals.css`. Icons
  from `lucide-react`. Avoid custom CSS classes unless utilities cannot
  reasonably express the style.
- Keep semantic HTML, accessible labels, responsive layouts, and strict
  TypeScript types. UI language is Indonesian.
- Run `bun run lint` and `bun run build` from this folder after changes.

## 4. Short definition of "done" for frontend changes

A screen/task is considered done when: it matches `docs/frontend/05-screen-specs`,
uses the tokens and components from the docs, all four data states render
correctly (loading / empty / error / filled), it is responsive at
360/768/1280px, passes the accessibility checklist, has no lint/typecheck
errors, and makes no network calls. Details in
`docs/frontend/10-a11y-responsive-qa.md`.
