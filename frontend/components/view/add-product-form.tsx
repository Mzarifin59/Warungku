"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { addProduct, createCategory } from "@/lib/supabase/mutations";
import { useDashboardStore } from "@/lib/dashboard-provider";
import { formatRupiah } from "@/lib/utils";

export function AddProductCard() {
  const { store, refresh } = useDashboardStore();
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [available, setAvailable] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const categories = store?.categories ?? [];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!store) return;

    const priceNum = parseInt(price, 10);
    if (!name.trim() || !priceNum || priceNum <= 0) {
      setMessage({ type: "error", text: "Nama dan harga wajib diisi." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    // Buat kategori baru bila user mengetik kategori yang belum ada
    let categoryId: string | null = null;
    const existingCat = categories.find(
      (c) => c.name.toLowerCase() === category.trim().toLowerCase(),
    );
    if (category.trim() && !existingCat) {
      const newCat = await createCategory(
        store.id,
        category.trim(),
        categories.length + 1,
      );
      if (newCat) categoryId = newCat.id;
    } else if (existingCat) {
      categoryId = existingCat.id;
    }

    const result = await addProduct({
      storeId: store.id,
      name,
      price: priceNum,
      categoryId,
      description: description || null,
      imageUrl: imageUrl || null,
      available,
    });

    setSubmitting(false);
    if (result.ok) {
      await refresh();
      setMessage({ type: "success", text: result.message });
      // Reset form
      setName("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImageUrl("");
      setAvailable(true);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  }

  if (!store) return null;

  return (
    <form
      className="rounded-2xl border border-[#dce5f0] bg-white p-4 sm:p-5"
      onSubmit={handleSubmit}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#2b4568]">Tambah Produk</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nama Produk" htmlFor="product-name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="product-name"
            required
            minLength={2}
            placeholder="Contoh: Ayam Lalapan"
          />
        </Field>
        <Field
          label="Harga (Rp)"
          htmlFor="product-price"
          required
          hint={price ? formatRupiah(parseInt(price, 10) || 0) : undefined}
        >
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            id="product-price"
            required
            type="number"
            min={1}
            placeholder="15000"
          />
        </Field>
        <Field
          label="Kategori"
          htmlFor="product-category"
          hint="Ketik kategori yang sudah ada atau buat baru"
          optional
        >
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            id="product-category"
            list="category-options"
            placeholder="Pilih atau ketik kategori"
          />
          <datalist id="category-options">
            {categories.map((c) => (
              <option key={c.id} value={c.name} />
            ))}
          </datalist>
        </Field>
        <Field label="URL Gambar Produk" htmlFor="product-image" optional>
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            id="product-image"
            type="url"
            placeholder="https://example.com/product.jpg"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field
            label="Deskripsi"
            htmlFor="product-desc"
            hint="Maksimal 1000 karakter"
            optional
          >
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="product-desc"
              maxLength={1000}
              rows={2}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-[#2b4568]">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="size-4 rounded border-[#dce5f0] text-primary focus:ring-primary"
            />
            Produk tersedia
          </label>
        </div>
      </div>
      {message && (
        <p
          className={`mt-2 text-xs ${message.type === "error" ? "text-danger" : "text-success"}`}
          role="status"
        >
          {message.text}
        </p>
      )}
      <div className="mt-4 flex justify-end">
        <Button size="sm" loading={submitting} type="submit">
          <Plus size={14} /> Tambah
        </Button>
      </div>
    </form>
  );
}
