/**
 * Seed data mock — WarungKu Fase 1.
 *
 * Ini pengganti backend. Dikonsumsi oleh layer repository (`lib/repos/*`)
 * sehingga komponen UI tidak pernah mengimpor seed secara langsung
 * (lihat docs/frontend/AGENTS.md bagian WAJIB #6).
 *
 * // TODO(api): ganti isi repos dengan panggilan Supabase di Fase 2;
 * seed ini cukup untuk demo & sstatis pages.
 */

import type { Store, Product, Category } from "./types";

export const seedCategories: Category[] = [
  { id: "cat-makanan", name: "Makanan", sortOrder: 1 },
  { id: "cat-minuman", name: "Minuman", sortOrder: 2 },
  { id: "cat-cemilan", name: "Cemilan", sortOrder: 3 },
  { id: "cat-roti", name: "Roti & Kue", sortOrder: 4 },
];

export const seedStores: Store[] = [
  {
    id: "st-roti-ibu",
    ownerName: "Bu Ratna",
    name: "Toko Roti Ibu",
    slug: "toko-roti-ibu",
    description:
      "Roti & kue segar setiap hari. Dipanggang subuh, dikirim hangat. Pesan lewat WhatsApp, siap diantar.",
    whatsappNumber: "6281234567801",
    status: "published",
    categories: [
      { id: "cat-roti", name: "Roti & Kue", sortOrder: 1 },
      { id: "cat-cokelat", name: "Cokelat", sortOrder: 2 },
      { id: "cat-minuman", name: "Minuman", sortOrder: 3 },
    ],
    products: [
      {
        id: "p-roti-1",
        storeId: "st-roti-ibu",
        name: "Roti Cokelat Panggang",
        price: 8000,
        categoryId: "cat-roti",
        description: "Roti cokelat klasik, panggang harian.",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=480&q=85",
        available: true,
        sortOrder: 1,
      },
      {
        id: "p-roti-2",
        storeId: "st-roti-ibu",
        name: "Kue Lapis Pandan",
        price: 10000,
        categoryId: "cat-roti",
        description: "Kue lapis pandan lembut, 10 lapis.",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=480&q=85",
        available: true,
        sortOrder: 2,
      },
      {
        id: "p-roti-3",
        storeId: "st-roti-ibu",
        name: "Donat Cokelat",
        price: 7000,
        categoryId: "cat-cokelat",
        description: "Donat isi cokelat, 6 pcs per bungkus.",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=480&q=85",
        available: false,
        sortOrder: 3,
      },
      {
        id: "p-roti-4",
        storeId: "st-roti-ibu",
        name: "Kopi Susu Hangat",
        price: 9000,
        categoryId: "cat-minuman",
        description: "Kopi susu hangat, cangkir keramik.",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=480&q=85",
        available: true,
        sortOrder: 4,
      },
    ],
  },
  {
    id: "st-dapur-rasa",
    ownerName: "Budi",
    name: "Dapur Rasa",
    slug: "dapur-rasa",
    description:
      "Sajian ayam rumahan dengan bumbu khas dan sambal segar. Menu favorit keluarga.",
    whatsappNumber: "6281234567802",
    status: "published",
    categories: [
      { id: "cat-makanan", name: "Makanan", sortOrder: 1 },
      { id: "cat-paket", name: "Paket Hemat", sortOrder: 2 },
    ],
    products: [
      {
        id: "p-dapur-1",
        storeId: "st-dapur-rasa",
        name: "Ayam Lalapan",
        price: 15000,
        categoryId: "cat-makanan",
        description: "Ayam bakar lalapan, nasi & sambal.",
        image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=480&q=85",
        available: true,
        sortOrder: 1,
      },
      {
        id: "p-dapur-2",
        storeId: "st-dapur-rasa",
        name: "Ayam Bakar Madu",
        price: 22000,
        categoryId: "cat-makanan",
        description: "Ayam bakar madu, bumbu kecombrang.",
        image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=480&q=85",
        available: true,
        sortOrder: 2,
      },
      {
        id: "p-dapur-3",
        storeId: "st-dapur-rasa",
        name: "Paket Ayam Komplit",
        price: 25000,
        categoryId: "cat-paket",
        description: "Paket hemat 4 orang: 2 ayam + 2 lalapan.",
        image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=480&q=85",
        available: true,
        sortOrder: 3,
      },
    ],
  },
  {
    id: "st-keripik-makmur",
    ownerName: "Pak Makmur",
    name: "Keripik Makmur",
    slug: "keripik-makmur",
    description: "Keripik renyah khas Bandung. 100% singkong pilihan.",
    whatsappNumber: "6281234567803",
    status: "published",
    categories: [
      { id: "cat-cemilan", name: "Cemilan", sortOrder: 1 },
    ],
    products: [
      {
        id: "p-keripik-1",
        storeId: "st-keripik-makmur",
        name: "Keripik Singkong",
        price: 15000,
        categoryId: "cat-cemilan",
        description: "Keripik singkong original, 250g.",
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=480&q=85",
        available: true,
        sortOrder: 1,
      },
      {
        id: "p-keripik-2",
        storeId: "st-keripik-makmur",
        name: "Keripik Pisang Cokelat",
        price: 20000,
        categoryId: "cat-cemilan",
        description: "Keripik pisang celup cokelat, 200g.",
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=480&q=85",
        available: false,
        sortOrder: 2,
      },
    ],
  },
  {
    // Toko draft — untuk menguji jalur "Toko tidak ditemukan" (P04)
    id: "st-sarapan-pagi",
    ownerName: "Bu Sari",
    name: "Sarapan Pagi",
    slug: "sarapan-pagi",
    description: "Sarapan hangat, harga bersahabat. Buka 05.30–11.00.",
    whatsappNumber: "6281234567804",
    status: "draft",
    categories: [
      { id: "cat-makanan", name: "Makanan", sortOrder: 1 },
    ],
    products: [
      {
        id: "p-sarapan-1",
        storeId: "st-sarapan-pagi",
        name: "Bubur Ayam",
        price: 12000,
        categoryId: "cat-makanan",
        description: "Bubur ayam kampung, toping lengkap.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=480&q=85",
        available: true,
        sortOrder: 1,
      },
    ],
  },
];

/** Toko contoh untuk hero landing → "Lihat contoh toko". */
export const exampleStoreSlug = "toko-roti-ibu";

export type { Product, Category };
