/**
 * Composer pesan WhatsApp.
 *
 * Aturan kejujuran: total selalu "Estimasi", pesan tidak
 * boleh mengklaim pesanan "berhasil/diterima".
 *
 * Keamanan:
 * - `items` HARUS hasil `prepareCheckout` (nama & harga dari database),
 *   bukan isi keranjang mentah dari localStorage.
 * - Teks bebas (nama pembeli, catatan, nama produk) dibersihkan menjadi
 *   satu baris, sehingga tidak bisa menyisipkan baris palsu seperti
 *   "Estimasi total: Rp 1".
 */

import { formatRupiah } from "./utils";
import { CART_QTY_MAX, CART_QTY_MIN } from "./constants";
import type { CartItem, Store } from "./types";

export const CUSTOMER_NAME_MAX = 60;
export const ORDER_NOTE_MAX = 200;

export interface OrderDetails {
  customerName: string;
  note?: string;
}

const CONTROL_CHARS = new RegExp("[\u0000-\u001f\u007f-\u009f\u2028\u2029]", "g");
const INVISIBLE_CHARS = new RegExp("[\u200b-\u200f\u202a-\u202e\u2060-\u2069\ufeff]", "g");

/**
 * Jadikan teks bebas aman untuk satu baris pesan: buang karakter kontrol &
 * baris baru, karakter tak terlihat (zero-width/bidi), rapikan spasi,
 * potong ke `max` karakter.
 */
export function toSingleLine(value: string | undefined, max: number): string {
  const cleaned = (value ?? "")
    .replace(CONTROL_CHARS, " ")
    .replace(INVISIBLE_CHARS, "")
    .replace(/\s+/g, " ")
    .trim();
  // Array.from: potong per karakter (aman untuk emoji / surrogate pair).
  return Array.from(cleaned).slice(0, max).join("").trim();
}

/** Susun pesan teks WhatsApp dari item yang SUDAH diverifikasi. */
export function buildWhatsAppMessage(
  store: Pick<Store, "name">,
  items: CartItem[],
  details: OrderDetails,
): string {
  const lines: string[] = [];
  lines.push(`Halo ${toSingleLine(store.name, 80)}!`);
  lines.push("Saya ingin memesan:", "");

  let total = 0;
  for (const item of items) {
    const subtotal = item.unitPrice * item.quantity;
    total += subtotal;
    lines.push(
      `• ${toSingleLine(item.name, 100)} × ${item.quantity} = ${formatRupiah(subtotal)}`,
    );
  }

  lines.push("");
  lines.push(`Estimasi total: ${formatRupiah(total)}`);
  lines.push("");
  lines.push(`Nama pembeli: ${toSingleLine(details.customerName, CUSTOMER_NAME_MAX)}`);
  const note = toSingleLine(details.note, ORDER_NOTE_MAX);
  if (note) lines.push(`Catatan pembeli: "${note}"`);
  lines.push("");
  lines.push(
    "(Dikirim lewat Warungku. Harga sesuai katalog saat pesan dibuat — mohon konfirmasi ketersediaan & total akhir.)",
  );

  return lines.join("\n");
}

/** Tautan wa.me dengan pesan terisi. Nomor dipaksa hanya digit. */
export function buildWaLink(whatsappNumber: string, message: string): string {
  const digits = whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export { CART_QTY_MIN, CART_QTY_MAX };
