/**
 * Copy for /AboutMe: everything about Stefan that isn't AI consulting. The home page links here
 * once ("More about me"), and nothing else on the site points to the pages listed in `explore`.
 *
 * Same house style as data/site/home.ts. Show counts, countries, reviews, and TV credits match
 * MagicTrickGuy.com so the two sites never disagree.
 */

import type { Photo, Project, SuitGroup } from "@/data/site/types";

const MTG = "https://www.magictrickguy.com";

export const intro = {
  kicker: "About me",
  heading: "Hi, I'm Stefan.",
  paragraphs: [
    "I was born in Oklahoma City. In 2005 I joined the US Air Force and worked in air transportation until 2010, when I left as a Staff Sergeant. While I was deployed to Iraq, I did magic for patients in a military hospital.",
    "Along the way I earned degrees in engineering, software engineering, mathematics, theater, and air transportation. I've performed magic for almost twenty years, in 43 countries and on TV.",
    "Today most of my work is AI consulting. The engineering helps me build things that work, and the years on stage help me explain them. I live near Orlando, Florida, and my purpose hasn't changed. I want to bring joy to as many people as I can."
  ],
  photo: {
    src: "/images/site/stefan-oswald-portrait.webp",
    alt: "Stefan Oswald holding a crystal ball close to the camera",
    width: 1080,
    height: 1350
  } satisfies Photo,
  facts: [
    { label: "From", value: "Oklahoma City" },
    { label: "Served", value: "US Air Force, 2005 to 2010" },
    { label: "Home", value: "Four Corners, near Orlando" },
    { label: "Studied", value: "Engineering, software, math, theater, air transportation" }
  ],
  mantra: "Energy for energy. What I give is always returned to me.",
  mantraNote: "The rule I try to live by"
};

export const stage = {
  kicker: "On stage",
  heading: "I'm also a magician.",
  body: "I've performed close-up and stage magic and hosted events for almost twenty years. Companies like Amazon, Google, IBM, and Dell have hired me to entertain their people.",
  seenOn: "You might have seen me on America's Got Talent, FOX, NBC, CBS, ABC, or The Blox.",
  stats: [
    { value: "3,000+", label: "live shows" },
    { value: "43", label: "countries" },
    { value: "1,000+", label: "five-star reviews" }
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
  ] satisfies Photo[],
  // The only link to MagicTrickGuy.com on this page.
  link: { label: "Book me for an event at MagicTrickGuy.com", href: MTG }
};

export const projects: { heading: string; stages: { label: string; note: string; items: Project[] }[] } = {
  heading: "Before, now, and next",
  stages: [
    {
      label: "Before",
      note: "Past projects",
      items: [
        { name: "Super Host Florida", body: "My vacation rental and vehicle rental company." },
        { name: "The Great Magic Hall", body: "I was the resident magician there, in Old Town Kissimmee." },
        { name: "Drone stock footage", body: "A library of aerial footage for filmmakers and editors." }
      ]
    },
    {
      label: "Now",
      note: "What I'm working on",
      items: [
        {
          name: "AI consulting",
          body: "My main work now. I help businesses put AI to work.",
          href: "/",
          linkLabel: "See how it works"
        },
        {
          name: "Your Fullest Potential",
          body: "The book took ten years, the talks took ten months, the album took ten weeks, and the app took ten days. Next is a stage show.",
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
          body: "An entertainment destination I'm planning for Orlando, with a mystery-show theater, dining, immersive art, a gym and spa, and a performing arts college under one roof.",
          href: "/top-hat",
          linkLabel: "See the plan"
        },
        {
          name: "Energy for Energy",
          body: "An app idea for trading skills and favors with your neighbors.",
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

/**
 * "Pick a card": the things Stefan loves outside of work, dealt as the 16 honor cards.
 * Suits group them: spades = build, diamonds = make, clubs = capture, hearts = live.
 */
export const passions: { heading: string; intro: string; groups: SuitGroup[] } = {
  heading: "Pick a card. Any card.",
  intro: "These are the things I could talk about all night.",
  groups: [
    {
      suit: "spades",
      label: "Build",
      cards: [
        { rank: "A", title: "App creation", line: "If I need an app and it doesn't exist yet, I build it." },
        { rank: "K", title: "AI video", line: "I turn ideas into short films with AI video tools." },
        { rank: "Q", title: "VR game design", line: "I design games you can step inside." },
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
          line: "A personal growth book that took ten years, plus a science fiction series.",
          href: "/writing"
        },
        { rank: "K", title: "Music", line: "I wrote the Your Fullest Potential album in ten weeks." },
        { rank: "Q", title: "Murals", line: "Big walls and a lot of paint." },
        { rank: "J", title: "3D printing", line: "Eleven printers and counting." }
      ]
    },
    {
      suit: "clubs",
      label: "Capture",
      cards: [
        { rank: "A", title: "Content creation", line: "I post magic videos as @MagicTrickGuy.", href: "/watch" },
        { rank: "K", title: "Drones", line: "Everything from palm-sized drones to FPV freestyle." },
        { rank: "Q", title: "360 cameras", line: "An Insta360 goes everywhere I go." },
        {
          rank: "J",
          title: "Travel tech",
          line: "What I pack to travel light and still film everything.",
          href: "/travel-gear"
        }
      ]
    },
    {
      suit: "hearts",
      label: "Live",
      cards: [
        { rank: "A", title: "Travel", line: "Shows in 43 countries so far." },
        { rank: "K", title: "Longevity", line: "I want a long, strong life, so I train for one." },
        { rank: "Q", title: "Calisthenics", line: "Bodyweight training I can do anywhere." },
        { rank: "J", title: "Cybertruck", line: "Want to drive mine? It's on Turo.", href: "/cybertruck" }
      ]
    }
  ]
};

export const explore = {
  heading: "More to read and watch",
  items: [
    { label: "Watch", href: "/watch", body: "Magic videos from festivals, parties, and the street." },
    { label: "Your Fullest Potential", href: "/your-fullest-potential", body: "The opening chapters of my book." },
    { label: "The Contingency", href: "/the-contingency", body: "The start of my science fiction series." },
    { label: "The Top Hat", href: "/top-hat", body: "My plan for an entertainment destination in Orlando." },
    { label: "Energy for Energy", href: "/energy-for-energy", body: "An app idea built on trading favors." },
    { label: "Travel gear", href: "/travel-gear", body: "Everything I pack to travel light and film." },
    { label: "Cybertruck", href: "/cybertruck", body: "Rent my truck on Turo." },
    { label: "Learn magic", href: "/learn-magic", body: "A few rules and some easy tricks to start with." }
  ],
  socialNote: "I post as @MagicTrickGuy on"
};
