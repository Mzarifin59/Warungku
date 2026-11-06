import Link from "next/link";
import { Icon } from "@/components/icon";
import { footerGroups, site, socialLinks } from "@/lib/content/site";

export function SiteFooter() {
  const socials = socialLinks.filter((s) => s.href);

  return (
    <footer className="mt-auto bg-[#f3f8ff]">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 pb-8 md:grid-cols-4 lg:grid-cols-[minmax(220px,1.6fr)_repeat(3,minmax(140px,1fr))] lg:gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link
              className="inline-flex items-center gap-2 text-base font-bold tracking-[-0.6px] text-[#233e62]"
              href="/"
              aria-label={`${site.name} — Beranda`}
            >
              <span className="relative grid size-8 place-items-center text-primary">
                <Icon name="bag" size={25} />
                <span className="absolute top-[9px] text-[11px] font-bold text-white">W</span>
              </span>
              <span>{site.name}</span>
            </Link>
            <p className="mt-2 max-w-xs text-xs leading-[1.7] text-[#7387a3]">{site.tagline}</p>
            {socials.length > 0 && (
              <div className="mt-4 flex gap-4">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-[#304d72] transition hover:-translate-y-0.5 hover:text-primary"
                  >
                    <Icon name={s.icon} size={19} />
                  </a>
                ))}
              </div>
            )}
          </div>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-2 text-xs font-bold tracking-wide text-[#334e70] uppercase">
                {group.title}
              </h2>
              <ul className="space-y-1.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      className="text-xs text-[#7185a0] transition-colors hover:text-primary"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#bfcee0] pt-4 text-xs text-[#7588a2]">
          {site.copyright}
        </div>
      </div>
    </footer>
  );
}
