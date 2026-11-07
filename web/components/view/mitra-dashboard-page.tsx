"use client";

import Link from "next/link";
import {
  Check,
  ExternalLink,
  Layers,
  PackageX,
  Plus,
  ShoppingCart,
  Store as StoreIcon,
} from "lucide-react";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { CardSkeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/mitra/dashboard-gate";
import { ShareLinkCard, usePublish } from "@/components/mitra/store-status";
import { useDashboardStore } from "@/lib/dashboard-provider";
import { useSession } from "@/lib/session-store";
import { cn, formatRupiah } from "@/lib/utils";
import type { Store } from "@/lib/types";

export function MitraDashboardPage() {
  const { status, store, error, refresh } = useDashboardStore();
  const { session } = useSession();
  const firstName = session?.user.name.split(" ")[0] ?? "";

  const header = (
    <PageHeader
      title={`Halo${firstName ? `, ${firstName}` : ""}!`}
      description="Kelola warung dan produkmu di sini."
    />
  );

  if (status === "loading") {
    return (
      <div className="space-y-5">
        {header}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" role="status" aria-label="Memuat data warung">
          {Array.from({ length: 4 }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-5">
        {header}
        <Banner
          tone="danger"
          title="Data warung gagal dimuat"
          description={error ?? undefined}
          onRetry={() => void refresh()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {header}
      {store ? <StoreOverview store={store} /> : <Checklist store={null} />}
    </div>
  );
}

/** Toko draft: checklist + tombol terbit (aturan F1). */
function DraftChecklist({ store }: { store: Store }) {
  const publish = usePublish(store);
  return <Checklist store={store} publish={publish} />;
}

/** Checklist awal: Buat warung · Tambah produk · Terbitkan. */
function Checklist({
  store,
  publish,
}: {
  store: Store | null;
  publish?: ReturnType<typeof usePublish>;
}) {
  const steps = [
    {
      label: "Buat warung",
      done: Boolean(store),
      action: (
        <Link href="/mitra/toko" className={primaryLink}>
          <StoreIcon size={15} /> Buat Warung
        </Link>
      ),
    },
    {
      label: "Tambah produk",
      done: Boolean(store?.products.length),
      action: (
        <Link href="/mitra/produk/baru" className={primaryLink}>
          <Plus size={15} /> Tambah Produk
        </Link>
      ),
    },
    {
      label: "Terbitkan warung",
      done: store?.status === "published",
      action: publish ? (
        <div className="flex flex-col items-start gap-1.5">
          <Button
            size="sm"
            onClick={publish.publish}
            loading={publish.busy}
            disabled={Boolean(publish.blocker)}
          >
            Terbitkan Sekarang
          </Button>
          {publish.blocker && (
            <span className="text-xs text-text-muted">{publish.blocker}</span>
          )}
        </div>
      ) : null,
    },
  ];
  const current = steps.findIndex((s) => !s.done);

  return (
    <section className="rounded-2xl border border-[#dce5f0] bg-white p-4 sm:p-6" aria-labelledby="checklist-title">
      <h2 id="checklist-title" className="text-sm font-bold text-[#2b4568]">
        {store ? "Warungmu belum terbit" : "Mulai jualan dalam 3 langkah"}
      </h2>
      <p className="mt-1 text-xs text-[#8794a5]">
        {store
          ? "Selesaikan langkah berikut agar pelanggan bisa memesan."
          : "Buat warung gratis, tambahkan produk, lalu bagikan link-nya."}
      </p>
      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => {
          const active = index === current;
          return (
            <li
              key={step.label}
              className={cn(
                "flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between",
                active ? "border-primary/40 bg-[#f2f8ff]" : "border-[#edf1f6]",
              )}
              aria-current={active ? "step" : undefined}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                    step.done
                      ? "bg-success text-white"
                      : active
                        ? "bg-primary text-white"
                        : "bg-[#edf1f6] text-[#8794a5]",
                  )}
                >
                  {step.done ? <Check size={14} /> : index + 1}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    step.done ? "text-[#8794a5] line-through" : "font-medium text-[#2b4568]",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {active && step.action}
            </li>
          );
        })}
      </ol>
      {publish?.dialog}
    </section>
  );
}

function StoreOverview({ store }: { store: Store }) {
  const total = store.products.length;
  const available = store.products.filter((p) => p.available).length;
  const published = store.status === "published";

  const metrics = [
    { label: "Total Produk", value: total, note: "Lihat semua produk", icon: ShoppingCart, href: "/mitra/produk" },
    { label: "Tersedia", value: available, note: "Bisa dipesan", icon: Layers, href: "/mitra/produk?status=tersedia" },
    { label: "Habis", value: total - available, note: "Tandai tersedia lagi", icon: PackageX, href: "/mitra/produk?status=habis" },
    { label: "Kategori", value: store.categories.length, note: "Kelola kategori", icon: Layers, href: "/mitra/kategori" },
  ];

  return (
    <>
      {published ? (
        <section className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,1fr)]" aria-label="Informasi warung">
          <StoreSummaryCard store={store} />
          <ShareLinkCard store={store} />
        </section>
      ) : (
        <DraftChecklist store={store} />
      )}

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Ringkasan warung">
        {metrics.map(({ label, value, note, icon: MetricIcon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl border border-[#dce5f0] bg-white p-3.5 transition hover:border-primary/40 hover:shadow-sm sm:p-4"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e6f1ff] text-primary">
                <MetricIcon size={17} strokeWidth={1.8} />
              </span>
              <span className="text-xs font-semibold text-[#7d8794] sm:text-sm">{label}</span>
            </div>
            <strong className="mt-2 block text-2xl font-bold text-[#2b4568]">{value}</strong>
            <span className="mt-0.5 block text-[11px] text-[#8491a2]">{note}</span>
          </Link>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border border-[#dce5f0] bg-white" aria-labelledby="recent-title">
        <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
          <h2 id="recent-title" className="text-sm font-bold text-[#2b4568]">Produk Terbaru</h2>
          <div className="flex items-center gap-3">
            <Link className="text-xs font-medium text-primary hover:underline" href="/mitra/produk">
              Lihat Semua
            </Link>
            <Link href="/mitra/produk/baru" className={primaryLink}>
              <Plus size={14} /> Tambah
            </Link>
          </div>
        </div>
        {total === 0 ? (
          <p className="mx-4 mb-4 rounded-xl border border-dashed border-[#bcd6f5] px-4 py-8 text-center text-sm text-[#7185a0] sm:mx-5">
            Belum ada produk. Tambahkan produk pertamamu supaya pelanggan bisa memesan.
          </p>
        ) : (
          <ul className="divide-y divide-[#edf0f4] border-t border-[#edf0f4]">
            {[...store.products]
              .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
              .slice(0, 5)
              .map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/mitra/produk/${product.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-[#fbfdff] sm:px-5"
                  >
                    <span className="min-w-0 truncate text-sm font-medium text-[#334e70]">{product.name}</span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-semibold text-[#334e70]">{formatRupiah(product.price)}</span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px]",
                          product.available ? "bg-[#d9f5e8] text-[#348d68]" : "bg-[#edf0f4] text-[#7b8490]",
                        )}
                      >
                        {product.available ? "Tersedia" : "Habis"}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </section>
    </>
  );
}

function StoreSummaryCard({ store }: { store: Store }) {
  return (
    <article className="flex items-start gap-3 rounded-2xl border border-[#dce5f0] bg-white p-4 sm:p-5">
      <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-[#e6f1ff] text-primary">
        {store.logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL storage dinamis
          <img src={store.logo} alt="" className="size-full object-cover" />
        ) : (
          <StoreIcon size={22} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-bold text-[#2b4568]">{store.name}</h2>
          <span className="rounded-full bg-success-subtle px-2 py-0.5 text-[10px] font-medium text-success">
            Terbit
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-[#8b929c]">
          {store.description || "Belum ada deskripsi warung."}
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <Link href="/mitra/toko" className="font-medium text-primary hover:underline">
            Ubah profil
          </Link>
          <Link href={`/warung/${store.slug}`} target="_blank" className="inline-flex items-center gap-1 text-[#75849a] hover:text-primary">
            Buka halaman publik <ExternalLink size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
}

const primaryLink =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-white transition-colors hover:bg-primary/90";
