import { toStoreDisplay, type ProductDisplay } from "@/lib/home-data";
import { formatRupiah } from "@/lib/utils";
import { listPublishedStoresLite } from "@/lib/repos/store-repo";
import { createClient } from "@/lib/supabase/server";
import { HomePage } from "@/components/view/home-page";

const HOME_STORE_COUNT = 4;
const HOME_PRODUCT_COUNT = 6;

async function fetchFeaturedProducts(
  stores: { id: string; name: string; slug: string }[],
): Promise<ProductDisplay[]> {
  if (stores.length === 0) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("id, store_id, name, price, image_url")
    .in("store_id", stores.map((s) => s.id))
    .eq("available", true)
    .limit(HOME_PRODUCT_COUNT);

  const byId = new Map(stores.map((s) => [s.id, s]));
  const items: ProductDisplay[] = [];
  for (const product of data ?? []) {
    if (items.length >= HOME_PRODUCT_COUNT) break;
    const owner = byId.get(product.store_id);
    if (!owner) continue;
    items.push({
      id: product.id,
      name: product.name,
      price: formatRupiah(product.price),
      store: owner.name,
      slug: owner.slug,
      image: product.image_url ?? "",
    });
  }
  return items;
}

export default async function Page() {
  const liteStores = await listPublishedStoresLite();
  const stores = liteStores.slice(0, HOME_STORE_COUNT).map(toStoreDisplay);
  const products = await fetchFeaturedProducts(liteStores);
  return <HomePage stores={stores} products={products} />;
}
