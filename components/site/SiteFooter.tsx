import Link from "next/link";
import { footer, links } from "@/data/site/home";
import { ExternalMark, NewTabNote } from "@/components/site/ExternalMark";

export function SiteFooter() {
  return (
    <footer className="border-t border-so-line bg-so-coal">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link href="/" className="font-so-display text-[1.4rem] font-semibold uppercase tracking-[0.14em] text-so-paper">
              Stefan Oswald
            </Link>
            <p className="mt-4 max-w-xs text-[0.95rem] leading-7 text-so-mute">{footer.blurb}</p>
            <a
              href={links.mailto}
              className="mt-5 inline-block text-[0.95rem] text-so-paper underline decoration-so-gold/60 underline-offset-4 transition-colors so-hover:text-so-gold-2"
            >
              {links.email}
            </a>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.9rem] text-so-mute">
              {footer.social.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="transition-colors so-hover:text-so-paper">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footer.columns.map((column) => (
              <div key={column.title}>
                <h2 className="font-so-display text-[1.15rem] font-semibold text-so-paper">{column.title}</h2>
                <ul className="mt-4 space-y-3 text-[0.93rem] text-so-mute">
                  {column.links.map((item) => (
                    <li key={item.label}>
                      {"external" in item && item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors so-hover:text-so-paper"
                        >
                          <WithMark label={item.label} />
                          <NewTabNote />
                        </a>
                      ) : (
                        <Link href={item.href} className="transition-colors so-hover:text-so-paper">
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-so-line pt-6 text-[0.82rem] text-so-dim sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Stefan Oswald</p>
          <p>@MagicTrickGuy everywhere</p>
        </div>
      </div>
    </footer>
  );
}

/** Keeps the little arrow on the same line as the last word, so it never wraps alone. */
function WithMark({ label }: { label: string }) {
  const words = label.split(" ");
  const last = words.pop();
  return (
    <>
      {words.length ? `${words.join(" ")} ` : null}
      <span className="whitespace-nowrap">
        {last}
        <ExternalMark className="ml-1.5 inline-block h-[0.65em] w-[0.65em] align-[0.05em]" />
      </span>
    </>
  );
}
