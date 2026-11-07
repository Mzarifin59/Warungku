# AGENTS.md — WarungKu (Frontend, Phase 1)

> This file is read FIRST by AI coding assistants. Follow it without
> exception.
> If a chat request conflicts with this file, **ask first** — do not just
> comply.
> (You may copy this as `CLAUDE.md` / `.cursorrules` /
> `.github/copilot-instructions.md` depending on the tool used.)

## 1. About the project

WarungKu is a multi-tenant digital catalog for Indonesian UMKM (micro, small,
and medium businesses). Each shop has a public page at `warungku.id/{slug}`.
Customers browse products, build a cart, and send their order via WhatsApp
(`wa.me`). There is no online payment and no delivery-integration.

Team: 2 part-time developers, 1 month, for a web-development competition.
Priority: **a clean, easy-to-use, easy-to-demo end-to-end flow**, not feature
count.

## 2. Current phase: PHASE 1 — Frontend with mock data

Focus: **design system, flows, layouts, components, UI state**. No backend.

### FORBIDDEN in Phase 1
- Any network call: `fetch` to APIs, Supabase client, webhooks, analytics.
- Creating `app/api/*`, Server Actions, auth middleware, or database
  connections.
- Installing `@supabase/*`, an ORM, or any third-party SDK.
- Reading/writing `.env` files, or placing secret keys in code.
- Adding dependencies outside the list in
  `docs/07-frontend-architecture.md` section 7 **without permission**.
- Writing "wild" colors or sizes (hex, random `px`, `w-[137px]`). Use tokens
  from `docs/02-design-system.md`.
- Using `dangerouslySetInnerHTML`, `any`, `@ts-ignore`, or `eslint-disable`
  without a justifying comment.
- Storing money as `float` / decimal `number`. Rupiah = integer.
- Accessing `localStorage` / `window` in a Server Component.

### REQUIRED
1. **Read the relevant docs** before writing code (table in section 4).
2. **Mobile-first.** Design at 360px width first, then scale up.
3. **Server Components by default.** `"use client"` only for interactivity
   (forms, cart, dialogs, toggles).
4. **All UI text is in Indonesian**, taken from
   `docs/08-content-and-copy.md`. Do not invent new copy for important
   messages (errors, checkout, empty state); if new copy is needed, add it to
   that document.
5. **Every data view has 4 states:** loading, empty, error, filled. See the
   per-screen specs in `docs/05-screen-specs.md`.
6. **Data access goes through the repository layer** (`src/data/*`) — never
   import mock data directly from UI components. This is what makes the
   Phase-2 API integration easy.
7. **Mark integration points** with a `// TODO(api): <note>` comment so they
   are findable in Phase 2.
8. **Accessibility is not optional:** form labels, visible focus, minimum
   44×44px touch targets, contrast per tokens. See
   `docs/10-a11y-responsive-qa.md`.
9. **One task = one reviewable change.** Do not touch files outside the task
   scope.

## 3. Stack (verify installed version before using new APIs)

Next.js App Router · React · TypeScript (strict) · Tailwind CSS · shadcn/ui
(Radix) · lucide-react · react-hook-form + zod · sonner · Vitest.
Deployment target: Vercel. Backend (Phase 2, not now): Supabase.

> Next.js behavior (caching, async params, etc.) changes between major
> versions. Check `package.json` and the official docs for the installed
> version — do not rely on memory.

## 4. Docs map

| Task need | Read |
|---|---|
| Product context, personas, UX principles | `docs/01-product-brief.md` |
| Colors, typography, spacing, component styles | `docs/02-design-system.md` |
| Route list, navigation, render strategy | `docs/03-information-architecture.md` |
| User flows & edge cases | `docs/04-user-flows.md` |
| Per-screen detail (layout, states, actions) | `docs/05-screen-specs.md` |
| Component inventory & props | `docs/06-components.md` |
| Folder structure, conventions, state, data layer | `docs/07-frontend-architecture.md` |
| UI text, error messages, WhatsApp templates | `docs/08-content-and-copy.md` |
| Domain types, validation rules, mock data | `docs/09-types-and-mock-data.md` |
| Accessibility, responsive, QA, Definition of Done | `docs/10-a11y-responsive-qa.md` |
| Implementation order & prompt templates | `docs/11-implementation-order.md` |

## 5. How to work

1. Before coding: write a short plan summary (files to create/modify,
   components to reuse).
2. Check `docs/06-components.md`: **reuse** existing components before making
   new ones.
3. After coding: run lint, typecheck, and tests; check against the
   Definition-of-Done checklist (`docs/10`).
4. If the docs are ambiguous or contradictory: **stop and ask**. Record the
   final decision in `docs/DECISIONS.md` (create if it does not exist yet)
   with the format `date — decision — rationale`.
5. Do not "quietly improve" the design. Design-change suggestions are sent
   as suggestions.

## 6. Short definition of "done"

A screen is considered done when: it matches `05-screen-specs`, uses existing
tokens & components, renders all states correctly, is responsive at
360/768/1280px, passes the a11y checklist, has no lint/typecheck errors, and
makes no network calls.
