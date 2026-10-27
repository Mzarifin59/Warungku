import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { mitraProducts } from "@/lib/mitra-data";
import { Download, MoreHorizontal, Pencil, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Produk Warung — Warungku",
};

export default function MitraProductsPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-xl font-bold tracking-[-0.5px] text-[#233e62] sm:text-2xl">Produk</h1>
          <p className="mt-1 text-xs text-[#8794a5] sm:text-sm">
            Kelola daftar produk yang tersedia di warungmu.
          </p>
        </div>
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-medium text-white transition-colors hover:bg-[#1769db]"
          type="button"
        >
          <Plus size={16} />
          Tambah Produk
        </button>
      </div>

      <section className="overflow-hidden rounded-xl border border-[#dce5f0] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#edf1f6] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-sm font-bold text-[#2b4568]">Semua Produk</h2>
            <p className="mt-1 text-[11px] text-[#8794a5]">12 produk terdaftar di warungmu</p>
          </div>
          <button
            className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg border border-[#dce5f0] px-3 text-xs text-[#5f7189] transition hover:border-primary hover:text-primary sm:self-auto"
            type="button"
          >
            <Download size={14} />
            Ekspor
          </button>
        </div>

        <div className="flex flex-col gap-2.5 border-b border-[#edf1f6] p-4 sm:flex-row sm:items-center sm:px-5">
          <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#dce5f0] px-3 text-[#8794a5] focus-within:border-primary">
            <Search size={16} />
            <input
              aria-label="Cari nama produk"
              className="w-full bg-transparent text-xs text-[#334e70] outline-none placeholder:text-[#a3acb9]"
              placeholder="Cari nama produk..."
              type="search"
            />
          </label>
          <label className="sr-only" htmlFor="category-filter">Filter kategori</label>
          <select
            className="h-10 rounded-lg border border-[#dce5f0] bg-white px-3 text-xs text-[#5f7189] outline-none focus:border-primary"
            defaultValue=""
            id="category-filter"
          >
            <option value="">Semua Kategori</option>
            <option>Makanan</option>
            <option>Minuman</option>
            <option>Pelengkap</option>
            <option>Paket Hemat</option>
          </select>
          <label className="sr-only" htmlFor="status-filter">Filter status</label>
          <select
            className="h-10 rounded-lg border border-[#dce5f0] bg-white px-3 text-xs text-[#5f7189] outline-none focus:border-primary"
            defaultValue=""
            id="status-filter"
          >
            <option value="">Semua Status</option>
            <option>Tersedia</option>
            <option>Stok menipis</option>
            <option>Tidak tersedia</option>
          </select>
          <button
            aria-label="Filter produk"
            className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#dce5f0] text-[#5f7189] transition hover:border-primary hover:text-primary"
            type="button"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="bg-[#f9fbfd] text-[10px] text-[#8794a5]">
              <tr>
                <th className="px-5 py-3 font-medium">Nama Produk</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Harga</th>
                <th className="px-4 py-3 font-medium">Stok</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Terakhir Diubah</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mitraProducts.map((product) => (
                <tr className="border-t border-[#edf1f6] hover:bg-[#fbfdff]" key={product.name}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#fff0ed] text-[#e78a7b]">
                        <Icon name="utensils" size={17} />
                      </span>
                      <span className="font-semibold text-[#334e70]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#6f8097]">{product.category}</td>
                  <td className="px-4 py-3 font-medium text-[#334e70]">{product.price}</td>
                  <td className="px-4 py-3 text-[#6f8097]">{product.stock} pcs</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] ${
                        product.status === "Tersedia"
                          ? "bg-[#d9f5e8] text-[#348d68]"
                          : product.status === "Stok menipis"
                            ? "bg-[#fff1d2] text-[#a67412]"
                            : "bg-[#edf0f4] text-[#7b8490]"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-[#8794a5]">{product.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        aria-label={`Edit ${product.name}`}
                        className="grid size-8 place-items-center rounded-md text-[#71839b] transition hover:bg-[#eaf3ff] hover:text-primary"
                        type="button"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        aria-label={`Hapus ${product.name}`}
                        className="grid size-8 place-items-center rounded-md text-[#71839b] transition hover:bg-rose-50 hover:text-rose-600"
                        type="button"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        aria-label={`Opsi lainnya untuk ${product.name}`}
                        className="grid size-8 place-items-center rounded-md text-[#71839b] transition hover:bg-[#f1f5f9]"
                        type="button"
                      >
                        <MoreHorizontal size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#edf1f6] px-4 py-3 text-[11px] text-[#8794a5] sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span>Menampilkan 6 dari 12 produk</span>
          <div className="flex items-center gap-1">
            <button className="h-8 rounded-md border border-[#e1e7ef] px-2.5 text-[#8794a5]" type="button">Sebelumnya</button>
            <button className="grid size-8 place-items-center rounded-md bg-primary font-medium text-white" type="button">1</button>
            <button className="grid size-8 place-items-center rounded-md border border-[#e1e7ef] text-[#5f7189]" type="button">2</button>
            <button className="h-8 rounded-md border border-[#e1e7ef] px-2.5 text-[#5f7189]" type="button">Selanjutnya</button>
          </div>
        </div>
      </section>
    </div>
  );
}
