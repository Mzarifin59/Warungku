"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Session } from "./types";
import {
  DEMO_NO_STORE_SESSION,
  DEMO_OWNER_SESSION,
  login as repoLogin,
  register as repoRegister,
  type LoginInput,
  type RegisterInput,
} from "./repos/auth-repo";

/**
 * Session store — FASE 1 (mock, client-side).
 *
 * // TODO(api): ganti dengan Supabase Auth di Fase 2; mock ini cukup
 * untuk demo alur onboarding (docs 04 F1 & F7).
 *
 * Simpan di `localStorage` sehingga bertahan setelah refresh.
 */

const SESSION_KEY = "warungku.session";

function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function writeSession(session: Session | null) {
  if (typeof window === "undefined") return;
  try {
    if (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // mode privat — state tetap di memori.
  }
}

interface SessionContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  signIn: (input: LoginInput) => Promise<Session>;
  signUp: (input: RegisterInput) => Promise<Session>;
  signOut: () => void;
  signInAsDemoOwner: () => void;
  signInAsNoStore: () => void;
  resetSession: () => void;
}

const SessionContext = React.createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = React.useState<Session | null>(() =>
    readSession(),
  );

  React.useEffect(() => {
    writeSession(session);
  }, [session]);

  const value = React.useMemo<SessionContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      async signIn(input) {
        const s = await repoLogin(input);
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
      signOut() {
        setSession(null);
        router.push("/");
      },
      signInAsDemoOwner() {
        setSession(DEMO_OWNER_SESSION);
        router.push("/mitra/dashboard");
      },
      signInAsNoStore() {
        setSession(DEMO_NO_STORE_SESSION);
        router.push("/mitra/dashboard");
      },
      resetSession() {
        setSession(null);
        writeSession(null);
      },
    }),
    [session, router],
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
