import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/meta";
import { ExternalMark, NewTabNote } from "@/components/site/ExternalMark";
import type { LegacyBlock } from "@/components/site/LegacyBlocks";
import { ReadingPage } from "@/components/site/ReadingPage";
import { links } from "@/data/site/home";
import text from "@/data/site/legacy/your-fullest-potential.json";

export const metadata: Metadata = pageMetadata({
  title: "Your Fullest Potential",
  description:
    "Read the opening chapters of Your Fullest Potential by Stefan Oswald: the power of habit, mastering your mornings, enriching your evenings, and abundance.",
  path: "/your-fullest-potential"
});

const blocks: LegacyBlock[] = [{ t: "h2", text: "Introduction" }, ...(text as LegacyBlock[])];

export default function YourFullestPotentialPage() {
  return (
    <ReadingPage
      kicker="The book"
      title="Your Fullest Potential"
      blocks={blocks}
      videoTitles={{ "8WNDiJXzmGk": "The Active Abundance Meditation Journey" }}
      intro={
        <>
          <p>
            Ten years to write the book. Ten months to write the talks. Ten weeks to write the album. Ten days to build the app.
            It all started here.
          </p>
          <p>
            This is an early draft of the opening chapters. I’m still polishing the final version, so if something here
            helps you, or trips you up,{" "}
            <a
              href={`${links.mailto}?subject=Your%20Fullest%20Potential`}
              className="text-so-paper underline decoration-so-gold/60 underline-offset-4 so-hover:text-so-gold-2"
            >
              email me
            </a>
            .
          </p>
        </>
      }
      after={
        <p className="text-[1rem] leading-7 text-so-mute">
          Want more? Guided meditations and talks live on the{" "}
          <a
            href={links.yfpYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-so-paper underline decoration-so-gold/60 underline-offset-4 so-hover:text-so-gold-2"
          >
            Your Fullest Potential YouTube channel
            <ExternalMark />
            <NewTabNote />
          </a>
          .
        </p>
      }
    />
  );
}
