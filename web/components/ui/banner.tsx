import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  success: "border-success-subtle bg-success-subtle text-success",
  warning: "border-warning-subtle bg-warning-subtle text-warning",
  danger: "border-danger-subtle bg-danger-subtle text-danger",
  info: "border-info-subtle bg-info-subtle text-info",
};

const toneIcon: Record<Tone, string> = {
  success: "✓",
  warning: "⚠",
  danger: "✕",
  info: "ⓘ",
};

/**
 * Banner data / error — untuk data error (docs 05 pola lintas layar):
 * "banner danger-subtle dengan ikon, pesan singkat, tombol 'Coba lagi'".
 */
export function Banner({
  tone = "info",
  title,
  description,
  onRetry,
  className,
}: {
  tone?: Tone;
  title: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3.5",
        toneClasses[tone],
        className,
      )}
    >
      <span className="shrink-0 text-lg leading-none" aria-hidden="true">
        {toneIcon[tone]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {description && <p className="mt-0.5 text-xs opacity-80">{description}</p>}
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            "shrink-0 rounded-md border border-current px-3 py-1.5 text-xs font-semibold",
          )}
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}
