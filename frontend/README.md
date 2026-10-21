# Warungku Frontend

Warungku is a local marketplace that helps customers discover neighborhood
micro, small, and medium-sized businesses (UMKM). This directory contains the
Next.js frontend.

## Stack

- Next.js App Router and React
- TypeScript with strict checking
- Tailwind CSS 4 for component styling and design tokens in `app/globals.css`
- Lucide React for interface icons
- Poppins, loaded with `next/font`

## Run locally

From this directory, install dependencies with the package manager specified in
`package.json`, then run:

```sh
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). Useful checks:

```sh
bun run lint
bun run build
```

## Project map

- `app/page.tsx` — homepage route.
- `app/layout.tsx` — root document, Indonesian locale, metadata, and font.
- `app/globals.css` — Tailwind import and global design tokens.
- `components/` — reusable homepage sections and Lucide icon adapter.
- `lib/home-data.ts` — typed mock categories, stores, products, and benefits.
- `public/market-hero.svg` — locally hosted hero illustration.

The homepage currently uses mock data. Product and shop photos in
`lib/home-data.ts` are remote Unsplash image URLs; replace them with approved,
locally managed assets when the real catalog is connected.

## Design system

- Primary: `#227BF3`
- Secondary: `#DBEDFF`
- Typeface: Poppins
- Page language and customer-facing copy: Indonesian

Keep shared presentation in `components/`, mock content in `lib/`, and theme
tokens in `app/globals.css`. Use Tailwind utility classes for component styling;
avoid adding custom CSS classes unless utilities cannot reasonably express the
design. Use Lucide React icons, semantic HTML, typed data, accessible names for
controls, and mobile-first responsive behavior.
