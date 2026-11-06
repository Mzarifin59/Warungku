"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { StoreCard } from "@/components/store-card";
import { categories, type StoreDisplay } from "@/lib/home-data";

type Sort = "nama" | "baru";

const sortOptions: { value: Sort; label: string }[] = [
  { value: "baru", label: "Terbaru" },
  { value: "nama", label: "Nama (A–Z)" },
];

const chipBase =
  "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-medium transition sm:text-sm";

export function WarungExplorePage({ stores }: { stores: StoreDisplay[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [sort, setSort] = useState<Sort>("baru");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stores
      .filter(
        (store) =>
          (category === "Semua" || store.category === category) &&
          (!q ||
            store.name.toLowerCase().includes(q) ||
            store.category.toLowerCase().includes(q)),
      )
      .sort((a, b) =>
        sort === "nama"
          ? a.name.localeCompare(b.name, "id")
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [query, category, sort, stores]);

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
              className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-[#8496b0]"
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
        <div
          className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Filter kategori"
        >
          {["Semua", ...categories.map((item) => item.name)].map((name) => {
            const active = category === name;
            return (
              <button
                className={`${chipBase} ${
                  active
                    ? "border-primary bg-primary text-white shadow-md shadow-primary/25"
                    : "border-[#d9eaff] bg-white text-[#344f72] hover:border-blue-300"
                }`}
                aria-pressed={active}
                key={name}
                onClick={() => setCategory(name)}
                type="button"
              >
                {name}
              </button>
            );
          })}
        </div>

        <div className="mt-5 mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#6f82a1]" aria-live="polite">
            Menampilkan{" "}
            <strong className="font-semibold text-[#2b4568]">{results.length}</strong> warung
          </p>
          <label className="flex items-center gap-2 text-xs text-[#6f82a1] sm:text-sm">
            Urutkan
            <select
              className="h-10 rounded-full border border-[#d9eaff] bg-white px-3 text-xs font-medium text-[#2b4568] outline-none focus:border-blue-300 sm:text-sm"
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
            >
              {sortOptions.map((option) => (
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
              <StoreCard key={store.name} store={store} />
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
            <button
              className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
              onClick={() => {
                setQuery("");
                setCategory("Semua");
              }}
              type="button"
            >
              Reset filter
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
