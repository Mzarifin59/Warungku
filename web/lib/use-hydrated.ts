"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `false` saat SSR **dan** saat komponen ini sedang di-hydrate, lalu `true`.
 *
 * Pakai untuk data yang hanya ada di browser (session dari cookie,
 * localStorage) agar render pertama di client sama dengan HTML server —
 * mencegah "Hydration failed". `useSyncExternalStore` memakai
 * `getServerSnapshot` selama hydration, lalu otomatis render ulang.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
