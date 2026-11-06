/**
 * Store repository (server) — dipakai Server Component halaman publik
 * (home, jelajahi, detail warung).
 *
 * RLS Supabase yang berlaku:
 * - `stores`: publik hanya melihat `status = 'published'`.
 * - `products` & `categories`: publik hanya melihat milik toko terbit
 *   (lihat docs/supabase/migrations/001-dashboard-mitra.sql).
 *
 * Mutasi & data dashboard mitra ada di `lib/supabase/mutations.ts` dan
 * `lib/dashboard-provider.tsx` (client).
 */

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  CATEGORY_COLUMNS,
  STORE_WITH_CATALOG,
  byCategoryOrder,
  mapCategory,
  mapStore,
} from "@/lib/supabase/mappers";
import type { ProductDisplay } from "../store-display";
import type { Category, Store } from "../types";

/**
 * Bentuk "ringan" untuk list publik (home & explore): kolom stores +
 * kategori, tanpa memuat produk.
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

/** Daftar toko terbit (terbaru dulu). Di-cache per request. */
export const listPublishedStoresLite = cache(
  async (): Promise<LiteStore[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stores")
      .select(
        `id, name, slug, description, location, operation_hours, logo_url, image_banner, created_at, categories ( ${CATEGORY_COLUMNS} )`,
      )
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[store-repo] listPublishedStoresLite:", error.message);
      return [];
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      location: row.location,
      operationHours: row.operation_hours,
      logoUrl: row.logo_url,
      imageBanner: row.image_banner,
      createdAt: row.created_at,
      categories: (row.categories ?? []).map(mapCategory).sort(byCategoryOrder),
    }));
  },
);

/**
 * Produk unggulan (tersedia) dari toko-toko terbit untuk beranda.
 */
export async function listFeaturedProducts(
  stores: Pick<LiteStore, "id" | "name" | "slug" | "logoUrl">[],
  limit: number,
): Promise<ProductDisplay[]> {
  if (stores.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, store_id, name, price, available, image_url")
    .in(
      "store_id",
      stores.map((s) => s.id),
    )
    .eq("available", true)
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[store-repo] listFeaturedProducts:", error.message);
    return [];
  }

  const byId = new Map(stores.map((s) => [s.id, s]));
  return (data ?? []).flatMap((product) => {
    const owner = byId.get(product.store_id);
    if (!owner) return [];
    return [
      {
        id: product.id,
        name: product.name,
        price: product.price,
        available: product.available,
        image: product.image_url ?? "",
        store: { name: owner.name, slug: owner.slug, logo: owner.logoUrl ?? "" },
      },
    ];
  });
}

/**
 * Toko terbit berdasarkan slug, lengkap dengan kategori & produk (satu query).
 * Di-cache per request agar `generateMetadata` + page tidak query dua kali.
 */
export const getStoreBySlug = cache(
  async (slug: string): Promise<Store | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stores")
      .select(STORE_WITH_CATALOG)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) {
      console.error("[store-repo] getStoreBySlug:", error.message);
      return null;
    }
    return data ? mapStore(data) : null;
  },
);
