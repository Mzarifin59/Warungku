/**
 * Utility helpers — class name joiner (mini cn) + format helper.
 *
 * Tanpa dependensi eksternal (clsx/tailwind-merge tidak ada di Fase 1).
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Format integer Rupiah untuk display (tanpa desimal). */
export function formatRupiah(value: number): string {
  return "Rp " + (Number.isFinite(value) ? Math.round(value) : 0).toLocaleString("id-ID");
}
