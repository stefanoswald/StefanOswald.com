/**
 * Copy for the StefanOswald.com home page. Since Oct 17, 2026 the home page sells three things:
 * AI consulting, corporate entertainment, and murals. Everything else about Stefan lives on /AboutMe,
 * /travel, /watch, and the pages linked from them.
 *
 * House style for the whole site: short sentences, plain words, straight quotes, no em dashes,
 * no semicolons. New copy goes through the humanizer skill so it doesn't read like AI wrote it.
 *
 * Prices: the AI rates came from Stefan on Oct 8, 2026 and the mural rate on Oct 17, 2026.
 * The entertainment starting prices match MagicTrickGuy.com (approved by Stefan on Oct 8, 2026).
 * Keep them the same on both sites.
 */

import type { Photo } from "@/data/site/types";

const MTG = "https://www.magictrickguy.com";
const EMAIL = "StefanPaulOswald@gmail.com";

export const links = {
  email: EMAIL,
  mailto: `mailto:${EMAIL}`,
  mtg: MTG,
  mtgContact: `${MTG}/contact`,
  mtgPricing: `${MTG}/pricing`,
  instagram: "https://www.instagram.com/magictrickguy/",
  youtube: "https://www.youtube.com/@magictrickguy",
  yfpYoutube: "https://www.youtube.com/@yourfullestpotential",
  facebook: "https://www.facebook.com/MagicTrickGuy/",
  github: "https://github.com/stefanoswald",
  magicMansion: "https://the-magic-mansion.com"
};

/** An email to Stefan with the subject and a short form already filled in. */
function prefilledEmail(subject: string, lines: string[]) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

/** A button or link that starts a conversation. external = it opens another website in a new tab. */
export type Action = { href: string; label: string; external: boolean };

/**
 * The AI discovery call. For now it opens an email to Stefan. When he has a booking page that
 * collects the $200, put its address in href, set external to true, and change both labels to
 * "Book a discovery call".
 */
export const discoveryCall = {
  href: prefilledEmail("Discovery call", [
    "Hi Stefan,",
    "",
    "I'd like to set up a discovery call.",
    "",
    "My name:",
    "My business:",
    "What I'd like AI to help with:",
    "Good days and times for a call:"
  ]),
  external: false,
  label: "Request a discovery call",
  shortLabel: "Discovery call",
  note: "30 minutes. The $200 counts toward your project."
};

/** Entertainment bookings happen on MagicTrickGuy.com, which shows Stefan's open dates. */
export const entertainmentBooking: Action = { href: `${MTG}/contact`, label: "Check dates and book", external: true };

export const muralRequest: Action = {
  href: prefilledEmail("Mural", [
    "Hi Stefan,",
    "",
    "I'd like to talk about a mural.",
    "",
    "Where the wall is (city):",
    "Wall size (width and height in feet):",
    "What I'd like painted:",
    "When I'd like it done:",
    "",
    "(If you can, attach a photo of the wall.)"
  ]),
  label: "Ask about a mural",
  external: false
};

export const hero = {
  kicker: "AI consultant, corporate entertainer, and muralist",
  heading: "I build AI, perform magic, and paint murals.",
  lede: "I'm based near Orlando, Florida. Every service below lists its prices, so you know what it costs before we talk."
};

/** The three cards at the top of the home page. Each one jumps to its section. */
export const offers: { id: string; title: string; body: string; price: string; href: string; photo: Photo }[] = [
  {
    id: "ai",
    title: "AI consulting",
    body: "Custom AI tools, hardware setup, and training for your team.",
    price: "Starts with a $200 call",
    href: "#ai-consulting",
    photo: {
      src: "/images/site/stefan-oswald-listening.webp",
      alt: "Stefan Oswald listening and talking with someone across a table",
      width: 1080,
      height: 1350
    }
  },
  {
    id: "entertainment",
    title: "Corporate entertainment",
    body: "Close-up magic, stage shows, emcee work, and keynotes for your event.",
    price: "From $2,500",
    href: "#entertainment",
    photo: {
      src: "/images/site/emcee-on-stage-live-audience.webp",
      alt: "Stefan on stage with a microphone in front of a live audience",
      width: 1080,
      height: 1350
    }
  },
  {
    id: "murals",
    title: "Murals",
    body: "Painted by hand, from the first sketch on your wall to the last detail.",
    price: "$20 per square foot",
    href: "#murals",
    photo: {
      src: "/images/site/murals/mural-galaxy-detail.webp",
      alt: "Close-up of a mural Stefan painted: a swirling purple galaxy with a bright orange center, a full moon, and white clouds",
      width: 1160,
      height: 557
    }
  }
];

