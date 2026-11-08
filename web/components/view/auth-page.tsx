"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { LogoMark } from "@/components/layout/logo-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailCheck } from "lucide-react";
import { useSession } from "@/lib/session-store";
import { EmailNotConfirmedError, resendConfirmation } from "@/lib/repos/auth-repo";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/schemas";

type AuthPageProps = {
  mode: "login" | "register";
};

type FieldErrorMap = { [K in string]?: string };

export function AuthPage({ mode }: AuthPageProps) {
  const isLogin = mode === "login";
  const { signIn, signUp } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next");
  // Hanya izinkan path internal (cegah open redirect).
  const nextParam =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/mitra/dashboard";

  const [submitting, setSubmitting] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrorMap>({});
  const [generalError, setGeneralError] = React.useState("");
  /** Email yang menunggu konfirmasi (setelah daftar / login belum dikonfirmasi). */
  const [pendingEmail, setPendingEmail] = React.useState("");
  const [registered, setRegistered] = React.useState(false);
  const linkError = CONFIRM_ERRORS[searchParams.get("error") ?? ""];

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setGeneralError("");
    setFieldErrors({});

    // Validasi Zod per-field.
    const parsed = isLogin
      ? loginSchema.safeParse({
          email: form.email,
          password: form.password,
        })
      : registerSchema.safeParse(form);

    if (!parsed.success) {
      const errors: FieldErrorMap = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      const firstKey = Object.keys(errors)[0];
      if (firstKey) {
        document.getElementById(firstKey)?.focus();
      }
      return;
    }

    setSubmitting(true);
    setPendingEmail("");
    try {
      if (isLogin) {
        const input = parsed.data as unknown as LoginInput;
        await signIn(input);
      } else {
        const input = parsed.data as unknown as RegisterInput;
        const result = await signUp(input);
        if (result.status === "confirm-email") {
          setPendingEmail(result.email);
          setRegistered(true);
          setSubmitting(false);
          return;
        }
      }
      router.replace(nextParam);
      router.refresh();
    } catch (err) {
      if (err instanceof EmailNotConfirmedError) setPendingEmail(form.email.trim());
      setGeneralError(err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-secondary">
      <header className="relative flex h-14 items-center justify-between border-b border-[#e6eef8] bg-white px-4 sm:px-8">
        <Link
          className="flex items-center gap-1.5 text-[15px] font-bold tracking-[-0.5px] text-[#233e62]"
          href="/"
          aria-label="Warungku — Beranda"
        >
          <LogoMark size={28} />
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
            {isLogin ? "Selamat Datang Kembali!" : "Buat Toko Gratis"}
          </h2>

          {registered ? (
            <CheckEmailPanel email={pendingEmail} />
          ) : (
          <>
          {linkError && !generalError && (
            <div className="mb-4 rounded-lg bg-warning-subtle px-3 py-2 text-sm text-warning" role="status">
              {linkError}
            </div>
          )}

          {generalError && (
            <div
              className="mb-4 rounded-lg bg-danger-subtle px-3 py-2 text-sm text-danger"
              role="alert"
            >
              {generalError}
              {pendingEmail && <ResendButton email={pendingEmail} className="mt-2" />}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {!isLogin && (
              <FieldBlock label="Nama" htmlFor="name" error={fieldErrors.name} required>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Nama kamu"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  error={Boolean(fieldErrors.name)}
                />
              </FieldBlock>
            )}

            <FieldBlock label="Email" htmlFor="email" error={fieldErrors.email} required>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete={isLogin ? "username" : "email"}
                placeholder="nama@email.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                error={Boolean(fieldErrors.email)}
              />
            </FieldBlock>

            <FieldBlock
              label="Kata Sandi"
              htmlFor="password"
              error={fieldErrors.password}
              required
            >
              <PasswordInput
                id="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                autoComplete={isLogin ? "current-password" : "new-password"}
                error={Boolean(fieldErrors.password)}
                placeholder="Minimal 8 karakter"
              />
            </FieldBlock>

            {!isLogin && (
              <FieldBlock
                label="Konfirmasi Kata Sandi"
                htmlFor="password_confirmation"
                error={fieldErrors.passwordConfirmation}
                required
              >
                <PasswordInput
                  id="password_confirmation"
                  value={form.passwordConfirmation}
                  onChange={(e) => update("passwordConfirmation", e.target.value)}
                  autoComplete="new-password"
                  error={Boolean(fieldErrors.passwordConfirmation)}
                  placeholder="Ulangi kata sandi"
                />
              </FieldBlock>
            )}

            {isLogin && (
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-[#8794a5]">
                  Demo: demo-dapur@warungku.id / demo1234
                </span>
                <Link href="#" className="font-medium text-primary hover:underline">
                  Lupa Kata Sandi?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              loading={submitting}
              loadingLabel={isLogin ? "Memproses..." : "Mendaftarkan..."}
              className="w-full"
            >
              {isLogin ? "Masuk" : "Daftar"}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-[#a2aab5]">
            {isLogin ? (
              <>
                Belum Punya Akun?{" "}
                <Link
                  className="font-medium text-primary hover:underline"
                  href={
                    nextParam !== "/mitra/dashboard"
                      ? `/daftar?next=${encodeURIComponent(nextParam)}`
                      : "/daftar"
                  }
                >
                  Daftar Sekarang
                </Link>
              </>
            ) : (
              <>
                Sudah Punya Akun?{" "}
                <Link
                  className="font-medium text-primary hover:underline"
                  href={
                    nextParam !== "/mitra/dashboard"
                      ? `/login?next=${encodeURIComponent(nextParam)}`
                      : "/login"
                  }
                >
                  Login
                </Link>
              </>
            )}
          </p>
          </>
          )}
        </section>
      </main>
    </div>
  );
}

/* ── Sub-komponen ──────────────────────────────────────────── */

/** Pesan untuk `/login?error=...` dari `app/auth/confirm/route.ts`. */
const CONFIRM_ERRORS: Record<string, string> = {
  kedaluwarsa:
    "Link konfirmasi sudah kedaluwarsa atau sudah dipakai. Coba masuk; bila email belum terkonfirmasi, kirim ulang emailnya.",
  konfirmasi:
    "Link konfirmasi tidak bisa dipakai otomatis di browser ini. Email kamu kemungkinan sudah terkonfirmasi — silakan masuk.",
};

const RESEND_COOLDOWN_S = 60;

function ResendButton({ email, className }: { email: string; className?: string }) {
  const [cooldown, setCooldown] = React.useState(0);
  const [status, setStatus] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  async function resend() {
    setSending(true);
    setStatus(null);
    try {
      await resendConfirmation(email);
      setStatus({ ok: true, text: `Email konfirmasi dikirim ulang ke ${email}.` });
      setCooldown(RESEND_COOLDOWN_S);
    } catch (err) {
      setStatus({ ok: false, text: err instanceof Error ? err.message : "Gagal mengirim ulang." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => void resend()}
        disabled={sending || cooldown > 0}
        className="text-sm font-semibold text-primary underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:text-text-subtle disabled:no-underline"
      >
        {sending
          ? "Mengirim…"
          : cooldown > 0
            ? `Kirim ulang dalam ${cooldown} dtk`
            : "Kirim ulang email konfirmasi"}
      </button>
      {status && (
        <p className={`mt-1 text-xs ${status.ok ? "text-success" : "text-danger"}`} role="status">
          {status.text}
        </p>
      )}
    </div>
  );
}

function CheckEmailPanel({ email }: { email: string }) {
  return (
    <div className="space-y-4 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-primary">
        <MailCheck size={26} aria-hidden="true" />
      </span>
      <div>
        <p className="font-semibold text-[#263e60]">Cek email kamu</p>
        <p className="mt-1 text-sm text-[#6f82a1]">
          Kami mengirim link konfirmasi ke <strong className="text-[#263e60]">{email}</strong>.
          Buka link itu <strong>di perangkat & browser ini</strong> agar langsung masuk ke dashboard.
        </p>
        <p className="mt-2 text-xs text-[#8794a5]">
          Tidak ada di kotak masuk? Periksa folder Spam / Promosi.
        </p>
      </div>
      <ResendButton email={email} />
      <Link href="/login" className="block text-sm text-[#6f82a1] hover:text-primary">
        Sudah konfirmasi? Masuk di sini
      </Link>
    </div>
  );
}

function FieldBlock({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="block text-sm font-medium text-[#263e60]"
        htmlFor={htmlFor}
      >
        {label}
        {required && <span className="ml-1 text-danger" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  error,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  error?: boolean;
  placeholder?: string;
}) {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        error={error}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-xs text-[#8794a5] hover:text-primary"
        aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        aria-pressed={visible}
      >
        {visible ? "Sembunyikan" : "Lihat"}
      </button>
    </div>
  );
}

