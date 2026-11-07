/**
 * Rekonsiliasi keranjang (localStorage, tidak terpercaya) dengan data
 * produk terbaru dari database (terpercaya). Fungsi murni — tanpa I/O.
 *
 * Aturan:
 * - Nama & harga di hasil SELALU dari database.
 * - Produk yang dihapus → konflik "missing"; habis → konflik "sold-out".
 * - Harga berbeda → dicatat di `priceChanges` (pembeli wajib melihat dulu).
 * - Jumlah dipaksa ke bilangan bulat 1–99.
 */

import { CART_QTY_MAX, CART_QTY_MIN } from "./constants";
import type { ProductSnapshot } from "./repos/product-repo";
import type { CartItem, CheckoutPreparation } from "./types";

export function clampQuantity(value: unknown): number {
  const n = typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : CART_QTY_MIN;
  return Math.min(CART_QTY_MAX, Math.max(CART_QTY_MIN, n));
}

export function prepareCheckout(
  items: CartItem[],
  products: Map<string, ProductSnapshot>,
): CheckoutPreparation {
  const prep: CheckoutPreparation = {
    safe: [],
    conflicts: [],
    priceChanges: [],
    safeTotal: 0,
  };

  for (const item of items) {
    const product = products.get(item.productId);
    if (!product) {
      prep.conflicts.push({ item, reason: "missing" });
      continue;
    }
    if (!product.available) {
      prep.conflicts.push({ item, reason: "sold-out" });
      continue;
    }
    const verified: CartItem = {
      ...item,
      name: product.name,
      unitPrice: product.price,
      quantity: clampQuantity(item.quantity),
    };
    if (item.unitPrice !== product.price) {
      prep.priceChanges.push({
        item: verified,
        oldPrice: item.unitPrice,
        newPrice: product.price,
      });
    }
    prep.safe.push(verified);
    prep.safeTotal += verified.unitPrice * verified.quantity;
  }

  return prep;
}

/** Ada yang harus dikonfirmasi pembeli sebelum pesan disusun? */
export function needsReview(prep: CheckoutPreparation): boolean {
  return prep.conflicts.length > 0 || prep.priceChanges.length > 0;
}
