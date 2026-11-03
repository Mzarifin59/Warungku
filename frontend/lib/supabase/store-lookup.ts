/**
 * Helper cari toko milik user (client-side).
 * Dipakai oleh session-store untuk mengisi `Session.storeId`.
 */

import { createClient } from "@/lib/supabase/client";

export async function fetchStoreForUser(
  userId: string,
): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", userId)
    .limit(1);
  if (error) return null;
  return data?.[0]?.id ?? null;
}
