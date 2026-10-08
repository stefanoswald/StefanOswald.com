/**
 * Copy and facts for the StefanOswald.com home page.
 *
 * House style for everything on the main site: short sentences, plain words, no em dashes,
 * no semicolons. Numbers for shows, countries, reviews, and TV credits match MagicTrickGuy.com
 * (artifacts/magictrickguy/src/data/content.ts in that repo), so the two sites never disagree.
 */

export type SuitName = "spades" | "hearts" | "diamonds" | "clubs";

const MTG = "https://www.magictrickguy.com";

export const links = {
  email: "StefanPaulOswald@gmail.com",
  mailto: "mailto:StefanPaulOswald@gmail.com",
  mailtoAI: "mailto:StefanPaulOswald@gmail.com?subject=AI%20consulting",
  // Stefan's Google Calendar booking page ("Call with Stefan Oswald", 15 minutes). Same one MagicTrickGuy.com uses.
  bookCall: "https://calendar.app.google/YmRSzh9C3nY5EcYm6",
  mtg: MTG,
  mtgContact: `${MTG}/contact`,
  instagram: "https://www.instagram.com/magictrickguy/",
  youtube: "https://www.youtube.com/@magictrickguy",
  yfpYoutube: "https://www.youtube.com/@yourfullestpotential",
  facebook: "https://www.facebook.com/MagicTrickGuy/",
  github: "https://github.com/stefanoswald",
  magicMansion: "https://the-magic-mansion.com"
};

export const hero = {
  name: "Stefan Oswald",
  role: "AI Consultant and Corporate Entertainer",
  roleLines: ["AI Consultant and", "Corporate Entertainer"],
  lede:
    "I help businesses put AI to work. I help rooms full of people put their phones down. It’s really the same job: making hard things feel like magic.",
  seenOn: "Seen on America’s Got Talent, FOX, NBC, CBS, ABC, and The Blox."
};

export const ai = {
  heading: "I build the AI I recommend.",
  intro: [
    "Plenty of people can talk about AI. I build with it every day. Agents, apps, and automations do real work in my own business.",
    "I’ll help you find where AI saves your team real time, build it with you, and teach your people to use it. In plain English."
  ],
  services: [
    {
      title: "Find the wins",
      body: "We look at how your team works today and pick the jobs AI can take off their plate first."
    },
    {
      title: "Build the tools",
      body: "Custom agents, apps, and automations, built fast. My own apps went from idea to my phone in days."
    },
    {
      title: "Make the content",
      body: "AI video, voice, and writing workflows that turn raw material into finished posts and videos."
    },
    {
      title: "Train your people",
      body: "Talks and hands-on workshops that make AI feel less scary and more fun. A little magic helps."
    }
  ],
  buildsHeading: "A few things I’ve built",
  builds: [
    {
      name: "Ronathon",
      kind: "AI agent",
      body: "My AI assistant on a Mac mini. It helps turn almost twenty years of show footage into daily videos."
    },
    {
      name: "The NAS Index",
      kind: "Private search",
      body: "A private search engine for my archive of more than 260,000 photos and videos. It can find a face, a line someone said, or the moment a crowd laughed."
    },
    {
      name: "YFP",
      kind: "iPhone app",
      body: "A twenty-sided die for your day, with an AI life coach. It’s the companion app to my book."
    },
    {
      name: "ShowCue",
      kind: "Show control",
      body: "It listens to my live show and fires the music, sound, and lighting cues on the right line. No buttons."
    },
    {
      name: "Meet Cutes and Warm Intro",
      kind: "Practice apps",
      body: "Practice small talk with AI people who talk back. One app for dating, one for business networking."
    },
    {
      name: "Anti-Social",
      kind: "iPhone and Android",
      body: "Facebook and Instagram with the feed removed. Messages, Marketplace, and replies only."
    },
    {
      name: "Whispy",
      kind: "Mac app, free",
      body: "Dictation that runs on your own Mac. Hold a key, talk, and clean text appears. Nothing leaves your computer.",
      href: "https://github.com/stefanoswald/whispy"
    },
    {
      name: "Selves",
      kind: "iPhone app",
      body: "Chat with AI versions of me at 10, 20, 30, and 40. Everyone should get to ask their younger self a few questions."
    },
    {
      name: "Teleprompter glasses",
      kind: "In progress",
      body: "Smart glasses that feed a speaker the next beat, even after they go off script."
    }
  ]
};

