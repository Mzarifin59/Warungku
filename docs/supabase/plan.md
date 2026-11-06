# Supabase Backend Plan - WarungKu

Branch: `feat/supabase-backend`
Stack: Next.js 16 (App Router) + Supabase (Postgres + Auth + RLS + Storage)
Tanggal: 2026-11-03

---

## Tujuan

Mengganti backend Laravel dengan Supabase. Semua data (toko, produk,
kategori, user) dihosting di Supabase Postgres. Auth memakai Supabase Auth
(email/password). Frontend Next.js memanggil Supabase langsung via
`@supabase/supabase-js` di client dan `@supabase/ssr` di server.

## Arsitektur

Next.js App Router
- Routes public: `/`, `/warung/[slug]`, `/login`, `/daftar`
- Routes protected: `/mitra/dashboard`, `/mitra/produk`
- `lib/repos/*`: repository pattern (sudah ada, kontrak async)
- `lib/supabase/`: client, server, middleware helpers
- `app/(protected)`: layout dengan auth guard

Supabase
- Auth (email/password)
- Postgres: `profiles`, `stores`, `categories`, `products`
- RLS policies per role (public / owner)
- Storage bucket: store logos, product images
- Edge Functions (seed demo, cek slug) - opsional

## Skema Database

Jalankan semua SQL berikut di Supabase SQL Editor satu kali saat setup.

### 1. Tabel profiles (extensi dari auth.users)

```sql
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  name          text not null,
  created_at    timestamptz not null default now()
);
```

### 2. Tabel stores

```sql
create table public.stores (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references public.profiles (id) on delete cascade,
  name            text not null,
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description     text check (char_length(description) <= 500),
  whatsapp_number text not null,
  logo_url        text,
  status          text not null default 'draft' check (status in ('draft','published')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
```

### 3. Tabel categories

```sql
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  store_id    uuid not null references public.stores (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 40),
  sort_order  int not null default 0,
  unique (store_id, name)
);
```

### 4. Tabel products

```sql
create table public.products (
  id          uuid primary key default gen_random_uuid(),
  store_id    uuid not null references public.stores (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  name        text not null check (char_length(name) between 1 and 100),
  price       int not null check (price >= 0 and price <= 100000000),
  description text check (char_length(description) <= 1000),
  image_url   text,
  available   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
```

### 5. Enable RLS

```sql
alter table public.profiles   enable row level security;
alter table public.stores     enable row level security;
alter table public.categories enable row level security;
alter table public.products   enable row level security;
```

### 6. Policies - profiles (owner-only)

```sql
create policy "profiles_owner_read" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_owner_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
```

### 7. Policies - stores

```sql
create policy "stores_public_read" on public.stores
  for select using (status = 'published' or auth.uid() = owner_id);

create policy "stores_owner_insert" on public.stores
  for insert with check (auth.uid() = owner_id);

create policy "stores_owner_update" on public.stores
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "stores_owner_delete" on public.stores
  for delete using (auth.uid() = owner_id);
```

### 8. Policies - categories (owner store)

```sql
create policy "categories_owner_all" on public.categories
  for all
  using (exists (
    select 1 from public.stores s
    where s.id = store_id and s.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.stores s
    where s.id = store_id and s.owner_id = auth.uid()
  ));
```

### 9. Policies - products

```sql
create policy "products_public_read" on public.products
  for select using (exists (
    select 1 from public.stores s
    where s.id = store_id and s.status = 'published'
  ));

create policy "products_owner_insert" on public.products
  for insert with check (exists (
    select 1 from public.stores s
    where s.id = store_id and s.owner_id = auth.uid()
  ));

create policy "products_owner_update" on public.products
  for update using (exists (
    select 1 from public.stores s
    where s.id = store_id and s.owner_id = auth.uid()
  )) with check (exists (
    select 1 from public.stores s
    where s.id = store_id and s.owner_id = auth.uid()
  ));

create policy "products_owner_delete" on public.products
  for delete using (exists (
    select 1 from public.stores s
    where s.id = store_id and s.owner_id = auth.uid()
  ));
```

### 10. Trigger auto-create profile saat user register

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### 11. Storage bucket untuk gambar

