"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { ProductCard } from "@/components/product-card";
import { StoreCard } from "@/components/store-card";
import { homeCategories, homeHero } from "@/lib/content/home";
import type { SearchResult } from "@/lib/repos/search-repo";
import { cn } from "@/lib/utils";

type Tab = "semua" | "produk" | "warung";
type Sort = "relevan" | "termurah" | "termahal";

const SORT_LABELS: Record<Sort, string> = {
  relevan: "Paling sesuai",
  termurah: "Harga terendah",
  termahal: "Harga tertinggi",
};

export function SearchPage({ result }: { result: SearchResult }) {
  const { query, stores, products } = result;
  const [tab, setTab] = React.useState<Tab>("semua");
  const [sort, setSort] = React.useState<Sort>("relevan");
  const [onlyAvailable, setOnlyAvailable] = React.useState(false);

  // Reset filter saat kata kunci berubah.
  const [lastQuery, setLastQuery] = React.useState(query);
  if (lastQuery !== query) {
    setLastQuery(query);
    setTab("semua");
    setSort("relevan");
    setOnlyAvailable(false);
  }

  const visibleProducts = React.useMemo(() => {
    const list = onlyAvailable ? products.filter((p) => p.available) : [...products];
    if (sort === "termurah") list.sort((a, b) => a.price - b.price);
    if (sort === "termahal") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, sort, onlyAvailable]);

  if (!query) return <SearchLanding />;

  const total = stores.length + products.length;
  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "semua", label: "Semua" },
    { id: "produk", label: "Produk", count: products.length },
    { id: "warung", label: "Warung", count: stores.length },
  ];
  const showProducts = tab !== "warung" && products.length > 0;
  const showStores = tab !== "produk" && stores.length > 0;

  return (
    <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-5">
        <p className="text-xs text-[#6f82a1]">Hasil pencarian</p>
        <h1 className="mt-0.5 text-xl font-bold tracking-[-0.5px] text-[#263f63] sm:text-2xl">
          “{query}”
        </h1>
        <p className="mt-1 text-sm text-[#6f82a1]" aria-live="polite">
          {total === 0
            ? "Tidak ada hasil"
            : `${products.length} produk dan ${stores.length} warung ditemukan`}
        </p>
      </div>

      {total === 0 ? (
        <NoResults />
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-3 border-b border-[#e4edf7] sm:flex-row sm:items-end sm:justify-between">
            <div className="-mb-px flex gap-1" role="tablist" aria-label="Jenis hasil">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "h-11 border-b-2 px-3 text-sm font-medium transition",
                    tab === t.id
                      ? "border-primary text-primary"
                      : "border-transparent text-[#6f82a1] hover:text-[#2b4568]",
                  )}
                >
                  {t.label}
                  {t.count !== undefined && (
                    <span className="ml-1.5 rounded-full bg-[#eef6ff] px-1.5 py-0.5 text-[11px]">
                      {t.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {tab !== "warung" && products.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pb-2 text-xs text-[#6f82a1] sm:text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="size-4 accent-primary"
                  />
                  Hanya yang tersedia
                </label>
                <label className="flex items-center gap-2">
                  <span className="sr-only sm:not-sr-only">Urutkan</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                    className="h-9 rounded-full border border-[#d9eaff] bg-white px-3 text-xs font-medium text-[#2b4568] outline-none focus:border-blue-300 sm:text-sm"
                    aria-label="Urutkan produk"
                  >
                    {(Object.keys(SORT_LABELS) as Sort[]).map((key) => (
                      <option key={key} value={key}>
                        {SORT_LABELS[key]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
          </div>

          {showProducts && (
            <section aria-labelledby="result-products" className="mb-10">
              <h2 id="result-products" className="mb-3 text-base font-bold text-[#2b4568]">
                Produk
              </h2>
              {visibleProducts.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[#bcd6f5] px-4 py-8 text-center text-sm text-[#6f82a1]">
                  Semua produk yang cocok sedang habis.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
                  {(tab === "semua" ? visibleProducts.slice(0, 12) : visibleProducts).map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
              {tab === "semua" && visibleProducts.length > 12 && (
                <button
                  type="button"
                  onClick={() => setTab("produk")}
                  className="mt-4 text-sm font-medium text-primary hover:underline"
                >
                  Lihat semua {visibleProducts.length} produk
                </button>
              )}
            </section>
          )}

          {showStores && (
            <section aria-labelledby="result-stores">
              <h2 id="result-stores" className="mb-3 text-base font-bold text-[#2b4568]">
                Warung
              </h2>
              <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {stores.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>
            </section>
          )}

          {!showProducts && !showStores && (
            <p className="py-10 text-center text-sm text-[#6f82a1]">
              Tidak ada {tab} yang cocok.
            </p>
          )}
        </>
      )}
    </main>
  );
}

function Suggestions() {
  return (
    <div className="mt-5 flex flex-wrap justify-center gap-2">
      {homeHero.popularSearches.map((term) => (
        <Link
          key={term}
          href={`/cari?q=${encodeURIComponent(term)}`}
          className="rounded-full border border-[#d9eaff] bg-white px-3.5 py-2 text-sm text-[#344f72] transition hover:border-primary hover:text-primary"
        >
          {term}
        </Link>
      ))}
    </div>
  );
}

function NoResults() {
  return (
    <div className="rounded-2xl border border-dashed border-[#bcd6f5] bg-[#f3f8ff] px-4 py-14 text-center">
      <span className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-secondary text-primary">
        <Icon name="search" size={22} />
      </span>
      <p className="font-semibold text-[#2b4568]">Belum ada yang cocok</p>
      <p className="mt-1 text-sm text-[#7185a0]">
        Coba kata kunci yang lebih umum, periksa ejaan, atau pilih salah satu di bawah.
      </p>
      <Suggestions />
      <Link href="/warung" className="mt-5 inline-block text-sm font-medium text-primary hover:underline">
        Jelajahi semua warung
      </Link>
    </div>
  );
}

function SearchLanding() {
  return (
    <main className="container mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-secondary text-primary">
          <Icon name="search" size={22} />
        </span>
        <h1 className="text-xl font-bold text-[#263f63] sm:text-2xl">Mau cari apa hari ini?</h1>
        <p className="mt-2 text-sm text-[#6f82a1]">
          Ketik nama produk, warung, kategori, atau kota di kolom pencarian.
        </p>
        <Suggestions />
      </div>
      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
        {homeCategories.map((c) => (
          <Link
            key={c.name}
            href={`/cari?q=${encodeURIComponent(c.query)}`}
            className="flex items-center gap-3 rounded-xl border border-[#d9eaff] bg-white p-3 text-sm font-medium text-[#344f72] transition hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/10"
          >
            <span
              className="grid size-9 shrink-0 place-items-center rounded-full text-white"
              style={{ backgroundColor: c.color }}
            >
              <Icon name={c.icon} size={18} />
            </span>
            {c.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