export const entertainment = {
  heading: "Magic that brings a room together.",
  body: [
    "For almost twenty years I’ve done close-up magic, stage shows, and event hosting. Companies like Amazon, Google, IBM, and Dell have brought me in.",
    "The magic is the tool. The goal is a room full of people who drop their guard, laugh, and start talking to each other."
  ],
  stats: [
    { value: "3,000+", label: "live shows" },
    { value: "43", label: "countries" },
    { value: "1,000+", label: "five-star reviews" }
  ],
  offerings: [
    { label: "Corporate events", href: `${MTG}/corporate-magic` },
    { label: "Trade shows", href: `${MTG}/trade-show-magic` },
    { label: "Emcee and host", href: `${MTG}/emcee-host` },
    { label: "Keynotes", href: `${MTG}/keynote-magic` },
    { label: "Private events", href: `${MTG}/private-events` }
  ],
  quote: {
    text: "We would definitely invite him back to delight our customers at more events.",
    name: "Elizabeth Huber",
    org: "Huber & Associates"
  },
  photos: [
    {
      src: "/images/site/corporate-guests-laughing-together.webp",
      alt: "Two guests laughing at a corporate event after a card trick",
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
  ]
};

export type Project = {
  name: string;
  body: string;
  href?: string;
  linkLabel?: string;
  external?: boolean;
};

export const projects: { heading: string; intro: string; stages: { label: string; note: string; items: Project[] }[] } = {
  heading: "Before, now, and next",
  intro: "A few of the things I’ve built, what I’m building today, and where it’s all heading.",
  stages: [
    {
      label: "Before",
      note: "Past projects",
      items: [
        { name: "Super Host Florida", body: "My vacation rental and vehicle rental company." },
        { name: "The Great Magic Hall", body: "Resident magician in Old Town Kissimmee." },
        { name: "Drone stock footage", body: "A library of aerial footage for filmmakers and editors." }
      ]
    },
    {
      label: "Now",
      note: "What I’m working on",
      items: [
        { name: "AI consulting", body: "Helping businesses put AI to work.", href: "/#ai", linkLabel: "How I help" },
        {
          name: "Your Fullest Potential",
          body: "Ten years to write the book. Ten months to write the talks. Ten weeks to write the album. Ten days to build the app. Next, a stage show.",
          href: "/your-fullest-potential",
          linkLabel: "Read the opening chapters"
        },
        {
          name: "The Magic Mansion",
          body: "Small-group masterminds in Orlando where magicians and mentalists build their acts with mentors like Gregory Wilson and Banachek.",
          href: "https://the-magic-mansion.com",
          linkLabel: "the-magic-mansion.com",
          external: true
        }
      ]
    },
    {
      label: "Next",
      note: "Future projects",
      items: [
        {
          name: "The Top Hat",
          body: "An entertainment destination planned for Orlando. A mystery-show theater, dining, immersive art, a gym and spa, and a performing arts college under one roof.",
          href: "/top-hat",
          linkLabel: "See the plan"
        },
        {
          name: "Energy for Energy",
          body: "An app for trading skills, tools, and favors with your neighbors. What you give comes back.",
          href: "/energy-for-energy",
          linkLabel: "Read the idea"
        },
        {
          name: "The Contingency",
          body: "My science fiction series. Earth is out of time, and a small team bets everything on one plan.",
          href: "/the-contingency",
          linkLabel: "Read the opening"
        }
      ]
    }
  ]
};

export type Passion = {
  rank: "A" | "K" | "Q" | "J";
  title: string;
  line: string;
  href?: string;
  external?: boolean;
};

export type SuitGroup = { suit: SuitName; label: string; cards: Passion[] };

/**
 * "Pick a card": the things Stefan loves outside his two jobs, dealt as the 16 honor cards.
 * Suits group them: spades = build, diamonds = make, clubs = capture, hearts = live.
 */
export const passions: { heading: string; intro: string; groups: SuitGroup[] } = {
  heading: "Pick a card. Any card.",
  intro: "Two jobs pay the bills. These are the things I could talk about all night.",
  groups: [
    {
      suit: "spades",
      label: "Build",
      cards: [
        { rank: "A", title: "App creation", line: "Habit trackers, practice partners, show tools. If I need an app, I build it." },
        { rank: "K", title: "AI video", line: "Turning ideas into short films with AI video tools." },
        { rank: "Q", title: "VR game design", line: "Designing games you can step inside." },
        { rank: "J", title: "Inventions", line: "A notebook full of ideas, and a few on the workbench." }
      ]
    },
    {
      suit: "diamonds",
      label: "Make",
      cards: [
        {
          rank: "A",
          title: "Writing",
          line: "A personal growth book ten years in the making, and a science fiction series.",
          href: "/writing"
        },
        { rank: "K", title: "Music", line: "I wrote the Your Fullest Potential album in ten weeks." },
        { rank: "Q", title: "Murals", line: "Big walls, bright paint, and a ladder." },
        { rank: "J", title: "3D printing", line: "Eleven printers. Something is always printing." }
      ]
    },
    {
      suit: "clubs",
      label: "Capture",
      cards: [
        { rank: "A", title: "Content creation", line: "Magic videos as @MagicTrickGuy, on every platform.", href: "/watch" },
        { rank: "K", title: "Drones", line: "From palm-sized fliers to FPV freestyle." },
        { rank: "Q", title: "360 cameras", line: "An Insta360 goes everywhere I go." },
        {
          rank: "J",
          title: "Travel tech",
          line: "The gear I use to travel light and film everything. Here’s the list.",
          href: "/travel-gear"
        }
      ]
    },
    {
      suit: "hearts",
      label: "Live",
      cards: [
        { rank: "A", title: "Travel", line: "Shows in 43 countries so far." },
        { rank: "K", title: "Longevity", line: "Sleep, training, and data for a long, strong life." },
        { rank: "Q", title: "Calisthenics", line: "Bodyweight training. Any place, any day." },
        { rank: "J", title: "Cybertruck", line: "Want to drive mine? It’s on Turo.", href: "/cybertruck" }
      ]
    }
  ]
};

export const about = {
  heading: "Hi, I’m Stefan.",
  paragraphs: [
    "I was born in Oklahoma City. In 2005 I joined the US Air Force, worked in air transportation, and left as a Staff Sergeant. While deployed to Iraq, I performed magic for patients in a military hospital.",
    "Along the way I earned degrees in engineering, software engineering, mathematics, theater, and air transportation. I’ve also spent almost twenty years performing, in 43 countries, on network TV, and on the America’s Got Talent stage.",
    "Today I put both halves to work. The engineer builds AI that does real jobs. The magician makes it feel easy. I live near Orlando, Florida, and my purpose hasn’t changed: bring joy to as many people as I can."
  ],
  facts: [
    { label: "From", value: "Oklahoma City" },
    { label: "Served", value: "US Air Force, 2005 to 2010" },
    { label: "Home", value: "Four Corners, near Orlando" },
    { label: "Studied", value: "Engineering, software, math, theater, air transportation" }
  ],
  mantra: "Energy for energy. What I give is always returned to me."
};

export const contact = {
  heading: "Let’s talk.",
  body: "Tell me what you’re working on. You’ll talk with me, not an agency.",
  eventsNote: "Planning an event? Everything about booking a show lives on MagicTrickGuy.com."
};

export const footer = {
  blurb: "AI consultant and corporate entertainer near Orlando, Florida.",
  columns: [
    {
      title: "Work with me",
      links: [
        { label: "AI consulting", href: "/#ai" },
        { label: "Book a call", href: links.bookCall, external: true },
        { label: "Book entertainment", href: MTG, external: true }
      ]
    },
    {
      title: "Projects",
      links: [
        { label: "Your Fullest Potential", href: "/your-fullest-potential" },
        { label: "The Top Hat", href: "/top-hat" },
        { label: "Energy for Energy", href: "/energy-for-energy" },
        { label: "The Magic Mansion", href: links.magicMansion, external: true }
      ]
    },
    {
      title: "Explore",
      links: [
        { label: "Watch", href: "/watch" },
        { label: "Writing", href: "/writing" },
        { label: "Travel gear", href: "/travel-gear" },
        { label: "Cybertruck", href: "/cybertruck" },
        { label: "Learn magic", href: "/learn-magic" }
      ]
    }
  ],
  social: [
    { label: "Instagram", href: links.instagram },
    { label: "YouTube", href: links.youtube },
    { label: "Facebook", href: links.facebook },
    { label: "GitHub", href: links.github }
  ]
};
