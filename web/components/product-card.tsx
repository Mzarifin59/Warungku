"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { addToStoredCart } from "@/lib/cart-store";
import { logoColor, logoInitials, type ProductDisplay } from "@/lib/store-display";
import { cn, formatRupiah } from "@/lib/utils";

/**
 * Kartu produk lintas warung. Klik kartu → halaman warung; tombol "+"
 * menambahkan ke keranjang warung tsb lalu membuka halamannya.
 */
export function ProductCard({ product }: { product: ProductDisplay }) {
  const router = useRouter();
  const href = `/warung/${product.store.slug}`;

  function quickAdd() {
    addToStoredCart(product.store.slug, {
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      image: product.image,
    });
    router.push(href);
  }

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#d9eaff] bg-white p-1.5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/10">
      <div className="relative aspect-[1.15] overflow-hidden rounded-xl bg-[#e7edf4]">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL dinamis (Storage / eksternal)
          <img
            src={product.image}
            alt=""
            loading="lazy"
            className="size-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="grid size-full place-items-center text-[#a8bcce]">
            <Icon name="bag" size={28} />
          </span>
        )}
        {!product.available && (
          <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white">
            Habis
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-1 pt-2 pb-1">
        <h3 className="line-clamp-2 min-h-[2lh] text-xs font-semibold leading-snug text-[#2c4669] sm:text-sm">
          {/* Stretched link: seluruh kartu bisa diklik */}
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {product.name}
          </Link>
        </h3>
        <span className="mt-1 text-sm font-bold text-[#263f63]">
          {formatRupiah(product.price)}
        </span>
        <div className="mt-auto flex items-center gap-1.5 pt-2 text-[10px] text-[#8292aa] sm:text-[11px]">
          <span
            className="grid size-6 shrink-0 place-items-center overflow-hidden rounded-full text-[8px] font-bold text-white"
            style={{ backgroundColor: product.store.logo ? undefined : logoColor(product.store.name) }}
            aria-hidden="true"
          >
            {product.store.logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- URL dinamis
              <img src={product.store.logo} alt="" className="size-full object-cover" />
            ) : (
              logoInitials(product.store.name)
            )}
          </span>
          <span className="min-w-0 truncate">{product.store.name}</span>
          <button
            type="button"
            onClick={quickAdd}
            disabled={!product.available}
            aria-label={`Tambah ${product.name} ke keranjang ${product.store.name}`}
            className={cn(
              "relative z-10 ml-auto grid size-8 shrink-0 place-items-center rounded-full text-white shadow-sm transition",
              product.available
                ? "bg-primary shadow-blue-900/20 hover:scale-105 hover:bg-blue-600"
                : "cursor-not-allowed bg-[#c3cfdd]",
            )}
          >
            <Icon name="plus" size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
