# WarungKu Documentation — Frontend (Phase 1)

This document pack is written so that AI coding assistants (and human
developers) share the same context about **what is being built, how it
looks, and how it flows**, without backend integration.

## Status

| Phase | Contents | Status |
|---|---|---|
| **Phase 1** | UI, design system, flows, mock data | **This document** |
| Phase 2 | Supabase integration (Auth, DB + RLS, Storage), server actions, server-side checkout | Not yet — see the "Seam to Phase 2" section in `07` |

## How to use with an AI assistant

1. Place `AGENTS.md` at the repo root and the `docs/` folder next to it.
2. For every task, attach/mention: `AGENTS.md` + the relevant documents
   (table in `AGENTS.md` section 4).
3. Work in the order of `11-implementation-order.md`, one task per
   session/PR.
4. Record design-decision changes in `docs/DECISIONS.md`.

## Document list

| # | File | Contents |
|---|---|---|
| 01 | `01-product-brief.md` | Problem, personas, UX principles, scope |
| 02 | `02-design-system.md` | Tokens, typography, spacing, component styles |
| 03 | `03-information-architecture.md` | Sitemap, routes, navigation, render strategy |
| 04 | `04-user-flows.md` | Owner & customer flows, edge cases |
| 05 | `05-screen-specs.md` | Per-screen specs |
| 06 | `06-components.md` | Component inventory & props |
| 07 | `07-frontend-architecture.md` | Folder structure, conventions, data layer, state |
| 08 | `08-content-and-copy.md` | Indonesian microcopy |
| 09 | `09-types-and-mock-data.md` | Domain types, validation, mock data |
| 10 | `10-a11y-responsive-qa.md` | Accessibility, responsive, QA, DoD |
| 11 | `11-implementation-order.md` | Work order & prompt templates |

## Glossary

| Term | Meaning |
|---|---|
| **UMKM** | Micro, Small, and Medium enterprises (Usaha Mikro, Kecil, dan Menengah) |
| **Toko / Store** | One tenant; owned by one owner; has a public slug |
| **Slug** | Unique part of a shop's URL, e.g. `toko-roti-ibu` |
| **Owner / Pemilik** | Logged-in user managing one store |
| **Customer / Pelanggan** | Anonymous visitor ordering via WhatsApp |
| **Published / Terbit** | Shop is visible to the public. Opposite: **draft** |
| **Available / Tersedia** | Product can be ordered. Opposite: **Sold out / Habis** |
| **Mock** | Fake data/behavior standing in for the backend in Phase 1 |
| **Repository** | Data-access layer (`src/data/*`) whose implementation will later be swapped |
| **Seam** | The junction between UI and backend (marked `TODO(api)`) |

## Open decisions (defaults already set, can be changed)

| Decision | Default in this pack |
|---|---|
| Brand color | Terracotta orange (`#C2410C`) + green for WhatsApp actions |
| Font | Plus Jakarta Sans |
| UI tone | "kamu" (casual, friendly) |
| Base components | shadcn/ui (Radix) |
| Dark mode | Out of scope |
| Product detail | No detail page; description shown on card/sheet |
