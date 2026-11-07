import type { Metadata } from "next";
import { listPublishedStoresLite } from "@/lib/repos/store-repo";
import { toStoreDisplay, type StoreDisplay } from "@/lib/store-display";
import { WarungExplorePage } from "@/components/view/warung-explore-page";

export const metadata: Metadata = {
  title: "Jelajahi Warung — Warungku",
  description: "Temukan warung UMKM favoritmu di sekitar Anda.",
};

export default async function Page() {
  const liteStores = await listPublishedStoresLite();
  const stores: StoreDisplay[] = liteStores.map(toStoreDisplay);
  return <WarungExplorePage stores={stores} />;
}
