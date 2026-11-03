# Guide Setup Supabase - WarungKu

Panduan langkah demi langkah untuk setup Supabase dari nol hingga frontend
bisa connect. Ikuti berurutan.

## 1. Buat Project Supabase

1. Buka https://dashboard.supabase.com
2. Login dengan akun Supabase (gratis, bisa pakai GitHub/Google/Email)
3. Klik "New project" di sudut kanan atas
4. Isi:
   - **Name**: `warungku`
   - **Database password**: buat kata sandi yang kuat, simpan aman
   - **Region**: pilih `Singapore` (dekat dengan Indonesia, latensi rendah)
5. Klik "Create new project"
6. Tunggu sekitar 2 menit sampai project ready

> Catatan: Supabase gratis hingga 500MB database, 100K auth users, 5GB storage.
> Lebih dari cukup untuk demo dan development.

## 2. Setup Auth (Supabase Dashboard)

Di sidebar kiri dashboard, klik **Authentication** (ikon kunci).

Layar Authentication sekarang punya struktur:
- **MANAGE** → Users, OAuth Apps
- **NOTIFICATIONS** → Emails, SMS
- **CONFIGURATION** → Policies, Sign In / Providers, Passkeys, OAuth Server, Sessions, Rate Limits, Multi-Factor, URL Configuration, Attack Protection, Auth Hooks

Ikuti langkah berikut:

1. Klik **Sign In / Providers** (di section CONFIGURATION)
   - Pastikan **Email** sudah **enabled** (toggle ON / status "active")
   - Kalau belum, klik Email lalu aktifkan

2. Klik **URL Configuration**
   - **Site URL**: isi `https://warungku-q91iy2fef-rifky-arifins-projects.vercel.app`
   - **Redirect URLs**: tambahkan `https://warungku-q91iy2fef-rifky-arifins-projects.vercel.app`
   - (Opsional, untuk dev lokal) tambahkan juga `http://localhost:3000`

3. (Opsional - untuk demo lebih mulus) Klik **Policies**
   - Cari policy **Confirm sign up** (di section Authentication)
   - **Nonaktifkan** ("Confirm sign up") → user langsung masuk setelah
     register tanpa perlu buka email
   - Ini cocok untuk kompetisi - alur register lebih cepat

> Untuk kompetisi: matikan "Confirm sign up" agar alur register langsung masuk
> tanpa perlu buka email - pengalaman demo lebih mulus.

## 3. Jalankan SQL Setup

1. Di dashboard Supabase, klik menu **SQL Editor** di sidebar kiri
2. Klik "New query"
3. Copy-paste SQL dari `plan.md` bagian "Skema Database":
   - Bagian 1 sampai 11 (semua tabel, RLS, policies, trigger, storage)
4. Klik "Run" (ikon play)
5. Pastikan output menunjukkan "success" tanpa error

> Tips: jalankan per bagian (1, 2, 3, ...) agar jika ada error, lebih
> mudah tahu mana yang gagal.

### Verifikasi

Setelah SQL berhasil, di tab **Table Editor** di sidebar, pastikan 4 tabel
tampil:
- `profiles`
- `stores`
- `categories`
- `products`

Buka tab **Policies** dan pastikan policies sudah ada di setiap tabel.

## 4. Buat Storage Bucket

1. Di dashboard Supabase, klik menu **Storage** di sidebar kiri
2. Klik "Create new bucket"
3. Isi:
   - **Bucket name**: `store-images`
   - **Public bucket**: CHECK (aktifkan) - supaya gambar bisa diakses publik
4. (Sudah otomatis dibuat juga via SQL di bagian 11 plan.md - skip bila sudah)

## 5. Dapatkan API Keys

Di dashboard Supabase, klik menu **Settings** di sidebar kiri.

Layar Settings punya struktur:
- **CONFIGURATION** → General, Infrastructure, Integrations, **API Keys**, JWT Keys, Log Drains, Add-ons
- **INTEGRATIONS** → Data API, Vault (BETA)
- **BILLING** → Subscription, Usage

Ikuti langkah berikut:

