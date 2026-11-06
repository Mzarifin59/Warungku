"use client";

import Link from "next/link";
import {
  ExternalLink,
  Layers,
  Share2,
  ShoppingCart,
  Store as StoreIcon,
} from "lucide-react";
import { useDashboardStore } from "@/lib/dashboard-provider";
import { formatRupiah } from "@/lib/utils";
import { StoreProfileCard } from "./store-profile-form";
import { AddProductCard } from "./add-product-form";

export function MitraDashboardPage() {
  const { status, store } = useDashboardStore();

  if (status === "loading") {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="text-center">
          <div
            className="mx-auto size-10 animate-spin rounded-full border-2 border-border-strong border-t-primary motion-reduce:animate-none"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm text-text-muted">Memuat data warung…</p>
        </div>
      </div>
    );
  }

  if (status === "no-store" || !store) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="text-center">
          <p className="text-sm text-text-muted">
            Belum ada warung untuk akun ini.
          </p>
        </div>
      </div>
    );
  }

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/warung/${store.slug}`
      : `/warung/${store.slug}`;

  const totalProducts = store.products.length;
  const availableProducts = store.products.filter((p) => p.available).length;
  const categorySet = new Set(
    store.categories.map((c) => c.name.toLowerCase()),
  );
  const uniqueCategories = categorySet.size;

  const metrics = [
    {
      label: "Total Produk",
      value: String(totalProducts),
      note: "Lihat semua produk",
      icon: ShoppingCart,
      href: "/mitra/produk" as string | undefined,
    },
    {
      label: "Tersedia",
      value: String(availableProducts),
      note: `${totalProducts - availableProducts} habis`,
      icon: Layers,
      href: undefined as string | undefined,
    },
    {
      label: "Kategori",
      value: String(uniqueCategories),
      note: "Di warungmu",
      icon: Layers,
      href: undefined as string | undefined,
    },
    {
      label: "Status Warung",
      value: store.status === "published" ? "Publik" : "Draft",
      note:
        store.status === "published"
          ? "Terhubung ke URL publik"
          : "Belum terbit ke publik",
      icon: StoreIcon,
      href: undefined as string | undefined,
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-[-0.5px] text-[#233e62] sm:text-2xl">
          Halo, {store.ownerName || store.name}!
        </h1>
        <p className="mt-1 text-xs text-[#8794a5] sm:text-sm">
          Kelola Warung dan Produkmu di sini, tingkatkan jangkauan bisnismu
          dengan mudah.
        </p>
      </div>

      <section
        className="grid gap-3 lg:grid-cols-[minmax(0,1.8fr)_minmax(250px,0.8fr)]"
        aria-label="Informasi warung"
      >
        <StoreProfileCard />
        <article className="rounded-2xl border border-[#c6dcf8] bg-[#dcecff] p-4">
          <h2 className="text-xs font-semibold text-[#334f73]">
            Tautan Warung Kamu
          </h2>
          <div className="mt-2 flex h-9 items-center gap-2 rounded-lg border border-[#d3dce8] bg-white px-3 text-xs text-[#8491a2]">
            <span className="min-w-0 flex-1 truncate">{publicUrl}</span>
            <button
              type="button"
              aria-label="Salin tautan warung"
              className="text-[#7f8da0] hover:text-primary"
              onClick={() =>
                void navigator.clipboard.writeText(publicUrl)
              }
            >
              <ExternalLink size={14} />
            </button>
          </div>
          <p className="mt-2 text-[10px] text-[#8491a2]">
            Bagikan tautan ini ke pelangganmu
          </p>
          <Link
            className="mt-1.5 flex h-9 items-center justify-center gap-2 rounded-lg bg-primary text-xs font-medium text-white transition-colors hover:bg-[#1769db]"
            href={`/mitra/preview/${store.slug}`}
          >
            <Share2 size={14} /> Bagikan Tautan
          </Link>
        </article>
      </section>

      <section
        className="grid grid-cols-2 gap-3 xl:grid-cols-4"
        aria-label="Statistik warung"
      >
        {metrics.map(({ label, value, note, icon: MetricIcon, href }) => {
          const content = (
            <>
              <div className="flex items-center gap-2.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e6f1ff] text-primary">
                  <MetricIcon size={18} strokeWidth={1.8} />
                </span>
                <span className="text-xs font-semibold text-[#7d8794] sm:text-sm">
                  {label}
                </span>
              </div>
              <strong className="mt-2 block text-xl font-bold text-[#2b4568]">
                {value}
              </strong>
              <span className="mt-1 block text-[11px] text-[#8491a2]">
                {note}
              </span>
            </>
          );
          return href ? (
            <Link
              className="min-h-[132px] rounded-xl border border-[#dce5f0] bg-white p-3.5 transition hover:border-primary/40 hover:shadow-sm sm:p-4"
              href={href}
              key={label}
            >
              {content}
            </Link>
          ) : (
            <article
              className="min-h-[132px] rounded-xl border border-[#dce5f0] bg-white p-3.5 sm:p-4"
              key={label}
            >
              {content}
            </article>
          );
        })}
      </section>

      <section
        className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)]"
        aria-label="Produk terbaru & form"
      >
        <article className="overflow-hidden rounded-xl border border-[#dce5f0] bg-white">
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
            <h2 className="text-sm font-bold text-[#2b4568]">Produk Terbaru</h2>
            <Link
              className="text-xs font-medium text-primary hover:underline"
              href="/mitra/produk"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="overflow-x-auto px-3 pb-3 sm:px-4">
            {store.products.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[#bcd6f5] bg-white/60 px-4 py-8 text-center text-sm text-[#7185a0]">
                Belum ada produk di warungmu. Tambahkan lewat form di samping.
              </p>
            ) : (
              <table className="w-full min-w-[440px] text-left text-xs">
                <thead className="text-[10px] text-[#8b929c]">
                  <tr className="border-b border-[#edf0f4]">
                    <th className="px-2 py-2 font-medium">Nama Produk</th>
                    <th className="px-2 py-2 font-medium">Harga</th>
                    <th className="px-2 py-2 text-right font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {store.products.slice(0, 5).map((product) => (
                    <tr
                      className="border-b border-[#edf0f4] last:border-0"
                      key={product.id}
                    >
                      <td className="px-2 py-2">
                        <strong className="block text-[11px] font-semibold text-[#334e70]">
                          {product.name}
                        </strong>
                      </td>
                      <td className="px-2 py-2 font-semibold text-[#334e70]">
                        {formatRupiah(product.price)}
                      </td>
                      <td className="px-2 py-2 text-right">
                        <span
                          className={`rounded-full px-2 py-1 text-[9px] ${
                            product.available
                              ? "bg-[#d9f5e8] text-[#348d68]"
                              : "bg-[#edf0f4] text-[#7b8490]"
                          }`}
                        >
                          {product.available ? "Tersedia" : "Habis"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </article>

        <div className="space-y-4">
          <AddProductCard />
        </div>
      </section>

      <Link
        className="inline-flex items-center gap-1 text-xs text-[#75849a] hover:text-primary"
        href={`/warung/${store.slug}`}
      >
        Buka halaman publik <ExternalLink size={13} />
      </Link>
    </div>
  );
}
