/**
 * Konstanta & helper murni — WarungKu Fase 1.
 *
 * Dipakai di: validasi slug (D02), normalisasi nomor WhatsApp, format harga
 * (RP), dan aturan checkout (P03). Semua fungsi di sini pure & testable
 * (unit test tanpa DOM).
 */

/**
 * Slug terlarang — harus tetap sinkron dengan constraint database (Fase 2).
 * Lihat docs/web/03 §2.
 */
export const RESERVED_SLUGS: readonly string[] = [
  "dashboard",
  "login",
  "signup",
  "logout",
  "api",
  "admin",
  "auth",
  "static",
  "_next",
  "privacy",
];

/** Batas aturan slug (docs/web/05 D02). */
export const SLUG_MIN = 3;
export const SLUG_MAX = 40;

/**
 * Ubah input pengguna menjadi slug yang valid:
 * - huruf kecil
 * - spasi / karakter non-alphanumerik → `-`
 * - hyphen kembar diringkas
 * - potong depan/akhiran
 *
 * Contoh: "Toko Roti Ibu" -> "toko-roti-ibu".
 */
export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, "dan")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug.toLowerCase());
}

export function isSlugLengthOk(slug: string): boolean {
  return slug.length >= SLUG_MIN && slug.length <= SLUG_MAX;
}

/**
 * Normalisasi nomor WhatsApp Indonesia ke bentuk intern `62...` (string).
 * Menerima bentuk-bentuk umum: `0812...`, `+62812...`, `62812...`, `812...`.
 * Mengembalikan string dinormalisasi, atau `null` bila tak valid.
 *
 * Contoh:
 *   normalizeWhatsApp("0812 3456 7890") -> "6281234567890"
 *   normalizeWhatsApp("+62 812-3456-7890") -> "6281234567890"
 */
export function normalizeWhatsApp(raw: string): string | null {
  // Ambil semua digit, buang spasi/tanda hubung/+ dan sejenisnya.
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 9) return null;

  let body = digits;
  if (body.startsWith("0")) {
    // 08xx.. -> 628xx..
    body = "62" + body.slice(1);
  } else if (body.startsWith("62") && body.length > 10) {
    // Sudah bentuk 62.. — biarkan
  } else if (body.startsWith("8") && body.length === 10) {
    // 8xx.. (tanpa prefix) -> 628xx..
    body = "62" + body;
  } else {
    return null;
  }

  // Bentuk akhir harus diawali 628 dan panjang wajar.
  if (!body.startsWith("628")) return null;
  if (body.length < 11 || body.length > 14) return null;
  return body;
}

/**
 * Tampilkan nomor `62...` dalam format yang mudah dibaca: `+62 812 3456 7890`.
 */
export function formatWhatsApp(normalized: string | null): string {
  if (!normalized) return "—";
  const local = normalized.slice(2); // buang "62"
  // Kelompok: 3 - 4 - sisa
  const part1 = local.slice(0, 3);
  const part2 = local.slice(3, 7);
  const part3 = local.slice(7);
  return `+62 ${part1} ${part2}${part3 ? " " + part3 : ""}`.trim();
}

/** Batas harga produk: 0 – 100.000.000 (docs/web/05 D04). */
export const PRICE_MAX = 100_000_000;

/** Jumlah maksimum per item di keranjang (docs/web/05 P02: 1–99). */
export const CART_QTY_MIN = 1;
export const CART_QTY_MAX = 99;
