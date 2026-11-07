"use client";

import * as React from "react";
import { Copy, MessageCircle, ShieldAlert, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Sheet } from "@/components/ui/sheet";
import { Field, Input, Textarea } from "@/components/ui/input";
import { needsReview, prepareCheckout } from "@/lib/checkout";
import {
  StoreUnavailableError,
  getCheckoutSnapshot,
} from "@/lib/repos/product-repo";
import {
  CUSTOMER_NAME_MAX,
  ORDER_NOTE_MAX,
  buildWaLink,
  buildWhatsAppMessage,
  toSingleLine,
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

  const [review, setReview] = React.useState<CheckoutPreparation | null>(null);
  const [message, setMessage] = React.useState("");

  async function handleContinue() {
    const name = toSingleLine(form.customerName, CUSTOMER_NAME_MAX + 1);
    if (name.length < 2 || name.length > CUSTOMER_NAME_MAX) {
      setFieldErrors({
        name: `Nama minimal 2 karakter, maksimal ${CUSTOMER_NAME_MAX}.`,
      });
      document.getElementById("checkout-name")?.focus();
      return;
    }
    setFieldErrors({});
    setGeneralError("");
    setPhase("preparing");

    try {
      // Data keranjang (localStorage) tidak dipercaya: ambil ulang nama,
      // harga, ketersediaan, dan nomor WA warung dari database.
      const snapshot = await getCheckoutSnapshot(
        store.id,
        cart.items.map((i) => i.productId),
      );
      const prep = prepareCheckout(cart.items, snapshot.products);

      if (needsReview(prep)) {
        setReview(prep);
        setPhase("idle");
        return;
      }

      const msg = buildWhatsAppMessage(store, prep.safe, form);
      setMessage(msg);
      const waLink = buildWaLink(snapshot.whatsappNumber, msg);
      // Popup bisa diblokir karena dibuka setelah request async → fallback.
      // (Tanpa flag "noopener": dengan flag itu window.open selalu null.)
      const opened = window.open(waLink, "_blank");
      if (opened) opened.opener = null;
      else window.location.href = waLink;
      setPhase("sent");
    } catch (error) {
      setGeneralError(
        error instanceof StoreUnavailableError
          ? error.message
          : "Pesan tidak bisa disiapkan. Periksa koneksi lalu coba lagi.",
      );
      setPhase("idle");
    }
  }

  /** Terapkan data terbaru ke keranjang; pembeli melihat ringkasan baru dulu. */
  function handleApplyReview() {
    if (!review) return;
    cart.syncItems(review.safe);
    const empty = review.safe.length === 0;
    setReview(null);
    if (empty) onBackToCart();
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
                maxLength={CUSTOMER_NAME_MAX}
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
                maxLength={ORDER_NOTE_MAX}
                rows={2}
                error={Boolean(fieldErrors.note)}
              />
            </Field>
          </div>

          {/* Kotak kejujuran & keamanan pembayaran */}
          <div className="space-y-2 rounded-lg border border-info-subtle bg-info-subtle p-3 text-xs text-info">
            <p className="flex items-start gap-2">
              <TriangleAlert size={16} className="shrink-0" />
              <span>
                Pesanan resmi terkirim setelah kamu menekan Kirim di WhatsApp.
                Total &amp; ketersediaan dikonfirmasi langsung oleh penjual.
              </span>
            </p>
            <p className="flex items-start gap-2 font-medium">
              <ShieldAlert size={16} className="shrink-0" />
              <span>
                Jangan transfer uang sebelum penjual mengonfirmasi pesananmu.
                Warungku tidak pernah meminta pembayaran atau kode OTP.
              </span>
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

      {/* Konflik item & perubahan harga (P05) */}
      <Dialog
        open={Boolean(review)}
        onClose={() => setReview(null)}
        title={
          review && review.conflicts.length > 0 && review.priceChanges.length > 0
            ? "Keranjangmu perlu diperbarui"
            : review && review.priceChanges.length > 0
              ? "Ada harga yang berubah"
              : "Beberapa item tidak tersedia"
        }
        confirmLabel={review?.safe.length === 0 ? "Kosongkan keranjang" : "Perbarui keranjang"}
        cancelLabel="Batal"
        onConfirm={handleApplyReview}
      >
        {review && (
          <div className="space-y-3">
            {review.conflicts.length > 0 && (
              <div>
                <p>
                  Item berikut sudah <strong>habis / tidak dijual</strong> dan akan dihapus:
                </p>
                <ul className="mt-1 space-y-1">
                  {review.conflicts.map(({ item, reason }) => (
                    <li key={item.productId} className="text-sm">
                      • {item.name || "Produk"}{" "}
                      <span className="text-text-subtle">
                        ({reason === "sold-out" ? "Habis" : "Sudah tidak dijual"})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {review.priceChanges.length > 0 && (
              <div>
                <p>Harga terbaru dari penjual:</p>
                <ul className="mt-1 space-y-1">
                  {review.priceChanges.map(({ item, oldPrice, newPrice }) => (
                    <li key={item.productId} className="flex flex-wrap justify-between gap-x-2 text-sm">
                      <span className="min-w-0 truncate">• {item.name}</span>
                      <span className="tabular-nums">
                        <s className="text-text-subtle">{formatRupiah(oldPrice)}</s>{" "}
                        <strong className="text-text">{formatRupiah(newPrice)}</strong>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {review.safe.length > 0 ? (
              <div className="rounded-lg bg-surface-muted p-3 text-xs">
                <p className="text-text-muted">Estimasi total setelah diperbarui:</p>
                <p className="text-sm font-semibold text-text">
                  {formatRupiah(review.safeTotal)}
                </p>
                <p className="mt-1 text-text-muted">
                  Periksa ringkasan lalu tekan Lanjut ke WhatsApp lagi.
                </p>
              </div>
            ) : (
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
