import type { Metadata } from "next";
import { MitraStorePage } from "@/components/view/mitra-store-pages";

export const metadata: Metadata = {
  title: "Warung Saya — Warungku",
};

export default function Page() {
  return <MitraStorePage />;
}
