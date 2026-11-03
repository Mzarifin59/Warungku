/**
 * Auth repository — FASE 2 (Supabase).
 *
 * Login & register via `@supabase/supabase-js` email + password.
 *
 * Kredensial yang dipakai:
 *   - demo-roti@warungku.id    / demo1234
 *   - demo-dapur@warungku.id   / demo1234
 *   - demo-keripik@warungku.id / demo1234
 */

import { createClient } from "@/lib/supabase/client";
import type { Session, User } from "../types";

export const DEMO_EMAIL = "demo-dapur@warungku.id";
export const DEMO_PASSWORD = "demo1234";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

/** Ambil toko milik user (jika sudah ada). `null` bila belum punya. */
async function fetchStoreIdForUser(userId: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_id", userId)
    .limit(1);
  if (error) return null;
  return data?.[0]?.id ?? null;
}

/** Ambil nama profil user dari tabel profiles (jika ada). */
async function fetchProfileName(userId: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", userId)
    .limit(1);
  if (error) return null;
  return data?.[0]?.name ?? null;
}

export async function login(input: LoginInput): Promise<Session> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password,
  });

  if (error) {
    // Jangan bocor jenis error spesifik (docs 05 A02).
    throw new Error("Email atau kata sandi salah.");
  }

  const user = data.user;
  const name =
    (user.user_metadata?.name as string | undefined) ??
    (await fetchProfileName(user.id)) ??
    user.email ??
    "";
  const storeId = await fetchStoreIdForUser(user.id);

  const session: Session = {
    user: { id: user.id, name, email: user.email ?? "" } satisfies User,
    storeId,
  };
  return session;
}

export async function register(input: RegisterInput): Promise<Session> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      data: { name: input.name.trim() },
      emailRedirectTo:
        typeof window !== "undefined"
          ? window.location.origin
          : undefined,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      throw new Error(
        "Email ini sudah terdaftar. Silakan masuk ke akun Anda.",
      );
    }
    throw new Error("Pendaftaran belum berhasil. Coba lagi.");
  }

  const user = data.user;
  if (!user) {
    // Confirm-signup belum dimatikan di Auth config.
    throw new Error("Periksa email Anda untuk mengaktifkan akun.");
  }

  const name =
    (user.user_metadata?.name as string | undefined) ?? input.name.trim();
  const session: Session = {
    user: { id: user.id, name, email: user.email ?? "" } satisfies User,
    storeId: null,
  };
  return session;
}
