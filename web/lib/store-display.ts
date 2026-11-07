/**
 * Bentuk data "display" untuk kartu warung & produk di halaman publik,
 * plus helper avatar inisial. Sumber datanya Supabase (lihat
 * `lib/repos/*`); konten statis ada di `lib/content/*`.
 */

/** Kartu warung (beranda, jelajahi, hasil pencarian). */
export type StoreDisplay = {
  id: string;
  name: string;
  slug: string;
  /** Kategori utama (kategori pertama) — label kecil di kartu. */
  category: string;
  /** Semua nama kategori warung — untuk filter & pencarian. */
  categories: string[];
  location: string;
  /** Gambar banner (kolom image_banner). */
  image: string;
  /** URL logo bulat (kolom logo_url). */
  logo: string;
  tagline: string;
  hours: string;
  createdAt: string;
};

/** Kartu produk lintas warung (beranda, hasil pencarian). */
export type ProductDisplay = {
  id: string;
  name: string;
  /** Harga integer Rupiah. */
  price: number;
  available: boolean;
  image: string;
  store: { name: string; slug: string; logo: string };
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

export function toStoreDisplay(store: {
  id: string;
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
    id: store.id,
    name: store.name,
    slug: store.slug,
    category: store.categories[0]?.name ?? "UMKM",
    categories: store.categories.map((c) => c.name),
    location: store.location ?? "",
    image: store.imageBanner ?? "",
    logo: store.logoUrl ?? "",
    tagline: store.description || "",
    hours: store.operationHours ?? "",
    createdAt: store.createdAt,
  };
}

/** Normalisasi teks untuk pencarian client-side (huruf kecil, tanpa aksen). */
export function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Semua kata di `query` muncul di salah satu `fields`. */
export function matchesQuery(query: string, fields: (string | undefined)[]): boolean {
  const q = normalizeSearch(query);
  if (!q) return true;
  const haystack = normalizeSearch(fields.filter(Boolean).join(" "));
  return q.split(" ").every((word) => haystack.includes(word));
}
