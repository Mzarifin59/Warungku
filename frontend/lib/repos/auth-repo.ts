/**
 * Auth repository — Supabase Auth (email + password).
 *
 * Akun demo (lihat docs/supabase/seed.sql), password semua `demo1234`:
 *   - demo-roti@warungku.id
 *   - demo-dapur@warungku.id
 *   - demo-keripik@warungku.id
 */

import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Session } from "../types";

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

/** Ubah user Supabase → session domain. */
export function toSession(user: SupabaseUser | null | undefined): Session | null {
  if (!user) return null;
  const email = user.email ?? "";
  const metaName =
    typeof user.user_metadata?.name === "string"
      ? user.user_metadata.name.trim()
      : "";
  return {
    user: { id: user.id, email, name: metaName || email.split("@")[0] },
  };
}

export async function login(input: LoginInput): Promise<Session> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password,
  });

  if (error) {
    if (error.code === "email_not_confirmed") {
      throw new Error(
        "Email belum dikonfirmasi. Cek kotak masuk email Anda terlebih dahulu.",
      );
    }
    if (error.status === 400 || error.code === "invalid_credentials") {
      // Jangan bocorkan jenis error spesifik (docs 05 A02).
      throw new Error("Email atau kata sandi salah.");
    }
    throw new Error("Tidak dapat terhubung. Periksa koneksi lalu coba lagi.");
  }

  return toSession(data.user)!;
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
          ? `${window.location.origin}/mitra/dashboard`
          : undefined,
    },
  });

  if (error) {
    if (
      error.code === "user_already_exists" ||
      error.message.toLowerCase().includes("already")
    ) {
      throw new Error("Email ini sudah terdaftar. Silakan masuk ke akun Anda.");
    }
    if (error.code === "weak_password") {
      throw new Error("Kata sandi terlalu lemah. Gunakan minimal 8 karakter.");
    }
    throw new Error("Pendaftaran belum berhasil. Coba lagi.");
  }

  // Saat "Confirm email" aktif, Supabase mengembalikan user dengan
  // identities kosong untuk email yang sudah terdaftar (anti-enumeration).
  if (data.user && data.user.identities?.length === 0) {
    throw new Error("Email ini sudah terdaftar. Silakan masuk ke akun Anda.");
  }

  if (!data.session) {
    // "Confirm email" aktif di Supabase Auth → belum ada session.
    throw new Error(
      "Akun dibuat. Cek email Anda untuk konfirmasi, lalu masuk.",
    );
  }

  return toSession(data.user)!;
}
