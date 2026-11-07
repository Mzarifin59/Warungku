-- =====================================================================
-- WarungKu - Migrasi 001: dukungan dashboard mitra
--
-- Jalankan di Supabase SQL Editor (role postgres) setelah
-- 20261103000000_initial_schema.sql. Aman dijalankan berulang (idempotent).
--
-- Isi:
--   1. Kolom tambahan stores (location, operation_hours, image_banner)
--   2. Policy baca publik untuk categories (sebelumnya hanya owner →
--      kategori tidak tampil di halaman publik) + policy baca produk
--      untuk pemilik toko draft
--   3. RPC is_slug_available (cek slug lintas toko, termasuk draft)
--   4. Trigger updated_at otomatis
--   5. Bucket store-images + policy per-folder user (menggantikan policy
--      lama yang mengizinkan siapa pun update/delete file)
--   6. Index untuk query dashboard & halaman publik
-- =====================================================================


-- 1. Kolom tambahan ----------------------------------------------------
alter table public.stores add column if not exists location        text;
alter table public.stores add column if not exists operation_hours text;
alter table public.stores add column if not exists image_banner    text;


-- 2. Categories: publik boleh baca kategori milik toko terbit ----------
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (exists (
    select 1 from public.stores s
    where s.id = store_id and s.status = 'published'
  ));


-- 2b. Products: pemilik boleh baca produk tokonya sendiri --------------
-- Policy plan.md hanya mengizinkan baca produk toko TERBIT, sehingga
-- pemilik toko draft tidak bisa melihat/menambah produk (insert ... returning
-- ditolak RLS). Wajib untuk alur onboarding.
drop policy if exists "products_owner_read" on public.products;
create policy "products_owner_read" on public.products
  for select using (exists (
    select 1 from public.stores s
    where s.id = store_id and s.owner_id = auth.uid()
  ));


-- 3. Cek ketersediaan slug ---------------------------------------------
-- RLS menyembunyikan toko draft milik orang lain, jadi query biasa dari
-- client bisa keliru menganggap slug "tersedia". Fungsi ini security
-- definer dan hanya mengembalikan boolean (tidak membocorkan data toko).
create or replace function public.is_slug_available(
  p_slug    text,
  p_exclude uuid default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1 from public.stores
    where slug = lower(p_slug)
      and (p_exclude is null or id <> p_exclude)
  );
$$;

grant execute on function public.is_slug_available(text, uuid) to anon, authenticated;


-- 4. updated_at otomatis -------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists stores_set_updated_at on public.stores;
create trigger stores_set_updated_at
  before update on public.stores
  for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();


-- 5. Storage: bucket gambar + policy per-folder -------------------------
-- File disimpan di path "{auth.uid()}/{nama-file}" (lihat
-- web/lib/supabase/mutations.ts → uploadImage).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'store-images', 'store-images', true, 2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "store_images_public_read"  on storage.objects;
drop policy if exists "store_images_owner_write"  on storage.objects;
drop policy if exists "store_images_owner_update" on storage.objects;
drop policy if exists "store_images_owner_delete" on storage.objects;

create policy "store_images_public_read" on storage.objects
  for select using (bucket_id = 'store-images');

create policy "store_images_owner_write" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'store-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "store_images_owner_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'store-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "store_images_owner_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'store-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- 6. Index ---------------------------------------------------------------
create index if not exists stores_owner_id_idx      on public.stores (owner_id);
create index if not exists stores_status_idx        on public.stores (status);
create index if not exists categories_store_id_idx  on public.categories (store_id);
create index if not exists products_store_id_idx    on public.products (store_id);
create index if not exists products_category_id_idx on public.products (category_id);
