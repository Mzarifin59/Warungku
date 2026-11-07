"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/icon";
import { StoreCard } from "@/components/store-card";
import { matchesQuery, type StoreDisplay } from "@/lib/store-display";
import { cn } from "@/lib/utils";

type Sort = "baru" | "nama";

const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: "baru", label: "Terbaru" },
  { value: "nama", label: "Nama (A–Z)" },
];

/** Maksimal chip kategori yang ditampilkan (paling banyak dipakai). */
const MAX_CATEGORY_CHIPS = 10;

const chipBase =
  "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-medium transition sm:text-sm";

export function WarungExplorePage({ stores }: { stores: StoreDisplay[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(searchParams.get("q") ?? "");
  const category = searchParams.get("kategori") ?? "";
  const sort: Sort = searchParams.get("urut") === "nama" ? "nama" : "baru";

  const updateParams = React.useCallback(
    (patch: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Simpan kata kunci ke URL setelah berhenti mengetik (~300ms).
  React.useEffect(() => {
    if ((searchParams.get("q") ?? "") === query.trim()) return;
    const t = window.setTimeout(() => updateParams({ q: query.trim() }), 300);
    return () => window.clearTimeout(t);
  }, [query, searchParams, updateParams]);

  // Kategori dari data asli, diurutkan dari yang paling sering dipakai.
  const categoryChips = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of stores) {
      for (const c of new Set(s.categories.map((n) => n.trim()))) {
        counts.set(c, (counts.get(c) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "id"))
      .slice(0, MAX_CATEGORY_CHIPS)
      .map(([name]) => name);
  }, [stores]);

  const results = React.useMemo(
    () =>
      stores
        .filter(
          (s) =>
            (!category || s.categories.some((c) => c.toLowerCase() === category.toLowerCase())) &&
            matchesQuery(query, [s.name, s.tagline, s.location, ...s.categories]),
        )
        .sort((a, b) =>
          sort === "nama"
            ? a.name.localeCompare(b.name, "id")
            : b.createdAt.localeCompare(a.createdAt),
        ),
    [stores, category, query, sort],
  );

  const hasFilter = Boolean(query.trim() || category);

  function reset() {
    setQuery("");
    updateParams({ q: "", kategori: "" });
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-[#f3f8ff]">
        <div
          className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-secondary/70 blur-2xl"
          aria-hidden="true"
        />
        <div className="container relative mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary">
            <span className="size-[7px] rounded-full bg-emerald-400 ring-[3px] ring-emerald-400/15" />
            {stores.length} warung UMKM siap melayani
          </p>
          <h1 className="text-[clamp(26px,5vw,38px)] leading-tight font-bold tracking-[-1px] text-[#263f63]">
            Jelajahi Warung
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-[1.8] text-[#6f82a1]">
            Temukan warung favoritmu, dari makanan, minuman, hingga kebutuhan
            sehari-hari langsung dari pelaku UMKM sekitarmu.
          </p>
          <label className="mt-6 flex h-12 max-w-xl items-center gap-3 rounded-full border border-[#d9eaff] bg-white px-4 text-[#6882a8] shadow-sm shadow-blue-900/5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-primary/10">
            <Icon name="search" size={18} />
            <input
              className="w-full min-w-0 bg-transparent text-base text-foreground outline-none placeholder:text-[#8496b0] sm:text-sm"
              type="search"
              placeholder="Cari nama warung, kategori, atau lokasi..."
              aria-label="Cari warung"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {categoryChips.length > 0 && (
          <div
            className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Filter kategori"
          >
            {["", ...categoryChips].map((name) => {
              const active = category.toLowerCase() === name.toLowerCase();
              return (
                <button
                  className={cn(
                    chipBase,
                    active
                      ? "border-primary bg-primary text-white shadow-md shadow-primary/25"
                      : "border-[#d9eaff] bg-white text-[#344f72] hover:border-blue-300",
                  )}
                  aria-pressed={active}
                  key={name || "semua"}
                  onClick={() => updateParams({ kategori: name })}
                  type="button"
                >
                  {name || "Semua"}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-5 mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#6f82a1]" aria-live="polite">
            Menampilkan{" "}
            <strong className="font-semibold text-[#2b4568]">{results.length}</strong> warung
            {hasFilter && (
              <button type="button" onClick={reset} className="ml-2 text-primary hover:underline">
                Hapus filter
              </button>
            )}
          </p>
          <label className="flex items-center gap-2 text-xs text-[#6f82a1] sm:text-sm">
            Urutkan
            <select
              className="h-10 rounded-full border border-[#d9eaff] bg-white px-3 text-xs font-medium text-[#2b4568] outline-none focus:border-blue-300 sm:text-sm"
              value={sort}
              onChange={(event) => updateParams({ urut: event.target.value === "nama" ? "nama" : "" })}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#bcd6f5] bg-[#f3f8ff] px-4 py-14 text-center">
            <span className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-secondary text-primary">
              <Icon name="search" size={22} />
            </span>
            <p className="font-semibold text-[#2b4568]">Warung tidak ditemukan</p>
            <p className="mt-1 text-sm text-[#7185a0]">
              Coba kata kunci lain atau pilih kategori yang berbeda.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                onClick={reset}
                type="button"
              >
                Hapus filter
              </button>
              {query.trim() && (
                <Link
                  href={`/cari?q=${encodeURIComponent(query.trim())}`}
                  className="rounded-full border border-[#d9eaff] bg-white px-5 py-2 text-sm font-medium text-[#344f72] hover:border-primary hover:text-primary"
                >
                  Cari “{query.trim()}” di produk
                </Link>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
