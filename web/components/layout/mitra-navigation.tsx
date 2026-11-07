"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Eye, Layers, LayoutDashboard, LogOut, Store } from "lucide-react";
import { useSession } from "@/lib/session-store";
import { cn } from "@/lib/utils";

const NAVIGATION = [
  { label: "Dashboard", href: "/mitra/dashboard", icon: LayoutDashboard },
  { label: "Warung Saya", href: "/mitra/toko", icon: Store },
  { label: "Produk", href: "/mitra/produk", icon: Box },
  { label: "Kategori", href: "/mitra/kategori", icon: Layers },
  { label: "Pratinjau", href: "/mitra/preview", icon: Eye },
] as const;

export function MitraNavigation({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  const items = NAVIGATION.map(({ label, href, icon: NavIcon }) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link
        aria-current={active ? "page" : undefined}
        className={
          compact
            ? cn(
                "shrink-0 rounded-full px-3 py-2 text-xs",
                active ? "bg-[#e6f1ff] font-medium text-primary" : "text-[#75849a]",
              )
            : cn(
                "flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                active
                  ? "bg-[#e6f1ff] font-medium text-primary"
                  : "text-[#75849a] hover:bg-[#f5f8fc] hover:text-[#263e60]",
              )
        }
        href={href}
        key={href}
      >
        {!compact && <NavIcon size={18} strokeWidth={1.8} />}
        {label}
      </Link>
    );
  });

  return compact ? (
    <nav
      className="flex gap-2 overflow-x-auto border-b border-[#e7edf5] bg-white px-4 py-2 lg:hidden"
      aria-label="Navigasi mitra"
    >
      {items}
      <LogoutButton compact />
    </nav>
  ) : (
    <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Navigasi mitra">
      {items}
    </nav>
  );
}

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const { signOut } = useSession();
  const [busy, setBusy] = React.useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await signOut();
      }}
      className={
        compact
          ? "ml-auto flex shrink-0 items-center gap-1 px-2 text-xs text-[#8a929e] disabled:opacity-50"
          : "flex h-14 w-full items-center gap-3 px-6 text-sm text-[#8a929e] transition-colors hover:text-primary disabled:opacity-50"
      }
    >
      <LogOut size={compact ? 14 : 17} />
      {busy ? "Keluar…" : "Keluar"}
    </button>
  );
}
