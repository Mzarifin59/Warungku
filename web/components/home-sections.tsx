import Link from "next/link";
import { BenefitsIllustration } from "@/components/benefits-illustration";
import { Icon } from "@/components/icon";
import { ProductCard } from "@/components/product-card";
import { StoreCard } from "@/components/store-card";
import { homeBenefits, homeCategories, homeSections, sellerCta } from "@/lib/content/home";
import type { ProductDisplay, StoreDisplay } from "@/lib/store-display";

const container = "container mx-auto px-4 sm:px-6 lg:px-8";

export function SectionHeading({
  id,
  title,
  subtitle,
  href,
}: {
  id: string;
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 id={id} className="text-lg font-bold tracking-[-0.35px] text-[#2b4568] sm:text-xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-xs text-[#8191aa] sm:text-sm">{subtitle}</p>}
      </div>
      {href && (
        <Link
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline sm:text-sm"
          href={href}
        >
          Lihat Semua <Icon name="arrow-right" size={14} />
        </Link>
      )}
    </div>
  );
}

export function CategorySection() {
  return (
    <section className={`${container} mb-10`} aria-labelledby="categories-title">
      <SectionHeading id="categories-title" title={homeSections.categories.title} />
      <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:px-0 [&::-webkit-scrollbar]:hidden">
        {homeCategories.map((category) => (
          <Link
            className="group flex min-h-12 shrink-0 items-center gap-2.5 rounded-xl border border-[#d9eaff] bg-white px-3 py-2 text-xs font-medium text-[#344f72] transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/10 sm:text-sm lg:flex-col lg:justify-center lg:gap-2 lg:py-4"
            href={`/cari?q=${encodeURIComponent(category.query)}`}
            key={category.name}
          >
            <span
              className="grid size-8 shrink-0 place-items-center rounded-full text-white transition group-hover:scale-110 lg:size-10"
              style={{ backgroundColor: category.color }}
            >
              <Icon name={category.icon} size={18} />
            </span>
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function StoreSection({ stores }: { stores: StoreDisplay[] }) {
  const { title, subtitle } = homeSections.stores;
  return (
    <section className={`${container} mb-10`} aria-labelledby="stores-title">
      <SectionHeading id="stores-title" title={title} subtitle={subtitle} href="/warung" />
      {stores.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#bcd6f5] bg-[#f3f8ff] px-4 py-10 text-center">
          <p className="text-sm text-[#6f82a1]">{homeSections.emptyStores}</p>
          <Link href="/daftar" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
            Buka warung gratis
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </section>
  );
}

export function ProductSection({ products }: { products: ProductDisplay[] }) {
  if (products.length === 0) return null;
  const { title, subtitle } = homeSections.products;
  return (
    <section className={`${container} mb-10`} aria-labelledby="products-title">
      <SectionHeading id="products-title" title={title} subtitle={subtitle} href="/cari" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export function Benefits() {
  return (
    <section className={`${container} mb-10`} aria-labelledby="benefits-title">
      <div className="relative overflow-hidden rounded-2xl bg-secondary px-5 py-6 sm:px-8 sm:py-8 lg:pr-72">
        <h2 id="benefits-title" className="text-lg font-bold tracking-[-0.35px] text-[#2e496c] sm:text-xl">
          {homeBenefits.title}
        </h2>
        <p className="mt-1 text-xs text-[#7185a0] sm:text-sm">{homeBenefits.subtitle}</p>
        <ul className="mt-6 grid gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 md:gap-6">
          {homeBenefits.items.map((benefit) => (
            <li className="flex items-center gap-3" key={benefit.title}>
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-white sm:size-[52px]">
                <Icon name={benefit.icon} size={22} />
              </span>
              <span>
                <strong className="mb-0.5 block text-xs font-semibold text-[#2e496c] sm:text-sm">
                  {benefit.title}
                </strong>
                <small className="block text-[11px] text-[#7185a0] sm:text-xs">
                  {benefit.description}
                </small>
              </span>
            </li>
          ))}
        </ul>
        <BenefitsIllustration className="pointer-events-none absolute right-6 bottom-0 hidden h-[170px] w-auto lg:block xl:right-12" />
      </div>
    </section>
  );
}

export function SellerCta() {
  return (
    <section className={`${container} mb-12`}>
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-primary p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="text-lg font-bold sm:text-xl">{sellerCta.title}</h2>
          <p className="mt-1 max-w-xl text-sm text-white/85">{sellerCta.description}</p>
        </div>
        <Link
          href={sellerCta.action.href}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-primary transition hover:bg-white/90"
        >
          {sellerCta.action.label} <Icon name="arrow-right" size={16} />
        </Link>
      </div>
    </section>
  );
}
