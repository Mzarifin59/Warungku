/**
 * Mutasi Supabase (client-side) — edit profil toko & tambah produk.
 *
 * Dipakai oleh dashboard mitra. Hanya bisa dipanggil dari Client Component
 * karena memakai `createBrowserClient` (cookie session).
 */

import { createClient } from "./client";
import type { Category } from "../types";
import type { Database } from "./database.types";

type StoreUpdate = Database["public"]["Tables"]["stores"]["Update"];

export type UpdateStoreInput = {
  name?: string;
  description?: string | null;
  logoUrl?: string | null;
  imageBanner?: string | null;
  operationHours?: string | null;
};

export async function updateStore(
  storeId: string,
  input: UpdateStoreInput,
): Promise<{ ok: boolean; message: string }> {
  const supabase = createClient();
  const payload: StoreUpdate = {};
  if (input.name !== undefined) payload.name = input.name;
  if (input.description !== undefined) payload.description = input.description;
  if (input.logoUrl !== undefined) payload.logo_url = input.logoUrl;
  if (input.imageBanner !== undefined)
    payload.image_banner = input.imageBanner;
  if (input.operationHours !== undefined)
    payload.operation_hours = input.operationHours;

  const { error } = await supabase.from("stores").update(payload).eq("id", storeId);
  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }
  return { ok: true, message: "Profil warung berhasil diperbarui." };
}

export async function createCategory(
  storeId: string,
  name: string,
  sortOrder: number,
): Promise<Category | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({
      store_id: storeId,
      name: name.trim(),
      sort_order: sortOrder,
    })
    .select("id, name, sort_order")
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    sortOrder: data.sort_order,
  };
}

export async function addProduct(input: {
  storeId: string;
  name: string;
  price: number;
  categoryId?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  available?: boolean;
}): Promise<{ ok: boolean; message: string; id?: string }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      store_id: input.storeId,
      name: input.name.trim(),
      price: input.price,
      category_id: input.categoryId ?? null,
      description: input.description ?? null,
      image_url: input.imageUrl ?? null,
      available: input.available ?? true,
    })
    .select("id")
    .single();
  if (error) {
    return { ok: false, message: error.message };
  }
  return { ok: true, message: `Produk "${input.name}" ditambahkan.`, id: data?.id };
}
