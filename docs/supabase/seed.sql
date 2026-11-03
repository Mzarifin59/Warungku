-- =====================================================================
-- WarungKu - Seed Data Dummy
-- Tabel: auth.users (+identities) -> profiles, stores, categories, products
--
-- CARA PAKAI:
--   1. Pastikan skema dari plan.md (bagian 1-11) sudah dijalankan.
--   2. Buka SQL Editor di Supabase, pastikan role = postgres.
--   3. Paste seluruh isi file ini lalu klik Run.
--
-- Aman dijalankan berulang (idempotent) berkat ON CONFLICT.
-- Untuk menghapus semua data demo, lihat bagian RESET di paling bawah.
--
-- Akun demo (password semua: demo1234):
--   demo-roti@warungku.id
--   demo-dapur@warungku.id
--   demo-keripik@warungku.id
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. AUTH USERS (3 user demo)
--    Trigger on_auth_user_created akan otomatis membuat row di profiles.
-- ---------------------------------------------------------------------
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000001',
    'authenticated', 'authenticated',
    'demo-roti@warungku.id',
    crypt('demo1234', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Ibu Sari"}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000002',
    'authenticated', 'authenticated',
    'demo-dapur@warungku.id',
    crypt('demo1234', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Bu Rahmi"}',
    now(), now(), '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000003',
    'authenticated', 'authenticated',
    'demo-keripik@warungku.id',
    crypt('demo1234', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Pak Makmur"}',
    now(), now(), '', '', '', ''
  )
on conflict (id) do nothing;

-- Identities (dibutuhkan agar login email/password berfungsi)
insert into auth.identities (
  id, user_id, provider_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
)
select
  u.id,
  u.id,
  u.id::text,
  jsonb_build_object(
    'sub', u.id::text,
    'email', u.email,
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  now(), now(), now()
from auth.users u
where u.id in (
  'a0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000003'
)
on conflict (provider_id, provider) do nothing;


-- ---------------------------------------------------------------------
-- 2. PROFILES
--    Biasanya sudah terisi oleh trigger; upsert ini memastikan nama benar
--    (juga berguna kalau trigger belum aktif saat seed dijalankan).
-- ---------------------------------------------------------------------
insert into public.profiles (id, name) values
  ('a0000000-0000-0000-0000-000000000001', 'Ibu Sari'),
  ('a0000000-0000-0000-0000-000000000002', 'Bu Rahmi'),
  ('a0000000-0000-0000-0000-000000000003', 'Pak Makmur')
on conflict (id) do update set name = excluded.name;


-- ---------------------------------------------------------------------
-- 3. STORES (3 published + 1 draft untuk tes RLS)
-- ---------------------------------------------------------------------
insert into public.stores
  (id, owner_id, name, slug, description, whatsapp_number, logo_url, status)
values
  (
    '50000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Toko Roti Ibu',
    'toko-roti-ibu',
    'Roti dan kue rumahan yang dipanggang segar setiap pagi, tanpa pengawet.',
    '6281234567801',
    null,
    'published'
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    'Dapur Rasa',
    'dapur-rasa',
    'Nasi box dan lauk masakan rumah untuk acara kantor, arisan, dan syukuran.',
    '6281234567802',
    null,
    'published'
  ),
  (
    '50000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000003',
    'Keripik Makmur',
    'keripik-makmur',
    'Aneka keripik dan camilan khas daerah, renyah, gurih, cocok untuk oleh-oleh.',
    '6281234567803',
    null,
    'published'
  ),
  (
    -- Toko draft: TIDAK boleh terlihat publik (hanya pemilik)
    '50000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000002',
    'Kopi Senja',
    'kopi-senja',
    'Kedai kopi kecil, segera dibuka.',
    '6281234567804',
    null,
    'draft'
  )
on conflict (id) do nothing;


-- ---------------------------------------------------------------------
-- 4. CATEGORIES
-- ---------------------------------------------------------------------
insert into public.categories (id, store_id, name, sort_order) values
  -- Toko Roti Ibu
  ('c0000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'Roti Manis', 1),
  ('c0000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', 'Kue Basah',  2),
  -- Dapur Rasa
  ('c0000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000002', 'Nasi Box',   1),
  ('c0000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000002', 'Lauk Pauk',  2),
  ('c0000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000002', 'Minuman',    3),
  -- Keripik Makmur
  ('c0000000-0000-0000-0000-000000000006', '50000000-0000-0000-0000-000000000003', 'Keripik',        1),
  ('c0000000-0000-0000-0000-000000000007', '50000000-0000-0000-0000-000000000003', 'Camilan Pedas',  2),
  -- Kopi Senja (draft)
  ('c0000000-0000-0000-0000-000000000008', '50000000-0000-0000-0000-000000000004', 'Kopi', 1)
on conflict (id) do nothing;


-- ---------------------------------------------------------------------
-- 5. PRODUCTS (harga dalam Rupiah, integer)
-- ---------------------------------------------------------------------
insert into public.products
  (id, store_id, category_id, name, price, description, image_url, available, sort_order)
values
  -- ===== Toko Roti Ibu =====
  ('d0000000-0000-0000-0000-000000000001',
   '50000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
   'Roti Coklat Keju', 8000,
   'Roti lembut isi coklat leleh dengan taburan keju parut.', null, true, 1),

  ('d0000000-0000-0000-0000-000000000002',
   '50000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
   'Roti Sobek Pandan', 15000,
   'Roti sobek aroma pandan, cocok untuk sarapan keluarga.', null, true, 2),

  ('d0000000-0000-0000-0000-000000000003',
   '50000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001',
   'Donat Kentang', 5000,
   'Donat empuk berbahan kentang dengan gula halus.', null, true, 3),

  ('d0000000-0000-0000-0000-000000000004',
   '50000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002',
   'Bolu Kukus Mekar', 6000,
   'Bolu kukus warna-warni, lembut dan manis pas.', null, true, 1),

  ('d0000000-0000-0000-0000-000000000005',
   '50000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002',
   'Lemper Ayam', 4000,
   'Ketan isi ayam suwir berbumbu, dibungkus daun pisang.', null, false, 2),

  -- ===== Dapur Rasa =====
  ('d0000000-0000-0000-0000-000000000006',
   '50000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003',
   'Nasi Box Ayam Bakar', 25000,
   'Nasi putih, ayam bakar bumbu kecap, lalapan, sambal, dan kerupuk.', null, true, 1),

  ('d0000000-0000-0000-0000-000000000007',
   '50000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003',
   'Nasi Kuning Komplit', 22000,
   'Nasi kuning dengan orek tempe, telur balado, dan ayam suwir.', null, true, 2),

  ('d0000000-0000-0000-0000-000000000008',
   '50000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004',
   'Rendang Daging (1/2 kg)', 85000,
   'Rendang daging sapi empuk, dimasak perlahan dengan santan kental.', null, true, 1),

  ('d0000000-0000-0000-0000-000000000009',
   '50000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004',
   'Sambal Terasi Botol', 12000,
   'Sambal terasi pedas gurih, tahan 2 minggu di kulkas.', null, true, 2),

  ('d0000000-0000-0000-0000-000000000010',
   '50000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000005',
   'Es Teh Manis Jumbo', 5000,
   'Es teh manis 500 ml, segar untuk teman makan.', null, false, 1),

  -- ===== Keripik Makmur =====
  ('d0000000-0000-0000-0000-000000000011',
   '50000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000006',
   'Keripik Singkong Original', 15000,
   'Keripik singkong tipis renyah, gurih bawang. Kemasan 250 gr.', null, true, 1),

  ('d0000000-0000-0000-0000-000000000012',
   '50000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000006',
   'Keripik Pisang Coklat', 18000,
   'Keripik pisang kepok dengan lapisan coklat. Kemasan 250 gr.', null, true, 2),

  ('d0000000-0000-0000-0000-000000000013',
   '50000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000006',
   'Keripik Tempe Sagu', 17000,
   'Keripik tempe garing dengan adonan sagu. Kemasan 200 gr.', null, true, 3),

  ('d0000000-0000-0000-0000-000000000014',
   '50000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000007',
   'Basreng Pedas Daun Jeruk', 20000,
   'Bakso goreng kering pedas dengan aroma daun jeruk. Kemasan 200 gr.', null, true, 1),

  -- ===== Kopi Senja (draft, tidak terlihat publik) =====
  ('d0000000-0000-0000-0000-000000000015',
   '50000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000008',
   'Kopi Susu Gula Aren', 18000,
   'Espresso, susu segar, dan gula aren asli.', null, true, 1)
on conflict (id) do nothing;


-- ---------------------------------------------------------------------
-- VERIFIKASI (opsional, jalankan terpisah)
-- ---------------------------------------------------------------------
-- select 'profiles'   as tabel, count(*) from public.profiles
-- union all select 'stores',     count(*) from public.stores
-- union all select 'categories', count(*) from public.categories
-- union all select 'products',   count(*) from public.products;
--
-- Hasil yang diharapkan: profiles 3 (atau lebih jika sudah ada user lain),
-- stores 4, categories 8, products 15.


-- ---------------------------------------------------------------------
-- RESET (opsional): hapus semua data demo
-- Hapus user -> profiles, stores, categories, products ikut terhapus
-- otomatis lewat ON DELETE CASCADE.
-- Hapus tanda komentar (--) lalu jalankan jika diperlukan.
-- ---------------------------------------------------------------------
-- delete from auth.users
-- where id in (
--   'a0000000-0000-0000-0000-000000000001',
--   'a0000000-0000-0000-0000-000000000002',
--   'a0000000-0000-0000-0000-000000000003'
-- );