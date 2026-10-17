import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/site/PageIntro";
import { travel, type TravelPhoto } from "@/data/site/travel";
import { pageMetadata } from "@/lib/site/meta";

export const metadata: Metadata = pageMetadata({
  title: "Travel",
  description:
    "Photos from Stefan Oswald's travels: drone shots of Santorini, Mykonos, and Paros, plus Dubai, Hyderabad, and London.",
  path: "/travel"
});

export default function TravelPage() {
  return (
    <>
      <PageIntro kicker={travel.kicker} title={travel.title}>
        {travel.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </PageIntro>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Figure photo={travel.hero} sizes="(min-width: 1152px) 1104px, 100vw" priority />
      </div>

      <section aria-label="Photos" className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        {/* Columns keep each photo's own shape, so tall and wide shots sit together without cropping. */}
        <ul className="gap-6 sm:columns-2 lg:columns-3">
          {travel.photos.map((photo) => (
            <li key={photo.src} className="mb-6 break-inside-avoid">
              <Figure photo={photo} sizes="(min-width: 1152px) 352px, (min-width: 640px) 46vw, 100vw" />
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="More" className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6 lg:pb-32">
        <ul className="grid gap-x-10 border-t border-so-line sm:grid-cols-2">
          {travel.more.map((item) => (
            <li key={item.href} className="border-b border-so-line">
              <Link href={item.href} className="group block py-6 pr-4">
                <span className="font-so-display text-[1.6rem] font-semibold leading-tight text-so-paper transition-colors group-hover:text-so-gold-2">
                  {item.label}
                </span>
                <span className="mt-1.5 block text-[0.95rem] leading-6 text-so-mute">{item.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function Figure({ photo, sizes, priority = false }: { photo: TravelPhoto; sizes: string; priority?: boolean }) {
  return (
    <figure>
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        priority={priority}
        className="h-auto w-full rounded-[3px] bg-so-coal-2"
      />
      <figcaption className="mt-2.5 flex flex-wrap items-baseline gap-x-2 text-[0.92rem]">
        <span className="text-so-paper">{photo.place}</span>
        <span className="text-so-dim">{photo.note}</span>
      </figcaption>
    </figure>
  );
}
