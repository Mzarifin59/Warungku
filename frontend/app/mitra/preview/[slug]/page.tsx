import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WarungDetailPage } from "@/components/view/warung-detail-page";
import { seedStores } from "@/lib/seed-data";

export function generateStaticParams() {
  return seedStores.map((store) => ({ slug: store.slug }));
}

function getStore(slug: string) {
  return seedStores.find((s) => s.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const store = getStore((await params).slug);
  return store ? { title: `Preview ${store.name} — Warungku` } : {};
}

export default async function MitraStorePreview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const store = getStore((await params).slug);
  if (!store) notFound();

  return (
    <div className="-mx-4 -my-5 sm:-mx-6 sm:-my-7 lg:-mx-7">
      <div className="flex items-center justify-between gap-3 border-b border-[#dce5f0] bg-white px-4 py-3 sm:px-6">
        <div>
          <h1 className="text-sm font-bold text-[#2b4568]">Preview Warung</h1>
          <p className="mt-0.5 text-[11px] text-[#8794a5]">Tampilan halaman warung untuk pelanggan</p>
        </div>
        <Link
          className="shrink-0 rounded-lg border border-[#dce5f0] px-3 py-2 text-xs font-medium text-[#5f7189] transition hover:border-primary hover:text-primary"
          href={`/warung/${store.slug}`}
        >
          Lihat halaman publik
        </Link>
      </div>
      <WarungDetailPage store={store} />
    </div>
  );
}
