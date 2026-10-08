import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site/meta";
import { ExternalMark, NewTabNote } from "@/components/site/ExternalMark";
import { slugify } from "@/components/site/LegacyBlocks";
import { PageIntro } from "@/components/site/PageIntro";
import { YouTubeLite } from "@/components/site/YouTubeLite";

export const metadata: Metadata = pageMetadata({
  title: "Travel gear for content creators",
  description:
    "The gear Stefan Oswald travels and films with: 360 cameras, drones, audio, and storage, plus the shoes and custom pants he wears to carry it.",
  path: "/travel-gear"
});

type Gear = {
  name: string;
  body: string;
  links?: { label: string; href: string }[];
  video?: { id: string; title: string };
};

// Product links are Stefan's affiliate and referral links from the old travel gear page.
// Expired promos (a November discount, "I just ordered the Avata 2") were taken out in Oct 2026.
const SECTIONS: { title: string; intro?: string; items: Gear[] }[] = [
  {
    title: "Cameras",
    items: [
      {
        name: "Insta360 X4",
        body: "My everyday camera. Shoot everything around you, then frame it later in the app. It can fake a drone shot in tight spaces, do Bullet Time, and track a subject on its own. Editing and posting take minutes.",
        links: [
          { label: "Get the X4 with a free selfie stick", href: "https://www.insta360.com/sal/x4?utm_term=INRNBXY" },
          { label: "Buy it on Amazon", href: "https://amzn.to/3xGOWBu" }
        ],
        video: { id: "utIKv7KNOYo", title: "Meet Insta360 X4" }
      },
      {
        name: "Insta360 ONE RS 1-Inch 360 Edition",
        body: "Bigger and better in low light than the X4. It isn’t waterproof, so it stays dry.",
        links: [
          { label: "Insta360 ONE RS 1-Inch 360", href: "https://www.insta360.com/sal/one_rs_1_inch_360?insrc=INRNBXY" },
          { label: "The selfie stick and tripod I use", href: "https://amzn.to/3K8X5B6" }
        ]
      },
      {
        name: "DJI Action 2",
        body: "A tiny, waterproof action camera with a magnetic mount. I wear it on my head or chest to film hands-free.",
        links: [
          { label: "Buy from DJI", href: "https://click.dji.com/AFEqqPCwAsU1vyqQockj8Q?pm=link" },
          { label: "Buy on Amazon", href: "https://amzn.to/40OkcrG" }
        ]
      },
      {
        name: "Insta360 GO 3",
        body: "Much lighter than the Action 2, and small enough to clip anywhere.",
        links: [{ label: "Insta360 GO 3", href: "https://www.insta360.com/sal/go-3?insrc=INRNBXY" }]
      }
    ]
  },
  {
    title: "Audio and accessories",
    items: [
      {
        name: "DJI Mic",
        body: "Clean audio on either 360 camera. I connect it with a mic adapter, an audio cable, and a camera mount. If you have a 3D printer, the mount is a free download.",
        links: [
          { label: "DJI Mic", href: "https://amzn.to/40EZ9rG" },
          { label: "Mic adapter", href: "https://amzn.to/40zf22M" },
          { label: "Audio cable", href: "https://amzn.to/3ZDIq6X" },
          { label: "Camera mount", href: "https://amzn.to/3lVUUZT" },
          { label: "Free 3D-printable mount", href: "https://www.thingiverse.com/thing:5632858" }
        ]
      },
      {
        name: "Extended selfie stick",
        body: "Put the X4 on this and your shots start to look like an FPV drone flew them.",
        links: [{ label: "Extended selfie stick", href: "https://amzn.to/3m4SGHm" }]
      }
    ]
  },
  {
    title: "Drones",
    items: [
      {
        name: "HoverAir X1",
        body: "It launches from your palm in about three seconds and frames you as the star. No controller. At 125 grams it folds into a pocket, and the enclosed design makes it safer around crowds and kids. My favorite modes are Dolly, which follows you, and Orbit, which circles you.",
        links: [{ label: "HoverAir X1", href: "https://shareasale.com/u.cfm?d=1071919&m=145704&u=929667&afftrack=" }],
        video: { id: "1D8cnAMuFMA", title: "Hover X1" }
      },
      {
        name: "DJI Mini 4 Pro",
        body: "Light enough that most places don’t require registration. 4K video at 60 frames per second, 48MP photos, up to 45 minutes of flight, and obstacle sensing on every side.",
        links: [{ label: "DJI Mini 4 Pro", href: "https://click.dji.com/AMNv4NC7_gQc8iFsYOBu-g?pm=ad_image" }]
      },
      {
        name: "DJI Mavic 3 Pro",
        body: "Bigger than the Mini, better at almost everything else. Obstacle sensing all around means no more crashes from flying sideways, and the extra lenses help you tell a story from the air.",
        links: [{ label: "DJI Mavic 3 Pro", href: "https://click.dji.com/ADlbfnd1dCrWB-_mTiqbNA?pm=ad_image" }]
      },
      {
        name: "DJI Avata 2",
        body: "FPV flying made easy. Easy Acro mode is so much fun.",
        links: [{ label: "DJI Avata 2", href: "https://click.dji.com/AOaRWlQphN0pULMWudXMaA?pm=link" }]
      },
      {
        name: "Insta360 mount for the DJI Avata",
        body: "Cheat a little and look like an expert FPV pilot, even at slow speeds indoors. Eight months after faking it with this mount, I could fly FPV for real.",
        links: [{ label: "Avata Insta360 mount", href: "https://amzn.to/3zpqt14" }],
        video: { id: "gMx5UDf8fQQ", title: "An indoor fly-through with the Insta360 on the Avata" }
      }
    ]
  },
  {
    title: "Laptop and storage",
    items: [
      {
        name: "ASUS ZenBook Duo 14",
        body: "Two screens in one laptop, which makes editing on the road much easier.",
        links: [
          { label: "ZenBook Duo 14", href: "https://amzn.to/3Ncev30" },
          { label: "The Core i9 version", href: "https://amzn.to/40DIfto" }
        ]
      },
      {
        name: "Rugged portable SSD",
        body: "Fast, drop-proof, water and dust resistant, and encrypted. Footage adds up fast.",
        links: [
          { label: "4 TB", href: "https://amzn.to/3zWn3TQ" },
          { label: "2 TB", href: "https://amzn.to/41UaEM9" }
        ]
      }
    ]
  },
  {
    title: "What I wear",
    items: [
      {
        name: "Kizik shoes",
        body: "My all-time favorite shoes. You step in and the heel springs back into shape. No laces, no bending over.",
        links: [
          {
            label: "$20 off Kizik",
            href: "https://i.refs.cc/A4pGt0mv?smile_ref=eyJzbWlsZV9zb3VyY2UiOiJzbWlsZV91aSIsInNtaWxlX21lZGl1bSI6IiIsInNtaWxlX2NhbXBhaWduIjoicmVmZXJyYWxfcHJvZ3JhbSIsInNtaWxlX2N1c3RvbWVyX2lkIjo4MTcwMDk4ODR9"
          }
        ]
      },
      {
        name: "MagBak phone case",
        body: "It sticks to anything metal, so the phone becomes a camera mount anywhere.",
        links: [{ label: "MagBak", href: "https://magbak.refr.cc/stefanoswald" }]
      },
      {
        name: "Custom pants from I Love Jeans",
        body: "My friend Freddy made my pants. They hold over an hour of magic tricks, two selfie sticks, two 360 cameras, a mic, and two action cameras.",
        links: [{ label: "I Love Jeans", href: "https://ilovejeansusa.com/" }]
      }
    ]
  }
];

