"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "./session-store";
import type { Category, Product, Store } from "./types";

type Status = "loading" | "ready" | "no-store";

interface DashboardContextValue {
  status: Status;
  store: Store | null;
  /** Panggil ulang untuk refresh data (mis. setelah simpan form). */
  refresh: () => Promise<void>;
}

const DashboardContext = React.createContext<DashboardContextValue | null>(null);

function mapCategory(row: { id: string; name: string; sort_order: number }): Category {
  return { id: row.id, name: row.name, sortOrder: row.sort_order };
}

function mapProduct(row: {
  id: string;
  store_id: string;
  name: string;
  price: number;
  category_id: string | null;
  description: string | null;
  image_url: string | null;
  available: boolean;
  sort_order: number;
}): Product {
  return {
    id: row.id,
    storeId: row.store_id,
    name: row.name,
    price: row.price,
    categoryId: row.category_id,
    description: row.description ?? undefined,
    image: row.image_url ?? "",
    available: row.available,
    sortOrder: row.sort_order,
  };
}

async function fetchOwnedStore(ownerUserId: string): Promise<Store | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("stores")
    .select(
      "id, owner_id, name, slug, description, whatsapp_number, logo_url, image_banner, operation_hours, status",
    )
    .eq("owner_id", ownerUserId)
    .limit(1);
  if (!data?.length) return null;

  const row = data[0];
  const [cats, prods] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, sort_order")
      .eq("store_id", row.id)
      .order("sort_order"),
    supabase
      .from("products")
      .select(
        "id, store_id, name, price, category_id, description, image_url, available, sort_order",
      )
      .eq("store_id", row.id)
      .order("sort_order"),
  ]);

  return {
    id: row.id,
    ownerName: "",
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    whatsappNumber: row.whatsapp_number,
    logo: row.logo_url ?? undefined,
    imageBanner: row.image_banner ?? undefined,
    operationHours: row.operation_hours ?? undefined,
    status: row.status,
    categories: (cats.data ?? []).map(mapCategory),
    products: (prods.data ?? []).map(mapProduct),
  };
}

/**
 * Ambil toko milik user dari Supabase (client-side). Di-mount di layout
 * /mitra; dashboard & produk memakai `useDashboardStore()`.
 */
export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { session, initializing } = useSession();
  const [status, setStatus] = React.useState<Status>("loading");
  const [store, setStore] = React.useState<Store | null>(null);

  const userId = session?.user?.id;

  // Initial load (and reload when userId / initializing changes).
  React.useEffect(() => {
    if (initializing) return;
    let cancelled = false;

    (async () => {
      if (!userId) {
        if (!cancelled) setStatus("no-store");
        return;
      }
      const s = await fetchOwnedStore(userId);
      if (cancelled) return;
      setStore(s);
      setStatus(s ? "ready" : "no-store");
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, initializing]);

  const refresh = React.useCallback(async () => {
    if (!userId) return;
    const s = await fetchOwnedStore(userId);
    setStore(s);
    setStatus(s ? "ready" : "no-store");
  }, [userId]);

  const value = React.useMemo(
    () => ({
      status: initializing ? "loading" : status,
      store,
      refresh,
    }),
    [status, store, initializing, refresh],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardStore(): DashboardContextValue {
  const ctx = React.useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboardStore harus dipakai di dalam <DashboardProvider>.");
  }
  return ctx;
}
