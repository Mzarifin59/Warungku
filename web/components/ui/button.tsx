"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "whatsapp";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary/90 disabled:opacity-50",
  secondary: "border border-border-strong bg-surface text-text hover:bg-surface-muted disabled:opacity-50",
  ghost: "bg-transparent text-text hover:bg-surface-muted disabled:opacity-50",
  destructive: "bg-danger text-white hover:bg-danger/90 disabled:opacity-50",
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-hover disabled:opacity-50",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none";

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  loadingLabel,
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  loadingLabel?: string;
}) {
  const isDisabled = disabled || loading;
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <svg
          className="size-4 animate-spin text-white"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : null}
      {loading ? loadingLabel ?? "…" : children}
    </button>
  );
}
