import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { SiteChrome } from "@/components/layout/site-chrome";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Warungku — Belanja dari UMKM Lokal",
  description:
    "Temukan makanan, minuman, dan produk lokal terbaik dari warung di sekitar Anda.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${poppins.variable} h-full`}>
      <body className="min-h-full bg-background font-sans text-sm text-foreground antialiased">
        <Suspense fallback={children}>
          <SiteChrome>{children}</SiteChrome>
        </Suspense>
      </body>
    </html>
  );
}
