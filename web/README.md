# Warungku — Web

Aplikasi Next.js untuk Warungku: marketplace publik, dashboard mitra, dan
auth. Data & auth memakai Supabase (lihat `../supabase/` dan
`../docs/supabase/`).

## Stack

- Next.js 16 (App Router, `proxy.ts`, Cache Components) + React 19
- TypeScript strict, Tailwind CSS 4 (token di `app/globals.css`)
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`), Zod, Lucide React
- Poppins via `next/font`

## Menjalankan

```sh
cp .env.example .env.local   # isi URL & anon key Supabase
bun install
bun run dev                  # http://localhost:3000
```

Cek sebelum commit:

```sh
bun run lint
bun run build
```

## Peta folder

| Path | Isi |
|---|---|
| `app/` | Rute: publik (`/`, `/warung`, `/warung/[slug]`, `/cari`), auth (`/login`, `/daftar`, `/auth/confirm`), dashboard (`/mitra/*`) |
| `components/ui/` | Komponen dasar (Button, Input, Dialog, Sheet, Toggle, Toast, ...) |
| `components/layout/` | Header, footer, hero, shell & navigasi dashboard |
| `components/mitra/` | Form & kartu khusus dashboard mitra |
| `components/view/` | Komponen satu halaman penuh (dirender oleh `app/**/page.tsx`) |
| `lib/content/` | **Konten statis** (menu, footer, teks beranda, FAQ) — ubah teks di sini, lihat README di dalamnya |
| `lib/repos/` | Query Supabase untuk halaman publik, pencarian, auth, checkout |
| `lib/supabase/` | Client browser/server, tipe database, mapper, mutasi dashboard |
| `lib/` (lainnya) | Tipe domain, keranjang, session, checkout, pesan WhatsApp, helper |
| `proxy.ts` | Refresh session Supabase + guard `/mitra/*` |

## Konvensi

- Teks UI berbahasa Indonesia; ikuti spesifikasi di `../docs/web/`.
- Konten statis di `lib/content/`, bukan di dalam komponen.
- Data dari Supabase selalu lewat `lib/repos/*` atau `lib/supabase/*`;
  komponen tidak memanggil `createClient()` langsung.
- Perubahan skema database = file baru di `../supabase/migrations/` +
  perbarui `lib/supabase/database.types.ts`.
- Styling dengan utility Tailwind & token di `app/globals.css`; ikon dari
  `lucide-react` (lewat `components/icon.tsx` untuk halaman publik).
