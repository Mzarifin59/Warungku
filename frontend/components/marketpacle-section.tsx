import { StoreCard } from "@/components/store-card";
import { benefits, categories, products, stores } from "@/lib/home-data";
import { Icon } from "@/components/icon";
import { BenefitsIllustration } from "@/components/benefits-illustration";

function SectionHeading({
  title,
  subtitle,
  href = "#",
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-base font-bold tracking-[-0.35px] text-[#2b4568] sm:text-xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-xs text-[#8191aa] sm:text-sm">{subtitle}</p>}
      </div>
      <a
        className="inline-flex shrink-0 items-center gap-1 pt-1 text-xs font-medium text-primary hover:underline sm:text-sm"
        href={href}
      >
        Lihat Semua <Icon className="-rotate-45" name="chevron" size={14} />
      </a>
    </div>
  );
}

export function CategorySection() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10" aria-labelledby="categories-title">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2
          className="text-base font-bold tracking-[-0.35px] text-[#2b4568] sm:text-xl"
          id="categories-title"
        >
          Jelajahi Kategori
        </h2>
        <a
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline sm:text-sm"
          href="#"
        >
          Lihat Semua <Icon className="-rotate-45" name="arrow-right" size={14} />
        </a>
      </div>
      <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <a
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d9eaff] bg-white px-3 py-1.5 text-xs text-[#344f72] transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/10 sm:min-h-[48px] sm:gap-2.5 sm:px-4 sm:text-sm"
            href="#"
            key={category.name}
          >
            <span
              className="grid size-7 place-items-center rounded-full text-white sm:size-8"
              style={{ backgroundColor: category.color }}
            >
              <Icon name={category.icon} size={17} />
            </span>
            {category.name}
          </a>
        ))}
      </div>
    </section>
  );
}

export function StoreSection() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
      <SectionHeading
        title="Warung Pilihan"
        href="/warung"
        subtitle="Warung UMKM yang Sedang Populer"
      />
      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {stores.map((store) => (
          <StoreCard key={store.name} store={store} />
        ))}
      </div>
    </section>
  );
}

export function ProductSection() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
      <SectionHeading
        title="Produk Terlaris"
        subtitle="Pilihan produk favorit dari berbagai toko UMKM"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {products.map((product) => (
          <article
            className="min-w-0 overflow-hidden rounded-[15px] border border-[#d9eaff] bg-white p-1.5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/10"
            key={product.name}
          >
            <a
              className="block aspect-[1.2] rounded-[10px] bg-[#e7edf4] bg-cover bg-center"
              href="#"
              style={{ backgroundImage: `url("${product.image}")` }}
              role="img"
              aria-label={product.name}
            />
            <div className="px-px pt-2 pb-px">
              <a
                className="block truncate text-xs font-semibold text-[#2c4669] sm:text-sm"
                href="#"
              >
                {product.name}
              </a>
              <span className="mt-0.5 block truncate text-xs text-[#506681] sm:text-sm">
                {product.price}
              </span>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#8292aa] sm:text-[11px]">
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-full border border-[#f1e5d9] text-[8px] font-bold text-white"
                  style={{ backgroundColor: product.logoColor }}
                  aria-hidden="true"
                >
                  {product.logo}
                </span>
                <span className="truncate">{product.store}</span>
                <button
                  className="ml-auto grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-[#2873c9] transition hover:scale-105 hover:bg-[#c1ddff]"
                  type="button"
                  aria-label={`Tambah ${product.name} ke keranjang`}
                >
                  <Icon name="plus" size={15} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Benefits() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:my-10">
      <div className="relative overflow-hidden rounded-2xl bg-secondary px-5 py-6 sm:px-8 sm:py-8 lg:pr-72">
        <h2 className="text-lg font-bold tracking-[-0.35px] text-[#2e496c] sm:text-xl">
          Belanja Makin Mudah
        </h2>
        <p className="mt-1 text-xs text-[#7185a0] sm:text-sm">
          Akses Warungku kapan saja, di mana saja.
        </p>
        <div className="mt-6 grid gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 md:gap-6">
          {benefits.map((benefit) => (
            <div className="flex items-center gap-3" key={benefit.title}>
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
            </div>
          ))}
        </div>
        <BenefitsIllustration className="pointer-events-none absolute right-6 bottom-0 hidden h-[170px] w-auto lg:block xl:right-12" />
      </div>
    </section>
  );
}
