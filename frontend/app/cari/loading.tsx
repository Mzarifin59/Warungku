import { ProductCardSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8" aria-busy="true">
      <div className="mb-6 h-8 w-64 animate-pulse rounded-md bg-surface-muted motion-reduce:animate-none" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
