import type { Metadata } from "next";
import { MitraNewProductPage } from "@/components/view/mitra-store-pages";

export const metadata: Metadata = {
  title: "Tambah Produk — Warungku",
};

export default function Page() {
  return <MitraNewProductPage />;
}
