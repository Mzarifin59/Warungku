"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Check, Layers, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DashboardGate, PageHeader } from "@/components/mitra/dashboard-gate";
import { useDashboardStore } from "@/lib/dashboard-provider";
import {
  createCategory,
  deleteCategory,
  renameCategory,
  reorderCategories,
} from "@/lib/supabase/mutations";
import type { Category, Store } from "@/lib/types";

export function MitraCategoriesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader
        title="Kategori"
        description="Kelompokkan produk supaya pelanggan lebih mudah mencari."
      />
      <DashboardGate skeleton="rows">{(store) => <CategoryManager store={store} />}</DashboardGate>
    </div>
  );
}

function validateName(name: string, store: Store, exceptId?: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Nama kategori wajib diisi.";
  if (trimmed.length > 40) return "Nama kategori maksimal 40 karakter.";
  const dup = store.categories.some(
    (c) => c.id !== exceptId && c.name.toLowerCase() === trimmed.toLowerCase(),
  );
  return dup ? "Nama kategori sudah dipakai." : null;
}

function CategoryManager({ store }: { store: Store }) {
  const { patchStore, toast } = useDashboardStore();
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [adding, setAdding] = React.useState(false);
  const [toDelete, setToDelete] = React.useState<Category | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const counts = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const p of store.products) {
      if (p.categoryId) map.set(p.categoryId, (map.get(p.categoryId) ?? 0) + 1);
    }
    return map;
  }, [store.products]);

  async function add(event: React.FormEvent) {
    event.preventDefault();
    const problem = validateName(name, store);
    if (problem) {
      setError(problem);
      return;
    }
    setAdding(true);
    const maxOrder = Math.max(0, ...store.categories.map((c) => c.sortOrder));
    const result = await createCategory(store.id, name, maxOrder + 1);
    setAdding(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    patchStore((s) => ({ ...s, categories: [...s.categories, result.data] }));
    setName("");
    toast({ text: `Kategori "${result.data.name}" ditambahkan.` });
  }

  async function move(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= store.categories.length) return;
    const previous = store.categories;
    const next = [...previous];
    [next[index], next[target]] = [next[target], next[index]];
    const ordered = next.map((c, i) => ({ ...c, sortOrder: i + 1 }));
    patchStore((s) => ({ ...s, categories: ordered })); // optimistic
    const result = await reorderCategories(ordered);
    if (!result.ok) {
      patchStore((s) => ({ ...s, categories: previous }));
      toast({ text: result.message, variant: "error" });
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const result = await deleteCategory(toDelete.id);
    setDeleting(false);
    if (!result.ok) {
      toast({ text: result.message, variant: "error" });
      setToDelete(null);
      return;
    }
    patchStore((s) => ({
      ...s,
      categories: s.categories.filter((c) => c.id !== toDelete.id),
      products: s.products.map((p) =>
        p.categoryId === toDelete.id ? { ...p, categoryId: null } : p,
      ),
    }));
    toast({ text: `Kategori "${toDelete.name}" dihapus.` });
    setToDelete(null);
  }

  const affected = toDelete ? counts.get(toDelete.id) ?? 0 : 0;

  return (
    <section className="space-y-4 rounded-2xl border border-[#dce5f0] bg-white p-4 sm:p-5">
      <form onSubmit={add} noValidate className="space-y-1.5">
        <label htmlFor="category-name" className="block text-sm font-medium text-text">
          Nama kategori
        </label>
        <div className="flex gap-2">
          <Input
            id="category-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            maxLength={40}
            placeholder="Contoh: Minuman"
            error={Boolean(error)}
            aria-describedby={error ? "category-name-error" : undefined}
          />
          <Button type="submit" loading={adding} loadingLabel="…" className="shrink-0">
            Tambah
          </Button>
        </div>
        {error && (
          <p id="category-name-error" className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </form>

      {store.categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
          <Layers className="mx-auto text-text-muted" size={22} aria-hidden="true" />
          <p className="mt-2 font-medium text-text">Belum ada kategori</p>
          <p className="mt-1 text-sm text-text-muted">
            Kategori membantu pelanggan menemukan produk. Ini opsional.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-[#edf1f6] rounded-xl border border-[#edf1f6]">
          {store.categories.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
              store={store}
              count={counts.get(category.id) ?? 0}
              isFirst={index === 0}
              isLast={index === store.categories.length - 1}
              onMove={(delta) => void move(index, delta)}
              onDelete={() => setToDelete(category)}
            />
          ))}
        </ul>
      )}

      <Dialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title={`Hapus kategori "${toDelete?.name ?? ""}"?`}
        confirmLabel="Hapus"
        confirmVariant="destructive"
        confirmLoading={deleting}
        onConfirm={() => void confirmDelete()}
      >
        {affected > 0
          ? `${affected} produk di kategori ini akan menjadi "Tanpa kategori". Produknya tidak ikut terhapus.`
          : "Kategori ini tidak berisi produk."}
      </Dialog>
    </section>
  );
}

