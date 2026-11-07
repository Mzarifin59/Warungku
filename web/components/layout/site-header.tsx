"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Icon } from "@/components/icon";
import { SearchForm } from "@/components/search-form";
import { mainNav, site } from "@/lib/content/site";
import { useSession } from "@/lib/session-store";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export function SiteHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useSession();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const query = pathname === "/cari" ? searchParams.get("q") ?? "" : "";

  // Tutup menu mobile saat pindah halaman.
  const [lastPath, setLastPath] = React.useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  const account = isAuthenticated
    ? { href: "/mitra/dashboard", label: "Dashboard" }
    : { href: "/login", label: "Masuk" };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex min-h-16 flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:gap-6 sm:px-6 sm:py-0 lg:px-8">
        <Link
          className="flex shrink-0 items-center gap-2 text-[17px] font-bold tracking-[-0.6px] text-[#233e62]"
          href="/"
          aria-label={`${site.name} — Beranda`}
        >
          <span className="relative grid size-8 place-items-center text-primary">
            <Icon name="bag" size={25} />
            <span className="absolute top-[9px] text-[11px] font-bold text-white">W</span>
          </span>
          <span>{site.name}</span>
        </Link>

        <SearchForm
          defaultValue={query}
          className="order-3 w-full sm:order-none sm:max-w-[380px] sm:flex-1"
        />

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Navigasi utama">
          {mainNav.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                className={cn(
                  "relative py-6 text-sm transition-colors hover:text-primary",
                  active
                    ? "text-primary after:absolute after:right-0 after:bottom-4 after:left-0 after:h-0.5 after:rounded-full after:bg-primary"
                    : "text-[#647895]",
                )}
                href={link.href}
                aria-current={active ? "page" : undefined}
                key={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#eef6ff] px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-secondary sm:text-sm"
            href={account.href}
          >
            <Icon name="user" size={15} />
            {account.label}
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-[#344f72] hover:bg-[#f3f8ff] lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-slate-100 bg-white px-4 py-2 shadow-sm sm:px-6 lg:hidden"
          aria-label="Navigasi utama"
        >
          {mainNav.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-12 items-center rounded-lg px-3 text-sm",
                  active ? "bg-[#eef6ff] font-medium text-primary" : "text-[#344f72]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {!isAuthenticated && (
            <Link
              href="/daftar"
              className="mt-1 mb-2 flex h-12 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white"
            >
              Buka Warung Gratis
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
