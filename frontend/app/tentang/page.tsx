import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icon";

export const metadata: Metadata = {
  title: "Tentang Kami — Warungku",
  description:
    "Kenali Warungku, ruang untuk menemukan warung lokal dan mendukung pelaku UMKM di sekitar kita.",
};

const values: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "heart",
    title: "Berpihak pada lokal",
    description:
      "Kami percaya usaha kecil punya cerita dan kualitas yang layak dikenal lebih luas.",
  },
  {
    icon: "shield",
    title: "Membangun kepercayaan",
    description:
      "Kami ingin membuat pengalaman menemukan warung terasa nyaman, jelas, dan mudah.",
  },
  {
    icon: "bag",
    title: "Tumbuh bersama",
    description:
      "Ketika pelanggan dan pemilik warung terhubung, komunitas lokal ikut berkembang.",
  },
];

export default function TentangPage() {
  return (
    <main>
      <section className="overflow-hidden bg-[#f3f8ff]">
        <div className="container mx-auto grid items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-2 lg:gap-14 lg:px-8 lg:py-16">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-primary">
              <span className="size-[7px] rounded-full bg-emerald-400 ring-[3px] ring-emerald-400/15" />
              Cerita di balik Warungku
            </p>
            <h1 className="text-[clamp(28px,5vw,44px)] leading-[1.2] font-bold tracking-[-1px] text-[#263f63]">
              Warung lokal, lebih dekat dengan kita
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-[1.9] text-[#6f82a1]">
              Warungku hadir untuk membantu kamu menemukan beragam warung dan
              produk UMKM di sekitar. Kami ingin membuat langkah sederhana
              untuk mendukung usaha lokal jadi lebih mudah dilakukan setiap
              hari.
            </p>
            <Link
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition hover:bg-blue-600"
              href="/warung"
            >
              Jelajahi warung
              <Icon name="arrow-right" size={17} />
            </Link>
          </div>
          <div className="relative">
            <div
              className="absolute -inset-3 rounded-[28px] bg-[#dbeeff]"
              aria-hidden="true"
            />
            <Image
              className="relative aspect-[5/3] w-full rounded-2xl object-cover shadow-lg shadow-blue-900/10"
              src="/umkm_hero.jpg"
              alt="Pelaku UMKM lokal menyiapkan produk untuk pelanggan"
              width={800}
              height={480}
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            Tujuan kami
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.6px] text-[#263f63] sm:text-3xl">
            Mendukung usaha kecil lewat koneksi yang bermakna
          </h2>
          <p className="mt-4 text-sm leading-[1.9] text-[#6f82a1]">
            Banyak hal baik tumbuh dari lingkungan sekitar: makanan favorit,
            produk buatan tangan, dan orang-orang yang merintis usaha dengan
            penuh semangat. Warungku ingin menjadi penghubung agar karya mereka
            lebih mudah ditemukan dan semakin banyak orang bisa memilih produk
            lokal.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
          {values.map((value) => (
            <article
              className="rounded-2xl border border-[#e3edf9] bg-white p-5 shadow-sm shadow-blue-900/[0.03]"
              key={value.title}
            >
              <span className="grid size-11 place-items-center rounded-full bg-secondary text-primary">
                <Icon name={value.icon} size={21} />
              </span>
              <h3 className="mt-4 text-base font-semibold text-[#304a6d]">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-[1.8] text-[#7387a3]">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#f3f8ff] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-lg font-bold text-[#263f63] sm:text-xl">
              Yuk, dukung warung di sekitar kita
            </h2>
            <p className="mt-1 text-sm leading-[1.8] text-[#6f82a1]">
              Temukan produk lokal yang cocok untuk kebutuhanmu.
            </p>
          </div>
          <Link
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-[#d4e6fb] bg-white px-4 text-sm font-medium text-primary transition hover:border-primary hover:bg-secondary/50"
            href="/warung"
          >
            Mulai jelajahi
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