function CategoryRow({
  category,
  store,
  count,
  isFirst,
  isLast,
  onMove,
  onDelete,
}: {
  category: Category;
  store: Store;
  count: number;
  isFirst: boolean;
  isLast: boolean;
  onMove: (delta: -1 | 1) => void;
  onDelete: () => void;
}) {
  const { patchStore, toast } = useDashboardStore();
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(category.name);
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const inputId = `category-${category.id}`;

  async function save(event?: React.FormEvent) {
    event?.preventDefault();
    if (value.trim() === category.name) {
      setEditing(false);
      return;
    }
    const problem = validateName(value, store, category.id);
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    const result = await renameCategory(category.id, value);
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    patchStore((s) => ({
      ...s,
      categories: s.categories.map((c) =>
        c.id === category.id ? { ...c, name: value.trim() } : c,
      ),
    }));
    setEditing(false);
    toast({ text: "Nama kategori diperbarui." });
  }

  const iconButton =
    "grid size-9 place-items-center rounded-md text-[#71839b] transition hover:bg-[#eaf3ff] hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent";

  if (editing) {
    return (
      <li className="p-3">
        <form onSubmit={save} className="flex items-center gap-2">
          <label htmlFor={inputId} className="sr-only">
            Nama kategori
          </label>
          <Input
            id={inputId}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setValue(category.name);
                setEditing(false);
              }
            }}
            maxLength={40}
            autoFocus
            error={Boolean(error)}
            className="h-10"
          />
          <button type="submit" className={iconButton} aria-label="Simpan nama kategori" disabled={saving}>
            <Check size={16} />
          </button>
          <button
            type="button"
            className={iconButton}
            aria-label="Batal ubah nama"
            onClick={() => {
              setValue(category.name);
              setError("");
              setEditing(false);
            }}
          >
            <X size={16} />
          </button>
        </form>
        {error && (
          <p className="mt-1 text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2 p-3">
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="min-w-0 flex-1 rounded-md px-1 py-1 text-left hover:bg-[#f5f8fc]"
        aria-label={`Ubah nama kategori ${category.name}`}
      >
        <span className="block truncate text-sm font-medium text-[#334e70]">{category.name}</span>
        <span className="text-[11px] text-[#8794a5]">{count} produk</span>
      </button>
      <button type="button" className={iconButton} onClick={() => setEditing(true)} aria-label={`Ubah nama ${category.name}`}>
        <Pencil size={15} />
      </button>
      <button type="button" className={iconButton} onClick={() => onMove(-1)} disabled={isFirst} aria-label={`Naikkan ${category.name}`}>
        <ArrowUp size={15} />
      </button>
      <button type="button" className={iconButton} onClick={() => onMove(1)} disabled={isLast} aria-label={`Turunkan ${category.name}`}>
        <ArrowDown size={15} />
      </button>
      <button
        type="button"
        className="grid size-9 place-items-center rounded-md text-[#71839b] transition hover:bg-rose-50 hover:text-rose-600"
        onClick={onDelete}
        aria-label={`Hapus ${category.name}`}
      >
        <Trash2 size={15} />
      </button>
    </li>
  );
}
