import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/meta";
import Link from "next/link";
import { ExternalMark, NewTabNote } from "@/components/site/ExternalMark";
import { PageIntro } from "@/components/site/PageIntro";
import { links } from "@/data/site/home";

export const metadata: Metadata = pageMetadata({
  title: "Writing",
  description:
    "Your Fullest Potential, a personal growth book ten years in the making, and The Contingency, a science fiction series by Stefan Oswald.",
  path: "/writing"
});

const BOOKS = [
  {
    title: "Your Fullest Potential",
    kind: "Personal growth",
    body: [
      "Habits, mornings, evenings, and abundance, told through the stories that shaped me. It took ten years to write.",
      "The book became the foundation for everything that followed: a series of talks, a full album, an iPhone app, and a stage show now in the works."
    ],
    href: "/your-fullest-potential",
    cta: "Read the opening chapters",
    extra: { label: "Your Fullest Potential on YouTube", href: links.yfpYoutube }
  },
  {
    title: "The Contingency",
    kind: "Science fiction",
    body: [
      "Earth is out of time. A small team of scientists and dreamers bets it all on one plan to carry humanity, and everything it knows, to a new home."
    ],
    href: "/the-contingency",
    cta: "Read the opening",
    extra: null
  }
];

export default function WritingPage() {
  return (
    <>
      <PageIntro kicker="Writing" title="Books">
        <p>Two very different projects. One is about building a better day. The other is about saving the human race.</p>
      </PageIntro>

      <section aria-label="Books" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:pb-32">
        <ul className="grid gap-px border-y border-so-line lg:grid-cols-2">
          {BOOKS.map((book) => (
            <li key={book.title} className="border-b border-so-line py-10 last:border-b-0 lg:border-b-0 lg:px-10 lg:first:border-r lg:first:pl-0 lg:last:pr-0">
              <p className="text-[0.85rem] text-so-dim">{book.kind}</p>
              <h2 className="mt-2 font-so-display text-[2.6rem] font-medium leading-tight text-so-paper">{book.title}</h2>
              <div className="mt-5 space-y-4 text-[1.05rem] leading-[1.8] text-so-mute">
                {book.body.map((paragraph) => (
                  <p key={paragraph} className="so-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href={book.href}
                  className="inline-flex items-center rounded-[3px] bg-so-gold px-5 py-3 text-[0.95rem] font-semibold text-so-ink transition-colors so-hover:bg-so-gold-2"
                >
                  {book.cta}
                </Link>
                {book.extra ? (
                  <a
                    href={book.extra.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[0.95rem] text-so-paper underline decoration-so-gold/60 underline-offset-4 so-hover:text-so-gold-2"
                  >
                    {book.extra.label}
                    <ExternalMark />
                    <NewTabNote />
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
