/**
 * Store repository — FASE 2 (Supabase).
 *
 * Query tabel `public.stores`. RLS sudah mengatur:
 * - `listPublishedStoresLite` → SELECT untuk anon
 * - `getStoreBySlug` → SELECT untuk anon
 * - `getStoreForOwner` → hanya owner (via `eq("owner_id", ...)`)
 *
 * Catatan client vs server:
 * - Fungsi READ yang dipakai Server Component (home, explore, detail) memakai
 *   `createClient()` dari `@/lib/supabase/server` (cookie session).
 * - Fungsi MUTASI (update/insert) hanya bisa dari Client Component memakai
 *   `createClient()` dari `@/lib/supabase/client` — jadi helper mutasi
 *   diletakkan di file client (`lib/stores/mutations.ts`).
 */

import { createClient } from "@/lib/supabase/server";
import type { Category, Product, Store } from "../types";

/**
 * Bentuk "ringan" untuk list publik (home & explore): hanya kolom stores +
 * kategori pertama tiap toko, tanpa memuat produk (mahal untuk list).
 */
export type LiteStore = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  location: string | null;
  operationHours: string | null;
  logoUrl: string | null;
  imageBanner: string | null;
  categories: Category[];
  createdAt: string;
};

/**
 * List toko terbit (ringan) + kategori tiap toko untuk display home/explore.
 * Dipakai dari Server Component.
 */
export async function listPublishedStoresLite(): Promise<LiteStore[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stores")
    .select(
      "id, name, slug, description, location, operation_hours, logo_url, image_banner, created_at, categories ( id, name, sort_order )",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error || !data?.length) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    location: row.location,
    operationHours: row.operation_hours,
    logoUrl: row.logo_url,
    imageBanner: row.image_banner,
    createdAt: row.created_at,
    categories: (row.categories ?? [])
      .map((c) => ({
        id: c.id,
        name: c.name,
        sortOrder: c.sort_order,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder),
  }));
}

function mapCategory(row: {
  id: string;
  name: string;
  sort_order: number;
}): Category {
  return {
    id: row.id,
    name: row.name,
    sortOrder: row.sort_order,
  };
}

function mapProduct(row: {
  id: string;
  store_id: string;
  name: string;
  price: number;
  category_id: string | null;
  description: string | null;
  image_url: string | null;
  available: boolean;
  sort_order: number;
}): Product {
  return {
    id: row.id,
    storeId: row.store_id,
    name: row.name,
    price: row.price,
    categoryId: row.category_id,
    description: row.description ?? undefined,
    image: row.image_url ?? "",
    available: row.available,
    sortOrder: row.sort_order,
  };
}

async function fetchCategories(storeId: string): Promise<Category[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, sort_order")
    .eq("store_id", storeId)
    .order("sort_order");
  return (data ?? []).map(mapCategory);
}

async function fetchProducts(storeId: string): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, store_id, name, price, category_id, description, image_url, available, sort_order",
    )
    .eq("store_id", storeId)
    .order("sort_order");
  return (data ?? []).map(mapProduct);
}

/** Ambil nama owner dari tabel profiles (untuk display di dashboard). */
async function fetchOwnerName(ownerId: string): Promise<string> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", ownerId)
    .limit(1);
  return data?.[0]?.name ?? "";
}

async function buildStore(
  row: {
    id: string;
    owner_id: string;
    name: string;
    slug: string;
    description: string | null;
    whatsapp_number: string;
    logo_url: string | null;
    image_banner: string | null;
    operation_hours: string | null;
    status: "draft" | "published";
  },
): Promise<Store> {
  const [categories, products, ownerName] = await Promise.all([
    fetchCategories(row.id),
    fetchProducts(row.id),
    fetchOwnerName(row.owner_id),
  ]);
  return {
    id: row.id,
    ownerName,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    whatsappNumber: row.whatsapp_number,
    logo: row.logo_url ?? undefined,
    imageBanner: row.image_banner ?? undefined,
    operationHours: row.operation_hours ?? undefined,
    status: row.status,
    categories,
    products,
  };
}

const STORE_COLUMNS =
  "id, owner_id, name, slug, description, whatsapp_number, logo_url, image_banner, operation_hours, status";

export async function getStoreBySlug(
  slug: string,
): Promise<Store | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stores")
    .select(STORE_COLUMNS)
    .eq("slug", slug)
    .eq("status", "published")
    .limit(1);
  if (error || !data?.length) return null;
  return buildStore(data[0]);
}

/**
 * Ambil toko milik user (untuk dashboard mitra) + owner name dari profiles.
 * Dipakai dari Server Component setelah auth.
 */
export async function getStoreForOwner(
  ownerUserId: string,
): Promise<Store | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stores")
    .select(STORE_COLUMNS)
    .eq("owner_id", ownerUserId)
    .limit(1);
  if (error || !data?.length) return null;
  return buildStore(data[0]);
}

/** Cek apakah slug tersedia (client-side, untuk form registrasi). */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stores")
    .select("id")
    .eq("slug", slug)
    .limit(1);
  if (error) return false;
  return data?.length === 0;
}
