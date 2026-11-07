"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Sheet/BottomSheet — hand-rolled, tanpa dependensi Radix.
 * - Mobile (< md): bottom sheet (radius xl di atas).
 * - Desktop (≥ md): side panel kanan.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center md:items-stretch md:justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/40"
        onClick={onClose}
        aria-label="Tutup panel"
      />
      <div
        className={cn(
          "relative z-10 flex w-full flex-col overflow-hidden bg-surface shadow-lg",
          "rounded-t-xl",
          "md:ml-auto md:h-full md:w-[min(480px,100%)] md:rounded-l-xl md:rounded-tr-none md:rounded-br-none",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <h2 className="text-base font-semibold text-text">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full text-text-muted transition hover:bg-surface-muted"
            aria-label="Tutup"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5">{children}</div>
        {footer && (
          <div className="border-t border-border px-4 py-3 sm:px-5">{footer}</div>
        )}
      </div>
    </div>
  );
}
