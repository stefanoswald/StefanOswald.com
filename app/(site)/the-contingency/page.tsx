import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/meta";
import Link from "next/link";
import type { LegacyBlock } from "@/components/site/LegacyBlocks";
import { ReadingPage } from "@/components/site/ReadingPage";
import text from "@/data/site/legacy/the-contingency.json";

export const metadata: Metadata = pageMetadata({
  title: "The Contingency",
  description:
    "Read the opening of The Contingency, a science fiction series by Stefan Oswald about humanity's last hope.",
  path: "/the-contingency"
});

export default function TheContingencyPage() {
  return (
    <ReadingPage
      kicker="Science fiction"
      title="The Contingency"
      blocks={text as LegacyBlock[]}
      intro={
        <p>
          Earth is out of time. A small team of scientists and dreamers bets it all on one plan to carry humanity, and
          everything it knows, to a new home. This is the opening of the series.
        </p>
      }
      after={
        <p className="text-[1rem] leading-7 text-so-mute">
          More of the series is on the way. Until then, try{" "}
          <Link href="/your-fullest-potential" className="text-so-paper underline decoration-so-gold/60 underline-offset-4 so-hover:text-so-gold-2">
            Your Fullest Potential
          </Link>
          .
        </p>
      }
    />
  );
}
