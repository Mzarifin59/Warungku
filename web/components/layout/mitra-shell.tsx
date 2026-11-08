"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink, Store, UserRound } from "lucide-react";
import { LogoMark } from "@/components/layout/logo-mark";
import { LogoutButton, MitraNavigation } from "@/components/layout/mitra-navigation";
import { useDashboardStore } from "@/lib/dashboard-provider";
import { useSession } from "@/lib/session-store";

export function MitraShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f7fc] text-[#263e60]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[232px] flex-col border-r border-[#dce5f0] bg-white lg:flex">
        <Link
          className="flex h-[76px] items-center gap-2.5 border-b border-[#edf1f6] px-7 text-xl font-bold tracking-[-0.7px] text-[#233e62]"
          href="/"
          aria-label="Warungku — Beranda"
        >
          <LogoMark size={36} />
          Warungku
        </Link>
        <MitraNavigation />
        <LogoutButton />
      </aside>

      <div className="lg:pl-[232px]">
        <MitraHeader />
        <MitraNavigation compact />
        <main className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 sm:py-7 lg:px-7">
          {children}
        </main>
      </div>
    </div>
  );
}

function MitraHeader() {
  const { session } = useSession();
  const { store } = useDashboardStore();
  const userName = session?.user.name || "Pengguna";
  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between gap-3 border-b border-[#e7edf5] bg-white px-4 sm:px-7">
      <div className="flex min-w-0 items-center gap-2">
        <Link
          className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[#2b4568]"
          href="/mitra/dashboard"
        >
          <Store className="shrink-0 text-primary" size={20} strokeWidth={1.8} />
          <span className="truncate">{store?.name ?? "Warungku"}</span>
        </Link>
        {store && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
              store.status === "published"
                ? "bg-success-subtle text-success"
                : "bg-warning-subtle text-warning"
            }`}
          >
            {store.status === "published" ? "Terbit" : "Draft"}
          </span>
        )}
        {store?.status === "published" && (
          <Link
            href={`/warung/${store.slug}`}
            target="_blank"
            className="hidden text-[#8794a5] hover:text-primary sm:block"
            aria-label="Buka halaman publik warung"
          >
            <ExternalLink size={14} />
          </Link>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-full bg-[#edf1f6] text-[#44546a]">
          {initials ? <span className="text-xs font-bold">{initials}</span> : <UserRound size={18} />}
        </span>
        <span className="hidden sm:block">
          <strong className="block text-xs font-semibold text-[#2b4568]">{userName}</strong>
          <small className="block text-[10px] text-[#8794a5]">Pemilik Warung</small>
        </span>
      </div>
    </header>
  );
}
