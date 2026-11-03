"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { fetchStoreForUser } from "@/lib/supabase/store-lookup";
import type { Session } from "./types";
import {
  login as repoLogin,
  register as repoRegister,
  type LoginInput,
  type RegisterInput,
} from "./repos/auth-repo";

/**
 * Session store — FASE 2 (Supabase).
 *
 * State session disimpan via `@supabase/ssr` (cookie) — bukan localStorage.
 * Di client: `createClient()` dari `@supabase/ssr` otomatis membaca cookie
 * yang di-set oleh middleware / server component.
 */

function toSession(
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  } | null,
  storeId: string | null,
): Session | null {
  if (!user) return null;
  const name =
    (user.user_metadata?.name as string | undefined) ?? user.email ?? "";
  return {
    user: { id: user.id, name, email: user.email ?? "" },
    storeId,
  };
}

interface SessionContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  initializing: boolean;
  signIn: (input: LoginInput) => Promise<Session>;
  signUp: (input: RegisterInput) => Promise<Session>;
  signOut: () => void;
  resetSession: () => void;
}

const SessionContext = React.createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = React.useState<Session | null>(null);
  const [initializing, setInitializing] = React.useState(true);

  React.useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function init() {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      const user = data.session?.user ?? null;
      let storeId: string | null = null;
      if (user) {
        storeId = await fetchStoreForUser(user.id);
      }
      if (cancelled) return;
      setSession(toSession(user, storeId));
      setInitializing(false);
    }

    init();

    const { data: subData } = supabase.auth.onAuthStateChange(
      async (event, sessionData) => {
        if (cancelled) return;
        const user = sessionData?.user ?? null;
        let storeId: string | null = null;
        if (user) {
          storeId = await fetchStoreForUser(user.id);
        }
        if (cancelled) return;
        setSession(toSession(user, storeId));
        if (event === "SIGNED_OUT") {
          router.replace("/");
        }
      },
    );

    return () => {
      cancelled = true;
      subData.subscription.unsubscribe();
    };
  }, [router]);

  const value = React.useMemo<SessionContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      initializing,
      async signIn(input) {
        const s = await repoLogin(input);
        // Supabase sudah set cookie via auth.signInWithPassword;
        // cukup sinkron state.
        setSession(s);
        router.push("/mitra/dashboard");
        return s;
      },
      async signUp(input) {
        const s = await repoRegister(input);
        setSession(s);
        router.push("/mitra/dashboard");
        return s;
      },
      async signOut() {
        const supabase = createClient();
        await supabase.auth.signOut();
        setSession(null);
        router.push("/");
      },
      resetSession() {
        setSession(null);
      },
    }),
    [session, initializing, router],
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = React.useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession harus dipakai di dalam <SessionProvider>.");
  }
  return ctx;
}
