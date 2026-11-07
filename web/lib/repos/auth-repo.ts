/**
 * Auth repository — Supabase Auth (email + password).
 *
 * Akun demo (lihat supabase/seed.sql), password semua `demo1234`:
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

export class EmailNotConfirmedError extends Error {
  constructor() {
    super(
      "Email belum dikonfirmasi. Klik link di email pendaftaran, atau kirim ulang emailnya.",
    );
  }
}

export async function login(input: LoginInput): Promise<Session> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password,
  });

  if (error) {
    if (error.code === "email_not_confirmed") {
      throw new EmailNotConfirmedError();
    }
    if (error.status === 400 || error.code === "invalid_credentials") {
      // Jangan bocorkan jenis error spesifik.
      throw new Error("Email atau kata sandi salah.");
    }
    throw new Error("Tidak dapat terhubung. Periksa koneksi lalu coba lagi.");
  }

  return toSession(data.user)!;
}

/** Alamat callback link email (lihat `app/auth/confirm/route.ts`). */
function confirmRedirectUrl(): string | undefined {
  return typeof window !== "undefined"
    ? `${window.location.origin}/auth/confirm`
    : undefined;
}

export type RegisterResult =
  /** "Confirm email" nonaktif → langsung masuk. */
  | { status: "signed-in"; session: Session }
  /** "Confirm email" aktif → user harus klik link di email dulu. */
  | { status: "confirm-email"; email: string };

export async function register(input: RegisterInput): Promise<RegisterResult> {
  const supabase = createClient();
  const email = input.email.trim();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: { name: input.name.trim() },
      emailRedirectTo: confirmRedirectUrl(),
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
    if (error.code === "over_email_send_rate_limit") {
      throw new Error("Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.");
    }
    throw new Error("Pendaftaran belum berhasil. Coba lagi.");
  }

  // Saat "Confirm email" aktif, Supabase mengembalikan user dengan
  // identities kosong untuk email yang sudah terdaftar (anti-enumeration).
  if (data.user && data.user.identities?.length === 0) {
    throw new Error("Email ini sudah terdaftar. Silakan masuk ke akun Anda.");
  }

  if (!data.session) return { status: "confirm-email", email };
  return { status: "signed-in", session: toSession(data.user)! };
}

/** Kirim ulang email konfirmasi pendaftaran. */
export async function resendConfirmation(email: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.trim(),
    options: { emailRedirectTo: confirmRedirectUrl() },
  });
  if (error) {
    throw new Error(
      error.code === "over_email_send_rate_limit" || error.status === 429
        ? "Tunggu sebentar sebelum meminta email baru."
        : "Email belum bisa dikirim ulang. Coba lagi nanti.",
    );
  }
}
