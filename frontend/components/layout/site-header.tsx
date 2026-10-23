"use client";

import { Icon } from "@/components/icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Beranda", href: "/" },
  { label: "Jelajahi", href: "/warung" },
  { label: "Tentang", href: "/tentang" },
  { label: "Bantuan", href: "/bantuan" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="relative z-10 border-b border-slate-100 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8 flex min-h-16 flex-wrap items-center justify-between gap-3 py-3 sm:flex-nowrap sm:gap-6 sm:py-0">
        <Link
          className="flex shrink-0 items-center gap-2 text-[17px] font-bold tracking-[-0.6px] text-[#233e62]"
          href="/"
          aria-label="Warungku — Beranda"
        >
          <span className="relative grid size-8 place-items-center text-primary">
            <Icon name="bag" size={25} />
            <span className="absolute top-[9px] text-[11px] font-bold text-white">W</span>
          </span>
          <span>Warungku</span>
        </Link>
        <label className="order-3 flex h-10 w-full min-w-0 items-center gap-2 rounded-full border border-[#e4edf7] bg-[#f5f9ff] px-3 text-[#6882a8] focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-primary/10 sm:order-none sm:max-w-[360px] sm:flex-1">
          <Icon name="search" size={15} />
          <input
            className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-[#8496b0]"
            type="search"
            placeholder="Cari toko, produk, atau kategori..."
            aria-label="Cari toko, produk, atau kategori"
          />
          <kbd className="hidden shrink-0 text-[9px] text-slate-400 md:inline">⌘ K</kbd>
        </label>
        <nav className="hidden items-center gap-4 lg:flex" aria-label="Navigasi utama">
          {links.map((link) => {
            const active =
              link.href !== "#" &&
              (pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(`${link.href}/`)));

            return (
            <Link
              className={`relative py-6 text-sm transition-colors hover:text-primary ${
                active
                  ? "text-primary after:absolute after:right-0 after:bottom-4 after:left-0 after:h-0.5 after:rounded-full after:bg-primary"
                  : "text-[#647895]"
              }`}
              href={link.href}
              aria-current={active ? "page" : undefined}
              key={link.label}
            >
              {link.label}
            </Link>
            );
          })}
        </nav>
        <a
          className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#eef6ff] px-3 py-2 text-xs font-medium text-primary sm:text-sm transition-colors hover:bg-secondary sm:ml-0"
          href="#"
        >
          <Icon name="user" size={15} />
          <span className="min-[400px]:hidden">Masuk</span><span className="hidden min-[400px]:inline">Login / Daftar</span>
        </a>
      </div>
    </header>
  );
}
