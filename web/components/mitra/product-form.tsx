"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { ImagePicker } from "@/components/mitra/image-picker";
import { useDashboardStore } from "@/lib/dashboard-provider";
import { PRICE_MAX } from "@/lib/constants";
import {
  createCategory,
  createProduct,
  deleteProduct,
  updateProduct,
  type ProductInput,
} from "@/lib/supabase/mutations";
import { formatRupiah } from "@/lib/utils";
import type { Category, Product, Store } from "@/lib/types";

type Draft = {
  name: string;
  price: string; // digit saja
  categoryId: string; // "" = tanpa kategori
  description: string;
  imageUrl: string;
  available: boolean;
};

type Errors = Partial<Record<"name" | "price" | "description", string>>;

function toDraft(product?: Product): Draft {
  return {
    name: product?.name ?? "",
    price: product ? String(product.price) : "",
    categoryId: product?.categoryId ?? "",
    description: product?.description ?? "",
    imageUrl: product?.image ?? "",
    available: product?.available ?? true,
  };
}

const groupThousands = (digits: string) =>
  digits ? Number(digits).toLocaleString("id-ID") : "";

export function ProductForm({
  store,
  product,
}: {
  store: Store;
  product?: Product;
}) {
  const isEdit = Boolean(product);
  const router = useRouter();
  const { patchStore, toast } = useDashboardStore();

  const initial = React.useMemo(() => toDraft(product), [product]);
  const [draft, setDraft] = React.useState<Draft>(initial);
  const [errors, setErrors] = React.useState<Errors>({});
  const [formError, setFormError] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [newCategoryOpen, setNewCategoryOpen] = React.useState(false);

  const dirty = (Object.keys(draft) as (keyof Draft)[]).some(
    (key) => draft[key] !== initial[key],
  );
  const leavingRef = React.useRef(false);

  React.useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      if (!leavingRef.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): Errors {
    const found: Errors = {};
    const name = draft.name.trim();
    if (!name) found.name = "Nama produk wajib diisi.";
    else if (name.length > 100) found.name = "Nama produk maksimal 100 karakter.";
    if (draft.price === "") found.price = "Harga wajib diisi.";
    else if (Number(draft.price) > PRICE_MAX)
      found.price = `Harga maksimal ${formatRupiah(PRICE_MAX)}.`;
    if (draft.description.length > 1000)
      found.description = "Deskripsi maksimal 1.000 karakter.";
    return found;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    const found = validate();
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      document.getElementById(`product-${firstKey}`)?.focus();
      return;
    }

    setSaving(true);
    const input: ProductInput = {
      name: draft.name,
      price: Number(draft.price),
      categoryId: draft.categoryId || null,
      description: draft.description,
      imageUrl: draft.imageUrl,
      available: draft.available,
    };
    const result = product
      ? await updateProduct(product.id, input)
      : await createProduct(store.id, input);
    if (!result.ok) {
      setSaving(false);
      setFormError(result.message);
      return;
    }

    const saved = result.data;
    patchStore((s) => ({
      ...s,
      products: product
        ? s.products.map((p) => (p.id === saved.id ? saved : p))
        : [...s.products, saved],
    }));
    toast({ text: product ? "Perubahan disimpan." : `"${saved.name}" ditambahkan.` });
    leavingRef.current = true;
    router.push("/mitra/produk");
  }

  async function handleDelete() {
    if (!product) return;
    setDeleting(true);
    const result = await deleteProduct(product.id);
    setDeleting(false);
    if (!result.ok) {
      setConfirmDelete(false);
      toast({ text: result.message, variant: "error" });
      return;
    }
    patchStore((s) => ({
      ...s,
      products: s.products.filter((p) => p.id !== product.id),
    }));
    toast({ text: `"${product.name}" dihapus.` });
    leavingRef.current = true;
    router.push("/mitra/produk");
  }

  async function markSoldOutInstead() {
    if (!product) return;
    setConfirmDelete(false);
    const result = await updateProduct(product.id, { available: false });
    if (!result.ok) {
      toast({ text: result.message, variant: "error" });
      return;
    }
    patchStore((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === product.id ? result.data : p)),
    }));
    set("available", false);
    toast({ text: `"${product.name}" ditandai Habis.` });
  }

  const category = store.categories.find((c) => c.id === draft.categoryId);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,36rem)_18rem] lg:items-start">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-[#dce5f0] bg-white p-4 sm:p-6"
      >
        <ImagePicker
          id="product-image"
          label="Foto produk"
          kind="product"
          value={draft.imageUrl}
          onChange={(url) => set("imageUrl", url)}
          onUploadingChange={setUploading}
        />

        <Field label="Nama produk" htmlFor="product-name" required error={errors.name}>
          <Input
            id="product-name"
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            maxLength={100}
            placeholder="Contoh: Ayam Lalapan"
            error={Boolean(errors.name)}
          />
        </Field>

        <Field label="Harga" htmlFor="product-price" required error={errors.price}>
          <div
            className={`flex h-11 items-center overflow-hidden rounded-md border bg-surface focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 ${
              errors.price ? "border-danger" : "border-border-strong"
            }`}
          >
            <span className="px-3 text-sm font-medium text-text-muted" aria-hidden="true">
              Rp
            </span>
            <input
              id="product-price"
              inputMode="numeric"
              autoComplete="off"
              value={groupThousands(draft.price)}
              onChange={(e) =>
                set("price", e.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 9))
              }
              placeholder="15.000"
              className="h-full min-w-0 flex-1 bg-transparent pr-3 text-base text-text outline-none"
            />
          </div>
        </Field>

        <Field label="Kategori" htmlFor="product-categoryId" optional>
          <div className="flex gap-2">
            <select
              id="product-categoryId"
              value={draft.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className="h-11 min-w-0 flex-1 rounded-md border border-border-strong bg-surface px-3 text-base text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            >
              <option value="">Tanpa kategori</option>
              {store.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setNewCategoryOpen(true)}
              aria-label="Tambah kategori baru"
            >
              <Plus size={16} /> <span className="hidden sm:inline">Baru</span>
            </Button>
          </div>
        </Field>

        <Field
          label="Deskripsi"
          htmlFor="product-description"
          optional
          hint={`${draft.description.length}/1000 karakter`}
          error={errors.description}
        >
          <Textarea
            id="product-description"
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Bahan, porsi, atau info penting lainnya."
          />
        </Field>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
          <div>
            <p className="text-sm font-medium text-text">
              {draft.available ? "Tersedia" : "Habis"}
            </p>
            <p className="text-xs text-text-muted">
              Produk habis tetap tampil, tapi tidak bisa dipesan.
            </p>
          </div>
          <Toggle
            checked={draft.available}
            onCheckedChange={(next) => set("available", next)}
            label="Produk tersedia"
          />
        </div>

        {formError && (
          <p className="rounded-lg bg-danger-subtle px-3 py-2 text-sm text-danger" role="alert">
            {formError}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link
            href="/mitra/produk"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border-strong px-4 text-sm font-medium text-text hover:bg-surface-muted"
            onClick={(e) => {
              if (dirty && !window.confirm("Perubahan belum disimpan. Tetap keluar?")) {
                e.preventDefault();
              }
            }}
          >
            Batal
          </Link>
          <Button
            type="submit"
            loading={saving}
            loadingLabel="Menyimpan…"
            disabled={uploading || (isEdit && !dirty)}
          >
            {isEdit ? "Simpan" : "Tambah Produk"}
          </Button>
        </div>

        {isEdit && (
          <div className="border-t border-border pt-4">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-sm font-medium text-danger hover:underline"
            >
              Hapus produk
            </button>
          </div>
        )}
      </form>

      <aside className="hidden lg:block" aria-label="Pratinjau produk">
        <p className="mb-2 text-xs font-medium text-[#8794a5]">Pratinjau di warung</p>
        <ProductPreview
          name={draft.name}
          price={Number(draft.price || 0)}
          image={draft.imageUrl}
          available={draft.available}
          category={category}
        />
      </aside>

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={`Hapus "${product?.name ?? ""}"?`}
        confirmLabel="Hapus"
        confirmVariant="destructive"
        confirmLoading={deleting}
        onConfirm={() => void handleDelete()}
      >
        <p>Produk akan dihapus permanen dari warungmu.</p>
        {product?.available && (
          <button
            type="button"
            onClick={() => void markSoldOutInstead()}
            className="mt-2 text-sm font-medium text-primary hover:underline"
          >
            Cukup tandai Habis saja?
          </button>
        )}
      </Dialog>

      <NewCategoryDialog
        open={newCategoryOpen}
        onClose={() => setNewCategoryOpen(false)}
        store={store}
        onCreated={(c) => set("categoryId", c.id)}
      />
    </div>
  );
}

function ProductPreview({
  name,
  price,
  image,
  available,
  category,
}: {
  name: string;
  price: number;
  image: string;
  available: boolean;
  category?: Category;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#dce5f0] bg-white">
      <div className="relative grid aspect-square place-items-center bg-[#f3f7fc] text-[#a3b3c7]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL storage dinamis
          <img src={image} alt="" className="size-full object-cover" />
        ) : (
          <ImageIcon size={32} aria-hidden="true" />
        )}
        {!available && (
          <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
            Habis
          </span>
        )}
      </div>
      <div className="space-y-1 p-3">
        {category && <p className="text-[10px] text-[#8794a5]">{category.name}</p>}
        <p className="line-clamp-2 text-sm font-semibold text-[#2b4568]">
          {name.trim() || "Nama produk"}
        </p>
        <p className="text-sm font-bold text-primary">{formatRupiah(price)}</p>
      </div>
    </div>
  );
}

