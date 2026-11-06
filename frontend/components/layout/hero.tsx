import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { SearchForm } from "@/components/search-form";
import { homeHero } from "@/lib/content/home";

export function Hero({ storeCount }: { storeCount: number }) {
  return (
    <section className="overflow-hidden bg-[#f3f8ff]">
      <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1.1fr_1fr] md:py-14 lg:gap-14 lg:px-8">
        <div className="min-w-0">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.3px] text-primary">
            <span className="size-[7px] rounded-full bg-emerald-400 ring-[3px] ring-emerald-400/15" />
            {storeCount > 0 ? `${storeCount} warung UMKM siap melayani` : homeHero.eyebrow}
          </p>
          <h1 className="text-[clamp(28px,5.5vw,46px)] leading-[1.18] font-bold tracking-[-1px] text-[#263f63] sm:tracking-[-1.5px]">
            {homeHero.title[0]}
            <br />
            <span className="text-primary">{homeHero.title[1]}</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-[1.8] text-[#6f82a1] sm:text-base">
            {homeHero.description}
          </p>

          <SearchForm variant="hero" className="mt-6 max-w-xl" />
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#6f82a1]">
            <span>Populer:</span>
            {homeHero.popularSearches.map((term) => (
              <Link
                key={term}
                href={`/cari?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-[#d9eaff] bg-white px-3 py-1.5 text-[#344f72] transition hover:border-primary hover:text-primary"
              >
                {term}
              </Link>
            ))}
          </div>

          <ul className="mt-7 grid grid-cols-1 gap-3 min-[480px]:grid-cols-3">
            {homeHero.sellingPoints.map((point) => (
              <li className="flex items-center gap-2.5" key={point.title}>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-[#294a72] sm:size-10">
                  <Icon name={point.icon} size={20} />
                </span>
                <span>
                  <strong className="mb-0.5 block text-xs font-semibold text-[#304a6d]">
                    {point.title}
                  </strong>
                  <small className="block text-[11px] text-[#8191aa]">{point.text}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative hidden md:block">
          <div className="absolute -inset-3 rounded-[28px] bg-[#dbeeff]" aria-hidden="true" />
          <Image
            className="relative aspect-[5/4] w-full rounded-2xl object-cover shadow-lg shadow-blue-900/10"
            src={homeHero.image.src}
            alt={homeHero.image.alt}
            width={640}
            height={512}
            sizes="(min-width: 768px) 45vw, 100vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}