export const ai = {
  kicker: "AI consulting",
  heading: "Put AI to work in your business.",
  intro: "I find the work AI can take off your team's plate, and then I build it and set it up for you. It all starts with a 30-minute discovery call.",
  services: [
    {
      title: "Find the time savers",
      body: "We go through how your team works now and pick the jobs AI should take over first."
    },
    {
      title: "Build the tools",
      body: "I build custom AI agents and apps, plus automations for things like video and content. My own apps went from idea to my phone in days."
    },
    {
      title: "Set up the hardware",
      body: "I install the computers and devices your AI runs on, and I make sure they work before I hand them over."
    },
    {
      title: "Train your team",
      body: "I teach your people how to use what we built. Almost twenty years on stage taught me how to keep a room awake."
    }
  ],
  tiersHeading: "How it works",
  tiersIntro: "Every project starts with one paid call. After that, you can book me by the hour or fly me out for a full day.",
  tiers: [
    {
      step: "Start here",
      name: "Discovery call",
      price: "$200",
      unit: "30 minutes",
      body: "You tell me what your business needs. I tell you where AI fits and what I would do first. The $200 counts toward hourly or on-site work.",
      cta: true
    },
    {
      step: "Then, by the hour",
      name: "Hourly consulting",
      price: "$400",
      unit: "per hour",
      body: "Planning and hands-on help for as many hours as your project needs.",
      cta: false
    },
    {
      step: "Or, in person",
      name: "On-site day",
      price: "$5,000",
      unit: "per day, plus travel",
      body: "I fly to you for up to 12 hours of AI consulting and hardware setup each day. After the visit, you also get a phone consultation every week for 2 months.",
      cta: false
    }
  ],
  buildsHeading: "I build the AI I recommend.",
  buildsIntro: "I built all of these for my own work, and one is still in progress.",
  builds: [
    {
      name: "Ronathon",
      kind: "AI agent",
      body: "My AI assistant on a Mac mini. It helps turn almost twenty years of show footage into daily videos."
    },
    {
      name: "The NAS Index",
      kind: "Private search",
      body: "A private search engine for my archive of more than 260,000 files. It can find a face in a crowd or the moment an audience started laughing."
    },
    {
      name: "YFP",
      kind: "iPhone app",
      body: "A twenty-sided die for your day, with an AI life coach built in. It goes with my book."
    },
    {
      name: "ShowCue",
      kind: "Show control",
      body: "It listens to my live show and plays the right music and lighting cue at the right line, so I never have to press a button."
    },
    {
      name: "Meet Cutes and Warm Intro",
      kind: "Practice apps",
      body: "Practice small talk with AI people who talk back. One app is for dating and the other is for business networking."
    },
    {
      name: "Anti-Social",
      kind: "iPhone app",
      body: "Facebook and Instagram without the feed. I still get my messages and Marketplace, but there's nothing to scroll."
    },
    {
      name: "Whispy",
      kind: "Mac app, free",
      body: "Dictation that runs on your own Mac. Hold down a key and talk, and clean text shows up wherever you're typing.",
      href: "https://github.com/stefanoswald/whispy"
    },
    {
      name: "Selves",
      kind: "iPhone app",
      body: "Chat with AI versions of me at 10, 20, 30, and 40. I think everyone should get to ask their younger self a few questions."
    },
    {
      name: "Teleprompter glasses",
      kind: "In progress",
      body: "Smart glasses that feed a speaker the next point in their talk, even after they go off script."
    }
  ]
};

