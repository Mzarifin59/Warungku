/**
 * Mutasi Supabase (client-side) untuk dashboard mitra.
 *
 * Semua fungsi mengembalikan `Result<T>` — tidak pernah melempar — supaya UI
 * cukup memeriksa `ok` lalu menampilkan `message` (Bahasa Indonesia).
 * Otorisasi dijaga oleh RLS (owner hanya bisa mengubah tokonya sendiri).
 */

import type { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "./client";
import {
  CATEGORY_COLUMNS,
  PRODUCT_COLUMNS,
  STORE_WITH_CATALOG,
  mapCategory,
  mapProduct,
  mapStore,
} from "./mappers";
import type { Database } from "./database.types";
import type { Category, Product, Store, StoreStatus } from "../types";

export type Result<T = void> =
  | { ok: true; data: T }
  | { ok: false; message: string };

type StoreUpdate = Database["public"]["Tables"]["stores"]["Update"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

const STORAGE_BUCKET = "store-images";

function fail(message: string): { ok: false; message: string } {
  return { ok: false, message };
}

/** Terjemahkan error Postgres/PostgREST umum ke pesan yang ramah. */
function describeError(
  error: PostgrestError,
  context: { unique?: string } = {},
): string {
  switch (error.code) {
    case "23505":
      return context.unique ?? "Data yang sama sudah ada.";
    case "23514":
      return "Ada isian yang tidak sesuai aturan. Periksa kembali form.";
    case "42501":
      return "Anda tidak punya akses untuk mengubah data ini. Coba masuk ulang.";
    case "PGRST116":
      return "Data tidak ditemukan. Muat ulang halaman.";
    default:
      if (error.message?.toLowerCase().includes("fetch")) {
        return "Tidak dapat terhubung. Periksa koneksi lalu coba lagi.";
      }
      console.error("[supabase]", error);
      return "Terjadi kesalahan. Coba lagi.";
  }
}

const emptyToNull = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

/** Ambil toko milik user (termasuk draft) + kategori & produk. */
export async function fetchOwnedStore(
  ownerId: string,
): Promise<Result<Store | null>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stores")
    .select(STORE_WITH_CATALOG)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: true })
    .limit(1);
  if (error) return fail(describeError(error));
  return { ok: true, data: data?.[0] ? mapStore(data[0]) : null };
}

/** Cek slug belum dipakai toko lain (`excludeStoreId` = toko sendiri). */
export async function isSlugAvailable(
  slug: string,
  excludeStoreId?: string,
): Promise<boolean | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("is_slug_available", {
    p_slug: slug,
    p_exclude: excludeStoreId ?? null,
  });
  if (error) return null; // tidak diketahui — server tetap menjaga via unique
  return Boolean(data);
}

export type StoreInput = {
  name: string;
  slug: string;
  whatsappNumber: string;
  description?: string | null;
  location?: string | null;
  operationHours?: string | null;
  logoUrl?: string | null;
  imageBanner?: string | null;
};

const SLUG_TAKEN = "Alamat toko ini sudah dipakai. Coba alamat lain.";

export async function createStore(
  ownerId: string,
  input: StoreInput,
): Promise<Result<{ id: string }>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stores")
    .insert({
      owner_id: ownerId,
      name: input.name.trim(),
      slug: input.slug,
      whatsapp_number: input.whatsappNumber,
      description: emptyToNull(input.description),
      location: emptyToNull(input.location),
      operation_hours: emptyToNull(input.operationHours),
      logo_url: emptyToNull(input.logoUrl),
      image_banner: emptyToNull(input.imageBanner),
      status: "draft",
    })
    .select("id")
    .single();
  if (error) return fail(describeError(error, { unique: SLUG_TAKEN }));
  return { ok: true, data: { id: data.id } };
}

export async function updateStore(
  storeId: string,
  input: Partial<StoreInput>,
): Promise<Result> {
  const payload: StoreUpdate = {};
  if (input.name !== undefined) payload.name = input.name.trim();
  if (input.slug !== undefined) payload.slug = input.slug;
  if (input.whatsappNumber !== undefined)
    payload.whatsapp_number = input.whatsappNumber;
  if (input.description !== undefined)
    payload.description = emptyToNull(input.description);
  if (input.location !== undefined) payload.location = emptyToNull(input.location);
  if (input.operationHours !== undefined)
    payload.operation_hours = emptyToNull(input.operationHours);
  if (input.logoUrl !== undefined) payload.logo_url = emptyToNull(input.logoUrl);
  if (input.imageBanner !== undefined)
    payload.image_banner = emptyToNull(input.imageBanner);

  const supabase = createClient();
  const { error } = await supabase
    .from("stores")
    .update(payload)
    .eq("id", storeId);
  if (error) return fail(describeError(error, { unique: SLUG_TAKEN }));
  return { ok: true, data: undefined };
}

