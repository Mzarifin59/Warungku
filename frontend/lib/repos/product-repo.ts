/**
 * Product repository — FASE 1 (mock).
 *
 * // TODO(api): ganti isi repos dengan panggilan Supabase di Fase 2;
 * seed ini cukup untuk demo & sstatis pages.
 */

import { seedStores } from "../seed-data";
import type { Product } from "../types";

const MOCK_LATENCY_MS = 300;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** Semua produk milik satu toko (untuk katalog publik P01). */
export async function listProductsByStore(storeId: string): Promise<Product[]> {
  // TODO(api): productRepo.listByStore(storeId)
  await delay(MOCK_LATENCY_MS);
  const store = seedStores.find((s) => s.id === storeId);
  if (!store) return [];
  return [...store.products].sort(
    (a, b) => a.sortOrder - b.sortOrder || b.id.localeCompare(a.id),
  );
}

/** Cek ketersediaan massal (checkout P03 → F5 konflik item). */
export async function checkAvailability(
  storeId: string,
  items: { productId: string }[],
): Promise<Map<string, boolean>> {
  // TODO(api): productRepo.checkAvailability(storeId, ids)
  await delay(250);
  const store = seedStores.find((s) => s.id === storeId);
  const products = new Map(store?.products.map((p) => [p.id, p]) ?? []);
  const result = new Map<string, boolean>();
  for (const { productId } of items) {
    const product = products.get(productId);
    // "missing" = produk sudah dihapus → dianggap tak tersedia.
    result.set(productId, product ? product.available : false);
  }
  return result;
}
