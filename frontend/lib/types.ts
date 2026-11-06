/**
 * Domain types — WarungKu Fase 1 (mock data).
 *
 * Semua uang disimpan sebagai integer Rupiah (lihat docs/frontend/02 §2:
 * "Rupiah = integer"). Jangan pernah simpan sebagai `float`/desimal.
 *
 * Tipe di sini adalah kontrak untuk mock data (`lib/*-data.ts`) dan nanti
 * repository backend (Fase 2). Lihat docs/frontend/09-types-and-mock-data.md
 * (belum ditulis) — saat ini sumbernya adalah docs/frontend/01–05.
 */

/** Kategori produk dalam satu toko. */
export interface Category {
  id: string;
  /** Nama kategori. 1–40 karakter, unik per toko (case-insensitive). */
  name: string;
  /** Urutan tampilan (naik/durun di dashboard). Semakin kecil = makin atas. */
  sortOrder: number;
}

/** Status ketersediaan produk. Kebalikannya "Tersedia" adalah "Habis". */
export type ProductAvailability = "available" | "sold-out";

/** Produk milik satu toko. */
export interface Product {
  id: string;
  storeId: string;
  name: string;
  /** Harga dalam integer Rupiah (tanpa desimal). */
  price: number;
  /** `null` = produk tanpa kategori. */
  categoryId: string | null;
  /** Opsional, maks 1000 karakter. */
  description?: string;
  /** URL gambar. Fase 1: boleh local/placeholder. */
  image: string;
  available: boolean;
  /** Sort manual di dashboard; urutan sekunder = terbaru. */
  sortOrder: number;
  /** ISO timestamp perubahan terakhir. */
  updatedAt?: string;
}

/** Status terbit toko: "Terbit" (publik) vs "Draft" (privat). */
export type StoreStatus = "published" | "draft";

/**
 * Toko (tenant). Satu toko dimiliki satu pemilik, punya satu slug publik.
 */
export interface Store {
  id: string;
  ownerName: string;
  name: string;
  /** Bagian URL unik, mis. `toko-roti-ibu`. 3–40, lowercase/digit/hyphen. */
  slug: string;
  /** Opsional, maks 500 karakter. */
  description?: string;
  /** Nomor WhatsApp sudah dinormalisasi (bentuk `62...`). */
  whatsappNumber: string;
  /** URL logo bulat. Fase 1: boleh placeholder/inisial. */
  logo?: string;
  /** URL gambar banner warung. */
  imageBanner?: string;
  /** Jam operasional, mis. "07:00 - 20:00". */
  operationHours?: string;
  /** Kota / area warung, mis. "Bandung". */
  location?: string;
  status: StoreStatus;
  categories: Category[];
  products: Product[];
}

/** Session pengguna yang sedang login (dari Supabase Auth). */
export interface Session {
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

/** Item dalam keranjang (satu baris = satu produk + jumlah). */
export interface CartItem {
  productId: string;
  /** Nama produk saat masuk keranjang — untuk tetap menampilkan walau produk sudah dihapus. */
  name: string;
  /** Harga satuan saat masuk keranjang (integer Rupiah). */
  unitPrice: number;
  /** Jumlah 1–99. */
  quantity: number;
  /** Gambar produk saat masuk keranjang. */
  image: string;
}

/** Hasil validasi checkout: apa yang masih aman vs apa yang bermasalah. */
export interface CheckoutPreparation {
  /** Item yang masih tersedia, dengan nama & harga dari database. */
  safe: CartItem[];
  /** Item bermasalah beserta alasannya. */
  conflicts: { item: CartItem; reason: "sold-out" | "missing" }[];
  /** Item yang harganya berbeda dari saat dimasukkan ke keranjang. */
  priceChanges: { item: CartItem; oldPrice: number; newPrice: number }[];
  /** Total estimasi untuk item yang aman (integer Rupiah). */
  safeTotal: number;
}