```sql
insert into storage.buckets (id, name, public)
values ('store-images', 'store-images', true)
on conflict (id) do nothing;

create policy "store_images_public_read" on storage.objects
  for select using (bucket_id = 'store-images');

create policy "store_images_owner_write" on storage.objects
  for insert with check (bucket_id = 'store-images' and auth.role() = 'authenticated');

create policy "store_images_owner_update" on storage.objects
  for update using (bucket_id = 'store-images');

create policy "store_images_owner_delete" on storage.objects
  for delete using (bucket_id = 'store-images');
```

## Migrasi Mock to Real

Semua fungsi di `lib/repos/*` sudah punya kontrak async yang sama.
Penggantian bertahap tanpa mengubah UI:

| File mock | Fungsi Supabase |
|---|---|
| `auth-repo.ts` login | `supabase.auth.signInWithPassword` |
| `auth-repo.ts` register | `supabase.auth.signUp` + trigger auto profiles |
| `store-repo.ts` getStoreBySlug | `select * from stores where slug = ? and status = 'published'` |
| `store-repo.ts` listPublishedStores | `select * from stores where status = 'published'` |
| `product-repo.ts` listProductsByStore | `select * from products where store_id = ? order by sort_order` |
| `product-repo.ts` checkAvailability | `select id, available from products where id in (...)` |
| `isSlugAvailable` | `select 1 from stores where slug = ? limit 1` |

## Environment Variables

File: `frontend/.env.local` (JANGAN commit ke git)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # hanya di server, secret
```

Dapatkan dari: Supabase Dashboard > Settings > API

## Langkah Implementasi

### Fase A - Setup (langsung)
- [x] Buat branch `feat/supabase-backend`
- [x] Tulis dokumen plan ini
- [x] Buat project Supabase di `dashboard.supabase.com`
- [x] Jalankan SQL di atas di Supabase SQL Editor
- [x] `bun add @supabase/supabase-js @supabase/ssr` di `frontend/`
- [x] Buat `frontend/lib/supabase/client.ts` (browser client)
- [x] Buat `frontend/lib/supabase/server.ts` (server client + cookies)
- [x] Buat `frontend/proxy.ts` untuk refresh token (Next 16: `middleware.ts` → `proxy.ts`)
- [x] Tambahkan `.env.local` (jangan commit ke git)

### Fase B - Auth
- [x] Update `auth-repo.ts`: login, register pakai Supabase
- [x] Update `session-store.tsx` untuk Supabase session

### Fase C - Data
- [x] Update `store-repo.ts` dengan queries Supabase
- [x] Update `product-repo.ts` dengan queries Supabase
- [x] Tambahkan seed script (opsional, untuk demo juri)

### Fase D - Dashboard CRUD (mitra)
- [x] Form store create/update POST/PUT ke Supabase
- [x] Form product create/update/delete
- [x] Toggle available (optimistic UI)
- [x] Tambah kategori

### Fase E - Cleanup
- [ ] Hapus `seed-data.ts` (atau simpan sebagai fallback)
- [ ] Tes end-to-end: register -> buat toko -> tambah produk -> publik bisa lihat
- [x] `bun run lint && bun run build`

## Migrasi lanjutan

Setelah skema di atas, jalankan juga
[`migrations/001-dashboard-mitra.sql`](./migrations/001-dashboard-mitra.sql):
kolom tambahan `stores`, policy baca publik `categories`, RPC
`is_slug_available`, trigger `updated_at`, bucket `store-images` dengan
policy per-folder user, dan index. **Tanpa migrasi ini kategori tidak tampil
di halaman publik dan upload gambar gagal.**

Dashboard mitra (Fase D) memakai rute: `/mitra/dashboard`, `/mitra/toko`,
`/mitra/produk`, `/mitra/produk/baru`, `/mitra/produk/[id]`,
`/mitra/kategori`, `/mitra/preview`.

## Panduan Setup Supabase

Lihat [`guide-setup-supabase.md`](./guide-setup-supabase.md) untuk langkah
mendetail membuat project, menjalankan SQL, dan mengkonfigurasi env vars.
