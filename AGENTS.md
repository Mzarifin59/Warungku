# AGENTS.md — WarungKu (root)

This file is the entry point for AI coding assistants working across the
WarungKu repository. Read it BEFORE modifying code in any folder. Each folder
also has its own `AGENTS.md` with folder-specific rules — the folder file takes
PRIORITY; this file only provides cross-folder context.

## 1. About the project

WarungKu is a multi-tenant digital catalog for Indonesian UMKM (micro, small
and medium businesses). Each shop gets a public page at `warungku.id/{slug}`.
Customers pick products and send a structured order via WhatsApp (`wa.me`);
owners manage their shop and catalog from a simple dashboard.

Team: 2 part-time developers, one-month target (web development competition).
Priority: **a clean, easy-to-use, easy-to-demo end-to-end flow**, not feature
count.

## 2. Repository layout

| Folder | Contents | AGENTS.md |
|---|---|---|
| `frontend/` | Next.js App Router + React app (marketplace, partner dashboard, auth UI) | [frontend/AGENTS.md](frontend/AGENTS.md) |
| `backend/` | Laravel application (API + foundation) | `backend/AGENTS.md` does not exist yet — follow `backend/` conventions from its Laravel skeleton until it is written |
| `docs/frontend/` | Frontend Phase-1 documentation package (product brief → implementation order) | [docs/frontend/AGENTS.md](docs/frontend/AGENTS.md) |
| `handoffs/` | Cross-session work notes | *(folder not created yet)* |
| `CHANGELOG_FIXES.md` | Verified-fix history (root or per-service) | *(file not created yet)* |

## 3. Cross-folder rules

- **Docs are the source of truth for design.** Before changing frontend UI,
  read the relevant documents in `docs/frontend/` (full map in section 4).
  Do not "quietly improve" the design; propose changes via
  `docs/frontend/DECISIONS.md` when needed.
- **Frontend is Phase 1 with mock data.** Do NOT add network calls,
  `app/api/*`, Server Actions, auth middleware, or Supabase integration to the
  frontend without explicit permission. Full "FORBIDDEN in Phase 1" list is in
  `frontend/AGENTS.md`.
- **Backend = Laravel + PHP 8.5.** `backend/AGENTS.md` does not exist yet;
  follow Laravel conventions and check installed package versions
  (`composer show --direct`) before using new APIs.
- **Do not mix folders.** A frontend change does not touch `backend/`, and
  vice versa.
- **Verify after changes:** frontend → `bun run lint` and `bun run build`
  from `frontend/`; backend → tests and lint per `backend/AGENTS.md`.

## 4. Frontend docs map (`docs/frontend/`)

Complete documentation, written in Indonesian (keep UI copy in Indonesian even
when translating these docs). Read only what is relevant to the task, not all
of it.

| Need | Read |
|---|---|
| Product context, personas, UX principles, scope | [docs/frontend/01-product-brief.md](docs/frontend/01-product-brief.md) |
| Color tokens, typography, spacing, component styles | [docs/frontend/02-design-system.md](docs/frontend/02-design-system.md) |
| Sitemap, route list, navigation, render strategy | [docs/frontend/03-information-architecture.md](docs/frontend/03-information-architecture.md) |
| User flows & edge cases | [docs/frontend/04-user-flows.md](docs/frontend/04-user-flows.md) |
| Per-screen specs (layout, states, actions) | [docs/frontend/05-screen-specs.md](docs/frontend/05-screen-specs.md) |
| Component inventory & props | [docs/frontend/06-components.md](docs/frontend/06-components.md) |
| Folder structure, conventions, data layer, state | [docs/frontend/07-frontend-architecture.md](docs/frontend/07-frontend-architecture.md) |
| UI text, error messages, WhatsApp templates | [docs/frontend/08-content-and-copy.md](docs/frontend/08-content-and-copy.md) |
| Domain types, validation rules, mock data | [docs/frontend/09-types-and-mock-data.md](docs/frontend/09-types-and-mock-data.md) |
| Accessibility, responsive, QA, Definition of Done | [docs/frontend/10-a11y-responsive-qa.md](docs/frontend/10-a11y-responsive-qa.md) |
| Implementation order & prompt templates | [docs/frontend/11-implementation-order.md](docs/frontend/11-implementation-order.md) |
| How to use this docs package | [docs/frontend/AGENTS.md](docs/frontend/AGENTS.md) |

> Note: `docs/frontend/` currently contains documents 01–05 plus
> `AGENTS.md` and `README.md`. Documents 06–11 and `DECISIONS.md` are not
> written yet. If a table row above points at a file that does not exist, do
> NOT invent its content — report this to the user and ask (see
> `docs/frontend/AGENTS.md`).

## 5. Docs vs code conflicts

The `docs/frontend/` package prescribes specific design decisions (e.g. brand
terracotta orange `#C2410C`, Plus Jakarta Sans font), while the current
frontend code uses different tokens in `frontend/app/globals.css` (e.g.
primary `#227BF3`, Poppins). **If both apply to your task: stop and ask the
user which one governs — do not pick on your own.** Record the decision in
`docs/frontend/DECISIONS.md` (format: `date — decision — rationale`).

## 6. Short definition of "done"

A change is considered done when: it matches the relevant docs, passes the
relevant lint/typecheck (frontend: `bun run lint`, `bun run build`;
backend: test suite), no file outside the task scope was modified, and any
decision made (and not yet documented) is recorded in
`docs/frontend/DECISIONS.md` when applicable.
