import type { IconName } from "@/components/icon";

export type Category = {
  name: string;
  icon: IconName;
  color: string;
};

/**
 * Tipe display home/explore page (sumber: data Supabase, bukan mock).
 */
export type StoreDisplay = {
  name: string;
  slug: string;
  /** Kategori utama toko (nama kategori pertama). */
  category: string;
  location: string;
  /** Gambar banner (dari kolom image_banner). */
  image: string;
  /** URL logo bulat (dari kolom logo_url). */
  logo: string;
  tagline: string;
  hours: string;
  createdAt: string;
};

export type ProductDisplay = {
  id: string;
  name: string;
  price: string;
  store: string;
  slug: string;
  image: string;
};

function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const LOGO_COLORS = [
  "#ed7836",
  "#b9874a",
  "#cf8955",
  "#e7ab44",
  "#9b7653",
  "#6383ed",
  "#e77e66",
  "#2f855a",
];

export function logoInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((word) => word && !/^(tb|sdt|d|pt)\.?$/i.test(word));
  const parts = words.slice(0, 2);
  if (parts.length === 0) return name.slice(0, 2).toUpperCase();
  return parts.map((word) => word[0]).join("").toUpperCase();
}

export function logoColor(name: string): string {
  return LOGO_COLORS[hashString(name) % LOGO_COLORS.length];
}

/**
 * Ubah toko ringan (dari `listPublishedStoresLite`) menjadi bentuk display
 * untuk kartu home/explore.
 */
export function toStoreDisplay(store: {
  name: string;
  slug: string;
  description: string | null;
  location: string | null;
  operationHours: string | null;
  logoUrl: string | null;
  imageBanner: string | null;
  createdAt: string;
  categories: { name: string }[];
}): StoreDisplay {
  return {
    name: store.name,
    slug: store.slug,
    category: store.categories[0]?.name ?? "UMKM",
    location: store.location ?? "",
    image: store.imageBanner ?? "",
    logo: store.logoUrl ?? "",
    tagline: store.description || store.name,
    hours: store.operationHours ?? "",
    createdAt: store.createdAt,
  };
}

export const categories: Category[] = [
  { name: "Makanan", icon: "utensils", color: "#ef4444" },
  { name: "Minuman", icon: "cup", color: "#f5c400" },
  { name: "Cemilan", icon: "popcorn", color: "#fb8737" },
  { name: "Kebutuhan Harian", icon: "basket", color: "#6383ed" },
  { name: "Roti & Kue", icon: "cake", color: "#e77e66" },
  { name: "Kerajinan", icon: "scissors", color: "#95958f" },
];

export const benefits: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "devices",
    title: "Responsif",
    description: "Nyaman di semua perangkat",
  },
  {
    icon: "shield",
    title: "Aman & Terpercaya",
    description: "Transaksi lebih aman",
  },
  {
    icon: "headset",
    title: "Bantuan 24/7",
    description: "Siap membantu kapan saja",
  },
];

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "dan")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
