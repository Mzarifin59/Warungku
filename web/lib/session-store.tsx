"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Session } from "./types";
import {
  login as repoLogin,
  register as repoRegister,
  toSession,
  type LoginInput,
  type RegisterInput,
  type RegisterResult,
} from "./repos/auth-repo";

/**
 * Session store — Supabase Auth.
 *
 * Session disimpan di cookie oleh `@supabase/ssr` (bukan localStorage) dan
 * di-refresh oleh `proxy.ts`. Provider ini hanya menyinkronkan state user
 * untuk UI; data toko dimuat oleh `DashboardProvider`.
 *
 * Catatan: callback `onAuthStateChange` sengaja TIDAK memanggil query
 * Supabase lain (bisa deadlock di supabase-js) — cukup set state.
 */

interface SessionContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  initializing: boolean;
  signIn: (input: LoginInput) => Promise<Session>;
  signUp: (input: RegisterInput) => Promise<RegisterResult>;
  signOut: () => Promise<void>;
}

const SessionContext = React.createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = React.useState<Session | null>(null);
  const [initializing, setInitializing] = React.useState(true);

  React.useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(toSession(data.session?.user));
      setInitializing(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (cancelled) return;
      setSession(toSession(s?.user));
      setInitializing(false);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = React.useCallback(async (input: LoginInput) => {
    const s = await repoLogin(input);
    setSession(s);
    return s;
  }, []);

  const signUp = React.useCallback(async (input: RegisterInput) => {
    const result = await repoRegister(input);
    if (result.status === "signed-in") setSession(result.session);
    return result;
  }, []);

  const signOut = React.useCallback(async () => {
    await createClient().auth.signOut();
    setSession(null);
    router.replace("/");
    router.refresh();
  }, [router]);

  const value = React.useMemo<SessionContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      initializing,
      signIn,
      signUp,
      signOut,
    }),
    [session, initializing, signIn, signUp, signOut],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = React.useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession harus dipakai di dalam <SessionProvider>.");
  }
  return ctx;
}
