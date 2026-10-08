import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalMark, NewTabNote } from "@/components/site/ExternalMark";
import { PassionDeck } from "@/components/site/PassionDeck";
import { Suit } from "@/components/site/Suit";
import { about, ai, contact, entertainment, hero, links, passions, projects } from "@/data/site/home";
import { pageMetadata } from "@/lib/site/meta";

export const metadata: Metadata = pageMetadata({
  title: "Stefan Oswald | AI Consultant and Corporate Entertainer",
  description:
    "Stefan Oswald helps businesses put AI to work and brings rooms together with corporate magic and emceeing. Based near Orlando, Florida.",
  path: "/"
});

export default function HomePage() {
  return (
    <>
      <PersonJsonLd />
      <Hero />
      <AiSection />
      <EntertainmentSection />
      <ProjectsSection />
      <PassionsSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-12">
        <div className="pb-2 pt-6 lg:pb-20">
          <h1 className="font-so-display text-so-paper">
            <span className="block text-[clamp(3.9rem,12.5vw,8.6rem)] font-medium leading-[0.84] tracking-[-0.02em]">
              Stefan
              <br />
              Oswald
            </span>
            <span className="mt-7 block text-[clamp(1.7rem,4vw,2.6rem)] font-normal italic leading-[1.1] text-so-paper/90">
              {hero.roleLines[0]}
              <br />
              {hero.roleLines[1]}
            </span>
          </h1>
          <p className="so-pretty mt-7 max-w-[34rem] text-[1.08rem] leading-[1.75] text-so-mute sm:text-[1.15rem]">{hero.lede}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={links.bookCall}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[3px] bg-so-gold px-5 py-3 text-[0.95rem] font-semibold text-so-ink transition-colors so-hover:bg-so-gold-2"
            >
              Talk with me about AI
              <NewTabNote />
            </a>
            <a
              href={links.mtg}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[3px] border border-so-line-2 px-5 py-3 text-[0.95rem] font-semibold text-so-paper transition-colors so-hover:border-so-gold so-hover:text-so-gold-2"
            >
              Book entertainment
              <ExternalMark />
              <NewTabNote />
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[26rem] lg:mx-0 lg:ml-auto lg:max-w-[31rem]">
          <Image
            src="/images/site/stefan-oswald-portrait-cards.webp"
            alt="Stefan Oswald smiling and holding a fan of playing cards"
            width={1080}
            height={1350}
            priority
            sizes="(min-width: 1024px) 496px, (min-width: 640px) 26rem, 100vw"
            className="h-auto w-full rounded-t-[3px] object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-so-ink to-transparent" />
        </div>
      </div>

      <div className="border-y border-so-line bg-so-coal">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-[0.95rem] text-so-mute sm:px-6">{hero.seenOn}</p>
      </div>
    </section>
  );
}

function SectionHeading({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <h2
      id={id}
      className={`so-balance font-so-display text-[clamp(2.5rem,5.6vw,4.1rem)] font-medium leading-[1.02] tracking-[-0.01em] text-so-paper ${className}`}
    >
      {children}
    </h2>
  );
}

