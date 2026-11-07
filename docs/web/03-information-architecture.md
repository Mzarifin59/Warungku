# 03 — Information Architecture, Routes, and Render Strategy

## 1. Sitemap and routes

| Route | Screen | Access | Render strategy (final target) | Phase 1 implementation |
|---|---|---|---|---|
| `/` | M01 Landing | Public | **SSG** | Static |
| `/privacy` | M02 Privacy policy | Public | **SSG** | Static |
| `/signup` | A01 Register | Public (guest) | Dynamic | UI + mock |
| `/login` | A02 Log in | Public (guest) | Dynamic | UI + mock |
| `/dashboard` | D01 Overview | Owner | **SSR/dynamic** | Client-state mock |
| `/dashboard/toko` | D02 Shop (create/edit) | Owner | Dynamic | Client-state mock |
| `/dashboard/produk` | D03 Product list | Owner | Dynamic | Client-state mock |
| `/dashboard/produk/baru` | D04 New product | Owner | Dynamic | Client-state mock |
| `/dashboard/produk/[id]` | D05 Edit product | Owner | Dynamic | Client-state mock |
| `/dashboard/kategori` | D06 Categories | Owner | Dynamic | Client-state mock |
| `/[slug]` | P01 Public catalog (+ P02 cart, P03 checkout) | Public | **ISR** + on-demand revalidation | Rendered from static seed |
| `/[slug]` (missing/draft) | P04 Shop not found | Public | `notFound()` | `notFound()` |
| (global) | E01 Generic 404 | Public | Static | Static |

> In Phase 1 the `/[slug]` pages are written **as if they were ISR**
> (server components, no per-user data, no `cookies()`), but data comes
> from a seed. This means the structure does not need to change in Phase 2.

## 2. Routing rules

- Slugs live at the root (`/{slug}`), so **static routes must always be
  prioritized** and slugs must not collide with those route names.
- Forbidden slug list (must stay in sync with the database constraint
  later): `dashboard, login, signup, logout, api, admin, auth, static,
  _next, privacy`. Stored in a single `RESERVED_SLUGS` constant in
  `src/lib/constants.ts` and used by the slug validator.
- Draft shop or missing slug → `notFound()` (do not distinguish, so drafts
  are not exposed).
- Dashboard routes are grouped into route groups so their layout is
  separated: `(marketing)`, `(auth)`, `(dashboard)`, and `[slug]`.
- A logged-out user opening `/dashboard/*` → redirected to `/login`. A
  logged-in user opening `/login` or `/signup` → redirected to
  `/dashboard`. (Phase 1: this behavior is simulated from client-side mock
  auth state.)

## 3. `app/` folder structure

```
src/app/
├── layout.tsx                  # font, base metadata, Toaster
├── globals.css                 # tokens
├── not-found.tsx               # E01
├── (marketing)/
│   ├── layout.tsx              # marketing header+footer
│   ├── page.tsx                # M01
│   └── privacy/page.tsx        # M02
├── (auth)/
│   ├── layout.tsx              # centered form layout
│   ├── login/page.tsx          # A02
│   └── signup/page.tsx         # A01
├── (dashboard)/dashboard/
│   ├── layout.tsx              # sidebar/bottom-nav + mock guard
│   ├── page.tsx                # D01
│   ├── toko/page.tsx           # D02
│   ├── kategori/page.tsx       # D06
│   └── produk/
│       ├── page.tsx            # D03
│       ├── baru/page.tsx       # D04
│       └── [id]/page.tsx       # D05
└── [slug]/
    ├── layout.tsx              # (optional) public-shop frame
    ├── page.tsx                # P01 (+ CartSheet, CheckoutSheet as client components)
    └── not-found.tsx           # P04
```

## 4. Navigation

### 4.1 Marketing header
WarungKu logo (left) · "How it works" link (anchor) · `secondary` "Log in"
button · `primary` "Create a free shop" button. Mobile: logo + "Log in"
button + compact menu.

### 4.2 Dashboard
Menu (in order): **Overview**, **Products**, **Categories**, **My shop**.

| Viewport | Pattern |
|---|---|
| Mobile (< md) | **Bottom navigation** 4 items (icon + label), top header with shop name + account menu |
| Desktop (≥ md) | **Left sidebar** 240px, content header on top |

Always-present dashboard elements: a **"View shop"** button (opens the
public page in a new tab; disabled with a tooltip if not yet published),
account menu (Log out).

### 4.3 Public shop page
Simple header (not the WarungKu navigation): shop logo+name, cart icon
with count badge. Small footer: "Built with WarungKu". Category
tabs/chips under the header (sticky on scroll).

## 5. Metadata & SEO (static in Phase 1)

| Page | `title` | `description` |
|---|---|---|
| Landing | "WarungKu — Online catalog for UMKM, order via WhatsApp" | Service summary |
| Shop | "{Shop Name} — Catalog & Order via WhatsApp" | Shop description (truncated to 160 characters) |
| Dashboard | "{Page Name} · WarungKu" | — (`noindex`) |

Dashboard and auth pages: `robots: noindex`. Draft shops must not be
indexed. Shop Open Graph uses name + logo when available.

## 6. Phase 2 render-strategy notes (so the current structure does not
need to be torn out)

- `/[slug]` pages must **not use** `cookies()`/`headers()` and must not
  load per-user data. Owner-specific elements (e.g. "Edit shop") are
  rendered on the client or omitted.
- Catalog data is fetched through `storeRepo.getPublishedBySlug(slug)` and
  `productRepo.listBySlug(slug)`, so only the repository implementation
  needs to change.
- Dashboard changes in Phase 2 trigger `revalidatePath('/[slug]')`; in
  Phase 1 this is just noted as `// TODO(api): revalidate`.
- Next.js caching behavior differs between versions; verify against the
  installed version's docs.
