/**
 * Store repository — FASE 2 (Supabase).
 *
 * Query tabel `public.stores`. RLS sudah mengatur:
 * - `listPublishedStores` → SELECT untuk anon
 * - `getStoreBySlug` → SELECT untuk anon
 * - `getStoreForOwner` → hanya owner (via `eq("owner_id", ...)`)
 */

import { createClient } from "@/lib/supabase/client";
import type { Category, Product, Store } from "../types";

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

export async function getStoreBySlug(
  slug: string,
): Promise<Store | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stores")
    .select("id, owner_id, name, slug, description, whatsapp_number, logo_url, status")
    .eq("slug", slug)
    .eq("status", "published")
    .limit(1);
  if (error || !data?.length) return null;

  const row = data[0];
  const [cats, prods] = await Promise.all([
    fetchCategories(row.id),
    fetchProducts(row.id),
  ]);

  const ownerName = await (async () => {
    const s = createClient();
    const { data: profiles } = await s
      .from("profiles")
      .select("name")
      .eq("id", row.owner_id)
      .limit(1);
    return profiles?.[0]?.name ?? "";
  })();

  return {
    id: row.id,
    ownerName,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    whatsappNumber: row.whatsapp_number,
    logo: row.logo_url ?? undefined,
    status: row.status,
    categories: cats,
    products: prods,
  };
}

export async function listPublishedStores(): Promise<Store[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stores")
    .select("id, owner_id, name, slug, description, whatsapp_number, logo_url, status")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error || !data?.length) return [];

  const result: Store[] = [];
  for (const row of data) {
    const [cats, prods] = await Promise.all([
      fetchCategories(row.id),
      fetchProducts(row.id),
    ]);
    result.push({
      id: row.id,
      ownerName: "",
      name: row.name,
      slug: row.slug,
      description: row.description ?? undefined,
      whatsappNumber: row.whatsapp_number,
      logo: row.logo_url ?? undefined,
      status: row.status,
      categories: cats,
      products: prods,
    });
  }
  return result;
}

export async function getStoreForOwner(
  ownerUserId: string,
): Promise<Store | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stores")
    .select("id, owner_id, name, slug, description, whatsapp_number, logo_url, status")
    .eq("owner_id", ownerUserId)
    .limit(1);
  if (error || !data?.length) return null;

  const row = data[0];
  const [cats, prods] = await Promise.all([
    fetchCategories(row.id),
    fetchProducts(row.id),
  ]);

  const s = createClient();
  const { data: profiles } = await s
    .from("profiles")
    .select("name")
    .eq("id", row.owner_id)
    .limit(1);

  return {
    id: row.id,
    ownerName: profiles?.[0]?.name ?? "",
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    whatsappNumber: row.whatsapp_number,
    logo: row.logo_url ?? undefined,
    status: row.status,
    categories: cats,
    products: prods,
  };
}

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
