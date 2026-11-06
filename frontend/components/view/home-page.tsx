import {
  Benefits,
  CategorySection,
  ProductSection,
  StoreSection,
} from "@/components/marketpacle-section";
import { Hero } from "../layout/hero";
import type { ProductDisplay, StoreDisplay } from "@/lib/home-data";

export function HomePage({
  stores,
  products,
}: {
  stores: StoreDisplay[];
  products: ProductDisplay[];
}) {
  return (
    <main>
      <Hero />
      <div className="py-6 sm:py-7">
        <CategorySection />
        <StoreSection stores={stores} />
        <ProductSection products={products} />
        <Benefits />
      </div>
    </main>
  );
}
