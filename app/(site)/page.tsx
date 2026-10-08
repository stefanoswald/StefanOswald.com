import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalMark, NewTabNote } from "@/components/site/ExternalMark";
import { CallButton, Kicker, SectionHeading, keepHyphenatedWordsWhole } from "@/components/site/ui";
import { closing, discoveryCall, hero, howItWorks, links, meet, services, work } from "@/data/site/home";
import { pageMetadata } from "@/lib/site/meta";

export const metadata: Metadata = pageMetadata({
  title: "Stefan Oswald | AI Consultant",
  description:
    "AI consulting and hardware setup from Stefan Oswald, near Orlando, Florida. Start with a 30-minute discovery call, then book hourly help or an on-site day.",
  path: "/"
});

export default function HomePage() {
  return (
    <>
      <ServiceJsonLd />
      <Hero />
      <Services />
      <HowItWorks />
      <Work />
      <Meet />
      <Closing />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-32">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-12">
        <div className="pb-4 pt-6 lg:pb-20">
          <Kicker>{hero.kicker}</Kicker>
          <h1 className="so-balance mt-4 max-w-[13ch] font-so-display text-[clamp(3.3rem,8.6vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.015em] text-so-paper">
            {hero.heading}
          </h1>
          <p className="so-pretty mt-7 max-w-[34rem] text-[1.1rem] leading-[1.75] text-so-mute sm:text-[1.18rem]">{hero.lede}</p>
          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
            <CallButton />
            <p className="text-[0.92rem] leading-6 text-so-dim">{discoveryCall.note}</p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[26rem] lg:mx-0 lg:ml-auto lg:max-w-[30rem]">
          <Image
            src="/images/site/stefan-oswald-listening.webp"
            alt="Stefan Oswald listening and talking with someone across a table"
            width={1080}
            height={1350}
            priority
            sizes="(min-width: 1024px) 480px, (min-width: 640px) 26rem, 100vw"
            className="h-auto w-full rounded-t-[3px] object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-so-ink to-transparent" />
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="border-t border-so-line py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="services-heading">{services.heading}</SectionHeading>
        <ul className="mt-14 grid border-t border-so-line sm:grid-cols-2 lg:grid-cols-4">
          {services.items.map((service, index) => (
            <li
              key={service.title}
              className={`border-b border-so-line py-7 ${index % 2 === 1 ? "sm:border-l sm:pl-6" : "sm:pr-6"} ${
                index === 0 ? "lg:pl-0 lg:pr-7" : "lg:border-l lg:px-7"
              }`}
            >
              <h3 className="font-so-display text-[1.7rem] font-semibold leading-tight text-so-paper">{service.title}</h3>
              <p className="so-pretty mt-3 text-[0.98rem] leading-[1.7] text-so-mute">{service.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="border-y border-so-line bg-so-coal py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <SectionHeading id="how-heading">{howItWorks.heading}</SectionHeading>
          <p className="so-pretty mt-5 text-[1.08rem] leading-[1.8] text-so-mute">{howItWorks.intro}</p>
        </div>

        <ol className="mt-14 grid gap-5 lg:grid-cols-3">
          {howItWorks.tiers.map((tier) => (
            <li
              key={tier.name}
              className={`flex flex-col rounded-[4px] border p-7 sm:p-8 ${
                tier.cta ? "border-so-gold/80 bg-so-ink" : "border-so-line bg-so-ink/50"
              }`}
            >
              <p className={`text-[0.88rem] ${tier.cta ? "text-so-gold" : "text-so-dim"}`}>{tier.step}</p>
              <h3 className="mt-2 font-so-display text-[2rem] font-semibold leading-tight text-so-paper">{tier.name}</h3>
              <p className="mt-6">
                <span className="so-lining block font-so-display text-[3.4rem] font-semibold leading-none text-so-paper">
                  {tier.price}
                </span>
                <span className="mt-2 block text-[0.98rem] text-so-mute">{tier.unit}</span>
              </p>
              <p className="so-pretty mt-6 text-[0.98rem] leading-[1.75] text-so-mute">{keepHyphenatedWordsWhole(tier.body)}</p>
              {tier.cta ? (
                <div className="mt-auto pt-8">
                  <CallButton />
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" aria-labelledby="work-heading" className="py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <SectionHeading id="work-heading">{work.heading}</SectionHeading>
          <p className="so-pretty max-w-md text-[1.05rem] leading-[1.75] text-so-mute">{work.intro}</p>
        </div>
        <ul className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {work.builds.map((build) => (
            <li key={build.name} className="border-t border-so-line py-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-so-display text-[1.45rem] font-semibold leading-tight text-so-paper">
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
                </h3>
                <span className="shrink-0 text-[0.78rem] text-so-dim">{build.kind}</span>
              </div>
              <p className="so-pretty mt-2.5 text-[0.95rem] leading-[1.7] text-so-mute">{build.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Meet() {
  return (
    <section id="about" aria-labelledby="meet-heading" className="border-y border-so-line bg-so-coal py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-20">
        <div className="mx-auto w-full max-w-[22rem] lg:mx-0 lg:max-w-none">
          <Image
            src={meet.photo.src}
            alt={meet.photo.alt}
            width={meet.photo.width}
            height={meet.photo.height}
            sizes="(min-width: 1024px) 380px, 22rem"
            className="h-auto w-full rounded-[3px]"
          />
        </div>
        <div>
          <SectionHeading id="meet-heading">{meet.heading}</SectionHeading>
          <div className="mt-8 max-w-[38rem] space-y-5 text-[1.08rem] leading-[1.85] text-so-mute">
            {meet.paragraphs.map((paragraph) => (
              <p key={paragraph} className="so-pretty">
                {paragraph}
              </p>
            ))}
          </div>
          <Link
            href="/AboutMe"
            className="mt-9 inline-flex items-center rounded-[3px] border border-so-line-2 px-5 py-3 text-[0.95rem] font-semibold text-so-paper transition-colors so-hover:border-so-gold so-hover:text-so-gold-2"
          >
            {meet.aboutLabel}
          </Link>
          <p className="mt-8 text-[0.95rem] leading-7 text-so-mute">
            {meet.magicNote}{" "}
            <a
              href={links.mtg}
              target="_blank"
              rel="noopener noreferrer"
              className="text-so-paper underline decoration-so-gold/60 underline-offset-4 transition-colors so-hover:text-so-gold-2"
            >
              {meet.magicLink}
              <ExternalMark className="ml-1 inline-block h-[0.65em] w-[0.65em] align-[0.05em]" />
              <NewTabNote />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <SectionHeading id="contact-heading">{closing.heading}</SectionHeading>
        <p className="so-pretty mx-auto mt-5 max-w-xl text-[1.1rem] leading-[1.8] text-so-mute">
          {keepHyphenatedWordsWhole(closing.body)}
        </p>
        <div className="mt-9 flex flex-col items-center gap-4">
          <CallButton className="px-6 py-3.5 text-[1rem]" />
          <a
            href={links.mailto}
            className="text-[0.98rem] text-so-mute underline decoration-so-gold/50 underline-offset-4 transition-colors so-hover:text-so-gold-2"
          >
            Or email {links.email}
          </a>
        </div>
      </div>
    </section>
  );
}

function ServiceJsonLd() {
  const person = {
    "@type": "Person",
    name: "Stefan Oswald",
    jobTitle: "AI Consultant",
    url: "https://www.stefanoswald.com",
    sameAs: [links.github, links.mtg]
  };
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Stefan Oswald, AI Consultant",
    url: "https://www.stefanoswald.com",
    image: "https://www.stefanoswald.com/images/site/stefan-oswald-listening.webp",
    email: "mailto:StefanPaulOswald@gmail.com",
    description:
      "AI consulting and hardware setup. Every project starts with a 30-minute discovery call. Hourly consulting or on-site days after that.",
    founder: person,
    makesOffer: [
      {
        "@type": "Offer",
        name: "AI discovery call, 30 minutes",
        price: "200",
        priceCurrency: "USD",
        description: "Credited toward hourly or on-site work."
      },
      {
        "@type": "Offer",
        name: "Hourly AI consulting",
        priceSpecification: { "@type": "UnitPriceSpecification", price: "400", priceCurrency: "USD", unitCode: "HUR" }
      },
      {
        "@type": "Offer",
        name: "On-site AI consulting and hardware setup",
        description:
          "Up to 12 hours per day, plus travel. Includes a phone consultation every week for 2 months after the visit.",
        priceSpecification: { "@type": "UnitPriceSpecification", price: "5000", priceCurrency: "USD", unitCode: "DAY" }
      }
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
