"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { searchPlaceholder } from "@/lib/content/site";
import { cn } from "@/lib/utils";

/**
 * Form pencarian global → `/cari?q=...`.
 * `variant="header"`: ringkas + pintasan keyboard Ctrl/⌘ K.
 * `variant="hero"`: besar dengan tombol "Cari".
 */
export function SearchForm({
  defaultValue = "",
  variant = "header",
  className,
  autoFocus,
}: {
  defaultValue?: string;
  variant?: "header" | "hero";
  className?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState(defaultValue);
  const inputId = React.useId();

  // Sinkron saat query di URL berubah (mis. klik saran pencarian).
  const [synced, setSynced] = React.useState(defaultValue);
  if (synced !== defaultValue) {
    setSynced(defaultValue);
    setValue(defaultValue);
  }

  React.useEffect(() => {
    if (variant !== "header") return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [variant]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const q = value.trim();
    router.push(q ? `/cari?q=${encodeURIComponent(q)}` : "/cari");
    inputRef.current?.blur();
  }

  const isHero = variant === "hero";

  return (
    <form
      role="search"
      action="/cari"
      onSubmit={submit}
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-full border bg-white text-[#6882a8] transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-primary/10",
        isHero
          ? "h-14 border-[#d9eaff] pr-1.5 pl-5 shadow-lg shadow-blue-900/5"
          : "h-10 border-[#e4edf7] bg-[#f5f9ff] px-3",
        className,
      )}
    >
      <label htmlFor={inputId} className="sr-only">
        {searchPlaceholder}
      </label>
      <Icon name="search" size={isHero ? 19 : 15} className="shrink-0" />
      <input
        ref={inputRef}
        id={inputId}
        name="q"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={searchPlaceholder}
        autoComplete="off"
        enterKeyHint="search"
        maxLength={60}
        autoFocus={autoFocus}
        className={cn(
          "w-full min-w-0 bg-transparent text-foreground outline-none placeholder:text-[#8496b0]",
          isHero ? "text-base" : "text-sm",
        )}
      />
      {isHero ? (
        <button
          type="submit"
          className="h-11 shrink-0 rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          Cari
        </button>
      ) : (
        <kbd className="hidden shrink-0 rounded border border-[#dbe5f1] bg-white px-1.5 py-0.5 font-sans text-[10px] text-slate-400 md:inline">
          Ctrl K
        </kbd>
      )}
    </form>
  );
}
