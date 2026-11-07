"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Banner } from "@/components/ui/banner";
import { CardSkeleton } from "@/components/ui/skeleton";
import { DashboardGate, PageHeader } from "@/components/mitra/dashboard-gate";
import { ProductForm } from "@/components/mitra/product-form";
import { StoreForm } from "@/components/mitra/store-form";
import { PublishCard, ShareLinkCard } from "@/components/mitra/store-status";
import { WarungDetailPage } from "@/components/view/warung-detail-page";
import { useDashboardStore } from "@/lib/dashboard-provider";

/** D02 — Warung Saya: mode buat (belum punya toko) atau ubah. */
export function MitraStorePage() {
  const { status, store, error, refresh } = useDashboardStore();

  if (status === "loading") {
    return <CardSkeleton />;
  }
  if (status === "error") {
    return (
      <Banner tone="danger" title="Data warung gagal dimuat" description={error ?? undefined} onRetry={() => void refresh()} />
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={store ? "Warung Saya" : "Buat Warung"}
        description={
          store
            ? "Atur profil, link, dan status terbit warungmu."
            : "Isi data dasar warungmu. Kamu bisa mengubahnya kapan saja."
        }
        action={
          store ? (
            <Link
              href="/mitra/preview"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#dce5f0] bg-white px-4 text-sm text-[#5f7189] transition hover:border-primary hover:text-primary"
            >
              <ExternalLink size={15} /> Pratinjau
            </Link>
          ) : undefined
        }
      />
      {store ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
          <StoreForm store={store} />
          <div className="space-y-4">
            <PublishCard store={store} />
            {store.status === "published" && <ShareLinkCard store={store} />}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl">
          <StoreForm store={null} />
        </div>
      )}
    </div>
  );
}

function BackToProducts() {
  return (
    <Link href="/mitra/produk" className="inline-flex items-center gap-1 text-xs text-[#75849a] hover:text-primary">
      <ArrowLeft size={14} /> Kembali ke Produk
    </Link>
  );
}

/** D04 — Tambah produk. */
export function MitraNewProductPage() {
  return (
    <div className="space-y-4">
      <BackToProducts />
      <PageHeader title="Tambah Produk" />
      <DashboardGate>{(store) => <ProductForm store={store} />}</DashboardGate>
    </div>
  );
}

/** D05 — Ubah produk. */
export function MitraEditProductPage({ productId }: { productId: string }) {
  return (
    <div className="space-y-4">
      <BackToProducts />
      <PageHeader title="Ubah Produk" />
      <DashboardGate>
        {(store) => {
          const product = store.products.find((p) => p.id === productId);
          if (!product) {
            return (
              <div className="rounded-xl border border-dashed border-border bg-white px-4 py-10 text-center">
                <p className="font-medium text-text">Produk tidak ditemukan</p>
                <p className="mt-1 text-sm text-text-muted">Mungkin produk ini sudah dihapus.</p>
                <Link href="/mitra/produk" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
                  Kembali ke daftar produk
                </Link>
              </div>
            );
          }
          return <ProductForm key={product.id} store={store} product={product} />;
        }}
      </DashboardGate>
    </div>
  );
}

/** Pratinjau warung milik sendiri — termasuk saat masih Draft. */
export function MitraPreviewPage() {
  return (
    <DashboardGate>
      {(store) => (
        <div className="-mx-4 -my-5 sm:-mx-6 sm:-my-7 lg:-mx-7">
          <div className="flex items-center justify-between gap-3 border-b border-[#dce5f0] bg-white px-4 py-3 sm:px-6">
            <div>
              <h1 className="text-sm font-bold text-[#2b4568]">Pratinjau Warung</h1>
              <p className="mt-0.5 text-[11px] text-[#8794a5]">
                {store.status === "published"
                  ? "Tampilan halaman warung untuk pelanggan"
                  : "Warung masih Draft — hanya kamu yang bisa melihat ini"}
              </p>
            </div>
            {store.status === "published" ? (
              <Link
                className="shrink-0 rounded-lg border border-[#dce5f0] px-3 py-2 text-xs font-medium text-[#5f7189] transition hover:border-primary hover:text-primary"
                href={`/warung/${store.slug}`}
                target="_blank"
              >
                Lihat halaman publik
              </Link>
            ) : (
              <Link
                className="shrink-0 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary/90"
                href="/mitra/toko"
              >
                Terbitkan
              </Link>
            )}
          </div>
          <WarungDetailPage store={store} />
        </div>
      )}
    </DashboardGate>
  );
}
