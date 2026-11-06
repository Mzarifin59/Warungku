"use client";

import { Icon } from "@/components/icon";
import Link from "next/link";
import type { ReactNode } from "react";
import { Suspense } from "react";
import {
  MitraNavigation,
  MitraNavigationFallback,
} from "@/components/layout/mitra-navigation";
import { ChevronDown, LogOut, Store, UserRound } from "lucide-react";
import { useSession } from "@/lib/session-store";
import { useDashboardStore } from "@/lib/dashboard-provider";

export function MitraShell({ children }: { children: ReactNode }) {
  return (
    <MitraShellInner>{children}</MitraShellInner>
  );
}

function MitraShellInner({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f3f7fc] text-[#263e60]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[232px] flex-col border-r border-[#dce5f0] bg-white lg:flex">
        <Link
          className="flex h-[76px] items-center gap-2.5 border-b border-[#edf1f6] px-7 text-xl font-bold tracking-[-0.7px] text-[#233e62]"
          href="/"
          aria-label="Warungku — Beranda"
        >
          <span className="relative grid size-9 place-items-center text-primary">
            <Icon name="bag" size={32} />
            <span className="absolute top-[11px] text-xs font-bold text-white">W</span>
          </span>
          Warungku
        </Link>
        <Suspense fallback={<MitraNavigationFallback />}>
          <MitraNavigation />
        </Suspense>
        <Link
          className="flex h-14 items-center gap-3 px-6 text-sm text-[#8a929e] transition-colors hover:text-primary"
          href="/"
        >
          <LogOut size={17} />
          Keluar
        </Link>
      </aside>

      <div className="lg:pl-[232px]">
        <MitraHeader />
        <Suspense fallback={<MitraNavigationFallback compact />}>
          <MitraNavigation compact />
        </Suspense>

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
  const storeName = store?.name ?? "Warungku";
  const userName = session?.user.name ?? session?.user.email ?? "Pengguna";
  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-[#e7edf5] bg-white px-4 sm:px-7">
      <Link className="flex items-center gap-2 text-sm font-semibold text-[#2b4568]" href="/mitra/dashboard">
        <Store className="text-primary" size={20} strokeWidth={1.8} />
        {storeName}
      </Link>
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-full bg-[#edf1f6] text-[#44546a]">
          {initials ? <span className="text-xs font-bold">{initials}</span> : <UserRound size={18} />}
        </span>
        <span className="hidden sm:block">
          <strong className="block text-xs font-semibold text-[#2b4568]">{userName}</strong>
          <small className="block text-[10px] text-[#8794a5]">Pemilik Warung</small>
        </span>
        <ChevronDown className="hidden text-[#93a0b1] sm:block" size={15} />
      </div>
    </header>
  );
}