1. Klik **API Keys** (di section CONFIGURATION)
   - Ada banner migrasi: "Migrate to publishable and secret API keys..."
   - Klik **"View legacy API keys"** hanya jika ingin memakai key lama (format `eyJ...`)
   - Supabase sekarang memakai **publishable/secret key** (format baru, lebih aman)

2. Di section **Publishable key** (atas):
   - Copy key `default` → ini yang dipakai sebagai `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Format: `sb_publishable_...`
   - Aman untuk di-expose ke browser (keamanan dijamin RLS)

3. Di section **Secret keys** (bawah):
   - Copy key `default` → ini yang dipakai sebagai `SUPABASE_SERVICE_ROLE_KEY`
   - Format: `sb_secret_...`
   - Klik ikon mata (👁) untuk menampilkan key penuh sebelum copy
   - JANGAN expose ke client - hanya untuk server-side

4. **Project URL** (dibutuhkan juga):
   - Di **header dashboard** (bukan di General Settings), cari project name kamu
   - Di sebelah project name ada dropdown (ikon `∨`) atau panel yang menampilkan
     **Project URL** dengan tombol copy
   - Alternatif: scroll ke bawah di halaman **General Settings** — ada section
     "Project access" atau informasi URL
   - Format: `https://xxxxx.supabase.co`
   - Atau lihat di menu **API Keys** — biasanya Project URL juga ditampilkan di sana

> **Catatan**: Jangan keliru dengan menu "Data API" (di section INTEGRATIONS)
> — itu untuk koneksi external data source, bukan untuk mengambil API key Supabase.
> Yang kamu butuhkan ada di **API Keys** (di section CONFIGURATION).

## 6. Setup Environment Variables di Frontend

Buat file `frontend/.env.local` (jangan commit ke git):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

| Variable | Berasal dari | Dipakai di |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (General settings / header) | Browser + Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key `default` | Browser + Server |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key `default` | Server only |

> `NEXT_PUBLIC_*` di-expose ke browser (publishable key memang aman -
> keamanan dijamin RLS). `SUPABASE_SERVICE_ROLE_KEY` (secret key) hanya di server.

> **Format key lama vs baru**:
> - Lama: `eyJhbGciOi...` (anon) dan `eyJhbGciOi...` (service_role)
> - Baru: `sb_publishable_...` dan `sb_secret_...`
> - Both supported oleh `@supabase/supabase-js` - pakai yang sesuai dashboard

## 7. Install Dependencies

Dari folder `frontend/`:

```bash
bun add @supabase/supabase-js @supabase/ssr
bun add -d @types/node
```

## 8. Struktur File Supabase Client

Buat file-file berikut di `frontend/lib/supabase/`:

### 8.1 `frontend/lib/supabase/client.ts`

Client untuk browser-side (dipanggil dari components dan lib):

```typescript
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### 8.2 `frontend/lib/supabase/server.ts`

Client untuk server-side (dipanggil dari Server Components dan route handlers):

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/database.types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value }) =>
              cookieStore.set(name, value, { path: "/" })
            );
          } catch {
            // Dipanggil dari Server Component - abaikan karena
            // redirect otomatis di middleware sudah menjaga session
          }
        },
      },
    }
  );
}
```

### 8.3 `frontend/middleware.ts`

Middleware untuk refresh session (jangan duplikat jika sudah ada middleware):

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Cek apakah token masih valid (jangan skip untuk halaman public)
  const { data: { user } } = await supabase.auth.getUser();

  if (
    !user &&
    request.nextUrl.pathname.startsWith("/mitra")
  ) {
    // Redirect ke login jika akses halaman protected tanpa session
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}
```

### 8.4 `frontend/lib/supabase/database.types.ts`

Generasi otomatis dari Supabase (biarkan kosong dulu, generate nanti):

```typescript
// Generate via:
//   supabase gen types typescript --local
// Atau manual saat sudah ada schema

