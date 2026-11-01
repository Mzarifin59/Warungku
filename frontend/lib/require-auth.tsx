"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "./session-store";

/**
 * Auth guard — FASE 1 (mock).
 *
 * // TODO(api): ganti dengan middleware Supabase / session server-side
 * di Fase 2 (docs 03 §2 & 04 F7). Mock: redirect ke /login bila belum login.
 *
 * Wrap komponen di dalam <RequireAuth> di route yang perlu login
 * (dashboard mitra, dst.).
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  // Kunci redirect agar effect ini tidak membuat loop setiap pathname/query
  // berubah (mis. saat di /login?next=...). Cukup redirect sekali.
  const redirectLock = React.useRef(false);

  React.useEffect(() => {
    if (redirectLock.current) return;
    if (!isAuthenticated) {
      redirectLock.current = true;
      const next = encodeURIComponent(pathname);
      router.replace("/login?next=" + next);
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) {
    return (
      <div
        className="grid min-h-[60vh] place-items-center px-4"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <div
            className="mx-auto size-10 animate-spin rounded-full border-2 border-border-strong border-t-primary motion-reduce:animate-none"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm text-text-muted">
            Memeriksa sesi…
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
