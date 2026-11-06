import Link from "next/link";
import { Icon } from "@/components/icon";
import {
  logoColor,
  logoInitials,
  type StoreDisplay,
} from "@/lib/home-data";

export function StoreCard({ store }: { store: StoreDisplay }) {
  const hasLogo = Boolean(store.logo);
  const logoText = hasLogo ? undefined : logoInitials(store.name);
  const logoColorValue = hasLogo ? undefined : logoColor(store.name);
  return (
    <Link
      className="overflow-hidden rounded-2xl border border-[#d9eaff] bg-white transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/10"
      href={`/warung/${store.slug}`}
    >
      {store.image ? (
        <img
          src={store.image}
          alt={store.name}
          className="h-36 w-full object-cover sm:h-40"
        />
      ) : (
        <div className="h-36 bg-[#e8eff7] sm:h-40" role="img" aria-label={store.name} />
      )}
      <div className="relative px-3 pt-3 pb-3 sm:px-4">
        {hasLogo ? (
          <img
            src={store.logo}
            alt=""
            className="absolute -top-6 left-3 size-12 rounded-full border-[3px] border-white object-cover shadow-sm sm:left-4"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span
            className="absolute -top-6 left-3 grid size-12 place-items-center rounded-full border-[3px] border-white text-[11px] font-bold text-white shadow-sm sm:left-4"
            style={{ backgroundColor: logoColorValue }}
            aria-hidden="true"
          >
            {logoText}
          </span>
        )}
        <div className="mb-2 flex items-center justify-between gap-2 pl-12 text-[#2d4669]">
          <strong className="truncate text-sm font-semibold">{store.name}</strong>
          <Icon className="shrink-0 text-[#385b83]" name="chevron" size={16} />
        </div>
        <span className="inline-block rounded-full bg-[#edf6ff] px-2.5 py-1 text-[11px] text-[#4f77a8]">
          {store.category}
        </span>
        <div className="mt-3 flex items-center gap-1 text-[11px] text-[#7185a0] sm:text-xs">
          <Icon className="shrink-0" name="pin" size={13} />
          <span className="truncate">{store.location}</span>
        </div>
      </div>
    </Link>
  );
}