export type Database = Record<string, any>;
```

## 9. Setup Auth Trigger

Supabase trigger `handle_new_user` (bagian 10 SQL di plan.md) otomatis membuat
row di `profiles` setiap kali user register. Tidak perlu coding tambahan -
cukup pastikan:

- Trigger sudah aktif: cek di Table Editor > `profiles` > tab Triggers
- Saat register, kirim `name` di metadata:
  ```typescript
  await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },  // <-- ini
  });
  ```

## 10. Seed Data untuk Demo (Opsional)

Ada 2 cara untuk mengisi data dummy:

### Opsi A: Jalankan `seed.sql` (cepat, untuk testing)

File: `docs/supabase/seed.sql`

1. Di Supabase Dashboard, buka **Edits SQL** (ikon `</>` di sidebar)
2. Buka file `seed.sql` dan copy-paste seluruh isinya
3. **Penting**: pastikan SQL Editor berjalan sebagai role **`postgres`**
   (superuser), bukan `anon`. Klik dropdown role di pojok kanan atas
   query editor → pilih `postgres`.
4. Klik **Run**

Hasil: 3 toko (Toko Roti Ibu, Dapur Rasa, Keripik Makmur) + 10 produk +
3 user demo:

| Email | Password |
|---|---|
| `demo-roti@warungku.id` | `demo1234` |
| `demo-dapur@warungku.id` | `demo1234` |
| `demo-keripik@warungku.id` | `demo1234` |

Untuk reset: ada query di bagian bawah `seed.sql` (bagian "RESET").

### Opsi B: Seed via UI aplikasi (lebih realistis)

1. Buka aplikasi di browser
2. Register user baru via `/daftar`
3. Login, masuk dashboard `/mitra/dashboard`
4. Buat toko + produk lewat form
5. Status toko ubah ke "published"

Ini cara terbaik untuk memastikan seluruh alur (register → buat toko →
tambah produk → publik) berfungsi end-to-end sebelum demo.

## 11. Testing Checklist

Sebelum lanjut ke Fase B (ganti auth-repo), pastikan:

- [ ] `bun run dev` jalan tanpa error
- [ ] `curl -v http://localhost:3000` respons 200
- [ ] Login via Supabase Dashboard (Authentication > Users > Invite user)
        untuk testing cepat
- [ ] Register via form `/daftar` berhasil (jika sudah pakai Supabase auth)
- [ ] Table Editor: row baru muncul di `profiles` saat register

## 12. Troubleshooting

| Gejala | Penyebab | Solusi |
|---|---|---|
| `Supabase url is not set` | `.env.local` belum dibuat / tidak di-load | Restart `bun dev` setelah bikin `.env.local` |
| `relation "public.stores" does not exist` | SQL belum dijalankan | Jalankan semua SQL di SQL Editor |
| `new row violates row-level security` | Policy RLS tidak pas | Cek policy di Table Editor > Policies |
| Register sukses tapi `profiles` kosong | Trigger belum aktif | Jalankan bagian 10 SQL dari plan.md |
| `service_role` tidak di server | `SUPABASE_SERVICE_ROLE_KEY` tidak di `.env.local` | Tambahkan di `.env.local` |
| Gambar tidak tampil | Storage bucket belum public | Aktifkan "Public bucket" di Storage settings |

## 13. Daftar File yang Akan Diubah (ringkasan)

Buat baru:
- `frontend/lib/supabase/client.ts`
- `frontend/lib/supabase/server.ts`
- `frontend/lib/supabase/database.types.ts`
- `frontend/middleware.ts` (update jika sudah ada)
- `frontend/.env.local` (jangan commit)

Modifikasi:
- `frontend/lib/repos/auth-repo.ts`
- `frontend/lib/repos/store-repo.ts`
- `frontend/lib/repos/product-repo.ts`
- `frontend/lib/session-store.tsx`

## 14. Security Notes

- **JANGAN** commit `.env.local` ke git - sudah di `.gitignore`
- **JANGAN** pakai `SUPABASE_SERVICE_ROLE_KEY` di browser-side
- RLS adalah lapisan keamanan utama - test bahwa user A tidak bisa baca data user B
- Untuk production: aktifkan "Confirm email" di Auth settings
