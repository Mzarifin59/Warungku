"use client";

import { Icon } from "@/components/icon";
import Link from "next/link";

type AuthPageProps = {
  mode: "login" | "register";
};

export function AuthPage({ mode }: AuthPageProps) {
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-secondary">
      <header className="relative flex h-14 items-center justify-between border-b border-[#e6eef8] bg-white px-4 sm:px-8">
        <Link
          className="flex items-center gap-1.5 text-[15px] font-bold tracking-[-0.5px] text-[#233e62]"
          href="/"
          aria-label="Warungku — Beranda"
        >
          <span className="relative grid size-7 place-items-center text-primary">
            <Icon name="bag" size={24} />
            <span className="absolute top-[8px] text-[10px] font-bold text-white">W</span>
          </span>
          <span>Warungku</span>
        </Link>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-sm font-bold text-[#233e62] sm:text-base">
          {isLogin ? "Login" : "Daftar"}
        </h1>
        <span className="w-[92px]" aria-hidden="true" />
      </header>

      <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-4 py-9">
        <section
          aria-labelledby="auth-title"
          className={`w-full rounded-2xl bg-white px-5 py-6 shadow-[0_8px_24px_rgba(35,62,98,0.04)] sm:px-8 ${
            isLogin ? "max-w-[420px]" : "max-w-[460px]"
          }`}
        >
          <h2
            className="mb-6 text-center text-base font-bold tracking-[-0.3px] text-[#263e60]"
            id="auth-title"
          >
            {isLogin ? "Selamat Datang Kembali!" : "Mulai Belanja di Warungku"}
          </h2>

          <div className="space-y-3">
            {!isLogin && (
              <div>
                <label className="mb-1 block text-sm text-[#263e60]" htmlFor="name">
                  Nama
                </label>
                <input
                  autoComplete="name"
                  className={inputClassName}
                  id="name"
                  name="name"
                  placeholder="Masukkan Nama..."
                  required
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm text-[#263e60]" htmlFor="email">
                Email atau No HP
              </label>
              <input
                autoComplete={isLogin ? "username" : "email"}
                className={inputClassName}
                id="email"
                name="email"
                placeholder="Masukkan Email atau No HP..."
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#263e60]" htmlFor="password">
                Kata Sandi
              </label>
              <input
                autoComplete={isLogin ? "current-password" : "new-password"}
                className={inputClassName}
                id="password"
                minLength={8}
                name="password"
                placeholder="Masukkan Kata Sandi..."
                required
                type="password"
              />
            </div>

            {isLogin ? (
              <div className="flex items-center justify-between gap-3 pt-1 text-xs">
                <label className="flex items-center gap-1.5 text-[#8794a5]" htmlFor="remember">
                  <input
                    className="size-4 rounded border-[#cbd5e1] accent-primary"
                    id="remember"
                    name="remember"
                    type="checkbox"
                  />
                  Ingat Saya
                </label>
                <span className="text-primary">
                  Lupa Kata Sandi?
                </span>
              </div>
            ) : (
              <>
                <div>
                  <label className="mb-1 block text-sm text-[#263e60]" htmlFor="password_confirmation">
                    Konfirmasi Kata Sandi
                  </label>
                  <input
                    autoComplete="new-password"
                    className={inputClassName}
                    id="password_confirmation"
                    minLength={8}
                    name="password_confirmation"
                    placeholder="Konfirmasi Kata Sandi..."
                    required
                    type="password"
                  />
                </div>
                <label className="flex items-center gap-1.5 pt-1 text-xs text-[#8794a5]" htmlFor="terms">
                  <input
                    className="size-4 rounded border-[#cbd5e1] accent-primary"
                    id="terms"
                    name="terms"
                    required
                    type="checkbox"
                  />
                  <span>
                    Saya Menyetujui{" "}
                    <span className="text-primary">Syarat &amp; Ketentuan</span>
                  </span>
                </label>
              </>
            )}

            <button
              className="mx-auto flex min-h-10 w-full max-w-[280px] items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-[#1769db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              type="button"
            >
              {isLogin ? "Login" : "Daftar"}
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-[#a2aab5]">
            {isLogin ? "Belum Punya Akun?" : "Sudah Punya Akun?"}{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href={isLogin ? "/daftar" : "/login"}
            >
              {isLogin ? "Daftar Sekarang" : "Login"}
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}

const inputClassName =
  "h-10 w-full rounded-lg border border-[#d1d5db] bg-white px-3 text-sm text-[#263e60] outline-none transition placeholder:text-xs placeholder:text-[#b4b8bf] focus:border-primary focus:ring-2 focus:ring-primary/15";
