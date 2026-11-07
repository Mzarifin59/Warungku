import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/repos/store-repo";
import { WarungDetailPage } from "@/components/view/warung-detail-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const store = await getStoreBySlug((await params).slug);
  return store
    ? {
        title: `${store.name} — Warungku`,
        description: store.description,
      }
    : {};
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const store = await getStoreBySlug((await params).slug);
  if (!store) notFound();
  return <WarungDetailPage store={store} />;
}
