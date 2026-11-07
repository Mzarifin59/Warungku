import { cn } from "@/lib/utils";

/**
 * Skeleton loading — bentuk menyerupai elemen akhir.
 * Tidak ada spinner layar penuh. Animasi pulse halus, dinonaktifkan saat
 * prefers-reduced-motion.
 */
export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-surface-muted",
        "motion-reduce:animate-none",
        className,
      )}
      aria-hidden="true"
    />
  );
}

/** Skeleton kartu produk 1:1 (grid P01). */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-2 p-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}

/** Skeleton baris daftar produk (D03). */
export function ProductRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
      <Skeleton className="size-14 shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-9 w-24" />
    </div>
  );
}

/** Skeleton kartu ringkasan (D01). */
export function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface p-4">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}
