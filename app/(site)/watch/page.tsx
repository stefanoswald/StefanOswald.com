import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/meta";
import { ExternalMark, NewTabNote } from "@/components/site/ExternalMark";
import { PageIntro } from "@/components/site/PageIntro";
import { YouTubeLite } from "@/components/site/YouTubeLite";
import { links } from "@/data/site/home";

export const metadata: Metadata = pageMetadata({
  title: "Watch",
  description:
    "Magic from festivals, parties, campuses, and corporate events, plus a few behind-the-scenes projects from Stefan Oswald.",
  path: "/watch"
});

// Titles tidied from each video's YouTube title (Oct 2026). U9NRfirlkNg was left out because it looks like an earlier
// upload of dUVRMhvR3As (same title, same 3:28 length).
const VIDEOS = [
  { id: "dUVRMhvR3As", title: "Stefan Oswald, magician" },
  { id: "VW04VYtAeXQ", title: "Magic moments at the Okeechobee Music Festival" },
  { id: "GKapXIQjqh0", title: "Making people happy with magic. This is why I perform." },
  { id: "2laqGifEHFs", title: "New Year’s party at The Compound" },
  { id: "AMdEmVbVJts", title: "Money magic in Utah" },
  { id: "jILT0PnYGk4", title: "Sharing some magic at PopStroke" },
  { id: "y1fvXnA0Sk4", title: "A magical stroll around UCF" },
  { id: "YqormJDJIrI", title: "Stefan Oswald: Magician (2019)" },
  { id: "n5TKozrYjPQ", title: "My first month learning magic tricks" },
  { id: "os2o-QBofoI", title: "Magic blanket backdrop, a software engineering project" }
];

export default function WatchPage() {
  return (
    <>
      <PageIntro kicker="Watch" title="Magic, up close">
        <p>Street shows, festivals, parties, and a few projects from behind the curtain. New videos land on @MagicTrickGuy first.</p>
      </PageIntro>

      <section aria-labelledby="promo-heading" className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="promo-heading" className="sr-only">
          Event promo
        </h2>
        <div className="overflow-hidden rounded-[4px] border border-so-line bg-black">
          <video
            className="aspect-video h-auto w-full"
            controls
            playsInline
            preload="none"
            poster="/videos/stefan-oswald-promo-poster.jpg"
          >
            <source src="/videos/stefan-oswald-promo-720.mp4" type="video/mp4" />
            <track kind="captions" src="/videos/stefan-oswald-promo.vtt" srcLang="en" label="English" default />
          </video>
        </div>
        <p className="mt-3 text-[0.92rem] text-so-mute">
          My corporate events promo, about a minute and a half. Planning an event?{" "}
          <a
            href={links.mtg}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-so-paper underline decoration-so-gold/60 underline-offset-4 so-hover:text-so-gold-2"
          >
            MagicTrickGuy.com
            <ExternalMark />
            <NewTabNote />
          </a>
        </p>
      </section>

      <section aria-labelledby="videos-heading" className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 lg:pb-32">
        <h2 id="videos-heading" className="font-so-display text-[2.2rem] font-medium text-so-paper">
          More videos
        </h2>
        <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((video, index) => (
            <li key={video.id}>
              <YouTubeLite id={video.id} title={video.title} priority={index < 3} />
              <h3 className="mt-3 text-[1rem] leading-snug text-so-paper">{video.title}</h3>
            </li>
          ))}
        </ul>
        <a
          href={links.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-14 inline-flex items-center gap-2 rounded-[3px] border border-so-line-2 px-5 py-3 text-[0.95rem] font-semibold text-so-paper transition-colors so-hover:border-so-gold so-hover:text-so-gold-2"
        >
          See everything on YouTube
          <ExternalMark />
          <NewTabNote />
        </a>
      </section>
    </>
  );
}