export default function TravelGearPage() {
  return (
    <>
      <PageIntro kicker="Travel tech" title="The content creator’s backpack">
        <p>
          I learned the hard way that heavy, awkward gear stays at home. These are the tools I actually travel and film with.
        </p>
        <p>
          The three that changed everything for me are the Insta360 X4, the DJI Mini 4 Pro, and the HoverAir X1. You won’t need
          all of it. Pick the few that fit how you shoot, and they’ll fit in one backpack.
        </p>
      </PageIntro>

      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:pb-32">
        <p className="max-w-2xl border-l-2 border-so-line-2 pl-4 text-[0.9rem] leading-6 text-so-dim">
          Some links on this page are affiliate or referral links. If you buy through them, I may earn a commission or referral
          credit at no extra cost to you.
        </p>

        {SECTIONS.map((section) => (
          <section key={section.title} aria-labelledby={`gear-${slugify(section.title)}`} className="mt-20">
            <h2 id={`gear-${slugify(section.title)}`} className="font-so-display text-[2.5rem] font-medium leading-tight text-so-paper">
              {section.title}
            </h2>
            <ul className="mt-6 border-t border-so-line">
              {section.items.map((item) => (
                <li key={item.name} className="grid gap-6 border-b border-so-line py-8 lg:grid-cols-[1fr_22rem] lg:gap-12">
                  <div>
                    <h3 className="font-so-display text-[1.75rem] font-semibold leading-tight text-so-paper">{item.name}</h3>
                    <p className="so-pretty mt-3 max-w-2xl text-[1.02rem] leading-[1.8] text-so-mute">{item.body}</p>
                    {item.links ? (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {item.links.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer sponsored"
                              className="inline-flex items-center gap-1.5 rounded-full border border-so-line-2 px-3.5 py-1.5 text-[0.88rem] text-so-paper/90 transition-colors so-hover:border-so-gold so-hover:text-so-gold-2"
                            >
                              {link.label}
                              <ExternalMark />
                              <NewTabNote />
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  {item.video ? (
                    <div>
                      <YouTubeLite id={item.video.id} title={item.video.title} />
                      <p className="mt-2 text-[0.85rem] text-so-dim">{item.video.title}</p>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
