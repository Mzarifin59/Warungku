import { Button } from "@/components/ui/button";
import { exampleStoreSlug, seedStores } from "@/lib/seed-data";
import Link from "next/link";
import { MessageCircle, Plus, Store, Zap } from "lucide-react";

/**
 * Landing M01 — docs 05 §M01.
 * Struktur: hero → problem/solution → how-it-works → for-who → honest-note →
 * closing CTA. Marketing header & footer ada di `SiteChrome`.
 */

export function LandingHero() {
  const exampleStore = seedStores.find((s) => s.slug === exampleStoreSlug);

  return (
    <section className="bg-[#f3f8ff]">
      <div className="container mx-auto grid grid-cols-1 items-center gap-6 px-4 py-8 sm:px-6 md:grid-cols-2 md:gap-8 md:py-12 lg:px-8 lg:gap-12">
        <div>
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide text-primary">
            <span className="size-[7px] rounded-full bg-emerald-400 ring-[3px] ring-emerald-400/15" />
            Katalog online untuk UMKM, pesan lewat WhatsApp
          </p>
          <h1 className="text-[clamp(26px,5.5vw,43px)] leading-[1.22] font-bold tracking-[-1px] sm:tracking-[-1.5px] text-[#263f63]">
            Jual produkmu lewat satu tautan,
            <br />
            tanpa ribet
          </h1>
          <p className="my-4 text-sm leading-[1.8] text-[#6f82a1]">
            Buat katalog toko dalam hitungan menit. Pelanggan pilih produk,
            kamu terima pesanan lewat WhatsApp — tanpa aplikasi tambahan,
            tanpa biaya.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/daftar">
              <Button size="lg" className="w-full min-[480px]:w-auto">
                <Store size={18} /> Buat toko gratis
              </Button>
            </Link>
            {exampleStore && (
              <Link href={`/warung/${exampleStoreSlug}`}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full min-[480px]:w-auto"
                >
                  Lihat contoh toko
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="order-first min-[480px]:order-none">
          {exampleStore && <PhoneMockup />}
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div
      className="mx-auto w-[240px] overflow-hidden rounded-3xl border-[8px] border-[#233e62] bg-white shadow-xl"
      aria-hidden="true"
    >
      <div className="h-24 bg-[#e8eff7]" />
      <div className="space-y-3 p-3">
        {[
          { name: "Roti Cokelat", price: "Rp 8.000" },
          { name: "Kue Lapis", price: "Rp 10.000" },
          { name: "Kopi Susu", price: "Rp 9.000" },
        ].map((product) => (
          <div
            key={product.name}
            className="flex items-center gap-2 rounded-lg border border-[#d9eaff] p-2"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded bg-secondary text-[10px] font-bold text-primary">
              {product.name.charAt(0)}
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-[11px] font-semibold text-[#2c4669]">
                {product.name}
              </strong>
              <span className="block text-[10px] text-[#506681]">
                {product.price}
              </span>
            </span>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-white">
              <Plus size={14} />
            </span>
          </div>
        ))}
        <div className="flex items-center justify-center gap-1.5 rounded-lg bg-[#15803D] py-2 text-xs font-semibold text-white">
          <MessageCircle size={14} /> Lanjut ke WhatsApp
        </div>
      </div>
    </div>
  );
}

const problemCards = [
  {
    icon: <Zap size={18} />,
    title: "Harga selalu berubah",
    text: "Daftar harga di chat cepat basi, pelanggan bingung.",
  },
  {
    icon: <Store size={18} />,
    title: "Katalog rapi",
    text: "Produk tersusun per kategori, mudah dicari.",
  },
  {
    icon: <MessageCircle size={18} />,
    title: "Pesanan lengkap",
    text: "Struktur pesan otomatis, tidak ada item yang terlewat.",
  },
];

export function ProblemSolution() {
  return (
    <section className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {problemCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-[#d9eaff] bg-white p-4"
          >
            <span className="grid size-10 place-items-center rounded-lg bg-secondary text-primary">
              {card.icon}
            </span>
            <strong className="mt-3 block text-sm font-semibold text-[#2b4568]">
              {card.title}
            </strong>
            <p className="mt-1 text-xs leading-5 text-[#8191aa]">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const howItWorks = [
  {
    step: 1,
    title: "Buat toko",
    text: "Daftar, isi nama toko, alamat, dan nomor WhatsAppmu.",
  },
  {
    step: 2,
    title: "Tambah produk",
    text: "Fotokan produk, tentukan harga, dan terbitkan tokomu.",
  },
  {
    step: 3,
    title: "Bagikan tautan",
    text: "Kirim satu link ke pelanggan. Mereka pesan lewat WhatsApp.",
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-base font-bold tracking-[-0.35px] text-[#2b4568] sm:text-xl">
        Cara kerja
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {howItWorks.map((step) => (
          <div key={step.step} className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white">
              {step.step}
            </span>
            <div>
              <strong className="block text-sm font-semibold text-[#2b4568]">
                {step.title}
              </strong>
              <p className="mt-0.5 text-xs leading-5 text-[#8191aa]">
                {step.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const businessTypes = [
  "Kedai kopi",
  "Bakery",
  "Katering",
  "Jajanan",
  "Buah & sayur",
  "Kerajinan",
];

export function ForWho() {
  return (
    <section className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-base font-bold tracking-[-0.35px] text-[#2b4568] sm:text-xl">
        Cocok untuk berbagai usaha
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {businessTypes.map((type) => (
          <span
            key={type}
            className="inline-flex items-center rounded-full border border-[#d9eaff] bg-[#f3f8ff] px-3 py-1.5 text-xs font-medium text-[#344f72]"
          >
            {type}
          </span>
        ))}
      </div>
    </section>
  );
}

export function HonestNote() {
  return (
    <section className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-[#d9eaff] bg-[#f3f8ff] p-4">
        <p className="text-xs leading-5 text-[#6f82a1]">
          <strong className="font-semibold text-[#2b4568]">
            Catatan penting:
          </strong>{" "}
          Pembayaran dan pengiriman diurus langsung antara penjual dan pembeli
          lewat WhatsApp. Warungku hanya membantu menampilkan katalog dan
          membuat pesan pesanan yang rapi.
        </p>
      </div>
    </section>
  );
}

export function ClosingCta() {
  return (
    <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-primary p-6 text-center text-white sm:p-8">
        <h2 className="text-xl font-bold sm:text-2xl">
          Mulai jual lewat WhatsApp sekarang
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
          Gratis, tanpa biaya bulanan. Toko onlinemu siap dalam 5 menit.
        </p>
        <Link href="/daftar" className="mt-5 inline-block">
          <Button size="lg" className="bg-white text-primary hover:bg-white/90">
            Buat toko gratis
          </Button>
        </Link>
      </div>
    </section>
  );
}
