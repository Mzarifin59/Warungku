"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  size = "md",
  label,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
  label?: string;
}) {
  const sizeClasses =
    size === "sm" ? "h-9 min-w-9 text-sm" : "h-11 min-w-11 text-base";

  const decrement = () => {
    if (value > min) onChange(value - 1);
  };
  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div
      className={cn("inline-flex items-center gap-0 rounded-md border border-border", size === "md" ? "text-base" : "text-sm")}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className={cn(
          "grid shrink-0 place-items-center rounded-l-md bg-surface text-text transition hover:bg-surface-muted disabled:opacity-40",
          sizeClasses,
        )}
        aria-label="Kurangi jumlah"
      >
        −
      </button>
      <span
        className={cn(
          "grid min-w-8 place-items-center rounded-sm border-x border-border bg-surface-muted text-center font-medium tabular-nums",
          sizeClasses,
        )}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className={cn(
          "grid shrink-0 place-items-center rounded-r-md bg-surface text-text transition hover:bg-surface-muted disabled:opacity-40",
          sizeClasses,
        )}
        aria-label="Tambah jumlah"
      >
        +
      </button>
    </div>
  );
}
