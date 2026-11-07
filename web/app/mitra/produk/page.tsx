import type { Metadata } from "next";
import { Suspense } from "react";
import { MitraProductsPage } from "@/components/view/mitra-products-page";

export const metadata: Metadata = {
  title: "Produk Warung — Warungku",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MitraProductsPage />
    </Suspense>
  );
}
