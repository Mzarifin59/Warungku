"use client";

import { Box, LayoutDashboard, LogOut, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardStore } from "@/lib/dashboard-provider";

export function MitraNavigation({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const { store } = useDashboardStore();

  const previewHref = store ? `/mitra/preview/${store.slug}` : "/mitra/dashboard";

  const navigation = [
    { label: "Dashboard", href: "/mitra/dashboard", icon: LayoutDashboard },
    { label: "Warung Saya", href: previewHref, icon: Store },
    { label: "Produk", href: "/mitra/produk", icon: Box },
  ];

  const items = navigation.map(({ label, href, icon: NavIcon }) => {
    const active =
      label === "Warung Saya"
        ? pathname.startsWith("/mitra/preview")
        : pathname === href;

    return (
      <Link
        aria-current={active ? "page" : undefined}
        className={
          compact
            ? `shrink-0 rounded-full px-3 py-2 text-xs ${
                active ? "bg-[#e6f1ff] font-medium text-primary" : "text-[#75849a]"
              }`
            : `flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
                active
                  ? "bg-[#e6f1ff] font-medium text-primary"
                  : "text-[#75849a] hover:bg-[#f5f8fc] hover:text-[#263e60]"
              }`
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
      <Link className="ml-auto flex shrink-0 items-center gap-1 px-2 text-xs text-[#8a929e]" href="/">
        <LogOut size={14} />
        Keluar
      </Link>
    </nav>
  ) : (
    <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Navigasi mitra">
      {items}
    </nav>
  );
}

export function MitraNavigationFallback({ compact = false }: { compact?: boolean }) {
  const navigation = [
    { label: "Dashboard", href: "/mitra/dashboard" },
    { label: "Warung Saya", href: "/mitra/dashboard" },
    { label: "Produk", href: "/mitra/produk" },
  ];
  const links = navigation.map(({ label, href }) => (
    <Link
      className={
        compact
          ? "shrink-0 rounded-full px-3 py-2 text-xs text-[#75849a]"
          : "flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-[#75849a]"
      }
      href={href}
      key={href}
    >
      {label}
    </Link>
  ));

  return compact ? (
    <nav
      className="flex gap-2 overflow-x-auto border-b border-[#e7edf5] bg-white px-4 py-2 lg:hidden"
      aria-label="Navigasi mitra"
    >
      {links}
      <Link className="ml-auto shrink-0 px-2 py-2 text-xs text-[#8a929e]" href="/">
        Keluar
      </Link>
    </nav>
  ) : (
    <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Navigasi mitra">
      {links}
    </nav>
  );
}
