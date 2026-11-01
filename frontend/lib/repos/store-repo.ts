/**
 * Store repository — FASE 1 (mock).
 *
 * // TODO(api): ganti isi repos dengan panggilan Supabase di Fase 2;
 * seed ini cukup untuk demo & sstatis pages.
 *
 * Kontrak async (Promise) disengaja: UI tidak perlu berubah saat backend
 * datang. Lihat docs/frontend/AGENTS.md bagian WAJIB #6 & #7.
 */

import { exampleStoreSlug, seedStores } from "../seed-data";
import type { Store } from "../types";

/** Simulasi latensi jaringa (ms). */
const MOCK_LATENCY_MS = 300;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** Ambil satu toko publik berdasarkan slug. `null` bila tak ada / draft. */
export async function getStoreBySlug(slug: string): Promise<Store | null> {
  // TODO(api): storeRepo.getPublishedBySlug(slug)
  await delay(MOCK_LATENCY_MS);
  const store = seedStores.find((s) => s.slug === slug);
  // Draft tidak boleh bocor — perlakukan sama dengan tak ada (docs 03 §2).
  if (!store || store.status !== "published") return null;
  return store;
}

/** Daftar semua toko publik (landing / explore). */
export async function listPublishedStores(): Promise<Store[]> {
  // TODO(api): storeRepo.listPublished()
  await delay(MOCK_LATENCY_MS);
  return seedStores.filter((s) => s.status === "published");
}

/** Toko untuk pemilik yang sedang login (mock). */
export async function getStoreForOwner(storeId: string): Promise<Store | null> {
  // TODO(api): storeRepo.getOwnedByUser(ownerId)
  await delay(MOCK_LATENCY_MS);
  return seedStores.find((s) => s.id === storeId) ?? null;
}

/** Simulasi cek ketersediaan slug (debounce ~400ms di UI). */
export async function isSlugAvailable(slug: string): Promise<boolean> {
  // TODO(api): storeRepo.slugAvailable(slug, excludeStoreId?)
  await delay(400);
  return !seedStores.some((s) => s.slug === slug);
}

export { exampleStoreSlug };
