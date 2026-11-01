"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info" | "neutral";

interface ToastMessage {
  id: number;
  text: string;
  variant: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
}

const TOAST_DURATION_MS = 4000;

const variantStyles: Record<ToastVariant, string> = {
  success: "border-success-subtle bg-success-subtle text-success",
  error: "border-danger-subtle bg-danger-subtle text-danger",
  info: "border-info-subtle bg-info-subtle text-info",
  neutral: "border-border bg-surface text-text",
};

let toastId = 0;

export function ToasterProvider({
  children,
  toasts,
  onDismiss,
}: {
  children: React.ReactNode;
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  return (
    <>
      {children}
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 z-[60] flex flex-col items-center gap-2",
          "bottom-4 md:top-4 md:bottom-auto md:right-4 md:left-auto md:items-end",
        )}
        role="region"
        aria-live="polite"
        aria-label="Notifikasi"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg border px-4 py-3 shadow-lg",
              "motion-safe:animate-[toast-in_.15s_ease-out]",
              variantStyles[toast.variant],
            )}
          >
            <p className="text-sm font-medium">{toast.text}</p>
            {toast.actionLabel && toast.onAction && (
              <button
                type="button"
                onClick={() => {
                  toast.onAction?.();
                  onDismiss(toast.id);
                }}
                className="text-sm font-semibold underline underline-offset-2"
              >
                {toast.actionLabel}
              </button>
            )}
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="grid size-6 shrink-0 place-items-center rounded-full opacity-70 transition hover:opacity-100"
              aria-label="Tutup notifikasi"
            >
              <svg className="size-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

export { TOAST_DURATION_MS };
export type { ToastMessage };
export function nextToastId() {
  return ++toastId;
}
