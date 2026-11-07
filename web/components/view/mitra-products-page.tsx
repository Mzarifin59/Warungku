"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ImageIcon, Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Toggle } from "@/components/ui/toggle";
import { DashboardGate, PageHeader } from "@/components/mitra/dashboard-gate";
import { useDashboardStore } from "@/lib/dashboard-provider";
import { deleteProduct, updateProduct } from "@/lib/supabase/mutations";
import { cn, formatRupiah } from "@/lib/utils";
import type { Product, Store } from "@/lib/types";

type StatusFilter = "" | "tersedia" | "habis";

export function MitraProductsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Produk"
        description="Kelola daftar produk di warungmu."
        action={
          <Link
            href="/mitra/produk/baru"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            <Plus size={16} /> Tambah Produk
          </Link>
        }
      />
      <DashboardGate skeleton="rows">{(store) => <ProductList store={store} />}</DashboardGate>
    </div>
  );
}

function ProductList({ store }: { store: Store }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { patchStore, toast } = useDashboardStore();
  const [query, setQuery] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const statusParam = searchParams.get("status");
  const status: StatusFilter =
    statusParam === "tersedia" || statusParam === "habis" ? statusParam : "";
  const [toDelete, setToDelete] = React.useState<Product | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const categoryName = React.useMemo(
    () => new Map(store.categories.map((c) => [c.id, c.name])),
    [store.categories],
  );

  const q = query.trim().toLowerCase();
  const filtered = store.products.filter(
    (p) =>
      (!q || p.name.toLowerCase().includes(q)) &&
      (!categoryId ||
        (categoryId === "none" ? !p.categoryId : p.categoryId === categoryId)) &&
      (!status || (status === "tersedia" ? p.available : !p.available)),
  );

  function setStatus(next: StatusFilter) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("status", next);
    else params.delete("status");
    const qs = params.toString();
    router.replace(qs ? `/mitra/produk?${qs}` : "/mitra/produk", { scroll: false });
  }

  async function setAvailable(product: Product, available: boolean, undoable = true) {
    const apply = (value: boolean) =>
      patchStore((s) => ({
        ...s,
        products: s.products.map((p) =>
          p.id === product.id ? { ...p, available: value } : p,
        ),
      }));
    apply(available); // optimistic
    const result = await updateProduct(product.id, { available });
    if (!result.ok) {
      apply(!available);
      toast({ text: result.message, variant: "error" });
      return;
    }
    if (undoable) {
      toast({
        text: `"${product.name}" ditandai ${available ? "Tersedia" : "Habis"}.`,
        variant: "neutral",
        actionLabel: "Urungkan",
        onAction: () => void setAvailable(product, !available, false),
      });
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const result = await deleteProduct(toDelete.id);
    setDeleting(false);
    if (!result.ok) {
      toast({ text: result.message, variant: "error" });
      setToDelete(null);
      return;
    }
    patchStore((s) => ({ ...s, products: s.products.filter((p) => p.id !== toDelete.id) }));
    toast({ text: `"${toDelete.name}" dihapus.` });
    setToDelete(null);
  }

  async function markSoldOutInstead() {
    if (!toDelete) return;
    const product = toDelete;
    setToDelete(null);
    await setAvailable(product, false);
  }

  if (store.products.length === 0) {
    return (
      <EmptyState
        icon={<Package size={22} />}
        title="Belum ada produk"
        description="Tambahkan produk pertamamu supaya pelanggan bisa memesan."
        action={
          <Link
            href="/mitra/produk/baru"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
          >
            <Plus size={16} /> Tambah Produk
          </Link>
        }
      />
    );
  }

  const available = store.products.filter((p) => p.available).length;

  return (
    <section className="overflow-hidden rounded-xl border border-[#dce5f0] bg-white">
      <div className="border-b border-[#edf1f6] p-4 sm:px-5">
        <h2 className="text-sm font-bold text-[#2b4568]">Semua Produk</h2>
        <p className="mt-1 text-[11px] text-[#8794a5]">
          {store.products.length} produk · {available} tersedia ·{" "}
          {store.products.length - available} habis
        </p>
      </div>

      <div className="flex flex-col gap-2.5 border-b border-[#edf1f6] p-4 sm:flex-row sm:items-center sm:px-5">
        <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#dce5f0] px-3 text-[#8794a5] focus-within:border-primary">
          <Search size={16} aria-hidden="true" />
          <input
            aria-label="Cari nama produk"
            className="w-full bg-transparent text-sm text-[#334e70] outline-none placeholder:text-[#a3acb9]"
            placeholder="Cari nama produk..."
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="grid grid-cols-2 gap-2.5 sm:flex">
          <label className="sr-only" htmlFor="category-filter">Filter kategori</label>
          <select
            id="category-filter"
            className="h-10 min-w-0 rounded-lg border border-[#dce5f0] bg-white px-3 text-sm text-[#5f7189] outline-none focus:border-primary"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {store.categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            <option value="none">Tanpa kategori</option>
          </select>
          <label className="sr-only" htmlFor="status-filter">Filter status</label>
          <select
            id="status-filter"
            className="h-10 min-w-0 rounded-lg border border-[#dce5f0] bg-white px-3 text-sm text-[#5f7189] outline-none focus:border-primary"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          >
            <option value="">Semua Status</option>
            <option value="tersedia">Tersedia</option>
            <option value="habis">Habis</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="font-medium text-[#334e70]">Tidak ada produk yang cocok</p>
          <Button
            className="mt-3"
            variant="secondary"
            size="sm"
            onClick={() => {
              setQuery("");
              setCategoryId("");
              setStatus("");
            }}
          >
            Hapus pencarian
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-[#edf1f6]">
          {filtered.map((product) => (
            <li
              key={product.id}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#fbfdff] sm:px-5"
            >
              <Link
                href={`/mitra/produk/${product.id}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-[#f3f7fc] text-[#a3b3c7]">
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- URL storage dinamis
                    <img src={product.image} alt="" className="size-full object-cover" />
                  ) : (
                    <ImageIcon size={20} aria-hidden="true" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-sm font-semibold text-[#334e70]">
                    {product.name}
                  </span>
                  <span className="mt-0.5 block text-sm font-medium text-[#334e70] md:hidden">
                    {formatRupiah(product.price)}
                  </span>
                  <span className="block truncate text-[11px] text-[#8794a5]">
                    {(product.categoryId && categoryName.get(product.categoryId)) || "Tanpa kategori"}
                  </span>
                </span>
                <span className="hidden w-28 shrink-0 text-right text-sm font-medium text-[#334e70] md:block">
                  {formatRupiah(product.price)}
                </span>
              </Link>

              <div className="flex shrink-0 items-center gap-2 sm:w-32">
                <Toggle
                  checked={product.available}
                  onCheckedChange={(next) => void setAvailable(product, next)}
                  label={`${product.name}: ${product.available ? "Tersedia" : "Habis"}`}
                />
                <span
                  className={cn(
                    "hidden text-xs sm:inline",
                    product.available ? "text-[#348d68]" : "text-[#7b8490]",
                  )}
                  aria-hidden="true"
                >
                  {product.available ? "Tersedia" : "Habis"}
                </span>
              </div>

              <div className="hidden shrink-0 gap-1 sm:flex">
                <Link
                  href={`/mitra/produk/${product.id}`}
                  aria-label={`Ubah ${product.name}`}
                  className="grid size-9 place-items-center rounded-md text-[#71839b] transition hover:bg-[#eaf3ff] hover:text-primary"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  type="button"
                  aria-label={`Hapus ${product.name}`}
                  onClick={() => setToDelete(product)}
                  className="grid size-9 place-items-center rounded-md text-[#71839b] transition hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title={`Hapus "${toDelete?.name ?? ""}"?`}
        confirmLabel="Hapus"
        confirmVariant="destructive"
        confirmLoading={deleting}
        onConfirm={() => void confirmDelete()}
      >
        <p>Produk akan dihapus permanen dari warungmu.</p>
        {toDelete?.available && (
          <button
            type="button"
            onClick={() => void markSoldOutInstead()}
            className="mt-2 text-sm font-medium text-primary hover:underline"
          >
            Cukup tandai Habis saja?
          </button>
        )}
      </Dialog>
    </section>
  );
}
