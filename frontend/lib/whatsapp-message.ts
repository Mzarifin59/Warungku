/**
 * Composer pesan WhatsApp — WarungKu Fase 1.
 *
 * // TODO(api): di Fase 2 pesan ini tetap dikomposisi client-side karena
 * dikirim lewat wa.me (bukan ke backend). Lihat docs 01 §6 & 05 P03.
 *
 * Aturan kejujuran (docs 01 §6): total selalu "Estimasi", pesan tidak
 * boleh mengklaim pesanan "berhasil/diterima".
 */

import { formatRupiah } from "./utils";
import { CART_QTY_MAX, CART_QTY_MIN } from "./constants";
import type { CartItem, Store } from "./types";

export interface OrderDetails {
  customerName: string;
  note?: string;
}

/** Susun pesan teks WhatsApp dari keranjang. */
export function buildWhatsAppMessage(
  store: Store,
  items: CartItem[],
  details: OrderDetails,
): string {
  const lines: string[] = [];
  lines.push(`Halo ${store.name}!`);
  lines.push(`Saya ingin memesan:`, "");

  for (const item of items) {
    lines.push(
      `• ${item.name} × ${item.quantity} = ${formatRupiah(
        item.unitPrice * item.quantity,
      )}`,
    );
  }

  const total = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  lines.push("");
  lines.push(`Estimasi total: ${formatRupiah(total)}`);
  lines.push(`Nama: ${details.customerName.trim()}`);
  if (details.note?.trim()) {
    lines.push(`Catatan: ${details.note.trim()}`);
  }
  lines.push("");
  lines.push(
    "(Mohon konfirmasi ketersediaan & total akhir. Pesanan resmi terkirim setelah saya menekan Kirim di WhatsApp.)",
  );

  return lines.join("\n");
}

/** Buka tautan wa.me dengan pesan terisi (URL-encode). */
export function buildWaLink(whatsappNumber: string, message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export { CART_QTY_MIN, CART_QTY_MAX };
