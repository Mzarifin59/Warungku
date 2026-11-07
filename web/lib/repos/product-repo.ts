/**
 * Product repository (client) — dipakai checkout.
 *
 * Isi keranjang (nama & harga) disimpan di localStorage sehingga bisa basi
 * atau diubah lewat DevTools. Sebelum pesan WhatsApp disusun, data produk &
 * nomor WA warung SELALU diambil ulang dari database lewat fungsi ini.
 */

import { createClient } from "@/lib/supabase/client";

export type ProductSnapshot = {
  name: string;
  price: number;
  available: boolean;
};

export type CheckoutSnapshot = {
  /** Nomor WA warung terbaru dari DB (bentuk `62...`). */
  whatsappNumber: string;
  /** Produk yang masih ada di DB; id yang tidak ada = sudah dihapus. */
  products: Map<string, ProductSnapshot>;
};

export class StoreUnavailableError extends Error {
  constructor() {
    super("Warung ini sedang tidak menerima pesanan.");
  }
}

/**
 * Ambil data terbaru untuk checkout. Melempar `StoreUnavailableError` bila
 * warung sudah tidak terbit, atau `Error` biasa bila query gagal (offline).
 */
export async function getCheckoutSnapshot(
  storeId: string,
  productIds: string[],
): Promise<CheckoutSnapshot> {
  const supabase = createClient();
  const [storeRes, productRes] = await Promise.all([
    supabase
      .from("stores")
      .select("whatsapp_number, status")
      .eq("id", storeId)
      .maybeSingle(),
    productIds.length === 0
      ? Promise.resolve({ data: [], error: null })
      : supabase
          .from("products")
          .select("id, name, price, available")
          .eq("store_id", storeId)
          .in("id", productIds),
  ]);

  if (storeRes.error) throw new Error(storeRes.error.message);
  if (productRes.error) throw new Error(productRes.error.message);
  if (!storeRes.data || storeRes.data.status !== "published") {
    throw new StoreUnavailableError();
  }

  return {
    whatsappNumber: storeRes.data.whatsapp_number,
    products: new Map(
      (productRes.data ?? []).map((p) => [
        p.id,
        { name: p.name, price: p.price, available: p.available },
      ]),
    ),
  };
}
