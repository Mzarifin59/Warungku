"use client";

import * as React from "react";
import {
  ToasterProvider,
  TOAST_DURATION_MS,
  nextToastId,
  type ToastMessage,
} from "@/components/ui/toast";
import { fetchOwnedStore } from "./supabase/mutations";
import { byCategoryOrder, byProductOrder } from "./supabase/mappers";
import { useSession } from "./session-store";
import type { Store } from "./types";

type Status = "loading" | "ready" | "no-store" | "error";

type ToastInput = Omit<ToastMessage, "id" | "variant"> & {
  variant?: ToastMessage["variant"];
};

interface DashboardContextValue {
  status: Status;
  store: Store | null;
  error: string | null;
  /** Muat ulang data toko dari server. */
  refresh: () => Promise<void>;
  /**
   * Ubah data toko secara lokal (optimistic update). Produk & kategori
   * otomatis diurutkan ulang.
   */
  patchStore: (updater: (store: Store) => Store) => void;
  toast: (input: ToastInput) => void;
}

const DashboardContext = React.createContext<DashboardContextValue | null>(null);

/**
 * Data toko milik user yang login (client-side). Di-mount di layout
 * `/mitra`; semua halaman dashboard memakai `useDashboardStore()`.
 */
export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { session, initializing } = useSession();
  const [status, setStatus] = React.useState<Status>("loading");
  const [store, setStore] = React.useState<Store | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const userId = session?.user.id;

  const load = React.useCallback(async (id: string) => {
    const result = await fetchOwnedStore(id);
    if (!result.ok) {
      setError(result.message);
      setStatus("error");
      return;
    }
    setError(null);
    setStore(result.data);
    setStatus(result.data ? "ready" : "no-store");
  }, []);

  React.useEffect(() => {
    // Tanpa user: proxy sudah mengarahkan ke /login; status diturunkan di bawah.
    if (initializing || !userId) return;
    let cancelled = false;
    fetchOwnedStore(userId).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setError(result.message);
        setStatus("error");
        return;
      }
      setError(null);
      setStore(result.data);
      setStatus(result.data ? "ready" : "no-store");
    });
    return () => {
      cancelled = true;
    };
  }, [userId, initializing]);

  const refresh = React.useCallback(async () => {
    if (userId) await load(userId);
  }, [userId, load]);

  const patchStore = React.useCallback(
    (updater: (store: Store) => Store) => {
      setStore((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        return {
          ...next,
          categories: [...next.categories].sort(byCategoryOrder),
          products: [...next.products].sort(byProductOrder),
        };
      });
    },
    [],
  );

  const dismissToast = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (input: ToastInput) => {
      const id = nextToastId();
      setToasts((prev) => [
        ...prev.slice(-2),
        { variant: "success", ...input, id },
      ]);
      window.setTimeout(() => dismissToast(id), TOAST_DURATION_MS);
    },
    [dismissToast],
  );

  const value = React.useMemo<DashboardContextValue>(
    () => ({
      status: initializing ? "loading" : userId ? status : "no-store",
      store: userId ? store : null,
      error,
      refresh,
      patchStore,
      toast,
    }),
    [initializing, userId, status, store, error, refresh, patchStore, toast],
  );

  return (
    <DashboardContext.Provider value={value}>
      <ToasterProvider toasts={toasts} onDismiss={dismissToast}>
        {children}
      </ToasterProvider>
    </DashboardContext.Provider>
  );
}

export function useDashboardStore(): DashboardContextValue {
  const ctx = React.useContext(DashboardContext);
  if (!ctx) {
    throw new Error(
      "useDashboardStore harus dipakai di dalam <DashboardProvider>.",
    );
  }
  return ctx;
}
