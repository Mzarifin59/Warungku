import type { Metadata } from "next";
import { MitraDashboardPage } from "@/components/view/mitra-dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard Mitra — Warungku",
};

export default function Page() {
  return <MitraDashboardPage />;
}
