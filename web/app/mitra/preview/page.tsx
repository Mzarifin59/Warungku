import type { Metadata } from "next";
import { MitraPreviewPage } from "@/components/view/mitra-store-pages";

export const metadata: Metadata = {
  title: "Pratinjau Warung — Warungku",
};

export default function Page() {
  return <MitraPreviewPage />;
}
