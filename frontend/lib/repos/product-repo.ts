/**
 * Product repository — FASE 2 (Supabase).
 *
 * Query tabel `public.products`.
 */

import { createClient } from "@/lib/supabase/client";
import type { Product } from "../types";

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

export async function listProductsByStore(
  storeId: string,
): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, store_id, name, price, category_id, description, image_url, available, sort_order",
    )
    .eq("store_id", storeId)
    .order("sort_order");
  if (error) return [];
  return (data ?? []).map(mapProduct);
}

export async function checkAvailability(
  storeId: string,
  items: { productId: string }[],
): Promise<Map<string, boolean>> {
  if (items.length === 0) return new Map();

  const ids = items.map((i) => i.productId);
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("id, available")
    .eq("store_id", storeId)
    .in("id", ids);

  const result = new Map<string, boolean>();
  const found = new Map((data ?? []).map((p) => [p.id, p.available]));
  for (const { productId } of items) {
    result.set(productId, found.get(productId) ?? false);
  }
  return result;
}
