"use client";

import * as React from "react";
import { MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/icon";
import { CartSheet } from "@/components/view/cart-sheet";
import { CheckoutSheet } from "@/components/view/checkout-sheet";
import { CartProvider, useCart } from "@/lib/cart-store";
import { formatRupiah } from "@/lib/utils";
import { logoColor, logoInitials } from "@/lib/home-data";
import type { Product, Store } from "@/lib/types";

type Panel = "checkout" | null;

export function WarungDetailPage({ store }: { store: Store }) {
  return (
    <CartProvider slug={store.slug}>
      <DetailPageInner typedStore={store} />
    </CartProvider>
  );
}

function DetailPageInner({ typedStore }: { typedStore: Store }) {
  const cart = useCart();
  const [panel, setPanel] = React.useState<Panel>(null);
  const [openCart, setOpenCart] = React.useState(false);

  const storeProducts = typedStore.products;

  const stats: {
    icon: IconName;
    label: string;
    value: string;
    note?: string;
    tint: string;
  }[] = [
    {
      icon: "basket",
      label: "Produk",
      value: `${storeProducts.length} item`,
      tint: "bg-secondary text-primary",
    },
  ];

  function handleQuickAdd(product: Product) {
    cart.add(product, 1);
    setOpenCart(true);
  }

  function openCartSheet() {
    setOpenCart(true);
  }

  function openCheckout() {
    if (cart.count === 0) {
      setOpenCart(true);
      return;
    }
    setPanel("checkout");
  }

  return (
    <main className="bg-[#f3f8ff] pt-6 pb-12 sm:pt-8">
      {/* Header toko */}
      <section
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        aria-labelledby="warung-title"
      >
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-blue-900/5">
          <div
            className="h-32 bg-[#e8eff7] sm:h-40 lg:h-48"
            role="img"
            aria-label={`Sampul ${typedStore.name}`}
          />
          <div className="px-4 pb-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
              <span
                className="-mt-10 grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-white bg-[#e8eff7] text-xl font-bold text-white shadow-sm sm:-mt-12 sm:size-24 sm:text-2xl"
                aria-hidden="true"
              >
                {typedStore.logo ? (
                  <img
                    src={typedStore.logo}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span
                    className="grid h-full w-full place-items-center text-center"
                    style={{ backgroundColor: logoColor(typedStore.name) }}
                  >
                    {logoInitials(typedStore.name)}
                  </span>
                )}
              </span>
              <div className="min-w-0 flex-1 sm:pb-1">
                <h1
                  className="truncate text-lg font-bold text-[#233e62] sm:text-xl"
                  id="warung-title"
                >
                  {typedStore.name}
                </h1>
                <p className="text-sm text-[#6f82a1]">
                  {typedStore.description}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:pb-1">
                <Button
                  variant="whatsapp"
                  size="sm"
                  onClick={openCheckout}
                  className="flex"
                >
                  <MessageCircle size={15} /> Pesan
                </Button>
                <button
                  type="button"
                  onClick={openCartSheet}
                  className="relative inline-flex h-9 items-center gap-1 rounded-lg border border-primary/40 bg-secondary px-3 text-sm font-medium text-primary transition hover:bg-[#c1ddff]"
                  aria-label="Buka keranjang"
                >
                  <Icon name="bag" size={15} />
                  <span className="sr-only">Keranjang</span>
                  {cart.count > 0 && (
                    <span className="grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                      {cart.count}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  className="flex items-center gap-3 rounded-xl bg-[#f3f8ff] px-3.5 py-3"
                  key={stat.label}
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-lg ${stat.tint}`}
                  >
                    <Icon
                      className={
                        stat.icon === "star" ? "fill-current" : undefined
                      }
                      name={stat.icon}
                      size={20}
                    />
                  </span>
                  <span className="min-w-0">
                    <small className="block text-[11px] text-[#7185a0]">
                      {stat.label}
                    </small>
                    <strong className="block truncate text-sm font-semibold text-[#2e496c]">
                      {stat.value}
                      {stat.note && (
                        <span className="ml-1 text-xs font-normal text-[#7185a0]">
                          {stat.note}
                        </span>
                      )}
                    </strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid produk */}
      <section
        className="container mx-auto mt-10 px-4 sm:mt-14 sm:px-6 lg:px-8"
        aria-labelledby="products-title"
      >
        <h2
          className="mb-4 text-base font-bold text-[#2b4568] sm:text-xl"
          id="products-title"
        >
          Semua Produk{" "}
          <span className="text-xs font-semibold text-[#6f82a1]">
            ({storeProducts.length} produk)
          </span>
        </h2>
        {storeProducts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#bcd6f5] bg-white/60 px-4 py-10 text-center text-sm text-[#7185a0]">
            Warung ini belum memiliki produk.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
            {storeProducts.map((product) => (
              <div
                key={product.id}
                className="relative min-w-0 overflow-hidden rounded-2xl border border-[#d9eaff] bg-white p-2 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/10"
              >
                <div
                  className="aspect-[1.2] rounded-xl bg-[#e7edf4] bg-cover bg-center"
                  style={
                    product.image
                      ? { backgroundImage: `url("${product.image}")` }
                      : undefined
                  }
                  role="img"
                  aria-label={product.name}
                >
                  {!product.image && (
                    <div className="grid h-full w-full place-items-center">
                      <Icon name="bag" size={28} className="text-[#a8bcce]" />
                    </div>
                  )}
                </div>
                <div className="px-1 pt-2 pb-1">
                  <h3 className="truncate text-xs font-semibold text-[#2c4669] sm:text-sm">
                    {product.name}
                  </h3>
                  <span className="block truncate text-xs text-[#506681] sm:text-sm">
                    {formatRupiah(product.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(product)}
                    disabled={!product.available}
                    className={
                      "mt-2 flex h-9 w-full items-center justify-center gap-1 rounded-lg text-xs font-semibold transition " +
                      (!product.available
                        ? "cursor-not-allowed bg-surface-muted text-text-subtle"
                        : "bg-primary text-white hover:bg-primary/90")
                    }
                    aria-label={`Tambah ${product.name} ke keranjang`}
                  >
                    <Plus size={14} />
                    {!product.available ? "Habis" : "Tambah"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sheet keranjang (P02) */}
      {openCart && (
        <CartSheet
          open={openCart}
          onClose={() => setOpenCart(false)}
          onCheckout={openCheckout}
        />
      )}

      {/* Checkout + WA (P03) */}
      {panel === "checkout" && (
        <CheckoutSheet
          open
          store={typedStore}
          onClose={() => setPanel(null)}
          onBackToCart={() => {
            setPanel(null);
            setOpenCart(true);
          }}
        />
      )}
    </main>
  );
}
