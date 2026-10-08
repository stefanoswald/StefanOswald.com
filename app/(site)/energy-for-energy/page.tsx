import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/meta";
import type { LegacyBlock } from "@/components/site/LegacyBlocks";
import { ReadingPage } from "@/components/site/ReadingPage";
import text from "@/data/site/legacy/energy-for-energy.json";

export const metadata: Metadata = pageMetadata({
  title: "Energy for Energy",
  description:
    "Energy for Energy is Stefan Oswald's idea for a community app where what you give comes back: skill sharing, renting, trading, and bartering with your neighbors.",
  path: "/energy-for-energy"
});

export default function EnergyForEnergyPage() {
  return (
    <ReadingPage
      kicker="A future project"
      title="Energy for Energy"
      blocks={text as LegacyBlock[]}
      intro={
        <p>
          My motto is "Energy for energy. What I give is always returned to me." This is the app version of that idea: a
          place to trade skills and borrow things from the people around you.
        </p>
      }
      after={
        <p className="text-[1rem] leading-7 text-so-mute">
          There's an early prototype you can click around in.{" "}
          <a href="/Energy" className="text-so-paper underline decoration-so-gold/60 underline-offset-4 so-hover:text-so-gold-2">
            Try the Energy for Energy prototype
          </a>
          .
        </p>
      }
    />
  );
}
