import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/meta";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/site/PageIntro";
import { YouTubeLite } from "@/components/site/YouTubeLite";

export const metadata: Metadata = pageMetadata({
  title: "The Top Hat",
  description:
    "The Top Hat is Stefan Oswald's plan for an all-in-one entertainment and hospitality destination in Orlando: a mystery-show theater, dining, immersive art, a gym and spa, and a performing arts college.",
  path: "/top-hat"
});

const INSIDE = [
  { name: "A theater for mystery shows", body: "The main stage, built for magic and mentalism." },
  { name: "Signature dining", body: "Dinner and the show in the same building." },
  { name: "An immersive art experience", body: "Art rooms you can walk through and touch." },
  { name: "A gym and spa", body: "A place to train and recover." },
  { name: "A performing arts college", body: "A school for the next generation of performers." },
  { name: "Innovation incubators", body: "Space for creators to build and launch new ideas." }
];

export default function TopHatPage() {
  return (
    <>
      <PageIntro kicker="A future project" title="The Top Hat">
        <p>
          The Top Hat is my plan for an all-in-one entertainment and hospitality destination in Orlando. It puts shows,
          dining, art, a gym and spa, and a performing arts college under one roof, in a building wrapped in LED screens.
          Orlando comes first, and other cities come after.
        </p>
      </PageIntro>

      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:pb-32">
        <div className="relative overflow-hidden rounded-[4px]">
          <Image
            src="/images/site/outdoor-levitation.webp"
            alt="Stefan levitating a table outdoors as a crowd looks on"
            width={1800}
            height={1286}
            sizes="(min-width: 1152px) 1104px, 100vw"
            className="h-[20rem] w-full object-cover object-[50%_40%] sm:h-[26rem] lg:h-[30rem]"
            priority
          />
        </div>

        <section aria-labelledby="inside-heading" className="mt-20">
          <h2 id="inside-heading" className="font-so-display text-[2.6rem] font-medium leading-tight text-so-paper">
            What's inside
          </h2>
          <ul className="mt-8 grid border-t border-so-line sm:grid-cols-2 lg:grid-cols-3">
            {INSIDE.map((item) => (
              <li key={item.name} className="border-b border-so-line py-7 sm:pr-8">
                <h3 className="font-so-display text-[1.6rem] font-semibold leading-tight text-so-paper">{item.name}</h3>
                <p className="mt-2 text-[0.98rem] leading-[1.7] text-so-mute">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* The "Orlando Top Hat" video (YouTube nVjgzsZ934U) is set to private as of Oct 2026, so it is left off.
            Once Stefan makes it public or unlisted, add it back with <YouTubeLite id="nVjgzsZ934U" title="Orlando Top Hat" />. */}
        <section
          id="the-magic-hostel"
          aria-labelledby="hostel-heading"
          className="mt-20 grid gap-8 border-t border-so-line pt-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14"
        >
          <div>
            <h2 id="hostel-heading" className="font-so-display text-[2.6rem] font-medium leading-tight text-so-paper">
              Where it started: The Magic Hostel
            </h2>
            <p className="so-pretty mt-4 text-[1.05rem] leading-[1.8] text-so-mute">
              Before The Top Hat, this was the original plan. The Top Hat will take more than five years to build. So the idea
              was to open The Magic Hostel first, inside a building that already exists.
            </p>
          </div>
          <div>
            <YouTubeLite id="ApOeja4DSDQ" title="The Magic Hostel" />
            <p className="mt-2 text-[0.85rem] text-so-dim">The Magic Hostel</p>
          </div>
        </section>

        <div className="mt-20 border-t border-so-line pt-12">
          <h2 className="font-so-display text-[2.2rem] font-medium leading-tight text-so-paper">Want to be part of it?</h2>
          <p className="so-pretty mt-4 max-w-2xl text-[1.05rem] leading-[1.8] text-so-mute">
            If you want to help build The Top Hat, I'd like to hear from you.
          </p>
          <a
            href="mailto:StefanPaulOswald@gmail.com?subject=The%20Top%20Hat"
            className="mt-7 inline-flex items-center rounded-[3px] bg-so-gold px-5 py-3 text-[0.95rem] font-semibold text-so-ink transition-colors so-hover:bg-so-gold-2"
          >
            Email me about The Top Hat
          </a>
        </div>
      </div>
    </>
  );
}
