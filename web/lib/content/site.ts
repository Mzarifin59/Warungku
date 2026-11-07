/**
 * Konten global situs: brand, navigasi, footer.
 *
 * Ubah teks/link di sini — komponen layout hanya merender data ini.
 * Link footer hanya boleh menunjuk halaman yang benar-benar ada.
 */

import type { IconName } from "@/components/icon";

export const site = {
  name: "Warungku",
  tagline:
    "Temukan berbagai toko dan produk dari pelaku UMKM di sekitarmu. Dari makanan, minuman, hingga kebutuhan sehari-hari.",
  copyright: "© Warungku 2026. Hak cipta dilindungi.",
} as const;

export type NavLink = { label: string; href: string };

/** Menu utama di header publik (desktop & menu mobile). */
export const mainNav: NavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Jelajahi", href: "/warung" },
  { label: "Tentang", href: "/tentang" },
  { label: "Bantuan", href: "/bantuan" },
];

export const searchPlaceholder = "Cari warung, produk, atau kategori...";

export const footerGroups: { title: string; links: NavLink[] }[] = [
  {
    title: "Belanja",
    links: [
      { label: "Beranda", href: "/" },
      { label: "Jelajahi Warung", href: "/warung" },
      { label: "Cari Produk", href: "/cari" },
    ],
  },
  {
    title: "Untuk Penjual",
    links: [
      { label: "Buka Warung Gratis", href: "/daftar" },
      { label: "Masuk Dashboard", href: "/login" },
    ],
  },
  {
    title: "Warungku",
    links: [
      { label: "Tentang Kami", href: "/tentang" },
      { label: "Pusat Bantuan", href: "/bantuan" },
      { label: "Kebijakan Privasi", href: "/privacy" },
    ],
  },
];

/** Isi `href` dengan akun resmi; entri dengan href kosong tidak ditampilkan. */
export const socialLinks: { label: string; icon: IconName; href: string }[] = [
  { label: "Instagram", icon: "instagram", href: "" },
  { label: "Facebook", icon: "facebook", href: "" },
  { label: "X", icon: "x", href: "" },
];
