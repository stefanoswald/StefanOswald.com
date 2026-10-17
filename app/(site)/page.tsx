import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalMark, NewTabNote } from "@/components/site/ExternalMark";
import { ActionButton, CallButton, Kicker, SectionHeading, keepHyphenatedWordsWhole } from "@/components/site/ui";
import {
  ai,
  contact,
  discoveryCall,
  entertainment,
  entertainmentBooking,
  hero,
  links,
  meet,
  muralRequest,
  murals,
  offers
} from "@/data/site/home";
import { pageMetadata } from "@/lib/site/meta";

export const metadata: Metadata = pageMetadata({
  title: "Stefan Oswald | AI Consultant, Corporate Entertainer, and Muralist",
  description:
    "Stefan Oswald, near Orlando, Florida: AI consulting from a $200 discovery call, magic and emcee work for corporate events from $2,500, and hand-painted murals at $20 per square foot.",
  path: "/"
});

export default function HomePage() {
  return (
    <>
      <ServiceJsonLd />
      <Hero />
      <AiConsulting />
      <Entertainment />
      <Murals />
      <Meet />
      <Contact />
    </>
  );
}

function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-7 lg:grid-cols-[1.45fr_0.55fr] lg:items-end lg:gap-12">
          <div>
            <Kicker>{hero.kicker}</Kicker>
            <h1
              id="hero-heading"
              className="so-balance mt-4 max-w-[15ch] font-so-display text-[clamp(3.1rem,7.6vw,6.2rem)] font-medium leading-[0.95] tracking-[-0.015em] text-so-paper"
            >
              {hero.heading}
            </h1>
          </div>
          <p className="so-pretty max-w-[36rem] text-[1.1rem] leading-[1.75] text-so-mute sm:text-[1.18rem] lg:pb-3 lg:text-[1.08rem]">
            {hero.lede}
          </p>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-16">
          {offers.map((offer, index) => (
            <li key={offer.id}>
              <a
                href={offer.href}
                className="group flex h-full overflow-hidden rounded-[4px] border border-so-line bg-so-coal transition-colors so-hover:border-so-gold/70 md:flex-col"
              >
                <div className="relative w-[7.5rem] shrink-0 overflow-hidden bg-so-coal-2 sm:w-44 md:aspect-[4/3] md:w-auto">
                  <Image
                    src={offer.photo.src}
                    alt={offer.photo.alt}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1152px) 352px, (min-width: 768px) 31vw, 176px"
                    className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
                      offer.id === "ai" ? "object-[50%_28%]" : offer.id === "entertainment" ? "object-[22%_32%]" : "object-[35%_50%]"
                    }`}
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-7">
                  <p className="font-so-display text-[1.6rem] font-semibold leading-[1.05] text-so-paper sm:text-[1.95rem]">{offer.title}</p>
                  <p className="so-pretty mt-2 text-[0.92rem] leading-[1.6] text-so-mute sm:mt-3 sm:text-[0.98rem] sm:leading-[1.7]">{offer.body}</p>
                  <p className="mt-auto flex items-center justify-between gap-4 pt-4 text-[0.92rem] font-medium text-so-gold sm:pt-6 sm:text-[0.95rem]">
                    <span>{offer.price}</span>
                    <span
                      aria-hidden="true"
                      className="text-so-dim transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-so-gold-2"
                    >
                      ↓
                    </span>
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** A heading for a part of a section, one step below SectionHeading. */
function SubHeading({ id, children }: { id: string; children: string }) {
  return (
    <h3 id={id} className="so-balance font-so-display text-[clamp(2.1rem,4vw,2.9rem)] font-medium leading-[1.05] text-so-paper">
      {children}
    </h3>
  );
}

function AiConsulting() {
  return (
    <section id="ai-consulting" aria-labelledby="ai-heading" className="border-t border-so-line py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <div>
            <Kicker>{ai.kicker}</Kicker>
            <SectionHeading id="ai-heading" className="mt-3">
              {ai.heading}
            </SectionHeading>
          </div>
          <div>
            <p className="so-pretty text-[1.08rem] leading-[1.8] text-so-mute">{keepHyphenatedWordsWhole(ai.intro)}</p>
            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
              <CallButton />
              <p className="text-[0.9rem] leading-6 text-so-dim">{discoveryCall.note}</p>
            </div>
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
              <p className="so-pretty mt-3 text-[0.98rem] leading-[1.7] text-so-mute">{service.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-24 max-w-2xl" id="how-it-works">
          <SubHeading id="how-heading">{ai.tiersHeading}</SubHeading>
          <p className="so-pretty mt-4 text-[1.05rem] leading-[1.8] text-so-mute">{ai.tiersIntro}</p>
        </div>
        <ol aria-labelledby="how-heading" className="mt-10 grid gap-5 lg:grid-cols-3">
          {ai.tiers.map((tier) => (
            <li
              key={tier.name}
              className={`flex flex-col rounded-[4px] border p-7 sm:p-8 ${tier.cta ? "border-so-gold/80 bg-so-coal" : "border-so-line bg-so-coal/50"}`}
            >
              <p className={`text-[0.88rem] ${tier.cta ? "text-so-gold" : "text-so-dim"}`}>{tier.step}</p>
              <h4 className="mt-2 font-so-display text-[2rem] font-semibold leading-tight text-so-paper">{tier.name}</h4>
              <p className="mt-6">
                <span className="so-lining block font-so-display text-[3.4rem] font-semibold leading-none text-so-paper">{tier.price}</span>
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

        <div className="mt-24 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16" id="work">
          <SubHeading id="work-heading">{ai.buildsHeading}</SubHeading>
          <p className="so-pretty max-w-md text-[1.05rem] leading-[1.75] text-so-mute">{ai.buildsIntro}</p>
        </div>
        <ul aria-labelledby="work-heading" className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
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
              <p className="so-pretty mt-2.5 text-[0.95rem] leading-[1.7] text-so-mute">{build.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Entertainment() {
  return (
    <section
      id="entertainment"
      aria-labelledby="entertainment-heading"
      className="border-y border-so-line bg-so-coal py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div>
            <Kicker>{entertainment.kicker}</Kicker>
            <SectionHeading id="entertainment-heading" className="mt-3">
              {entertainment.heading}
            </SectionHeading>
            <div className="mt-7 max-w-[36rem] space-y-4 text-[1.08rem] leading-[1.8] text-so-mute">
              <p className="so-pretty">{entertainment.body}</p>
              <p className="so-pretty">{entertainment.seenOn}</p>
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

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <SubHeading id="prices-heading">{entertainment.pricesHeading}</SubHeading>
            <ul aria-labelledby="prices-heading" className="mt-8 border-t border-so-line">
              {entertainment.prices.map((item) => (
                <li
                  key={item.name}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-so-line py-4 sm:grid-cols-[1fr_auto_auto]"
                >
                  <span className="font-so-display text-[1.35rem] font-semibold leading-snug text-so-paper">{item.name}</span>
                  <span className="so-lining whitespace-nowrap text-right font-so-display text-[1.35rem] font-semibold text-so-gold sm:order-last sm:min-w-[11rem]">
                    {item.price}
                  </span>
                  <span className="col-span-2 text-[0.9rem] text-so-mute sm:col-span-1 sm:text-right">{item.unit}</span>
                </li>
              ))}
            </ul>
            <p className="so-pretty mt-5 max-w-xl text-[0.92rem] leading-[1.7] text-so-dim">{entertainment.terms}</p>
          </div>

          <div className="flex flex-col gap-10 lg:pt-3">
            <figure>
              <blockquote className="font-so-display text-[clamp(1.6rem,3vw,2.1rem)] italic leading-[1.3] text-so-paper">
                {`"${entertainment.quote.text}"`}
              </blockquote>
              <figcaption className="mt-4 text-[0.92rem] text-so-mute">
                <span className="text-so-paper">{entertainment.quote.name}</span>, {entertainment.quote.org}
              </figcaption>
            </figure>
            <div className="flex flex-col items-start gap-4">
              <ActionButton action={entertainmentBooking} />
              <ActionButton action={entertainment.more} variant="outline" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Murals() {
  const [dayOne, laterThatDay, finished] = murals.photos;
  return (
    <section id="murals" aria-labelledby="murals-heading" className="py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
          <div>
            <Kicker>{murals.kicker}</Kicker>
            <SectionHeading id="murals-heading" className="mt-3">
              {murals.heading}
            </SectionHeading>
            <div className="mt-7 max-w-[36rem] space-y-4 text-[1.08rem] leading-[1.8] text-so-mute">
              {murals.paragraphs.map((paragraph) => (
                <p key={paragraph} className="so-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-[4px] border border-so-gold/80 bg-so-coal p-7 sm:p-8">
            <p className="flex items-baseline gap-3">
              <span className="so-lining font-so-display text-[3.6rem] font-semibold leading-none text-so-paper">{murals.rate.price}</span>
              <span className="text-[1rem] text-so-mute">{murals.rate.unit}</span>
            </p>
            <p className="so-pretty mt-5 text-[0.98rem] leading-[1.7] text-so-mute">{keepHyphenatedWordsWhole(murals.example)}</p>
            <ActionButton action={muralRequest} className="mt-7" />
          </div>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1fr_1.32fr] lg:grid-rows-2">
          <MuralPhoto photo={dayOne} sizes="(min-width: 1024px) 470px, 100vw" className="lg:col-start-1 lg:row-start-1" />
          <MuralPhoto photo={laterThatDay} sizes="(min-width: 1024px) 470px, 100vw" className="lg:col-start-1 lg:row-start-2" />
          <MuralPhoto
            photo={finished}
            sizes="(min-width: 1024px) 620px, 100vw"
            className="lg:col-start-2 lg:row-span-2 lg:row-start-1"
            tall
          />
        </div>
      </div>
    </section>
  );
}

function MuralPhoto({
  photo,
  sizes,
  className,
  tall = false
}: {
  photo: (typeof murals.photos)[number];
  sizes: string;
  className: string;
  tall?: boolean;
}) {
  return (
    <figure className={`flex flex-col ${className}`}>
      <div className={`relative overflow-hidden rounded-[3px] bg-so-coal-2 ${tall ? "aspect-[4/3] lg:aspect-auto lg:flex-1" : "aspect-video"}`}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
      </div>
      <figcaption className="mt-2.5 text-[0.88rem] text-so-dim">{photo.caption}</figcaption>
    </figure>
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
          <ul className="mt-9 flex flex-wrap gap-3">
            {meet.links.map((link, index) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`inline-flex items-center rounded-[3px] border px-5 py-3 text-[0.95rem] font-semibold transition-colors ${
                    index === 0
                      ? "border-so-line-2 text-so-paper so-hover:border-so-gold so-hover:text-so-gold-2"
                      : "border-transparent px-2 text-so-mute underline decoration-so-gold/50 underline-offset-4 so-hover:text-so-gold-2"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <SectionHeading id="contact-heading">{contact.heading}</SectionHeading>
          <p className="so-pretty mt-5 text-[1.1rem] leading-[1.8] text-so-mute">{contact.body}</p>
        </div>
        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {contact.options.map((option) => (
            <li key={option.title} className="flex flex-col rounded-[4px] border border-so-line bg-so-coal/60 p-7 sm:p-8">
              <h3 className="font-so-display text-[1.8rem] font-semibold leading-tight text-so-paper">{option.title}</h3>
              <p className="so-pretty mt-3 text-[0.98rem] leading-[1.7] text-so-mute">{option.body}</p>
              <div className="mt-auto pt-7">
                <ActionButton action={option.action} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-[0.98rem] text-so-mute">
          Or email me at{" "}
          <a
            href={links.mailto}
            className="text-so-paper underline decoration-so-gold/60 underline-offset-4 transition-colors so-hover:text-so-gold-2"
          >
            {links.email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function ServiceJsonLd() {
  const person = {
    "@type": "Person",
    name: "Stefan Oswald",
    jobTitle: ["AI Consultant", "Corporate Entertainer", "Muralist"],
    url: "https://www.stefanoswald.com",
    sameAs: [links.mtg, links.github, links.instagram, links.youtube]
  };
  const usd = (price: string) => ({ priceCurrency: "USD", price });
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Stefan Oswald",
    url: "https://www.stefanoswald.com",
    image: "https://www.stefanoswald.com/images/site/og.jpg",
    email: `mailto:${links.email}`,
    description:
      "AI consulting and hardware setup, magic and emcee work for corporate events, and hand-painted murals. Based near Orlando, Florida.",
    founder: person,
    makesOffer: [
      { "@type": "Offer", name: "AI discovery call, 30 minutes", ...usd("200"), description: "Credited toward hourly or on-site work." },
      {
        "@type": "Offer",
        name: "Hourly AI consulting",
        priceSpecification: { "@type": "UnitPriceSpecification", ...usd("400"), unitCode: "HUR" }
      },
      {
        "@type": "Offer",
        name: "On-site AI consulting and hardware setup",
        description: "Up to 12 hours per day, plus travel. Includes a phone consultation every week for 2 months after the visit.",
        priceSpecification: { "@type": "UnitPriceSpecification", ...usd("5000"), unitCode: "DAY" }
      },
      {
        "@type": "Offer",
        name: "Close-up and strolling magic, up to two hours",
        priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", minPrice: "2500" }
      },
      {
        "@type": "Offer",
        name: "Trade show booth magic, per show day",
        priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", minPrice: "3500" }
      },
      {
        "@type": "Offer",
        name: "Emcee and host, per event or meeting day",
        priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", minPrice: "3500" }
      },
      {
        "@type": "Offer",
        name: "Stage show, 20 to 45 minutes",
        priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", minPrice: "5000" }
      },
      {
        "@type": "Offer",
        name: "Keynote with a custom magic show",
        priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", minPrice: "10000", maxPrice: "15000" }
      },
      {
        "@type": "Offer",
        name: "Hand-painted mural",
        priceSpecification: { "@type": "UnitPriceSpecification", ...usd("20"), unitCode: "FTK", unitText: "square foot" }
      }
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
