import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card — latar surface, border, radius lg, padding 16 (docs 02 §7).
 * Bisa menjadi link (kartu yang bisa diklik: hover shadow-sm + border
 * strong, focus-visible ring).
 */
export function Card({
  as: As = "div",
  interactive = false,
  className,
  ...rest
}: {
  as?: React.ElementType;
  interactive?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const Component = As;
  return (
    <Component
      className={cn(
        "rounded-xl border border-border bg-surface p-4",
        interactive &&
          "transition hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-between gap-3", className)} {...rest} />;
}

export function CardTitle({
  className,
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-sm font-semibold text-text", className)} {...rest} />;
}

export function CardBody({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-3 space-y-2", className)} {...rest} />;
}
