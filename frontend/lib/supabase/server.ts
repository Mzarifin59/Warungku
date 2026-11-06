import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

type CookieLike = {
  getAll(): { name: string; value: string }[];
  set(name: string, value: string, options: { path: string }): void;
};

export function createClient() {
  const cookieStore = cookies() as unknown as Promise<CookieLike>;

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Promise<CookieLike> — supabase-js akan await hasil `getAll()`.
          return (async () => (await cookieStore).getAll())();
        },
        setAll(cookiesToSet) {
          try {
            void cookieStore.then((store) => {
              cookiesToSet.forEach(({ name, value }) =>
                store.set(name, value, { path: "/" })
              );
            });
          } catch {
            // Dipanggil dari Server Component yang tidak punya akses
            // untuk set cookie - aman diabaikan karena middleware
            // sudah menjaga session di route handler
          }
        },
      },
    }
  );
}
