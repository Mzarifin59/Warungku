import type { ReactNode } from "react";
import { Suspense } from "react";
import { MitraShell } from "@/components/layout/mitra-shell";
import { DashboardProvider } from "@/lib/dashboard-provider";

export default function MitraLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <DashboardProvider>
        <MitraShell>{children}</MitraShell>
      </DashboardProvider>
    </Suspense>
  );
}
