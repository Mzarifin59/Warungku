import type { Metadata } from "next";
import { MitraCategoriesPage } from "@/components/view/mitra-categories-page";

export const metadata: Metadata = {
  title: "Kategori — Warungku",
};

export default function Page() {
  return <MitraCategoriesPage />;
}
