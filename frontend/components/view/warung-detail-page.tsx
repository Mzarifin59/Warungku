"use client";

import * as React from "react";
import { MessageCircle, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Icon, type IconName } from "@/components/icon";
import { CartSheet } from "@/components/view/cart-sheet";
import { CheckoutSheet } from "@/components/view/checkout-sheet";
import { CartProvider, useCart } from "@/lib/cart-store";
import { logoColor, logoInitials, matchesQuery } from "@/lib/store-display";
import { cn, formatRupiah } from "@/lib/utils";
import type { Product, Store } from "@/lib/types";

type Panel = "cart" | "checkout" | null;

/** Nilai filter kategori: "" = semua, "none" = tanpa kategori. */
type CategoryFilter = string;

export function WarungDetailPage({ store }: { store: Store }) {
  return (
    <CartProvider slug={store.slug}>
      <DetailPageInner store={store} />
    </CartProvider>
  );
}

function DetailPageInner({ store }: { store: Store }) {
  const cart = useCart();
  const [panel, setPanel] = React.useState<Panel>(null);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<CategoryFilter>("");

  const products = store.products;
  const units = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  const categoryTabs = React.useMemo(() => {
    const used = new Set(products.map((p) => p.categoryId));
    const tabs = store.categories
      .filter((c) => used.has(c.id))
      .map((c) => ({ id: c.id, name: c.name }));
    if (tabs.length > 0 && used.has(null)) tabs.push({ id: "none", name: "Lainnya" });
    return tabs;
  }, [products, store.categories]);

  const categoryName = React.useMemo(
    () => new Map(store.categories.map((c) => [c.id, c.name])),
    [store.categories],
  );

  const visible = products.filter(
    (p) =>
      (!category || (category === "none" ? !p.categoryId : p.categoryId === category)) &&
      matchesQuery(query, [p.name, p.description, p.categoryId ? categoryName.get(p.categoryId) : ""]),
  );

  const stats: { icon: IconName; label: string; value: string }[] = [
    { icon: "basket", label: "Produk", value: `${products.length} item` },
    ...(store.location ? [{ icon: "pin" as const, label: "Lokasi", value: store.location }] : []),
    ...(store.operationHours
      ? [{ icon: "clock" as const, label: "Jam buka", value: store.operationHours }]
      : []),
    ...(store.categories.length
      ? [{ icon: "star" as const, label: "Kategori", value: `${store.categories.length} kategori` }]
      : []),
  ];

  function openCheckout() {
    setPanel(cart.count === 0 ? "cart" : "checkout");
  }

  return (
    <main className={cn("bg-[#f3f8ff] pt-6 pb-12 sm:pt-8", units > 0 && "pb-28")}>
      {/* Header toko */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="warung-title">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-blue-900/5">
          <div className="h-32 overflow-hidden bg-gradient-to-br from-[#e8eff7] to-[#d7e6f8] sm:h-44 lg:h-56">
            {store.imageBanner && (
              // eslint-disable-next-line @next/next/no-img-element -- URL banner dinamis (Storage / eksternal)
              <img
                src={store.imageBanner}
                alt={`Sampul ${store.name}`}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="px-4 pb-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
              <span
                className="-mt-10 grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-white bg-white text-xl font-bold text-white shadow-sm sm:-mt-12 sm:size-24 sm:text-2xl"
                aria-hidden="true"
              >
                {store.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- URL logo dinamis
                  <img src={store.logo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span
                    className="grid h-full w-full place-items-center"
                    style={{ backgroundColor: logoColor(store.name) }}
                  >
                    {logoInitials(store.name)}
                  </span>
                )}
              </span>
              <div className="min-w-0 flex-1 sm:pb-1">
                <h1 className="text-lg font-bold text-[#233e62] sm:text-2xl" id="warung-title">
                  {store.name}
                </h1>
                {store.description && (
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#6f82a1]">
                    {store.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 sm:pb-1">
                <Button variant="whatsapp" size="sm" onClick={openCheckout}>
                  <MessageCircle size={15} /> Pesan
                </Button>
                <button
                  type="button"
                  onClick={() => setPanel("cart")}
                  className="relative inline-flex h-9 items-center gap-1 rounded-lg border border-primary/40 bg-secondary px-3 text-sm font-medium text-primary transition hover:bg-[#c1ddff]"
                  aria-label={`Buka keranjang, ${units} item`}
                >
                  <Icon name="bag" size={15} />
                  {units > 0 && (
                    <span className="grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                      {units}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 lg:grid-cols-4">
              {stats.map((stat) => (
                <div className="flex items-center gap-3 rounded-xl bg-[#f3f8ff] px-3 py-2.5" key={stat.label}>
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                    <Icon name={stat.icon} size={18} />
                  </span>
                  <span className="min-w-0">
                    <dt className="text-[11px] text-[#7185a0]">{stat.label}</dt>
                    <dd className="truncate text-sm font-semibold text-[#2e496c]">{stat.value}</dd>
                  </span>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Produk */}
      <section className="container mx-auto mt-8 px-4 sm:mt-10 sm:px-6 lg:px-8" aria-labelledby="products-title">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-[#2b4568] sm:text-xl" id="products-title">
            Produk{" "}
            <span className="text-xs font-semibold text-[#6f82a1]">({products.length})</span>
          </h2>
          {products.length > 0 && (
            <label className="flex h-11 w-full items-center gap-2 rounded-full border border-[#d9eaff] bg-white px-4 text-[#6882a8] focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-primary/10 sm:max-w-xs">
              <Icon name="search" size={16} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Cari di ${store.name}...`}
                aria-label={`Cari produk di ${store.name}`}
                className="w-full min-w-0 bg-transparent text-base text-foreground outline-none placeholder:text-[#8496b0] sm:text-sm"
              />
            </label>
          )}
        </div>

        {categoryTabs.length > 1 && (
          <div
            className="sticky top-[112px] z-20 -mx-4 mb-4 flex gap-2 overflow-x-auto bg-[#f3f8ff]/95 px-4 py-2 backdrop-blur [scrollbar-width:none] sm:top-16 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Filter kategori produk"
          >
            {[{ id: "", name: "Semua" }, ...categoryTabs].map((tab) => {
              const active = category === tab.id;
              return (
                <button
                  key={tab.id || "semua"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(tab.id)}
                  className={cn(
                    "inline-flex min-h-9 shrink-0 items-center rounded-full border px-3.5 text-xs font-medium transition sm:text-sm",
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-[#d9eaff] bg-white text-[#344f72] hover:border-blue-300",
                  )}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>
        )}

        {products.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#bcd6f5] bg-white/60 px-4 py-10 text-center text-sm text-[#7185a0]">
            Warung ini belum memiliki produk.
          </p>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#bcd6f5] bg-white/60 px-4 py-10 text-center">
            <p className="text-sm text-[#7185a0]">Tidak ada produk yang cocok.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("");
              }}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              Tampilkan semua produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
            {visible.map((product) => (
              <StoreProductCard
                key={product.id}
                product={product}
                quantity={cart.getItem(product.id)?.quantity ?? 0}
                onAdd={() => cart.add(product, 1)}
                onChangeQuantity={(q) => cart.setQuantity(product.id, q)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Bar keranjang melayang */}
      {units > 0 && panel === null && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#d9eaff] bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(30,64,120,0.08)] backdrop-blur">
          <div className="container mx-auto flex items-center gap-3 sm:px-2 lg:px-4">
            <button
              type="button"
              onClick={() => setPanel("cart")}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                <ShoppingBag size={18} />
                <span className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                  {units}
                </span>
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] text-[#7185a0]">Estimasi total</span>
                <strong className="block truncate text-base text-[#263f63]">
                  {formatRupiah(cart.total)}
                </strong>
              </span>
            </button>
            <Button variant="whatsapp" onClick={openCheckout} className="shrink-0">
              <MessageCircle size={16} /> Pesan via WhatsApp
            </Button>
          </div>
        </div>
      )}

      {panel === "cart" && (
        <CartSheet open onClose={() => setPanel(null)} onCheckout={openCheckout} />
      )}

      {panel === "checkout" && (
        <CheckoutSheet
          open
          store={store}
          onClose={() => setPanel(null)}
          onBackToCart={() => setPanel("cart")}
        />
      )}
    </main>
  );
}

function StoreProductCard({
  product,
  quantity,
  onAdd,
  onChangeQuantity,
}: {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onChangeQuantity: (quantity: number) => void;
}) {
  return (
    <article
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-white p-2 transition",
        quantity > 0 ? "border-primary/50 shadow-md shadow-blue-900/10" : "border-[#d9eaff]",
        product.available && "hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/10",
      )}
    >
      <div className="relative aspect-[1.15] overflow-hidden rounded-xl bg-[#e7edf4]">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL dinamis
          <img
            src={product.image}
            alt=""
            loading="lazy"
            className={cn("size-full object-cover", !product.available && "opacity-60 grayscale")}
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
        <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-[#2c4669] sm:text-sm">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[#8292aa]">
            {product.description}
          </p>
        )}
        <span className="mt-1 text-sm font-bold text-[#263f63]">{formatRupiah(product.price)}</span>
        <div className="mt-auto pt-2">
          {quantity > 0 && product.available ? (
            <QuantityStepper
              size="sm"
              min={0}
              value={quantity}
              onChange={onChangeQuantity}
              label={`Jumlah ${product.name}`}
            />
          ) : (
            <button
              type="button"
              onClick={onAdd}
              disabled={!product.available}
              className={cn(
                "flex h-9 w-full items-center justify-center gap-1 rounded-lg text-xs font-semibold transition",
                product.available
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "cursor-not-allowed bg-surface-muted text-text-subtle",
              )}
              aria-label={product.available ? `Tambah ${product.name} ke keranjang` : `${product.name} habis`}
            >
              {product.available ? (
                <>
                  <Plus size={14} /> Tambah
                </>
              ) : (
                "Habis"
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
