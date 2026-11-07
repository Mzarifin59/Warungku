import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { faqs } from "@/lib/content/pages";

export const metadata: Metadata = {
  title: "Bantuan & FAQ — Warungku",
  description:
    "Jawaban atas pertanyaan umum tentang mencari warung, memesan, dan membuka warung di Warungku.",
};

export default function BantuanPage() {
  return (
    <main>
      <section className="bg-[#f3f8ff]">
        <div className="container mx-auto px-4 py-10 text-center sm:px-6 sm:py-14 lg:px-8">
          <p className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold text-primary">
            <span className="size-[7px] rounded-full bg-emerald-400 ring-[3px] ring-emerald-400/15" />
            Pusat bantuan Warungku
          </p>
          <h1 className="text-[clamp(28px,5vw,42px)] leading-tight font-bold tracking-[-1px] text-[#263f63]">
            Ada yang bisa kami bantu?
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-[1.8] text-[#6f82a1]">
            Temukan jawaban seputar cara mencari warung dan menggunakan
            Warungku melalui pertanyaan yang sering diajukan berikut.
          </p>
        </div>
      </section>

      <section
        className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
        aria-labelledby="faq-heading"
      >
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="mt-2 text-2xl font-bold tracking-[-0.6px] text-[#263f63] sm:text-3xl"
          >
            Pertanyaan yang sering diajukan
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details
              className="group rounded-2xl border border-[#e3edf9] bg-white px-4 shadow-sm shadow-blue-900/[0.03] open:border-[#c9def8] sm:px-5"
              key={faq.question}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-[#304a6d] marker:hidden sm:text-base [&::-webkit-details-marker]:hidden">
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 text-xs font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {faq.question}
                </span>
                <Icon
                  name="chevron"
                  size={18}
                  className="shrink-0 text-[#8194ad] transition-transform group-open:rotate-90"
                />
              </summary>
              <p className="pb-4 pl-8 text-sm leading-[1.8] text-[#7387a3]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#f3f8ff] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-lg font-bold text-[#263f63] sm:text-xl">
              Siap menemukan warung favoritmu?
            </h2>
            <p className="mt-1 text-sm leading-[1.8] text-[#6f82a1]">
              Jelajahi pilihan warung dan produk UMKM lokal.
            </p>
          </div>
          <Link
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:bg-blue-600"
            href="/warung"
          >
            Jelajahi warung
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
