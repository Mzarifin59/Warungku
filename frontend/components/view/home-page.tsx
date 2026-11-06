import {
  Benefits,
  CategorySection,
  ProductSection,
  SellerCta,
  StoreSection,
} from "@/components/home-sections";
import { Hero } from "@/components/layout/hero";
import type { ProductDisplay, StoreDisplay } from "@/lib/store-display";

export function HomePage({
  stores,
  products,
  storeCount,
}: {
  stores: StoreDisplay[];
  products: ProductDisplay[];
  storeCount: number;
}) {
  return (
    <main>
      <Hero storeCount={storeCount} />
      <div className="pt-8 sm:pt-10">
        <CategorySection />
        <StoreSection stores={stores} />
        <ProductSection products={products} />
        <Benefits />
        <SellerCta />
      </div>
    </main>
  );
}
