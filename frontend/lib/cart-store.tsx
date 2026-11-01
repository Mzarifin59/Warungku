"use client";

import * as React from "react";
import { CART_QTY_MAX } from "./constants";
import type { CartItem, Product } from "./types";

// Re-export type lokal untuk import di komponen lain.
export type { CartItem };

/**
 * Cart store — Fase 1 (mock, client-side).
 *
 * // TODO(api): di Fase 2 tetap per-user (Supabase Auth + DB), tapi
 * kontrak API di sini (add/setQty/remove/clear/total) tidak berubah.
 *
 * - Tersimpan per slug toko di `localStorage` (keys:
 *   `warungku.cart.{slug}`), bertahan setelah refresh (docs 04 F4).
 * - Bila `localStorage` tak tersedia (mode privat) → berjalan in-memory
 *   tanpa crash (docs 04 edge case).
 */

const STORAGE_PREFIX = "warungku.cart.";

function readStorage(key: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(key: string, items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // mode privat / kuota penuh — abaikan, state tetap di memori.
  }
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
  const [items, setItems] = React.useState<CartItem[]>(() =>
    readStorage(storageKey),
  );

  React.useEffect(() => {
    writeStorage(storageKey, items);
  }, [storageKey, items]);

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
            // 0 = minta hapus (docs 05 P02: "quantity 0 asks to remove").
            return prev.filter((i) => i.productId !== productId);
          }
          return prev.map((i) =>
            i.productId === productId ? { ...i, quantity: nextQty } : i,
          );
        });
      },
      remove: (productId) =>
        setItems((prev) => prev.filter((i) => i.productId !== productId)),
      clear: () => setItems([]),
      /**
       * Tambah item mentah langsung (bukan dari `Product` seed). Dipakai
       * untuk handoff dari home page yang memakai flat `home-data`.
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
    [slug, items, count, total],
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
