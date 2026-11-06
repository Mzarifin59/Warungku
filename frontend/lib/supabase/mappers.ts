/**
 * Mapper baris Supabase (snake_case) → tipe domain (camelCase).
 *
 * Satu-satunya tempat konversi row → domain; dipakai repo server (halaman
 * publik) maupun client (dashboard mitra).
 */

import type { Category, Product, Store } from "../types";
import type { Database } from "./database.types";

type Tables = Database["public"]["Tables"];
export type StoreRow = Tables["stores"]["Row"];
export type CategoryRow = Pick<Tables["categories"]["Row"], "id" | "name" | "sort_order">;
export type ProductRow = Omit<Tables["products"]["Row"], "created_at">;

export const CATEGORY_COLUMNS = "id, name, sort_order";
export const PRODUCT_COLUMNS =
  "id, store_id, category_id, name, price, description, image_url, available, sort_order, updated_at";
export const STORE_COLUMNS =
  "id, owner_id, name, slug, description, location, operation_hours, whatsapp_number, logo_url, image_banner, status, created_at, updated_at";

/** Store + relasi kategori & produk dalam satu query (PostgREST embed). */
export const STORE_WITH_CATALOG = `${STORE_COLUMNS}, categories ( ${CATEGORY_COLUMNS} ), products ( ${PRODUCT_COLUMNS} )`;

export function mapCategory(row: CategoryRow): Category {
  return { id: row.id, name: row.name, sortOrder: row.sort_order };
}

export function mapProduct(row: ProductRow): Product {
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
    updatedAt: row.updated_at,
  };
}

export function byCategoryOrder(a: Category, b: Category): number {
  return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "id");
}

/** Urutan produk: `sortOrder` naik, lalu terbaru dulu (docs 05 D03). */
export function byProductOrder(a: Product, b: Product): number {
  return (
    a.sortOrder - b.sortOrder ||
    (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")
  );
}

export function mapStore(
  row: StoreRow & {
    categories?: CategoryRow[] | null;
    products?: ProductRow[] | null;
  },
  ownerName = "",
): Store {
  return {
    id: row.id,
    ownerName,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    location: row.location ?? undefined,
    whatsappNumber: row.whatsapp_number,
    logo: row.logo_url ?? undefined,
    imageBanner: row.image_banner ?? undefined,
    operationHours: row.operation_hours ?? undefined,
    status: row.status,
    categories: (row.categories ?? []).map(mapCategory).sort(byCategoryOrder),
    products: (row.products ?? []).map(mapProduct).sort(byProductOrder),
  };
}
