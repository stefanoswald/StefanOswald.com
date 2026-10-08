import Link from "next/link";
import { footer, links } from "@/data/site/home";
import { CallButton } from "@/components/site/ui";
import { NewTabNote } from "@/components/site/ExternalMark";

export function SiteFooter() {
  return (
    <footer className="border-t border-so-line bg-so-coal">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div>
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

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-7 gap-y-3 text-[0.95rem] text-so-mute">
              {footer.links.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors so-hover:text-so-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={links.github} target="_blank" rel="noopener noreferrer" className="transition-colors so-hover:text-so-paper">
                  GitHub
                  <NewTabNote />
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:text-right">
            <CallButton />
          </div>
        </div>

        <div className="mt-14 border-t border-so-line pt-6 text-[0.82rem] text-so-dim">
          <p>© {new Date().getFullYear()} Stefan Oswald</p>
        </div>
      </div>
    </footer>
  );
}
