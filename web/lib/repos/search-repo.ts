/**
 * Pencarian katalog (server) untuk halaman `/cari`.
 *
 * Mencocokkan kata kunci (case-insensitive) ke:
 * - warung: nama, deskripsi, lokasi, nama kategori
 * - produk: nama, deskripsi (hanya dari warung terbit)
 */

import { createClient } from "@/lib/supabase/server";
import { CATEGORY_COLUMNS, byCategoryOrder, mapCategory } from "@/lib/supabase/mappers";
import { toStoreDisplay, type ProductDisplay, type StoreDisplay } from "../store-display";

export const SEARCH_MAX_LENGTH = 60;
const STORE_LIMIT = 24;
const PRODUCT_LIMIT = 48;

export type SearchResult = {
  query: string;
  stores: StoreDisplay[];
  products: ProductDisplay[];
};

/**
 * Bersihkan input: buang karakter yang punya arti khusus di filter PostgREST
 * (`,()` dan wildcard `%_*`), rapikan spasi, batasi panjang.
 */
export function sanitizeQuery(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return (value ?? "")
    .replace(/[%_*,()\\"']/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, SEARCH_MAX_LENGTH);
}

/** "nasi box" → "%nasi%box%" (urutan kata dipertahankan). */
const toPattern = (q: string) => `%${q.split(" ").join("%")}%`;

const STORE_SELECT = `id, name, slug, description, location, operation_hours, logo_url, image_banner, created_at, categories ( ${CATEGORY_COLUMNS} )`;

export async function searchCatalog(query: string): Promise<SearchResult> {
  if (!query) return { query, stores: [], products: [] };
  const supabase = await createClient();
  const pattern = toPattern(query);

  const [storeRes, categoryRes, productRes] = await Promise.all([
    supabase
      .from("stores")
      .select(STORE_SELECT)
      .eq("status", "published")
      .or(`name.ilike.${pattern},description.ilike.${pattern},location.ilike.${pattern}`)
      .order("created_at", { ascending: false })
      .limit(STORE_LIMIT),
    supabase.from("categories").select("store_id").ilike("name", pattern).limit(100),
    supabase
      .from("products")
      .select("id, name, price, available, image_url, stores ( name, slug, logo_url, status )")
      .or(`name.ilike.${pattern},description.ilike.${pattern}`)
      .order("available", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(PRODUCT_LIMIT),
  ]);

  for (const res of [storeRes, categoryRes, productRes]) {
    if (res.error) console.error("[search-repo]", res.error.message);
  }

  // Warung yang cocok lewat nama kategori tapi belum ada di hasil langsung.
  const storeRows = [...(storeRes.data ?? [])];
  const known = new Set(storeRows.map((s) => s.id));
  const extraIds = [
    ...new Set((categoryRes.data ?? []).map((c) => c.store_id)),
  ].filter((id) => !known.has(id));
  if (extraIds.length > 0 && storeRows.length < STORE_LIMIT) {
    const { data } = await supabase
      .from("stores")
      .select(STORE_SELECT)
      .eq("status", "published")
      .in("id", extraIds)
      .limit(STORE_LIMIT - storeRows.length);
    storeRows.push(...(data ?? []));
  }

  const stores = storeRows.map((row) =>
    toStoreDisplay({
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
    }),
  );

  const products: ProductDisplay[] = (productRes.data ?? []).flatMap((row) => {
    const store = row.stores;
    // Pemilik yang login bisa melihat produk tokonya yang masih draft —
    // jangan tampilkan di hasil publik.
    if (!store || store.status !== "published") return [];
    return [
      {
        id: row.id,
        name: row.name,
        price: row.price,
        available: row.available,
        image: row.image_url ?? "",
        store: { name: store.name, slug: store.slug, logo: store.logo_url ?? "" },
      },
    ];
  });

  return { query, stores, products };
}