/** Dialog kecil "Tambah kategori baru" (dipakai form produk). */
export function NewCategoryDialog({
  open,
  onClose,
  store,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  store: Store;
  onCreated?: (category: Category) => void;
}) {
  const { patchStore, toast } = useDashboardStore();
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  function close() {
    setName("");
    setError("");
    onClose();
  }

  async function submit() {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 40) {
      setError("Nama kategori 1–40 karakter.");
      return;
    }
    if (store.categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("Nama kategori sudah dipakai.");
      return;
    }
    setSaving(true);
    const maxOrder = Math.max(0, ...store.categories.map((c) => c.sortOrder));
    const result = await createCategory(store.id, trimmed, maxOrder + 1);
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    patchStore((s) => ({ ...s, categories: [...s.categories, result.data] }));
    onCreated?.(result.data);
    toast({ text: `Kategori "${result.data.name}" ditambahkan.` });
    close();
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Tambah kategori baru"
      confirmLabel="Tambah"
      confirmLoading={saving}
      onConfirm={() => void submit()}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <Field label="Nama kategori" htmlFor="new-category-name" error={error}>
          <Input
            id="new-category-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            maxLength={40}
            placeholder="Contoh: Minuman"
          />
        </Field>
      </form>
    </Dialog>
  );
}