function AiSection() {
  return (
    <section id="ai" aria-labelledby="ai-heading" className="py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <p className="font-so-display text-[1.35rem] italic text-so-gold">AI consulting</p>
            <SectionHeading id="ai-heading" className="mt-3">
              {ai.heading}
            </SectionHeading>
          </div>
          <div className="space-y-5 text-[1.08rem] leading-[1.8] text-so-mute lg:pt-12">
            {ai.intro.map((paragraph) => (
              <p key={paragraph} className="so-pretty">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <ul className="mt-16 grid border-t border-so-line sm:grid-cols-2 lg:grid-cols-4">
          {ai.services.map((service, index) => (
            <li
              key={service.title}
              className={`border-b border-so-line py-7 ${index % 2 === 1 ? "sm:border-l sm:pl-6" : "sm:pr-6"} ${
                index === 0 ? "lg:pl-0 lg:pr-7" : "lg:border-l lg:px-7"
              }`}
            >
              <h3 className="font-so-display text-[1.7rem] font-semibold leading-tight text-so-paper">{service.title}</h3>
              <p className="mt-3 text-[0.98rem] leading-[1.7] text-so-mute">{service.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-20">
          <h3 className="font-so-display text-[2rem] font-medium leading-tight text-so-paper">{ai.buildsHeading}</h3>
          <p className="mt-2 max-w-xl text-[0.98rem] leading-7 text-so-mute">
            The best proof is the stuff I build for myself. Some of it runs every day. Some of it is still on the workbench.
          </p>
          <ul className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {ai.builds.map((build) => (
              <li key={build.name} className="border-t border-so-line py-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="font-so-display text-[1.45rem] font-semibold leading-tight text-so-paper">
                    {build.href ? (
                      <a
                        href={build.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-baseline gap-1.5 underline decoration-so-gold/50 underline-offset-4 transition-colors so-hover:text-so-gold-2"
                      >
                        {build.name}
                        <ExternalMark className="h-[0.55em] w-[0.55em]" />
                        <NewTabNote />
                      </a>
                    ) : (
                      build.name
                    )}
                  </h4>
                  <span className="shrink-0 text-[0.78rem] text-so-dim">{build.kind}</span>
                </div>
                <p className="mt-2.5 text-[0.95rem] leading-[1.7] text-so-mute">{build.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-so-line pt-10">
          <a
            href={links.bookCall}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-[3px] bg-so-gold px-5 py-3 text-[0.95rem] font-semibold text-so-ink transition-colors so-hover:bg-so-gold-2"
          >
            Book a 15-minute call
            <NewTabNote />
          </a>
          <a
            href={links.mailtoAI}
            className="text-[0.98rem] text-so-paper underline decoration-so-gold/60 underline-offset-4 transition-colors so-hover:text-so-gold-2"
          >
            Or email me about your team
          </a>
        </div>
      </div>
    </section>
  );
}

function EntertainmentSection() {
  return (
    <section id="entertainment" aria-labelledby="entertainment-heading" className="border-y border-so-line bg-so-coal py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div>
            <p className="font-so-display text-[1.35rem] italic text-so-gold">Corporate entertainment</p>
            <SectionHeading id="entertainment-heading" className="mt-3 max-w-[17ch]">
              {entertainment.heading}
            </SectionHeading>
            <div className="mt-7 max-w-[36rem] space-y-5 text-[1.08rem] leading-[1.8] text-so-mute">
              {entertainment.body.map((paragraph) => (
                <p key={paragraph} className="so-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-4 self-end border-t border-so-line pt-6 lg:grid-cols-1 lg:gap-0 lg:border-t-0 lg:pt-0">
            {entertainment.stats.map((stat) => (
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
          {entertainment.photos.map((photo) => (
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

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <figure>
            <blockquote className="font-so-display text-[clamp(1.6rem,3vw,2.1rem)] italic leading-[1.3] text-so-paper">
              “{entertainment.quote.text}”
            </blockquote>
            <figcaption className="mt-4 text-[0.92rem] text-so-mute">
              <span className="text-so-paper">{entertainment.quote.name}</span>, {entertainment.quote.org}
            </figcaption>
          </figure>
          <div>
            <h3 className="text-[0.95rem] font-semibold text-so-paper">What I do for events</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {entertainment.offerings.map((offering) => (
                <li key={offering.label}>
                  <a
                    href={offering.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-so-line-2 px-3.5 py-1.5 text-[0.88rem] text-so-paper/90 transition-colors so-hover:border-so-gold so-hover:text-so-gold-2"
                  >
                    {offering.label}
                    <NewTabNote />
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={links.mtg}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-[3px] bg-so-gold px-5 py-3 text-[0.95rem] font-semibold text-so-ink transition-colors so-hover:bg-so-gold-2"
            >
              Plan your event at MagicTrickGuy.com
              <ExternalMark />
              <NewTabNote />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <SectionHeading id="projects-heading">{projects.heading}</SectionHeading>
          <p className="so-pretty mt-5 text-[1.08rem] leading-[1.8] text-so-mute">{projects.intro}</p>
        </div>

        <ol className="mt-16 grid gap-14 lg:grid-cols-3 lg:gap-10">
          {projects.stages.map((stage) => {
            const current = stage.label === "Now";
            return (
              <li key={stage.label} className="relative">
                <div className="flex items-center gap-3 border-b border-so-line pb-4">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${current ? "bg-so-gold" : "border border-so-dim"}`}
                    aria-hidden="true"
                  />
                  <h3 className="font-so-display text-[2.2rem] font-medium italic leading-none text-so-paper">{stage.label}</h3>
                  <span className="ml-auto text-[0.82rem] text-so-dim">{stage.note}</span>
                </div>
                <ul>
                  {stage.items.map((item) => (
                    <li key={item.name} className="border-b border-so-line py-6">
                      <h4 className="font-so-display text-[1.5rem] font-semibold leading-tight text-so-paper">{item.name}</h4>
                      <p className="so-pretty mt-2 text-[0.96rem] leading-[1.7] text-so-mute">{item.body}</p>
                      {item.href ? <ProjectLink href={item.href} label={item.linkLabel ?? "Learn more"} external={item.external} /> : null}
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

function ProjectLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const className =
    "mt-3 inline-flex items-center gap-1.5 text-[0.92rem] font-medium text-so-gold underline decoration-so-gold/40 underline-offset-4 transition-colors so-hover:text-so-gold-2";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
        <ExternalMark />
        <NewTabNote />
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

function PassionsSection() {
  return (
    <section id="more" aria-labelledby="more-heading" className="overflow-hidden border-y border-so-line bg-so-coal py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-so-display text-[1.35rem] italic text-so-gold">And so much more</p>
            <SectionHeading id="more-heading" className="mt-3">
              {passions.heading}
            </SectionHeading>
          </div>
          <p className="so-pretty max-w-sm text-[1.05rem] leading-[1.75] text-so-mute">{passions.intro}</p>
        </div>
        <div className="mt-14">
          <PassionDeck groups={passions.groups} />
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="mx-auto w-full max-w-[24rem] lg:mx-0 lg:max-w-none">
          <Image
            src="/images/site/stefan-oswald-portrait.webp"
            alt="Stefan Oswald holding a crystal ball close to the camera"
            width={1080}
            height={1350}
            sizes="(min-width: 1024px) 400px, 24rem"
            className="h-auto w-full rounded-[3px]"
          />
          <dl className="mt-8 divide-y divide-so-line border-y border-so-line">
            {about.facts.map((fact) => (
              <div key={fact.label} className="grid grid-cols-[5.5rem_1fr] gap-4 py-3 text-[0.92rem]">
                <dt className="text-so-dim">{fact.label}</dt>
                <dd className="text-so-paper/90">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:pt-6">
          <SectionHeading id="about-heading">{about.heading}</SectionHeading>
          <div className="mt-8 max-w-[38rem] space-y-6 text-[1.1rem] leading-[1.85] text-so-mute">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="so-pretty">
                {paragraph}
              </p>
            ))}
          </div>
          <figure className="mt-12 max-w-[38rem] border-l-2 border-so-gold pl-6">
            <blockquote className="font-so-display text-[clamp(1.7rem,3.4vw,2.3rem)] italic leading-[1.25] text-so-paper">
              {about.mantra}
            </blockquote>
            <figcaption className="mt-3 text-[0.9rem] text-so-dim">The rule I try to live by</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="border-t border-so-line bg-so-coal py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <div className="flex justify-center gap-2 text-so-dim" aria-hidden="true">
          <Suit suit="spades" className="h-4 w-4" />
          <Suit suit="hearts" className="h-4 w-4 text-[#d9545e]" />
          <Suit suit="diamonds" className="h-4 w-4 text-[#d9545e]" />
          <Suit suit="clubs" className="h-4 w-4" />
        </div>
        <SectionHeading id="contact-heading" className="mt-6">
          {contact.heading}
        </SectionHeading>
        <p className="so-pretty mx-auto mt-5 max-w-xl text-[1.1rem] leading-[1.8] text-so-mute">{contact.body}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={links.bookCall}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-[3px] bg-so-gold px-6 py-3.5 text-[1rem] font-semibold text-so-ink transition-colors so-hover:bg-so-gold-2"
          >
            Book a 15-minute call
            <NewTabNote />
          </a>
          <a
            href={links.mailto}
            className="inline-flex items-center rounded-[3px] border border-so-line-2 px-6 py-3.5 text-[1rem] font-semibold text-so-paper transition-colors so-hover:border-so-gold so-hover:text-so-gold-2"
          >
            Email {links.email}
          </a>
        </div>
        <p className="mt-10 text-[0.98rem] text-so-mute">
          {contact.eventsNote}{" "}
          <a
            href={links.mtgContact}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-so-paper underline decoration-so-gold/60 underline-offset-4 transition-colors so-hover:text-so-gold-2"
          >
            Plan your event
            <ExternalMark />
            <NewTabNote />
          </a>
        </p>
      </div>
    </section>
  );
}

function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Stefan Oswald",
    url: "https://www.stefanoswald.com",
    image: "https://www.stefanoswald.com/images/site/stefan-oswald-portrait-cards.webp",
    jobTitle: ["AI Consultant", "Corporate Entertainer"],
    description:
      "AI consultant and corporate entertainer near Orlando, Florida. Magician and emcee seen on America's Got Talent, FOX, NBC, CBS, and ABC.",
    homeLocation: { "@type": "Place", name: "Orlando, Florida" },
    email: "mailto:StefanPaulOswald@gmail.com",
    sameAs: [links.mtg, links.instagram, links.youtube, links.facebook, links.github]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
