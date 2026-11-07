"use client";

import * as React from "react";
import { CART_QTY_MAX } from "./constants";
import type { CartItem, Product } from "./types";

// Re-export type lokal untuk import di komponen lain.
export type { CartItem };

/**
 * Cart store — client-side (localStorage per warung).
 *
 *
 * - Tersimpan per slug toko di `localStorage` (keys:
 *   `warungku.cart.{slug}`), bertahan setelah refresh.
 * - Bila `localStorage` tak tersedia (mode privat) → berjalan in-memory
 *   tanpa crash.
 */

const STORAGE_PREFIX = "warungku.cart.";

function readStorage(key: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.flatMap(toCartItem) : [];
  } catch {
    return [];
  }
}

/**
 * Validasi satu item dari localStorage (bisa rusak / diubah manual).
 * Item tidak valid dibuang; jumlah dipaksa ke 1–99. Harga di sini hanya
 * untuk tampilan — checkout selalu memakai harga dari database.
 */
function toCartItem(value: unknown): CartItem[] {
  if (!value || typeof value !== "object") return [];
  const v = value as Record<string, unknown>;
  if (typeof v.productId !== "string" || !v.productId) return [];
  const price = typeof v.unitPrice === "number" && Number.isFinite(v.unitPrice) ? v.unitPrice : 0;
  const qty = typeof v.quantity === "number" && Number.isFinite(v.quantity) ? Math.floor(v.quantity) : 1;
  return [
    {
      productId: v.productId,
      name: typeof v.name === "string" ? v.name.slice(0, 100) : "",
      unitPrice: Math.max(0, Math.round(price)),
      quantity: Math.min(CART_QTY_MAX, Math.max(1, qty)),
      image: typeof v.image === "string" ? v.image : "",
    },
  ];
}

function writeStorage(key: string, items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // mode privat / kuota penuh — abaikan, state tetap di memori.
  }
}

/**
 * Tambah 1 item ke keranjang warung `slug` dari luar halaman warung
 * (mis. kartu produk di beranda / hasil pencarian). Keranjang akan terbaca
 * saat halaman warung dibuka.
 */
export function addToStoredCart(
  slug: string,
  item: Omit<CartItem, "quantity">,
) {
  const key = STORAGE_PREFIX + slug;
  updateCart(key, (items) => {
    const existing = items.find((i) => i.productId === item.productId);
    return existing
      ? items.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: Math.min(i.quantity + 1, CART_QTY_MAX) }
            : i,
        )
      : [...items, { ...item, quantity: 1 }];
  });
}

/* ------------------------------------------------------------------ */
/* Store eksternal per warung (localStorage + cache memori)            */
/* ------------------------------------------------------------------ */
// Dibaca lewat useSyncExternalStore: saat SSR & hydration keranjang
// dianggap kosong (sama dengan HTML server), lalu terisi dari storage —
// mencegah hydration mismatch. Bonus: sinkron antar-tab via event `storage`.

const EMPTY_CART: CartItem[] = [];
const cartCache = new Map<string, CartItem[]>();
const cartListeners = new Map<string, Set<() => void>>();

function getCart(key: string): CartItem[] {
  let items = cartCache.get(key);
  if (!items) {
    items = readStorage(key);
    cartCache.set(key, items);
  }
  return items;
}

function emit(key: string) {
  cartListeners.get(key)?.forEach((listener) => listener());
}

function updateCart(key: string, updater: (items: CartItem[]) => CartItem[]) {
  const next = updater(getCart(key));
  cartCache.set(key, next);
  writeStorage(key, next);
  emit(key);
}

function subscribeCart(key: string, listener: () => void) {
  let set = cartListeners.get(key);
  if (!set) {
    set = new Set();
    cartListeners.set(key, set);
  }
  set.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== key) return;
    cartCache.delete(key); // tab lain mengubah keranjang → baca ulang
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    set.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export interface CartContextValue {
  /** Slug toko aktif (untuk storage key). */
  slug: string;
  items: CartItem[];
  /** Jumlah baris item + total satuan (bukan jumlah total unit). */
  count: number;
  total: number;
  getItem: (productId: string) => CartItem | undefined;
  add: (product: Product, quantity?: number) => void;
  addRaw: (item: CartItem) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  /** Ganti isi keranjang dengan item terverifikasi (nama & harga dari DB). */
  syncItems: (items: CartItem[]) => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const storageKey = STORAGE_PREFIX + slug;
  const items = React.useSyncExternalStore(
    React.useCallback((listener) => subscribeCart(storageKey, listener), [storageKey]),
    () => getCart(storageKey),
    () => EMPTY_CART,
  );
  const setItems = React.useCallback(
    (updater: (prev: CartItem[]) => CartItem[]) => updateCart(storageKey, updater),
    [storageKey],
  );

  const total = React.useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items],
  );
  const count = React.useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const api = React.useMemo<CartContextValue>(
    () => ({
      slug,
      items,
      count,
      total,
      getItem: (productId) => items.find((i) => i.productId === productId),
      add: (product, quantity = 1) => {
        const qty = Math.max(1, Math.min(quantity, CART_QTY_MAX));
        setItems((prev) => {
          const existing = prev.find((i) => i.productId === product.id);
          if (existing) {
            return prev.map((i) =>
              i.productId === product.id
                ? {
                    ...i,
                    quantity: Math.min(i.quantity + qty, CART_QTY_MAX),
                  }
                : i,
            );
          }
          return [
            ...prev,
            {
              productId: product.id,
              name: product.name,
              unitPrice: product.price,
              quantity: qty,
              image: product.image,
            },
          ];
        });
      },
      setQuantity: (productId, quantity) => {
        setItems((prev) => {
          const nextQty = Math.max(1, Math.min(quantity, CART_QTY_MAX));
          if (quantity < 1) {
            // 0 = minta hapus.
            return prev.filter((i) => i.productId !== productId);
          }
          return prev.map((i) =>
            i.productId === productId ? { ...i, quantity: nextQty } : i,
          );
        });
      },
      remove: (productId) =>
        setItems((prev) => prev.filter((i) => i.productId !== productId)),
      clear: () => setItems(() => []),
      syncItems: (next) => setItems(() => next),
      /**
       * Tambah item mentah langsung (bukan dari `Product` seed). Dipakai
       * untuk handoff dari kartu produk lintas warung.
       */
      addRaw: (item: CartItem) => {
        setItems((prev) => {
          const existing = prev.find((i) => i.productId === item.productId);
          if (existing) {
            return prev.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, CART_QTY_MAX) }
                : i,
            );
          }
          return [...prev, { ...item, quantity: Math.min(item.quantity, CART_QTY_MAX) }];
        });
      },
    }),
    [slug, items, count, total, setItems],
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart harus dipakai di dalam <CartProvider>.");
  }
  return ctx;
}
