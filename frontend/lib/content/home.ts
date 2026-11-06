/**
 * Konten beranda (`/`): hero, pintasan kategori, judul section, keunggulan.
 *
 * Data warung & produk di beranda berasal dari Supabase; file ini hanya
 * berisi teks & pengaturan tampilan yang bisa diubah bebas.
 */

import type { IconName } from "@/components/icon";

export const homeHero = {
  eyebrow: "Pasar lokal, sekarang di genggaman",
  title: ["Dukung UMKM Lokal,", "Belanja Jadi Lebih Mudah"],
  description:
    "Temukan berbagai toko dan produk dari pelaku UMKM di sekitarmu. Pilih produknya, pesan langsung lewat WhatsApp.",
  image: { src: "/umkm_hero.jpg", alt: "Pelaku UMKM lokal" },
  /** Kata kunci cepat di bawah kolom pencarian hero. */
  popularSearches: ["Roti", "Nasi box", "Keripik", "Kopi"],
  sellingPoints: [
    { icon: "shield", title: "Toko Terpercaya", text: "Langsung dari pemilik" },
    { icon: "bolt", title: "Proses Cepat", text: "Pesan via WhatsApp" },
    { icon: "heart", title: "Dukung UMKM", text: "Bantu ekonomi lokal" },
  ] satisfies { icon: IconName; title: string; text: string }[],
};

/**
 * Pintasan kategori di beranda. Klik → halaman pencarian dengan `query`
 * (dicocokkan ke nama warung, deskripsi, kategori, dan produk).
 */
export const homeCategories: {
  name: string;
  icon: IconName;
  color: string;
  query: string;
}[] = [
  { name: "Makanan", icon: "utensils", color: "#ef4444", query: "nasi" },
  { name: "Minuman", icon: "cup", color: "#f5c400", query: "minuman" },
  { name: "Cemilan", icon: "popcorn", color: "#fb8737", query: "keripik" },
  { name: "Roti & Kue", icon: "cake", color: "#e77e66", query: "roti" },
  { name: "Kebutuhan Harian", icon: "basket", color: "#6383ed", query: "harian" },
  { name: "Kerajinan", icon: "scissors", color: "#95958f", query: "kerajinan" },
];

export const homeSections = {
  categories: { title: "Jelajahi Kategori" },
  stores: {
    title: "Warung Pilihan",
    subtitle: "Warung UMKM terbaru di Warungku",
    count: 4,
  },
  products: {
    title: "Produk Pilihan",
    subtitle: "Produk favorit dari berbagai warung UMKM",
    count: 6,
  },
  emptyStores: "Belum ada warung yang buka. Jadilah yang pertama!",
};

export const homeBenefits = {
  title: "Belanja Makin Mudah",
  subtitle: "Akses Warungku kapan saja, di mana saja.",
  items: [
    { icon: "devices", title: "Responsif", description: "Nyaman di semua perangkat" },
    { icon: "shield", title: "Langsung ke Penjual", description: "Pesanan masuk ke WhatsApp warung" },
    { icon: "bag", title: "Tanpa Aplikasi", description: "Cukup buka link, pilih, pesan" },
  ] satisfies { icon: IconName; title: string; description: string }[],
};

export const sellerCta = {
  title: "Punya usaha? Buka warungmu gratis",
  description:
    "Buat katalog online dalam hitungan menit, bagikan link-nya, dan terima pesanan lewat WhatsApp.",
  action: { label: "Buka Warung Gratis", href: "/daftar" },
};
