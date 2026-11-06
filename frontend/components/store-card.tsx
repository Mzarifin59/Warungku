import Link from "next/link";
import { Icon } from "@/components/icon";
import { logoColor, logoInitials, type StoreDisplay } from "@/lib/store-display";

export function StoreCard({ store }: { store: StoreDisplay }) {
  return (
    <Link
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#d9eaff] bg-white transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/10"
      href={`/warung/${store.slug}`}
    >
      <div className="h-32 overflow-hidden bg-gradient-to-br from-[#e8eff7] to-[#d7e6f8] sm:h-36">
        {store.image && (
          // eslint-disable-next-line @next/next/no-img-element -- URL dinamis (Storage / eksternal)
          <img
            src={store.image}
            alt=""
            loading="lazy"
            className="size-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="relative flex flex-1 flex-col px-3 pt-3 pb-3.5 sm:px-4">
        <span
          className="absolute -top-6 left-3 grid size-12 place-items-center overflow-hidden rounded-full border-[3px] border-white text-[11px] font-bold text-white shadow-sm sm:left-4"
          style={{ backgroundColor: store.logo ? "#fff" : logoColor(store.name) }}
          aria-hidden="true"
        >
          {store.logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- URL dinamis
            <img src={store.logo} alt="" className="size-full object-cover" />
          ) : (
            logoInitials(store.name)
          )}
        </span>
        <div className="mb-1.5 flex items-center justify-between gap-2 pl-12 text-[#2d4669]">
          <strong className="truncate text-sm font-semibold">{store.name}</strong>
          <Icon
            className="shrink-0 text-[#385b83] transition group-hover:translate-x-0.5"
            name="chevron"
            size={16}
          />
        </div>
        {store.tagline && (
          <p className="line-clamp-2 text-xs leading-relaxed text-[#7185a0]">
            {store.tagline}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-3 text-[11px] text-[#7185a0]">
          <span className="rounded-full bg-[#edf6ff] px-2.5 py-1 text-[#4f77a8]">
            {store.category}
          </span>
          {store.location && (
            <span className="flex min-w-0 items-center gap-1">
              <Icon className="shrink-0" name="pin" size={12} />
              <span className="truncate">{store.location}</span>
            </span>
          )}
          {store.hours && (
            <span className="flex items-center gap-1">
              <Icon className="shrink-0" name="clock" size={12} />
              {store.hours}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
