import { Icon } from "@/components/icon";
import Link from "next/link";

const footerGroups = [
  { title: "Tautan Cepat", links: ["Beranda", "Jelajahi", "Warung", "Produk", "Kategori"] },
  {
    title: "Layanan Pelanggan",
    links: ["Pusat Bantuan", "Cara Belanja", "Pembayaran", "Pengiriman", "Hubungi Kami"],
  },
  {
    title: "Tentang Kami",
    links: ["Cerita Warungku", "Jadi Mitra", "Karier", "Kebijakan Privasi", "Syarat & Ketentuan"],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#f3f8ff]">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 pb-6 md:grid-cols-3 lg:grid-cols-[minmax(200px,1.4fr)_repeat(3,minmax(120px,1fr))_auto] lg:gap-6">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link
              className="inline-flex items-center gap-2 text-base font-bold tracking-[-0.6px] text-[#233e62]"
              href="/"
              aria-label="Warungku — Beranda"
            >
              <span className="relative grid size-8 place-items-center text-primary">
                <Icon name="bag" size={25} />
                <span className="absolute top-[9px] text-[11px] font-bold text-white">W</span>
              </span>
              <span>Warungku</span>
            </Link>
            <p className="mt-2 max-w-xs text-xs leading-[1.7] text-[#7387a3]">
              Temukan berbagai toko dan produk dari pelaku UMKM di sekitarmu. Dari makanan, minuman, hingga kebutuhan sehari-hari.
            </p>
          </div>
          {footerGroups.map((group) => (
            <div className="flex flex-col items-start gap-1.5" key={group.title}>
              <h2 className="mb-1 text-xs font-bold text-[#334e70] uppercase">
                {group.title}
              </h2>
              {group.links.map((link) => (
                <a
                  className="py-0.5 text-xs text-[#7185a0] transition-colors hover:text-primary"
                  href={
                    link === "Cerita Warungku"
                      ? "/tentang"
                      : link === "Pusat Bantuan"
                        ? "/bantuan"
                        : "#"
                  }
                  key={link}
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
          <div className="col-span-2 flex gap-4 md:col-span-3 lg:col-span-1 lg:pt-1">
            <a className="text-[#304d72] transition hover:-translate-y-0.5 hover:text-primary" href="#" aria-label="Instagram">
              <Icon name="instagram" size={19} />
            </a>
            <a className="text-[#304d72] transition hover:-translate-y-0.5 hover:text-primary" href="#" aria-label="Facebook">
              <Icon name="facebook" size={19} />
            </a>
            <a className="text-[#304d72] transition hover:-translate-y-0.5 hover:text-primary" href="#" aria-label="X">
              <Icon name="x" size={18} />
            </a>
          </div>
        </div>
        <div className="border-t border-[#bfcee0] pt-4 text-xs text-[#7588a2]">
          © Warungku 2026. Hak Cipta dilindungi
        </div>
      </div>
    </footer>
  );
}
