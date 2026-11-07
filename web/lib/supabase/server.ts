import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import type { Database } from "./database.types";

/**
 * Supabase client untuk Server Component / Route Handler.
 *
 * Membaca cookie session (di-refresh oleh `proxy.ts`). Server Component tidak
 * boleh menulis cookie, jadi `setAll` diabaikan diam-diam di sana — refresh
 * token sudah ditangani proxy.
 *
 * `await connection()`: data Supabase selalu per-request, dan client-nya
 * membaca waktu (`Date.now()`, cek kedaluwarsa token). Tanpa ini, Cache
 * Components menganggapnya "unstable value while prerendering".
 */
export async function createClient() {
  await connection();
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Dipanggil dari Server Component — aman diabaikan.
          }
        },
      },
    },
  );
}
