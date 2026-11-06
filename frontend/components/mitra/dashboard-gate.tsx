"use client";

import Link from "next/link";
import { Store as StoreIcon } from "lucide-react";
import { Banner } from "@/components/ui/banner";
import { EmptyState } from "@/components/ui/empty-state";
import { CardSkeleton, ProductRowSkeleton } from "@/components/ui/skeleton";
import { useDashboardStore } from "@/lib/dashboard-provider";
import type { Store } from "@/lib/types";

/**
 * Menangani state loading / error / belum punya toko secara seragam untuk
 * halaman dashboard yang butuh toko. `children` hanya dirender bila toko ada.
 */
export function DashboardGate({
  children,
  skeleton = "cards",
}: {
  children: (store: Store) => React.ReactNode;
  skeleton?: "cards" | "rows";
}) {
  const { status, store, error, refresh } = useDashboardStore();

  if (status === "loading") {
    return (
      <div className="space-y-3" role="status" aria-label="Memuat data warung">
        {skeleton === "rows" ? (
          Array.from({ length: 5 }, (_, i) => <ProductRowSkeleton key={i} />)
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (status === "error") {
    return (
      <Banner
        tone="danger"
        title="Data warung gagal dimuat"
        description={error ?? undefined}
        onRetry={() => void refresh()}
      />
    );
  }

  if (!store) {
    return (
      <EmptyState
        icon={<StoreIcon size={22} />}
        title="Kamu belum punya warung"
        description="Buat warung dulu supaya bisa menambahkan produk."
        action={
          <Link
            href="/mitra/toko"
            className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
          >
            Buat Warung
          </Link>
        }
      />
    );
  }

  return <>{children(store)}</>;
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-xl font-bold tracking-[-0.5px] text-[#233e62] sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-xs text-[#8794a5] sm:text-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
