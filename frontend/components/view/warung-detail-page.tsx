import { Icon, type IconName } from "@/components/icon";
import { products, type Store } from "@/lib/home-data";

export function WarungDetailPage({ store }: { store: Store }) {
  const storeProducts = products.filter((product) => product.store === store.name);

  const stats: { icon: IconName; label: string; value: string; note?: string; tint: string }[] = [
    {
      icon: "star",
      label: "Rating Warung",
      value: store.rating,
      note: `(${store.reviews} Ulasan)`,
      tint: "bg-amber-100 text-amber-500",
    },
    {
      icon: "basket",
      label: "Produk Terjual",
      value: `${store.sold} Item`,
      tint: "bg-secondary text-primary",
    },
    {
      icon: "clock",
      label: "Jam Operasional",
      value: store.hours,
      tint: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: "pin",
      label: "Lokasi",
      value: store.location,
      tint: "bg-rose-100 text-rose-500",
    },
  ];

  return (
    <main className="bg-[#f3f8ff] pt-6 pb-12 sm:pt-8">
      <section
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        aria-labelledby="warung-title"
      >
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-blue-900/5">
          <div
            className="h-32 bg-[#e8eff7] bg-cover bg-center sm:h-40 lg:h-48"
            style={{ backgroundImage: `url("${store.image}")` }}
            role="img"
            aria-label={`Sampul ${store.name}`}
          />
          <div className="px-4 pb-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
              <span
                className="-mt-10 grid size-20 shrink-0 place-items-center rounded-full border-4 border-white text-xl font-bold text-white shadow-sm sm:-mt-12 sm:size-24 sm:text-2xl"
                style={{ backgroundColor: store.logoColor }}
                aria-hidden="true"
              >
                {store.logo}
              </span>
              <div className="min-w-0 flex-1 sm:pb-1">
                <h1
                  className="truncate text-lg font-bold text-[#233e62] sm:text-xl"
                  id="warung-title"
                >
                  {store.name}
                </h1>
                <p className="text-sm text-[#6f82a1]">{store.tagline}</p>
              </div>
              <div className="flex items-center gap-2 sm:pb-1">
                <button
                  className="h-9 rounded-lg bg-primary px-5 text-sm font-medium text-white transition hover:bg-blue-600"
                  type="button"
                >
                  Ikuti+
                </button>
                <button
                  className="h-9 rounded-lg border border-primary/40 bg-secondary px-5 text-sm font-medium text-primary transition hover:bg-[#c1ddff]"
                  type="button"
                >
                  Chat
                </button>
                <button
                  className="grid size-9 place-items-center rounded-lg border border-slate-300 text-slate-500 transition hover:border-primary hover:text-primary"
                  type="button"
                  aria-label={`Bagikan ${store.name}`}
                >
                  <Icon name="share" size={16} />
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  className="flex items-center gap-3 rounded-xl bg-[#f3f8ff] px-3.5 py-3"
                  key={stat.label}
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-lg ${stat.tint}`}
                  >
                    <Icon
                      className={stat.icon === "star" ? "fill-current" : undefined}
                      name={stat.icon}
                      size={20}
                    />
                  </span>
                  <span className="min-w-0">
                    <small className="block text-[11px] text-[#7185a0]">{stat.label}</small>
                    <strong className="block truncate text-sm font-semibold text-[#2e496c]">
                      {stat.value}
                      {stat.note && (
                        <span className="ml-1 text-xs font-normal text-[#7185a0]">
                          {stat.note}
                        </span>
                      )}
                    </strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="container mx-auto mt-10 px-4 sm:mt-14 sm:px-6 lg:px-8"
        aria-labelledby="products-title"
      >
        <h2 className="mb-4 text-base font-bold text-[#2b4568] sm:text-xl" id="products-title">
          Semua Produk{" "}
          <span className="text-xs font-semibold text-[#6f82a1]">
            ({storeProducts.length} produk)
          </span>
        </h2>
        {storeProducts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#bcd6f5] bg-white/60 px-4 py-10 text-center text-sm text-[#7185a0]">
            Warung ini belum memiliki produk.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
            {storeProducts.map((product) => (
              <article
                className="min-w-0 overflow-hidden rounded-2xl border border-[#d9eaff] bg-white p-2 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/10"
                key={product.name}
              >
                <div
                  className="aspect-[1.2] rounded-xl bg-[#e7edf4] bg-cover bg-center"
                  style={{ backgroundImage: `url("${product.image}")` }}
                  role="img"
                  aria-label={product.name}
                />
                <div className="flex items-end justify-between gap-2 px-1 pt-2 pb-1">
                  <div className="min-w-0">
                    <h3 className="truncate text-xs font-semibold text-[#2c4669] sm:text-sm">
                      {product.name}
                    </h3>
                    <span className="block truncate text-xs text-[#506681] sm:text-sm">
                      {product.price}
                    </span>
                  </div>
                  <button
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-[#2873c9] transition hover:scale-105 hover:bg-[#c1ddff]"
                    type="button"
                    aria-label={`Tambah ${product.name} ke keranjang`}
                  >
                    <Icon name="plus" size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
