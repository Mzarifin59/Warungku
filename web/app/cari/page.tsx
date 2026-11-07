import type { Metadata } from "next";
import { sanitizeQuery, searchCatalog } from "@/lib/repos/search-repo";
import { SearchPage } from "@/components/view/search-page";

export async function generateMetadata({
  searchParams,
}: PageProps<"/cari">): Promise<Metadata> {
  const q = sanitizeQuery((await searchParams).q);
  return {
    title: q ? `Hasil pencarian "${q}" — Warungku` : "Cari — Warungku",
    robots: { index: false },
  };
}

export default async function Page({ searchParams }: PageProps<"/cari">) {
  const q = sanitizeQuery((await searchParams).q);
  const result = await searchCatalog(q);
  return <SearchPage result={result} />;
}
