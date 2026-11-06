"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { logoColor, logoInitials, type ProductDisplay } from "@/lib/home-data";

function quickAddLocal(
  slug: string,
  item: { productId: string; name: string; unitPrice: number; image: string },
) {
  if (typeof window === "undefined") return;
  try {
    const key = "warungku.cart." + slug;
    const raw = window.localStorage.getItem(key);
    const items: {
      productId: string;
      name: string;
      unitPrice: number;
      quantity: number;
      image: string;
    }[] = raw ? JSON.parse(raw) : [];
    const existing = items.find((i) => i.productId === item.productId);
    const next = existing
      ? items.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: Math.min(i.quantity + 1, 99) }
            : i,
        )
      : [...items, { ...item, quantity: 1 }];
    window.localStorage.setItem(key, JSON.stringify(next));
  } catch {
    /* storage tak tersedia — abaikan */
  }
}

function handleProductAdd(
  product: ProductDisplay,
  router: ReturnType<typeof useRouter>,
) {
  quickAddLocal(product.slug, {
    productId: product.id,
    name: product.name,
    unitPrice: parseInt(product.price.replace(/\D/g, ""), 10) || 0,
    image: product.image,
  });
  router.push(`/warung/${product.slug}`);
}

export function ProductSection({ products }: { products: ProductDisplay[] }) {
  const router = useRouter();
  return (
    <section
      className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10"
      aria-labelledby="product-section-heading"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2
            className="text-base font-bold tracking-[-0.35px] text-[#2b4568] sm:text-xl"
            id="product-section-heading"
          >
            Produk Terlaris
          </h2>
          <p className="mt-1 text-xs text-[#8191aa] sm:text-sm">
            Pilihan produk favorit dari berbagai toko UMKM
          </p>
        </div>
        <Icon
          className="-rotate-45 pt-1"
          name="chevron"
          size={14}
          aria-hidden="true"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {products.map((product) => (
          <article
            className="min-w-0 overflow-hidden rounded-[15px] border border-[#d9eaff] bg-white p-1.5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/10"
            key={product.name}
          >
            <a
              className="block aspect-[1.2] overflow-hidden rounded-[10px] bg-[#e7edf4]"
              href="#"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt=""
                  className="size-full object-cover"
                />
              )}
            </a>
            <div className="px-px pt-2 pb-px">
              <a
                className="block truncate text-xs font-semibold text-[#2c4669] sm:text-sm"
                href="#"
              >
                {product.name}
              </a>
              <span className="mt-0.5 block truncate text-xs text-[#506681] sm:text-sm">
                {product.price}
              </span>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#8292aa] sm:text-[11px]">
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-full border border-[#f1e5d9] text-[8px] font-bold text-white"
                  style={{ backgroundColor: logoColor(product.store) }}
                  aria-hidden="true"
                >
                  {logoInitials(product.store)}
                </span>
                <span className="truncate">{product.store}</span>
                <button
                  type="button"
                  onClick={() => handleProductAdd(product, router)}
                  aria-label={`Tambah ${product.name} ke keranjang ${product.store}`}
                  className="ml-auto grid size-8 shrink-0 place-items-center rounded-full bg-primary text-white shadow-sm shadow-blue-900/20 transition hover:scale-105 hover:bg-blue-600"
                >
                  <Icon name="plus" size={15} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
