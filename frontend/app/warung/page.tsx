import type { Metadata } from "next";
import { WarungExplorePage } from "@/components/view/warung-explore-page";

export const metadata: Metadata = {
  title: "Jelajahi Warung — Warungku",
  description: "Temukan warung UMKM favoritmu di sekitar Anda.",
};

export default function Page() {
  return <WarungExplorePage />;
}
