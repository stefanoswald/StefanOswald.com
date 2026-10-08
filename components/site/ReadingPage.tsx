import type { ReactNode } from "react";
import { LegacyBlocks, legacyHeadings, type LegacyBlock } from "@/components/site/LegacyBlocks";

/** Layout for the long reading pages: intro, a chapter list on wide screens, and the text. */
export function ReadingPage({
  kicker,
  title,
  intro,
  blocks,
  videoTitles,
  after
}: {
  kicker: string;
  title: string;
  intro: ReactNode;
  blocks: LegacyBlock[];
  videoTitles?: Record<string, string>;
  after?: ReactNode;
}) {
  const headings = legacyHeadings(blocks);

  return (
    <article className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:pb-32 lg:pt-40">
      <header className="max-w-3xl">
        <p className="font-so-display text-[1.35rem] italic text-so-gold">{kicker}</p>
        <h1 className="so-balance mt-3 font-so-display text-[clamp(3rem,8.5vw,5.6rem)] font-medium leading-[0.95] tracking-[-0.015em] text-so-paper">
          {title}
        </h1>
        <div className="so-pretty mt-7 space-y-4 text-[1.1rem] leading-[1.8] text-so-mute">{intro}</div>
      </header>

      <div className="mt-14 grid gap-12 border-t border-so-line pt-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
        {headings.length > 1 ? (
          <nav aria-label="Chapters" className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-[0.85rem] font-semibold text-so-paper">On this page</p>
              <ol className="mt-4 space-y-2.5 text-[0.88rem] leading-snug text-so-mute">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a href={`#${heading.id}`} className="transition-colors so-hover:text-so-gold-2">
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        ) : (
          <div className="hidden lg:block" />
        )}
        <div className="max-w-[40rem]">
          <LegacyBlocks blocks={blocks} videoTitles={videoTitles} />
          {after ? <div className="mt-16 border-t border-so-line pt-10">{after}</div> : null}
        </div>
      </div>
    </article>
  );
}
