import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/meta";
import { ExternalMark, NewTabNote } from "@/components/site/ExternalMark";
import { PageIntro } from "@/components/site/PageIntro";
import { YouTubeLite } from "@/components/site/YouTubeLite";

export const metadata: Metadata = pageMetadata({
  title: "Rent my Cybertruck",
  description:
    "Drive to the show in style. Rent Stefan Oswald's Tesla Cybertruck on Turo, and watch the quick overview on the basics and charging.",
  path: "/cybertruck"
});

// The live listing (Kissimmee, FL), checked Oct 8, 2026.
const TURO = "https://turo.com/us/en/truck-rental/united-states/kissimmee-fl/tesla/cybertruck/2651472";

export default function CybertruckPage() {
  return (
    <>
      <PageIntro kicker="The Cybertruck" title="Drive to the show in style">
        <p>My Tesla Cybertruck is available to rent on Turo. Book it there, then watch the overview below before you pick it up.</p>
      </PageIntro>

      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:pb-32">
        <a
          href={TURO}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-[3px] bg-so-gold px-6 py-3.5 text-[1rem] font-semibold text-so-ink transition-colors so-hover:bg-so-gold-2"
        >
          Rent it on Turo
          <ExternalMark />
          <NewTabNote />
        </a>

        <section aria-labelledby="overview-heading" className="mt-16 grid gap-8 border-t border-so-line pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <h2 id="overview-heading" className="font-so-display text-[2.4rem] font-medium leading-tight text-so-paper">
              After you book
            </h2>
            <p className="so-pretty mt-4 text-[1.05rem] leading-[1.8] text-so-mute">
              Watch this short overview before your trip. It covers the basics of the truck and how to charge it.
            </p>
          </div>
          <div>
            <YouTubeLite id="Maw4qBBDX5c" title="Cybertruck overview: the basics and how to charge" />
            <p className="mt-2 text-[0.85rem] text-so-dim">Cybertruck overview: the basics and how to charge</p>
          </div>
        </section>
      </div>
    </>
  );
}
