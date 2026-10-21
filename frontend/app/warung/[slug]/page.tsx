import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WarungDetailPage } from "@/components/view/warung-detail-page";
import { getStoreBySlug, slugify, stores } from "@/lib/home-data";

export function generateStaticParams() {
  return stores.map((store) => ({ slug: slugify(store.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const store = getStoreBySlug((await params).slug);
  return store
    ? { title: `${store.name} — Warungku`, description: store.tagline }
    : {};
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const store = getStoreBySlug((await params).slug);
  if (!store) notFound();
  return <WarungDetailPage store={store} />;
}
