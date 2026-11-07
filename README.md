# Warungku

Katalog digital untuk UMKM Indonesia. Setiap warung punya halaman publik
`/warung/{slug}`; pembeli memilih produk lalu mengirim pesanan terstruktur
lewat WhatsApp. Pemilik warung mengelola toko & katalog dari dashboard
sederhana.

## Struktur repo

```
web/                 Aplikasi Next.js (App Router) — publik, dashboard mitra, auth
supabase/
  migrations/        Skema database (SQL) — jalankan berurutan sesuai nama file
  seed.sql           Data demo (3 warung + akun demo)
docs/
  web/               Spesifikasi produk & desain, DECISIONS.md
  supabase/          Rencana integrasi & panduan setup Supabase
```

Backend = **Supabase** (Postgres + Auth + Storage + RLS). Tidak ada server
API terpisah; aplikasi `web/` memanggil Supabase langsung.

## Menjalankan secara lokal

1. Siapkan project Supabase dan jalankan SQL di `supabase/migrations/`
   (panduan lengkap: [supabase/README.md](supabase/README.md)).
2. Salin `web/.env.example` menjadi `web/.env.local`, isi URL & key Supabase.
3. Dari folder `web/`:
   ```sh
   bun install
   bun run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000).

Validasi perubahan: `bun run lint` dan `bun run build` dari `web/`.

Akun demo (setelah `supabase/seed.sql` dijalankan, sandi `demo1234`):
`demo-roti@warungku.id`, `demo-dapur@warungku.id`, `demo-keripik@warungku.id`.

## Deploy (Vercel)

Root Directory project Vercel harus `web`.

## Untuk AI coding agent

Baca [AGENTS.md](AGENTS.md) terlebih dahulu.
