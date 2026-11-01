"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const baseClasses =
  "h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-base text-text placeholder:text-text-subtle outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50";

export function Input({
  className,
  error = false,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
}) {
  return (
    <input
      className={cn(
        baseClasses,
        error && "border-danger focus:border-danger focus:ring-danger/15",
        className,
      )}
      {...rest}
    />
  );
}

export function Textarea({
  className,
  error = false,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
}) {
  return (
    <textarea
      className={cn(
        baseClasses,
        "h-auto min-h-28 py-2",
        error && "border-danger focus:border-danger focus:ring-danger/15",
        className,
      )}
      {...rest}
    />
  );
}

export function Field({
  label,
  required,
  optional,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text" htmlFor={htmlFor}>
        {label}{" "}
        {required && <span className="text-danger">(wajib)</span>}
        {optional && <span className="text-text-subtle">(opsional)</span>}
      </label>
      {hint && <p className="text-xs text-text-muted">{hint}</p>}
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-danger" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
