-- =====================================================================
-- WarungKu - Migrasi 000: skema awal
--
-- Tabel profiles, stores, categories, products + RLS, trigger profil,
-- dan bucket gambar. Diekstrak dari docs/supabase/plan.md bagian 1-11.
-- Jalankan sebelum 20261106000000_dashboard_mitra.sql.
-- =====================================================================


-- 1. Tabel profiles (extensi dari auth.users)
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  name          text not null,
  created_at    timestamptz not null default now()
);

-- 2. Tabel stores
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

-- 3. Tabel categories
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  store_id    uuid not null references public.stores (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 40),
  sort_order  int not null default 0,
  unique (store_id, name)
);

-- 4. Tabel products
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

-- 5. Enable RLS
alter table public.profiles   enable row level security;
alter table public.stores     enable row level security;
alter table public.categories enable row level security;
alter table public.products   enable row level security;

-- 6. Policies - profiles (owner-only)
create policy "profiles_owner_read" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_owner_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- 7. Policies - stores
create policy "stores_public_read" on public.stores
  for select using (status = 'published' or auth.uid() = owner_id);

create policy "stores_owner_insert" on public.stores
  for insert with check (auth.uid() = owner_id);

create policy "stores_owner_update" on public.stores
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "stores_owner_delete" on public.stores
  for delete using (auth.uid() = owner_id);

-- 8. Policies - categories (owner store)
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

-- 9. Policies - products
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

-- 10. Trigger auto-create profile saat user register
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

-- 11. Storage bucket untuk gambar
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
