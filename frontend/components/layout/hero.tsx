import { Icon, type IconName } from "@/components/icon";
import Image from "next/image";

const sellingPoints: { icon: IconName; title: string; text: string }[] = [
  { icon: "shield", title: "Toko Terpercaya", text: "Langsung dari pemilik" },
  { icon: "bolt", title: "Proses Cepat", text: "Pesan tanpa ribet" },
  { icon: "heart", title: "Dukung UMKM", text: "Bantu ekonomi lokal" },
];

export function Hero() {
  return (
    <section className="overflow-hidden bg-[#f3f8ff]">
      <div className="container mx-auto grid grid-cols-1 items-center gap-6 px-4 sm:px-6 lg:px-8 py-8 md:grid-cols-2 md:gap-8 md:py-12 lg:gap-12">
        <div className="w-full">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.3px] text-primary">
          <span className="size-[7px] rounded-full bg-emerald-400 ring-[3px] ring-emerald-400/15" />
          Pasar lokal, sekarang di genggaman
        </p>
        <h1 className="text-[clamp(26px,5.5vw,43px)] leading-[1.22] font-bold tracking-[-1px] sm:tracking-[-1.5px] text-[#263f63]">
          Dukung UMKM Lokal,
          <br />
          Belanja Jadi Lebih Mudah
        </h1>
        <p className="my-4 text-sm leading-[1.8] text-[#6f82a1]">
          Temukan berbagai toko dan produk dari pelaku UMKM di sekitarmu.
          {" "}
          Dari makanan, minuman, hingga kebutuhan sehari-hari.
        </p>
        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
          {sellingPoints.map((point) => (
            <div className="flex items-center gap-2.5" key={point.title}>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-[#294a72] sm:size-10">
                <Icon name={point.icon} size={21} />
              </span>
              <span>
                <strong className="mb-0.5 block text-xs font-semibold text-[#304a6d]">
                  {point.title}
                </strong>
                <small className="block text-[11px] text-[#8191aa]">{point.text}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
      <Image
        className="h-auto w-full rounded-2xl object-cover shadow-lg shadow-blue-900/10"
        src="/umkm_hero.jpg"
        alt="Pelaku UMKM lokal"
        width={500}
        height={300}
        sizes="(min-width: 768px) 50vw, 100vw"
        priority
      />
      </div>
    </section>
  );
}
