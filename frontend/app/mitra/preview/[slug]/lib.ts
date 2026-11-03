import { createClient } from "@/lib/supabase/server";
import type { Store } from "@/lib/types";

export async function getPublicStore(
  slug: string,
): Promise<Store | null> {
  const supabase = await createClient();
  const { data: storeData, error: storeErr } = await supabase
    .from("stores")
    .select(
      "id, owner_id, name, slug, description, whatsapp_number, logo_url, status",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .limit(1);

  if (storeErr || !storeData?.length) return null;
  const row = storeData[0];

  const { data: catData } = await supabase
    .from("categories")
    .select("id, name, sort_order")
    .eq("store_id", row.id)
    .order("sort_order");

  const { data: prodData } = await supabase
    .from("products")
    .select(
      "id, store_id, name, price, category_id, description, image_url, available, sort_order",
    )
    .eq("store_id", row.id)
    .order("sort_order");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", row.owner_id)
    .limit(1);

  return {
    id: row.id,
    ownerName: profileData?.[0]?.name ?? "",
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    whatsappNumber: row.whatsapp_number,
    logo: row.logo_url ?? undefined,
    status: row.status,
    categories: (catData ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      sortOrder: c.sort_order,
    })),
    products: (prodData ?? []).map((p) => ({
      id: p.id,
      storeId: p.store_id,
      name: p.name,
      price: p.price,
      categoryId: p.category_id,
      description: p.description ?? undefined,
      image: p.image_url ?? "",
      available: p.available,
      sortOrder: p.sort_order,
    })),
  };
}
