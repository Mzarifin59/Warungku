"use client";

import * as React from "react";
import { Button } from "./button";

/**
 * Dialog sederhana — hand-rolled, tanpa Radix.
 * Untuk konfirmasi destruktif: tombol Cancel harus dapat fokus awal.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  confirmLabel,
  cancelLabel = "Batal",
  onConfirm,
  confirmVariant = "primary",
  confirmLoading = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  confirmVariant?: "primary" | "destructive" | "secondary";
  confirmLoading?: boolean;
}) {
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const cancelBtn = cancelRef.current;
    cancelBtn?.focus();
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/40"
        onClick={onClose}
        aria-label="Tutup dialog"
      />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-surface p-5 shadow-lg sm:p-6">
        <h2 className="text-base font-semibold text-text sm:text-lg">{title}</h2>
        <div className="mt-3 text-sm text-text-muted">{children}</div>
        {confirmLabel && (
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              ref={(node) => {
                cancelRef.current = node;
              }}
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-md border border-border-strong bg-surface px-4 text-sm font-medium text-text transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {cancelLabel}
            </button>
            <Button
              variant={confirmVariant}
              size="md"
              loading={confirmLoading}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
