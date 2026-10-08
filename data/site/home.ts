/**
 * Copy for the StefanOswald.com home page. The home page sells one thing: Stefan's AI consulting.
 * Everything else about him lives on /AboutMe (data/site/about.ts).
 *
 * House style for the whole site: short sentences, plain words, straight quotes, no em dashes,
 * no semicolons. New copy goes through the humanizer skill so it doesn't read like AI wrote it.
 * Prices and what each offer includes came from Stefan on Oct 8, 2026.
 */

const MTG = "https://www.magictrickguy.com";
const EMAIL = "StefanPaulOswald@gmail.com";

export const links = {
  email: EMAIL,
  mailto: `mailto:${EMAIL}`,
  mtg: MTG,
  instagram: "https://www.instagram.com/magictrickguy/",
  youtube: "https://www.youtube.com/@magictrickguy",
  yfpYoutube: "https://www.youtube.com/@yourfullestpotential",
  facebook: "https://www.facebook.com/MagicTrickGuy/",
  github: "https://github.com/stefanoswald",
  magicMansion: "https://the-magic-mansion.com"
};

const DISCOVERY_EMAIL = [
  "Hi Stefan,",
  "",
  "I'd like to set up a discovery call.",
  "",
  "My name:",
  "My business:",
  "What I'd like AI to help with:",
  "Good days and times for a call:"
].join("\n");

/**
 * The one thing the home page asks people to do. For now it opens an email to Stefan.
 * When he has a booking page that collects the $200, put its address in href, set external
 * to true, and change both labels to "Book a discovery call".
 */
export const discoveryCall = {
  href: `mailto:${EMAIL}?subject=${encodeURIComponent("Discovery call")}&body=${encodeURIComponent(DISCOVERY_EMAIL)}`,
  external: false,
  label: "Request a discovery call",
  shortLabel: "Discovery call",
  note: "30 minutes. The $200 counts toward your project."
};

export const hero = {
  kicker: "Stefan Oswald, AI consultant",
  heading: "Put AI to work in your business.",
  lede: "I find the work AI can take off your team's plate, and then I build it and set it up for you. It all starts with a 30-minute discovery call."
};

export const services = {
  heading: "Where I can help",
  items: [
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
  ]
};

export const howItWorks = {
  heading: "How it works",
  intro: "Every project starts with one paid call. After that, you can book me by the hour or fly me out for a full day.",
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
  ]
};

export const work = {
  heading: "I build the AI I recommend.",
  intro: "I use all of these myself. Some run every day, and one is still in progress.",
  builds: [
    {
      name: "Ronathon",
      kind: "AI agent",
      body: "My AI assistant on a Mac mini. It helps turn almost twenty years of show footage into daily videos."
    },
    {
      name: "The NAS Index",
      kind: "Private search",
      body: "A private search engine for my archive of more than 260,000 photos and videos. It can find a face in a crowd or the moment an audience started laughing."
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
      kind: "iPhone and Android",
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

export const meet = {
  heading: "Who you'll be working with",
  paragraphs: [
    "I'm Stefan Oswald. I studied engineering and software engineering, and I spent five years in the US Air Force.",
    "I've also been a professional magician for almost twenty years, with shows in 43 countries. Magic taught me how to make complicated things feel simple. That helps a lot when the complicated thing is AI.",
    "Today AI consulting is my main work. I live near Orlando, Florida, and I'm happy to fly to you."
  ],
  photo: {
    src: "/images/site/stefan-oswald-portrait-cards.webp",
    alt: "Stefan Oswald smiling and holding a fan of playing cards",
    width: 1080,
    height: 1350
  },
  aboutLabel: "More about me",
  // The only link to MagicTrickGuy.com on the home page, on purpose.
  magicNote: "Want to book me as a magician or emcee instead?",
  magicLink: "That's all on MagicTrickGuy.com."
};

export const closing = {
  heading: "Start with a 30-minute call.",
  body: "Tell me what you'd like AI to do for your business. If we keep working together, the $200 is credited toward hourly or on-site work."
};

export const footer = {
  blurb: "AI consultant near Orlando, Florida.",
  links: [
    { label: "Services", href: "/#services" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "My work", href: "/#work" },
    { label: "About me", href: "/AboutMe" }
  ]
};
