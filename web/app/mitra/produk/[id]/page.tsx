import type { Metadata } from "next";
import { MitraEditProductPage } from "@/components/view/mitra-store-pages";

export const metadata: Metadata = {
  title: "Ubah Produk — Warungku",
};

export default async function Page({ params }: PageProps<"/mitra/produk/[id]">) {
  const { id } = await params;
  return <MitraEditProductPage productId={id} />;
}
