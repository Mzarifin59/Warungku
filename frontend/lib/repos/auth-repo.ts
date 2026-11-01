/**
 * Auth repository — FASE 1 (mock).
 *
 * // TODO(api): ganti isi repos dengan Supabase Auth di Fase 2;
 * mock ini cukup untuk demo alur onboarding.
 *
 * Fase 1 tidak memanggil jaringan apa pun. Semua "sistem" disimulasikan
 * dengan state client (lihat docs/frontend/04 F7 & 03 §2).
 */

import type { Session, User } from "../types";

const MOCK_LATENCY_MS = 400;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** Akun demo (bisa dipakai juri untuk langsung masuk). */
export const DEMO_EMAIL = "demo@warungku.id";
export const DEMO_PASSWORD = "warungku";

/** Demo: login + sudah punya toko (skenario c). */
export const DEMO_OWNER_SESSION: Session = {
  user: { id: "usr-demo", name: "Budi", email: DEMO_EMAIL },
  storeId: "st-dapur-rasa",
};

/** Demo: login tanpa toko (skenario b). */
export const DEMO_NO_STORE_SESSION: Session = {
  user: { id: "usr-nostore", name: "Budi", email: DEMO_EMAIL },
  storeId: null,
};

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Login (mock). Kredensial salah → error generik, tanpa membedakan
 * "email tak terdaftar" vs "kata sandi salah" (docs 05 A02).
 */
export async function login(input: LoginInput): Promise<Session> {
  // TODO(api): supabase.auth.signInWithPassword
  await delay(MOCK_LATENCY_MS);
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    return DEMO_OWNER_SESSION;
  }

  // Error generik — jangan pernah bocor jenis error yang spesifik.
  throw new Error("Email atau kata sandi salah.");
}

/**
 * Daftar (mock). Sukses → langsung masuk, tanpa toko (docs 04 F1).
 */
export async function register(input: RegisterInput): Promise<Session> {
  // TODO(api): supabase.auth.signUp + upsert user
  await delay(MOCK_LATENCY_MS);
  if (input.email.trim().toLowerCase() === DEMO_EMAIL) {
    throw new Error("Pendaftaran belum berhasil. Coba lagi.");
  }
  const user: User = {
    id: "usr-" + Math.random().toString(36).slice(2, 10),
    name: input.name.trim(),
    email: input.email.trim(),
  };
  return { user, storeId: null };
}
