import {
  Benefits,
  CategorySection,
  ProductSection,
  StoreSection,
} from "@/components/marketpacle-section";
import { Hero } from "../layout/hero";

export function HomePage() {
  return (
    <>
      
      <main>
        <Hero />
        <div className="py-6 sm:py-7">
          <CategorySection />
          <StoreSection />
          <ProductSection />
          <Benefits />
        </div>
      </main>
    </>
  );
}
