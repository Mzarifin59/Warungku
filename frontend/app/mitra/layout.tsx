import type { ReactNode } from "react";
import { MitraShell } from "@/components/layout/mitra-shell";

export default function MitraLayout({ children }: { children: ReactNode }) {
  return <MitraShell>{children}</MitraShell>;
}
