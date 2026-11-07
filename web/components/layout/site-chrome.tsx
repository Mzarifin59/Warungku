"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/daftar";
  const isMitraPage = pathname.startsWith("/mitra");

  return (
    <>
      {!isAuthPage && !isMitraPage && <SiteHeader />}
      {children}
      {!isAuthPage && !isMitraPage && <SiteFooter />}
    </>
  );
}