export async function setStoreStatus(
  storeId: string,
  status: StoreStatus,
): Promise<Result> {
  const supabase = createClient();
  const { error } = await supabase
    .from("stores")
    .update({ status })
    .eq("id", storeId);
  if (error) return fail(describeError(error));
  return { ok: true, data: undefined };
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export type ProductInput = {
  name: string;
  price: number;
  categoryId: string | null;
  description?: string | null;
  imageUrl?: string | null;
  available: boolean;
};

export async function createProduct(
  storeId: string,
  input: ProductInput,
): Promise<Result<Product>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      store_id: storeId,
      name: input.name.trim(),
      price: input.price,
      category_id: input.categoryId,
      description: emptyToNull(input.description),
      image_url: emptyToNull(input.imageUrl),
      available: input.available,
    })
    .select(PRODUCT_COLUMNS)
    .single();
  if (error) return fail(describeError(error));
  return { ok: true, data: mapProduct(data) };
}

export async function updateProduct(
  productId: string,
  input: Partial<ProductInput>,
): Promise<Result<Product>> {
  const payload: ProductUpdate = {};
  if (input.name !== undefined) payload.name = input.name.trim();
  if (input.price !== undefined) payload.price = input.price;
  if (input.categoryId !== undefined) payload.category_id = input.categoryId;
  if (input.description !== undefined)
    payload.description = emptyToNull(input.description);
  if (input.imageUrl !== undefined) payload.image_url = emptyToNull(input.imageUrl);
  if (input.available !== undefined) payload.available = input.available;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", productId)
    .select(PRODUCT_COLUMNS)
    .single();
  if (error) return fail(describeError(error));
  return { ok: true, data: mapProduct(data) };
}

export async function deleteProduct(productId: string): Promise<Result> {
  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) return fail(describeError(error));
  return { ok: true, data: undefined };
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

const CATEGORY_TAKEN = "Nama kategori sudah dipakai.";

export async function createCategory(
  storeId: string,
  name: string,
  sortOrder: number,
): Promise<Result<Category>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({ store_id: storeId, name: name.trim(), sort_order: sortOrder })
    .select(CATEGORY_COLUMNS)
    .single();
  if (error) return fail(describeError(error, { unique: CATEGORY_TAKEN }));
  return { ok: true, data: mapCategory(data) };
}

export async function renameCategory(
  categoryId: string,
  name: string,
): Promise<Result> {
  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name: name.trim() })
    .eq("id", categoryId);
  if (error) return fail(describeError(error, { unique: CATEGORY_TAKEN }));
  return { ok: true, data: undefined };
}

/** Simpan urutan kategori (index array → sort_order). */
export async function reorderCategories(
  categories: Pick<Category, "id">[],
): Promise<Result> {
  const supabase = createClient();
  const results = await Promise.all(
    categories.map((c, index) =>
      supabase
        .from("categories")
        .update({ sort_order: index + 1 })
        .eq("id", c.id),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) return fail(describeError(failed.error));
  return { ok: true, data: undefined };
}

/** Hapus kategori; produk di dalamnya otomatis jadi "Tanpa kategori" (FK set null). */
export async function deleteCategory(categoryId: string): Promise<Result> {
  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);
  if (error) return fail(describeError(error));
  return { ok: true, data: undefined };
}

/* ------------------------------------------------------------------ */
/* Storage (logo, banner, foto produk)                                 */
/* ------------------------------------------------------------------ */

export const IMAGE_MAX_BYTES = 2 * 1024 * 1024;
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

/**
 * Perkecil gambar di browser (maks `maxSize` px sisi terpanjang, WebP).
 * Bila gagal (browser lama), kembalikan file asli.
 */
async function compressImage(file: File, maxSize = 1200): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85),
    );
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

/**
 * Upload gambar ke bucket `store-images` di folder milik user
 * (`{userId}/{kind}-{uuid}.webp`) dan kembalikan URL publiknya.
 */
export async function uploadImage(
  userId: string,
  file: File,
  kind: "logo" | "banner" | "product",
): Promise<Result<string>> {
  if (!IMAGE_ACCEPT.split(",").includes(file.type)) {
    return fail("Format gambar harus JPG, PNG, atau WebP.");
  }
  if (file.size > IMAGE_MAX_BYTES * 5) {
    return fail("Ukuran gambar terlalu besar (maks 10 MB).");
  }

  const blob = await compressImage(file, kind === "banner" ? 1600 : 1000);
  if (blob.size > IMAGE_MAX_BYTES) {
    return fail("Ukuran gambar maksimal 2 MB setelah dikompres.");
  }
  const ext = blob.type === "image/webp" ? "webp" : file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${kind}-${crypto.randomUUID()}.${ext}`;

  const supabase = createClient();
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, blob, { contentType: blob.type || file.type, upsert: false });
  if (error) {
    console.error("[storage] upload:", error.message);
    return fail(
      error.message.toLowerCase().includes("bucket")
        ? "Penyimpanan gambar belum disiapkan. Hubungi admin."
        : "Gambar gagal diunggah. Coba lagi.",
    );
  }
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { ok: true, data: data.publicUrl };
}