/** Same show counts, countries, reviews, TV credits, and clients as MagicTrickGuy.com. */
export const entertainment = {
  kicker: "Corporate entertainment",
  heading: "Magic for your next event.",
  body: "I've performed close-up and stage magic and hosted events for almost twenty years. Companies like Amazon, Google, IBM, and Dell have hired me to entertain their people.",
  seenOn: "You might have seen me on America's Got Talent, FOX, NBC, CBS, ABC, or The Blox.",
  stats: [
    { value: "3,000+", label: "live shows" },
    { value: "43", label: "countries" },
    { value: "1,000+", label: "five-star reviews" }
  ],
  photos: [
    {
      src: "/images/site/corporate-guests-laughing-together.webp",
      alt: "Two guests laughing together at a corporate party in a jet hangar",
      width: 1080,
      height: 1350
    },
    {
      src: "/images/site/emcee-on-stage-live-audience.webp",
      alt: "Stefan on stage with a microphone in front of a live audience",
      width: 1080,
      height: 1350
    },
    {
      src: "/images/site/trade-show-card-reveal-crowd.webp",
      alt: "A crowd at a trade show booth reacting to a card reveal",
      width: 1080,
      height: 1350
    }
  ] satisfies Photo[],
  pricesHeading: "Starting prices",
  prices: [
    { name: "Close-up and strolling magic", price: "From $2,500", unit: "up to two hours" },
    { name: "Trade show booth", price: "From $3,500", unit: "per show day" },
    { name: "Emcee and host", price: "From $3,500", unit: "per event or meeting day" },
    { name: "Stage show", price: "From $5,000", unit: "20 to 45 minutes" },
    { name: "Keynote", price: "$10,000 to $15,000", unit: "plus travel" }
  ],
  terms: "Your quote depends on the date, the length, and how much we customize. A 50% deposit holds your date, and travel outside Central Florida is extra.",
  quote: {
    text: "We would definitely invite him back to delight our customers at more events.",
    name: "Elizabeth Huber",
    org: "Huber & Associates"
  },
  more: { href: MTG, label: "Videos and reviews on MagicTrickGuy.com", external: true } satisfies Action
};

export const murals = {
  kicker: "Murals",
  heading: "Your wall, painted by hand.",
  paragraphs: [
    "I sketch the design right on your wall and then paint it in. This one started as a simple outline on a plain wall.",
    "Send me the size of your wall and your idea, and I'll get back to you."
  ],
  rate: { price: "$20", unit: "per square foot" },
  example: "For example, an 8-by-10-foot wall is 80 square feet, so that mural would be $1,600.",
  photos: [
    {
      src: "/images/site/murals/mural-day-one.webp",
      alt: "Stefan on a step stool painting the purple sky of a mural, with the rest of the design still in outline",
      width: 1600,
      height: 901,
      caption: "Day one"
    },
    {
      src: "/images/site/murals/mural-in-progress.webp",
      alt: "Stefan painting the left side of the mural. The galaxy and sky are filled in, and the figure on the right is still mostly an outline",
      width: 1600,
      height: 901,
      caption: "Later that day"
    },
    {
      src: "/images/site/murals/mural-finished.webp",
      alt: "The finished mural on a tall kitchen wall: a galaxy and clouds above Mickey Mouse as the Sorcerer's Apprentice, doing a cups trick at a small table, with a castle and a waterfall on the left",
      width: 1800,
      height: 1350,
      caption: "The finished wall"
    }
  ]
};

export const meet = {
  heading: "Who you'll be working with",
  paragraphs: [
    "I'm Stefan Oswald. I studied engineering and software engineering, and I spent five years in the US Air Force.",
    "I've been a professional magician for almost twenty years, with shows in 43 countries. Magic taught me how to make complicated things feel simple. That helps a lot when the complicated thing is AI.",
    "I also write, fly drones, and travel as much as I can."
  ],
  photo: {
    src: "/images/site/stefan-oswald-portrait-cards.webp",
    alt: "Stefan Oswald smiling and holding a fan of playing cards",
    width: 1080,
    height: 1350
  } satisfies Photo,
  links: [
    { label: "More about me", href: "/AboutMe" },
    { label: "Travel photos", href: "/travel" },
    { label: "Watch my videos", href: "/watch" }
  ]
};

export const contact = {
  heading: "Let's talk.",
  body: "Pick what you need. Each button takes you to the right place.",
  options: [
    {
      title: "AI consulting",
      body: "Request a 30-minute discovery call. The $200 counts toward your project.",
      action: { href: discoveryCall.href, label: discoveryCall.label, external: discoveryCall.external } satisfies Action
    },
    {
      title: "Corporate entertainment",
      body: "See my open dates and send your event details on MagicTrickGuy.com.",
      action: entertainmentBooking
    },
    {
      title: "Murals",
      body: "Tell me where the wall is, how big it is, and what you'd like on it.",
      action: muralRequest
    }
  ]
};

export const footer = {
  blurb: "AI consultant, corporate entertainer, and muralist near Orlando, Florida.",
  groups: [
    {
      title: "Work with me",
      links: [
        { label: "AI consulting", href: "/#ai-consulting" },
        { label: "Corporate entertainment", href: "/#entertainment" },
        { label: "Murals", href: "/#murals" }
      ]
    },
    {
      title: "More",
      links: [
        { label: "About me", href: "/AboutMe" },
        { label: "Travel", href: "/travel" },
        { label: "Watch", href: "/watch" },
        { label: "Writing", href: "/writing" }
      ]
    }
  ]
};
