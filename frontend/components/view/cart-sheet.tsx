"use client";

import * as React from "react";
import { MessageCircle, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart } from "@/lib/cart-store";
import { formatRupiah } from "@/lib/utils";
import { CART_QTY_MAX } from "@/lib/constants";

export function CartSheet({
  open,
  onClose,
  onCheckout,
}: {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}) {
  const cart = useCart();

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Keranjang"
      footer={
        cart.items.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Estimasi total</span>
              <span className="text-base font-bold text-text">
                {formatRupiah(cart.total)}
              </span>
            </div>
            <Button
              variant="whatsapp"
              size="lg"
              className="w-full"
              onClick={onCheckout}
            >
              <MessageCircle size={18} /> Lanjut pesan
            </Button>
            <button
              type="button"
              onClick={cart.clear}
              className="mx-auto block text-xs text-text-muted underline underline-offset-2"
            >
              Kosongkan keranjang
            </button>
          </div>
        ) : undefined
      }
    >
      {cart.items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={22} />}
          title="Keranjangmu masih kosong"
          description="Yuk pilih produk yang kamu suka."
          action={
            <Button variant="secondary" size="sm" onClick={onClose}>
              Lihat produk
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {cart.items.map((item) => (
            <li key={item.productId} className="flex gap-3">
              <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-sm font-bold text-text-subtle">
                    {item.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">
                  {item.name}
                </p>
                <p className="text-xs text-text-muted">
                  {formatRupiah(item.unitPrice)}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <QuantityStepper
                    size="sm"
                    value={item.quantity}
                    min={1}
                    max={CART_QTY_MAX}
                    onChange={(next) =>
                      next === 0
                        ? cart.remove(item.productId)
                        : cart.setQuantity(item.productId, next)
                    }
                    label={`Jumlah ${item.name}`}
                  />
                  <span className="text-sm font-semibold text-text tabular-nums">
                    {formatRupiah(item.unitPrice * item.quantity)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => cart.remove(item.productId)}
                className="grid size-8 shrink-0 place-items-center self-start rounded-md text-text-subtle hover:bg-surface-muted hover:text-danger"
                aria-label={`Hapus ${item.name} dari keranjang`}
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}
