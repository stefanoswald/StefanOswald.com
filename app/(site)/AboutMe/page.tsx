import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalMark, NewTabNote } from "@/components/site/ExternalMark";
import { PassionDeck } from "@/components/site/PassionDeck";
import { Kicker, SectionHeading, TextLink } from "@/components/site/ui";
import { explore, intro, passions, projects, stage } from "@/data/site/about";
import { links } from "@/data/site/home";
import { pageMetadata } from "@/lib/site/meta";

export const metadata: Metadata = pageMetadata({
  title: "About me",
  description:
    "Stefan Oswald's story: Air Force veteran, engineer, magician in 43 countries, and now an AI consultant. Plus his projects, books, and the things he loves.",
  path: "/AboutMe"
});

export default function AboutMePage() {
  return (
    <>
      <PersonJsonLd />
      <Intro />
      <Stage />
      <Projects />
      <Passions />
      <Explore />
    </>
  );
}

function Intro() {
  return (
    <section aria-labelledby="about-heading" className="pb-24 pt-28 sm:pt-32 lg:pb-32 lg:pt-40">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="order-2 mx-auto w-full max-w-[24rem] lg:order-1 lg:mx-0 lg:max-w-none">
          <Image
            src={intro.photo.src}
            alt={intro.photo.alt}
            width={intro.photo.width}
            height={intro.photo.height}
            priority
            sizes="(min-width: 1024px) 400px, 24rem"
            className="h-auto w-full rounded-[3px]"
          />
          <dl className="mt-8 divide-y divide-so-line border-y border-so-line">
            {intro.facts.map((fact) => (
              <div key={fact.label} className="grid grid-cols-[5.5rem_1fr] gap-4 py-3 text-[0.92rem]">
                <dt className="text-so-dim">{fact.label}</dt>
                <dd className="text-so-paper/90">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="order-1 lg:order-2">
          <Kicker>{intro.kicker}</Kicker>
          <h1
            id="about-heading"
            className="so-balance mt-3 font-so-display text-[clamp(3rem,8vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.015em] text-so-paper"
          >
            {intro.heading}
          </h1>
          <div className="mt-8 max-w-[38rem] space-y-6 text-[1.1rem] leading-[1.85] text-so-mute">
            {intro.paragraphs.map((paragraph) => (
              <p key={paragraph} className="so-pretty">
                {paragraph}
              </p>
            ))}
          </div>
          <figure className="mt-12 max-w-[38rem] border-l-2 border-so-gold pl-6">
            <blockquote className="font-so-display text-[clamp(1.7rem,3.4vw,2.3rem)] italic leading-[1.25] text-so-paper">
              {intro.mantra}
            </blockquote>
            <figcaption className="mt-3 text-[0.9rem] text-so-dim">{intro.mantraNote}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function Stage() {
  return (
    <section id="stage" aria-labelledby="stage-heading" className="border-y border-so-line bg-so-coal py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div>
            <Kicker>{stage.kicker}</Kicker>
            <SectionHeading id="stage-heading" className="mt-3">
              {stage.heading}
            </SectionHeading>
            <div className="mt-7 max-w-[36rem] space-y-4 text-[1.08rem] leading-[1.8] text-so-mute">
              <p className="so-pretty">{stage.body}</p>
              <p className="so-pretty">{stage.seenOn}</p>
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-4 self-end border-t border-so-line pt-6 lg:grid-cols-1 lg:gap-0 lg:border-t-0 lg:pt-0">
            {stage.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col-reverse lg:flex-row-reverse lg:items-baseline lg:justify-end lg:gap-4 lg:border-t lg:border-so-line lg:py-4"
              >
                <dt className="mt-1 text-[0.88rem] text-so-mute lg:mt-0">{stat.label}</dt>
                <dd className="so-lining font-so-display text-[2.3rem] font-semibold leading-none text-so-paper sm:text-[2.8rem] lg:w-[7.5rem]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="-mx-4 mt-14 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0">
          {stage.photos.map((photo) => (
            <li key={photo.src} className="w-[72%] shrink-0 snap-start sm:w-auto">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1152px) 368px, (min-width: 640px) 31vw, 72vw"
                className="aspect-[4/5] h-auto w-full rounded-[3px] object-cover"
              />
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
          <figure>
            <blockquote className="font-so-display text-[clamp(1.6rem,3vw,2.1rem)] italic leading-[1.3] text-so-paper">
              {`"${stage.quote.text}"`}
            </blockquote>
            <figcaption className="mt-4 text-[0.92rem] text-so-mute">
              <span className="text-so-paper">{stage.quote.name}</span>, {stage.quote.org}
            </figcaption>
          </figure>
          <div>
            <a
              href={stage.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[3px] border border-so-line-2 px-5 py-3 text-[0.95rem] font-semibold text-so-paper transition-colors so-hover:border-so-gold so-hover:text-so-gold-2"
            >
              {stage.link.label}
              <ExternalMark />
              <NewTabNote />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="projects-heading">{projects.heading}</SectionHeading>
        <ol className="mt-14 grid gap-14 lg:grid-cols-3 lg:gap-10">
          {projects.stages.map((stageGroup) => {
            const current = stageGroup.label === "Now";
            return (
              <li key={stageGroup.label}>
                <div className="flex items-center gap-3 border-b border-so-line pb-4">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${current ? "bg-so-gold" : "border border-so-dim"}`}
                    aria-hidden="true"
                  />
                  <h3 className="font-so-display text-[2.2rem] font-medium italic leading-none text-so-paper">{stageGroup.label}</h3>
                  <span className="ml-auto text-[0.82rem] text-so-dim">{stageGroup.note}</span>
                </div>
                <ul>
                  {stageGroup.items.map((item) => (
                    <li key={item.name} className="border-b border-so-line py-6">
                      <h4 className="font-so-display text-[1.5rem] font-semibold leading-tight text-so-paper">{item.name}</h4>
                      <p className="so-pretty mt-2 text-[0.96rem] leading-[1.7] text-so-mute">{item.body}</p>
                      {item.href ? <TextLink href={item.href} label={item.linkLabel ?? "Learn more"} external={item.external} /> : null}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Passions() {
  return (
    <section id="more" aria-labelledby="more-heading" className="overflow-hidden border-y border-so-line bg-so-coal py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="more-heading" className="max-w-2xl">
            {passions.heading}
          </SectionHeading>
          <p className="so-pretty max-w-sm text-[1.05rem] leading-[1.75] text-so-mute">{passions.intro}</p>
        </div>
        <div className="mt-14">
          <PassionDeck groups={passions.groups} />
        </div>
      </div>
    </section>
  );
}

function Explore() {
  return (
    <section id="explore" aria-labelledby="explore-heading" className="py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="explore-heading">{explore.heading}</SectionHeading>
        <ul className="mt-12 grid gap-x-10 border-t border-so-line sm:grid-cols-2 lg:grid-cols-4">
          {explore.items.map((item) => (
            <li key={item.href} className="border-b border-so-line">
              <Link href={item.href} className="group block py-6 pr-4">
                <span className="font-so-display text-[1.45rem] font-semibold leading-tight text-so-paper transition-colors group-hover:text-so-gold-2">
                  {item.label}
                </span>
                <span className="mt-1.5 block text-[0.92rem] leading-6 text-so-mute">{item.body}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-[0.98rem] text-so-mute">
          {explore.socialNote}{" "}
          <SocialLink href={links.instagram} label="Instagram" />,{" "}
          <SocialLink href={links.youtube} label="YouTube" />, and{" "}
          <SocialLink href={links.facebook} label="Facebook" />.
        </p>
      </div>
    </section>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-so-paper underline decoration-so-gold/60 underline-offset-4 transition-colors so-hover:text-so-gold-2"
    >
      {label}
      <NewTabNote />
    </a>
  );
}

function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Stefan Oswald",
    url: "https://www.stefanoswald.com/AboutMe",
    image: "https://www.stefanoswald.com/images/site/stefan-oswald-portrait.webp",
    jobTitle: ["AI Consultant", "Magician"],
    birthPlace: "Oklahoma City, Oklahoma",
    sameAs: [links.mtg, links.instagram, links.youtube, links.facebook, links.github]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
