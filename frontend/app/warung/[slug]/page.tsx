import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WarungDetailPage } from "@/components/view/warung-detail-page";
import { seedStores } from "@/lib/seed-data";

export function generateStaticParams() {
  return seedStores.map((store) => ({ slug: store.slug }));
}

function getPublicStore(slug: string) {
  const store = seedStores.find((s) => s.slug === slug);
  // Draft tidak boleh bocor — perlakukan sama dengan tak ada (P04).
  return store && store.status === "published" ? store : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const store = getPublicStore((await params).slug);
  return store
    ? { title: `${store.name} — Warungku`, description: store.description }
    : {};
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const store = getPublicStore((await params).slug);
  if (!store) notFound();
  return <WarungDetailPage store={store} />;
}
