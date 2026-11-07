import { homeSections } from "@/lib/content/home";
import { toStoreDisplay } from "@/lib/store-display";
import {
  listFeaturedProducts,
  listPublishedStoresLite,
} from "@/lib/repos/store-repo";
import { HomePage } from "@/components/view/home-page";

export default async function Page() {
  const liteStores = await listPublishedStoresLite();
  const stores = liteStores.slice(0, homeSections.stores.count).map(toStoreDisplay);
  const products = await listFeaturedProducts(liteStores, homeSections.products.count);
  return <HomePage stores={stores} products={products} storeCount={liteStores.length} />;
}
