# lib/content — konten statis situs

Ubah teks, link, dan pengaturan tampilan di sini tanpa menyentuh komponen.
Data warung/produk **tidak** di sini — itu dari Supabase (`lib/repos/*`).

| File | Isi | Dipakai di |
|---|---|---|
| `site.ts` | Nama brand, menu header, grup link footer, sosial media, placeholder pencarian | `components/layout/site-header.tsx`, `site-footer.tsx`, `components/search-form.tsx` |
| `home.ts` | Hero (judul, deskripsi, gambar, pencarian populer, keunggulan), pintasan kategori + kata kuncinya, judul & jumlah item tiap section, CTA penjual | `components/layout/hero.tsx`, `components/home-sections.tsx`, `app/page.tsx`, `components/view/search-page.tsx` |
| `pages.ts` | Nilai di halaman Tentang, daftar FAQ Bantuan | `app/tentang/page.tsx`, `app/bantuan/page.tsx` |

Tips:
- Pintasan kategori beranda membuka `/cari?q=<query>`; pilih `query` yang
  benar-benar muncul di nama produk/warung/kategori agar hasilnya tidak kosong.
- Link footer hanya boleh menunjuk halaman yang ada.
- Sosial media dengan `href` kosong otomatis disembunyikan.
- `icon` harus salah satu `IconName` di `components/icon.tsx`.
