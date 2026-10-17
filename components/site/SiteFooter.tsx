import Link from "next/link";
import { footer, links } from "@/data/site/home";
import { NewTabNote } from "@/components/site/ExternalMark";

const SOCIAL = [
  { label: "MagicTrickGuy.com", href: links.mtg },
  { label: "Instagram", href: links.instagram },
  { label: "YouTube", href: links.youtube },
  { label: "GitHub", href: links.github }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-so-line bg-so-coal">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="font-so-display text-[1.4rem] font-semibold uppercase tracking-[0.14em] text-so-paper">
              Stefan Oswald
            </Link>
            <p className="mt-4 max-w-xs text-[0.95rem] leading-7 text-so-mute">{footer.blurb}</p>
            <a
              href={links.mailto}
              className="mt-4 inline-block text-[0.95rem] text-so-paper underline decoration-so-gold/60 underline-offset-4 transition-colors so-hover:text-so-gold-2"
            >
              {links.email}
            </a>
          </div>

          {footer.groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-so-dim">{group.title}</p>
              <ul className="mt-4 space-y-3 text-[0.95rem] text-so-mute">
                {group.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors so-hover:text-so-paper">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Elsewhere">
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-so-dim">Elsewhere</p>
            <ul className="mt-4 space-y-3 text-[0.95rem] text-so-mute">
              {SOCIAL.map((item) => (
                <li key={item.href}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="transition-colors so-hover:text-so-paper">
                    {item.label}
                    <NewTabNote />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 border-t border-so-line pt-6 text-[0.82rem] text-so-dim">
          <p>© {new Date().getFullYear()} Stefan Oswald</p>
        </div>
      </div>
    </footer>
  );
}
