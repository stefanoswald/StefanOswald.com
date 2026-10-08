import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/meta";
import { PageIntro } from "@/components/site/PageIntro";
import { YouTubeLite } from "@/components/site/YouTubeLite";

export const metadata: Metadata = pageMetadata({
  title: "Learn magic",
  description:
    "Why learn magic, three rules that protect the wonder, and a few great beginner tricks to start with.",
  path: "/learn-magic"
});

const REASONS = [
  { name: "Pure enjoyment", body: "Magic is a fun, rewarding hobby, and it can even become a career." },
  { name: "Connection", body: "You'll meet all kinds of people, and every trick is an excuse to start a conversation." },
  { name: "A rare skill", body: "Not many people can amaze a room. You can learn to." },
  { name: "A way to earn", body: "Good magicians get paid to perform at parties and events." }
];

const RULES = [
  {
    name: "Practice makes perfect",
    body: "After you learn a new trick, practice it ten times before you show a stranger. Then show it to a hundred strangers you'll never see again before you show friends and family. Trust me on this one."
  },
  {
    name: "Keep secrets secret",
    body: "People rarely want to know how it's done. If they did, they could look it up. Revealing the secret steals the wonder you just created."
  },
  {
    name: "One and done",
    body: "Never do the same trick for the same person twice. The first time is entertainment. The second time, they're just trying to solve the puzzle."
  }
];

// Beginner tutorials by other magicians. Credit goes to each creator.
const TUTORIALS = [
  { id: "xKSTtUwFNys", title: "3 easy self-working card tricks anyone can learn in 5 minutes", by: "Jason Maher" },
  { id: "8wFgUa2yAUo", title: "3 easy card tricks you can learn in 5 minutes", by: "TheDanocracy" },
  { id: "oBxVjJiN5LQ", title: "3 easy rubber band magic tricks", by: "Chris Ramsay" },
  { id: "w5HYBPG1fME", title: "10 magic tricks with hands only", by: "Huu Trung" },
  { id: "l4FLH1tO918", title: "The best coin vanish in the world", by: "Oscar Owen Magic" }
];

export default function LearnMagicPage() {
  return (
    <>
      <PageIntro kicker="Learn magic" title="So you want to learn magic">
        <p>Good choice. These are the rules I give every beginner, plus a few easy tricks to start with.</p>
      </PageIntro>

      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:pb-32">
        <section aria-labelledby="why-heading">
          <h2 id="why-heading" className="font-so-display text-[2.5rem] font-medium leading-tight text-so-paper">
            Why learn it
          </h2>
          <ul className="mt-8 grid border-t border-so-line sm:grid-cols-2 lg:grid-cols-4">
            {REASONS.map((reason) => (
              <li key={reason.name} className="border-b border-so-line py-7 sm:pr-8">
                <h3 className="font-so-display text-[1.6rem] font-semibold leading-tight text-so-paper">{reason.name}</h3>
                <p className="mt-2 text-[0.98rem] leading-[1.7] text-so-mute">{reason.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="rules-heading" className="mt-20">
          <h2 id="rules-heading" className="font-so-display text-[2.5rem] font-medium leading-tight text-so-paper">
            Three rules
          </h2>
          <ul className="mt-8 grid border-t border-so-line lg:grid-cols-3">
            {RULES.map((rule) => (
              <li key={rule.name} className="border-b border-so-line py-8 lg:pr-10">
                <h3 className="font-so-display text-[1.7rem] font-semibold leading-tight text-so-paper">{rule.name}</h3>
                <p className="so-pretty mt-3 text-[1.02rem] leading-[1.8] text-so-mute">{rule.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="start-heading" className="mt-20">
          <h2 id="start-heading" className="font-so-display text-[2.5rem] font-medium leading-tight text-so-paper">
            Start with these
          </h2>
          <p className="mt-3 max-w-2xl text-[1.02rem] leading-[1.8] text-so-mute">
            I'll be teaching my own tricks soon. Until then, these lessons from other magicians are great places to begin.
          </p>
          <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {TUTORIALS.map((video) => (
              <li key={video.id}>
                <YouTubeLite id={video.id} title={`${video.title}, by ${video.by}`} />
                <h3 className="mt-3 text-[1rem] leading-snug text-so-paper">{video.title}</h3>
                <p className="mt-1 text-[0.85rem] text-so-dim">by {video.by}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
