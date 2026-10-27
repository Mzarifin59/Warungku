import { Icon } from "@/components/icon";
import Link from "next/link";
import {
  ArrowUpRight,
  Box,
  ChevronRight,
  Eye,
  ExternalLink,
  Share2,
  ShoppingCart,
  Star,
  UsersRound,
} from "lucide-react";
import { mitraProducts } from "@/lib/mitra-data";

const metrics = [
  {
    label: "Total Produk",
    value: "12",
    note: "Lihat semua produk",
    icon: Box,
    href: "/mitra/produk",
  },
  {
    label: "Penjualan Hari Ini",
    value: "20 Item",
    note: "Pesanan hari ini",
    icon: ShoppingCart,
  },
  {
    label: "Pengunjung",
    value: "—",
    note: "Belum ada data",
    icon: UsersRound,
  },
  {
    label: "Rating Warung",
    value: "4.8",
    note: "120 ulasan",
    icon: Star,
  },
];

const visitorPoints = "8,104 16,91 33,96 50,87 67,81 84,62 101,75";

export function MitraDashboardPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-[-0.5px] text-[#233e62] sm:text-2xl">
          Selamat datang, Budi!
        </h1>
        <p className="mt-1 text-xs text-[#8794a5] sm:text-sm">
          Kelola Warung dan Produkmu di sini, tingkatkan jangkauan bisnismu dengan mudah.
        </p>
      </div>

      <section className="grid gap-3 lg:grid-cols-[minmax(0,1.8fr)_minmax(250px,0.8fr)]" aria-label="Informasi warung">
        <article className="flex min-h-[132px] items-start gap-3 rounded-2xl border border-[#dce5f0] bg-white p-4 sm:p-5">
          <span className="grid size-14 shrink-0 place-items-center rounded-full border-[3px] border-[#f4d0c2] bg-[#be4b23] text-xs font-bold text-white">
            Dapur<br />Rasa
          </span>
          <div className="min-w-0 flex-1 pt-1">
            <h2 className="font-bold text-[#2b4568]">Dapur Rasa</h2>
            <p className="mt-1 text-sm text-[#8b929c]">Jago nya Ayam Lalapan</p>
            <p className="mt-3 max-w-lg text-xs leading-5 text-[#8491a2]">
              Sajian ayam rumahan dengan bumbu khas dan sambal segar. Temukan menu favoritmu dan
              nikmati hidangan lezat setiap hari.
            </p>
          </div>
          <button
            className="shrink-0 rounded-md border border-[#e1e6ed] px-2.5 py-1.5 text-[10px] text-[#8794a5] transition hover:border-primary hover:text-primary"
            type="button"
          >
            Ubah Warung
          </button>
        </article>

        <article className="rounded-2xl border border-[#c6dcf8] bg-[#dcecff] p-4">
          <h2 className="text-xs font-semibold text-[#334f73]">Tautan Warung Kamu</h2>
          <div className="mt-2 flex h-9 items-center gap-2 rounded-lg border border-[#d3dce8] bg-white px-3 text-xs text-[#8491a2]">
            <span className="min-w-0 flex-1 truncate">https://warungku-gules.vercel.app/warung/dapur-rasa</span>
            <button type="button" aria-label="Salin tautan warung" className="text-[#7f8da0] hover:text-primary">
              <Icon name="share" size={15} />
            </button>
          </div>
          <p className="mt-2 text-[10px] text-[#8491a2]">Bagikan tautan ini ke pelangganmu</p>
          <Link
            className="mt-1.5 flex h-9 items-center justify-center gap-2 rounded-lg bg-primary text-xs font-medium text-white transition-colors hover:bg-[#1769db]"
            href="/mitra/preview/dapur-rasa"
          >
            <Share2 size={14} />
            Bagikan Tautan
          </Link>
        </article>
      </section>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Statistik warung">
        {metrics.map(({ label, value, note, icon: MetricIcon, href }) => {
          const content = (
            <>
              <div className="flex items-center gap-2.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e6f1ff] text-primary">
                  <MetricIcon size={18} strokeWidth={1.8} />
                </span>
                <span className="text-xs font-semibold text-[#7d8794] sm:text-sm">{label}</span>
              </div>
              <strong className="mt-2 block text-xl font-bold text-[#2b4568]">{value}</strong>
              <span className="mt-1 block text-[11px] text-[#8491a2]">
                {note}
                {href && <ArrowUpRight className="ml-1 inline text-primary" size={12} />}
              </span>
            </>
          );

          return href ? (
            <Link
              className="min-h-[132px] rounded-xl border border-[#dce5f0] bg-white p-3.5 transition hover:border-primary/40 hover:shadow-sm sm:p-4"
              href={href}
              key={label}
            >
              {content}
            </Link>
          ) : (
            <article
              className="min-h-[132px] rounded-xl border border-[#dce5f0] bg-white p-3.5 sm:p-4"
              key={label}
            >
              {content}
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)]">
        <article className="overflow-hidden rounded-xl border border-[#dce5f0] bg-white">
          <div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
            <h2 className="text-sm font-bold text-[#2b4568]">Produk Terbaru</h2>
            <Link className="flex items-center gap-1 text-xs font-medium text-primary hover:underline" href="/mitra/produk">
              Lihat Semua <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto px-3 pb-3 sm:px-4">
            <table className="w-full min-w-[440px] text-left text-xs">
              <thead className="text-[10px] text-[#8b929c]">
                <tr className="border-b border-[#edf0f4]">
                  <th className="px-2 py-2 font-medium">Nama Produk</th>
                  <th className="px-2 py-2 font-medium">Harga</th>
                  <th className="px-2 py-2 font-medium">Terakhir Diubah</th>
                  <th className="px-2 py-2 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mitraProducts.slice(0, 5).map((product) => (
                  <tr className="border-b border-[#edf0f4] last:border-0" key={product.name}>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-2">
                        <span className="size-8 shrink-0 rounded-md bg-[#ffd6d5]" aria-hidden="true" />
                        <span>
                          <strong className="block text-[11px] font-semibold text-[#334e70]">{product.name}</strong>
                          <small className="text-[9px] text-[#8b929c]">{product.category}</small>
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2 font-semibold text-[#334e70]">{product.price}</td>
                    <td className="px-2 py-2 text-[10px] text-[#8794a5]">{product.updatedAt}</td>
                    <td className="px-2 py-2 text-right">
                      <span
                        className={`rounded-full px-2 py-1 text-[9px] ${
                          product.status === "Tersedia"
                            ? "bg-[#d9f5e8] text-[#348d68]"
                            : product.status === "Stok menipis"
                              ? "bg-[#fff1d2] text-[#a67412]"
                              : "bg-[#edf0f4] text-[#7b8490]"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-xl border border-[#dce5f0] bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#2b4568]">Statistik Pengunjung Warung</h2>
              <p className="mt-1 text-[11px] text-[#8794a5]">Ringkasan kunjungan selama 7 hari</p>
            </div>
            <span className="rounded-lg border border-[#e5e9ef] px-2.5 py-1.5 text-[10px] text-[#8794a5]">
              7 Hari Terakhir <ChevronRight className="ml-1 inline -rotate-90" size={11} />
            </span>
          </div>
          <div className="mt-5">
            <svg
              className="h-[150px] w-full overflow-visible"
              viewBox="0 0 110 112"
              preserveAspectRatio="none"
              role="img"
              aria-label="Grafik pengunjung warung selama tujuh hari"
            >
              <defs>
                <linearGradient id="visitor-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#227bf3" stopOpacity=".16" />
                  <stop offset="100%" stopColor="#227bf3" stopOpacity=".01" />
                </linearGradient>
              </defs>
              {[15, 38, 61, 84].map((y) => (
                <line key={y} x1="8" x2="108" y1={y} y2={y} stroke="#edf1f6" strokeWidth=".6" />
              ))}
              <polygon points={`8,104 ${visitorPoints} 108,104`} fill="url(#visitor-fill)" />
              <polyline points={visitorPoints} fill="none" stroke="#3886f5" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
              {visitorPoints.split(" ").map((point) => {
                const [cx, cy] = point.split(",");
                return <circle key={point} cx={cx} cy={cy} r="1.5" fill="#3886f5" />;
              })}
            </svg>
            <div className="mt-1 flex justify-between pl-[6%] text-[9px] text-[#8896a9]">
              {["8 Okt", "9 Okt", "10 Okt", "11 Okt", "12 Okt", "13 Okt", "14 Okt"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#edf1f6] pt-3">
            <span className="flex items-center gap-1.5 text-[10px] text-[#8794a5]">
              <Eye size={14} className="text-primary" /> Total kunjungan
            </span>
            <span className="text-xs font-semibold text-[#2b4568]">Belum ada data</span>
          </div>
        </article>
      </section>

      <Link
        className="inline-flex items-center gap-1 text-xs text-[#75849a] hover:text-primary"
        href="/warung/dapur-rasa"
      >
        Buka halaman publik <ExternalLink size={13} />
      </Link>
    </div>
  );
}
