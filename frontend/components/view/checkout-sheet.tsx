"use client";

import * as React from "react";
import { Copy, MessageCircle, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Sheet } from "@/components/ui/sheet";
import { Field, Input, Textarea } from "@/components/ui/input";
import { checkAvailability } from "@/lib/repos/product-repo";
import {
  buildWaLink,
  buildWhatsAppMessage,
  type OrderDetails,
} from "@/lib/whatsapp-message";
import { useCart } from "@/lib/cart-store";
import { formatRupiah } from "@/lib/utils";
import type { CheckoutPreparation, Store } from "@/lib/types";

type Phase = "idle" | "preparing" | "sent";

export function CheckoutSheet({
  open,
  store,
  onClose,
  onBackToCart,
}: {
  open: boolean;
  store: Store;
  onClose: () => void;
  onBackToCart: () => void;
}) {
  const cart = useCart();
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [generalError, setGeneralError] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<{
    name?: string;
    note?: string;
  }>({});

  const [form, setForm] = React.useState<OrderDetails>({
    customerName: "",
    note: "",
  });

  const [conflict, setConflict] = React.useState<CheckoutPreparation | null>(
    null,
  );
  const [message, setMessage] = React.useState("");

  async function handleContinue() {
    const name = form.customerName.trim();
    if (name.length < 2 || name.length > 60) {
      setFieldErrors({
        name: "Nama minimal 2 karakter, maksimal 60.",
      });
      return;
    }
    setFieldErrors({});
    setGeneralError("");
    setPhase("preparing");

    try {
      const availability = await checkAvailability(
        store.id,
        cart.items.map((i) => ({ productId: i.productId })),
      );

      const safe = cart.items.filter((i) => availability.get(i.productId));
      const conflicts = cart.items
        .filter((i) => !availability.get(i.productId))
        .map((i) => ({
          item: i,
          reason: (
            store.products.some(
              (p) => p.id === i.productId && !p.available,
            )
              ? "sold-out"
              : "missing"
          ) as "sold-out" | "missing",
        }));

      if (conflicts.length > 0) {
        const safeTotal = safe.reduce(
          (sum, i) => sum + i.unitPrice * i.quantity,
          0,
        );
        setConflict({ safe, conflicts, safeTotal });
        setPhase("idle");
        return;
      }

      const msg = buildWhatsAppMessage(store, safe, form);
      setMessage(msg);
      window.open(buildWaLink(store.whatsappNumber, msg), "_blank", "noopener");
      setPhase("sent");
    } catch {
      setGeneralError("Pesan tidak bisa disiapkan. Silakan coba lagi.");
      setPhase("idle");
    }
  }

  async function handleResolve() {
    if (!conflict) return;
    for (const { item } of conflict.conflicts) {
      cart.setQuantity(item.productId, 0);
    }
    setConflict(null);
    setPhase("idle");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      /* clipboard tak tersedia — abaikan */
    }
  }

  const showPostPanel = phase === "sent";

  return (
    <Sheet open={open} onClose={onClose} title="Pesanmu">
      {showPostPanel ? (
        <div className="space-y-4 py-2">
          <div className="rounded-lg border border-success-subtle bg-success-subtle p-4 text-center">
            <MessageCircle size={24} className="mx-auto text-success" />
            <p className="mt-2 text-sm font-medium text-success">
              Pesanmu siap dikirim
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Tekan Kirim di WhatsApp untuk menyelesaikan pesanan. Total akhir
              dikonfirmasi oleh penjual.
            </p>
          </div>
          <Button variant="secondary" className="w-full" onClick={handleCopy}>
            <Copy size={16} /> Salin pesan
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              cart.clear();
              onClose();
            }}
          >
            Kembali ke katalog
          </Button>
        </div>
      ) : (
        <div className="space-y-5 py-2">
          {/* Ringkasan pesanan */}
          <div>
            <h3 className="text-sm font-semibold text-text">Ringkasan</h3>
            <ul className="mt-2 space-y-1.5">
              {cart.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex justify-between gap-2 text-sm text-text-muted"
                >
                  <span className="truncate">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="tabular-nums">
                    {formatRupiah(item.unitPrice * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm">
              <span className="text-text-muted">Estimasi total</span>
              <span className="font-bold text-text">
                {formatRupiah(cart.total)}
              </span>
            </div>
          </div>

          {/* Form detail */}
          <div className="space-y-4">
            <Field
              label="Nama kamu"
              htmlFor="checkout-name"
              required
              error={fieldErrors.name}
            >
              <Input
                id="checkout-name"
                value={form.customerName}
                onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                placeholder="Nama untuk pesananmu"
                autoComplete="name"
                error={Boolean(fieldErrors.name)}
              />
            </Field>
            <Field
              label="Catatan untuk penjual"
              htmlFor="checkout-note"
              optional
              error={fieldErrors.note}
            >
              <Textarea
                id="checkout-note"
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                placeholder="Opsional, mis. tanpa pedas"
                maxLength={200}
                error={Boolean(fieldErrors.note)}
              />
            </Field>
          </div>

          {/* Kotak kejujuran */}
          <div className="flex items-start gap-2 rounded-lg border border-info-subtle bg-info-subtle p-3 text-xs text-info">
            <TriangleAlert size={16} className="shrink-0" />
            <p>
              Pesanan resmi terkirim setelah kamu menekan Kirim di WhatsApp.
              Total &amp; ketersediaan dikonfirmasi langsung oleh penjual.
            </p>
          </div>

          {generalError && (
            <div
              className="rounded-lg border border-danger-subtle bg-danger-subtle px-3 py-2 text-xs text-danger"
              role="alert"
            >
              {generalError}
            </div>
          )}

          {/* Aksi */}
          <div className="space-y-2">
            <Button
              variant="whatsapp"
              size="lg"
              className="w-full"
              onClick={handleContinue}
              loading={phase === "preparing"}
              loadingLabel="Menyiapkan pesan…"
            >
              <MessageCircle size={18} /> Lanjut ke WhatsApp
            </Button>
            <button
              type="button"
              onClick={onBackToCart}
              className="mx-auto block text-xs text-text-muted underline underline-offset-2"
            >
              Kembali ke keranjang
            </button>
          </div>
        </div>
      )}

      {/* Konflik item (P05) */}
      <Dialog
        open={Boolean(conflict)}
        onClose={() => setConflict(null)}
        title="Beberapa item tidak tersedia"
        confirmLabel="Hapus & lanjutkan"
        cancelLabel="Kembali ke keranjang"
        onConfirm={handleResolve}
      >
        {conflict && (
          <div className="space-y-3">
            <p>
              Item berikut sudah <strong>habis / tidak dijual</strong>:
            </p>
            <ul className="space-y-1">
              {conflict.conflicts.map(({ item, reason }) => (
                <li key={item.productId} className="text-sm">
                  • {item.name}{" "}
                  <span className="text-text-subtle">
                    ({reason === "sold-out" ? "Habis" : "Sudah tidak dijual"})
                  </span>
                </li>
              ))}
            </ul>
            {conflict.safe.length > 0 && (
              <div className="rounded-lg bg-surface-muted p-3 text-xs">
                <p className="text-text-muted">
                  Estimasi total item yang tersisa:
                </p>
                <p className="text-sm font-semibold text-text">
                  {formatRupiah(conflict.safeTotal)}
                </p>
              </div>
            )}
            {conflict.safe.length === 0 && (
              <p className="text-sm text-text-muted">
                Semua item di keranjangmu tidak tersedia.
              </p>
            )}
          </div>
        )}
      </Dialog>
    </Sheet>
  );
}
