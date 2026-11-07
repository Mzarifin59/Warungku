import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Callback link email Supabase (konfirmasi daftar, dsb).
 *
 * Mendukung dua bentuk link:
 * 1. `?code=...` — template email bawaan Supabase ({{ .ConfirmationURL }})
 *    dengan alur PKCE. Hanya berhasil di browser yang sama dengan saat
 *    mendaftar (code verifier disimpan di cookie browser itu).
 * 2. `?token_hash=...&type=email` — template email kustom (lihat
 *    docs/supabase/guide-setup-supabase.md). Berhasil di perangkat mana pun.
 *
 * Berhasil → masuk otomatis lalu ke `next` (default dashboard).
 * Gagal → `/login?error=...` dengan pesan yang sesuai.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const rawNext = searchParams.get("next");
  const next =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/mitra/dashboard";

  const fail = (reason: "kedaluwarsa" | "konfirmasi") =>
    NextResponse.redirect(new URL(`/login?error=${reason}`, request.url));

  // Supabase menambahkan ?error_code=otp_expired bila link sudah kedaluwarsa
  // atau sudah pernah dipakai.
  if (searchParams.get("error_code") === "otp_expired") return fail("kedaluwarsa");
  if (!code && !(tokenHash && type)) return fail("konfirmasi");

  const response = NextResponse.redirect(new URL(next, request.url));
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({ type: type!, token_hash: tokenHash! });

  if (error) {
    console.error("[auth/confirm]", error.code ?? error.message);
    return fail(error.code === "otp_expired" ? "kedaluwarsa" : "konfirmasi");
  }
  return response;
}
