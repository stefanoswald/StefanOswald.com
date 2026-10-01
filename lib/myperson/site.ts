/**
 * ============================================================================
 *  FIND MY PERSON: every word on the page, the video, and your links
 *  (stefanoswald.com/MyPerson)
 * ============================================================================
 *
 *  Everything in this file is public (it ships to the browser).
 *  Private things live elsewhere:
 *   - Your phone number: the CONTACT_PHONE environment variable in Vercel
 *   - Questions and scoring: lib/myperson/questionnaire.ts
 *
 *  {name} is filled in with her first name where noted.
 * ============================================================================
 */

export const site = {
  name: "Find Stefan's Person",
  /** The page's address. Everything for it lives under this path. */
  path: "/MyPerson",

  person: {
    firstName: "Stefan",
    fullName: "Stefan Oswald",
    location: "Orlando / Kissimmee, Florida"
  },

  seo: {
    title: "Find Stefan's Person",
    description:
      "Stefan is looking for his person. A one-minute video and a three-minute questionnaire. No wrong answers, just honest ones."
  },

  hero: {
    /** The word in `emphasis` is set in italics inside the headline. */
    headline: "I'm looking for my person.",
    emphasis: "person",
    subheading: "And apparently I've decided a QR code is a perfectly reasonable way to find her."
  },

  /**
   * THE VIDEO. The files are in public/MyPerson/.
   * Leave `src` empty to show the written version instead.
   */
  video: {
    src: "/MyPerson/intro.mp4",
    poster: "/MyPerson/poster.webp",
    captions: "/MyPerson/intro.vtt",
    durationLabel: "1 min",
    /** Width / height of the recording. Phone videos are usually "9 / 16". */
    aspectRatio: "9 / 16"
  },

  /**
   * The words in the video. Shown under it for anyone who can't play sound.
   * Keep this matched to what you say on camera. The timed captions are in
   * public/MyPerson/intro.vtt.
   */
  transcript: [
    "I'm Stefan. Nice to meet you.",
    "If you're watching this, it means I just handed you a QR code, or maybe somebody shared a link. Either way, hi.",
    "And I know this is not a normal move. But I'm a magician, so normal was never an option.",
    "Here's the deal. I am ready to find my person and to share this crazy life with her.",
    "I know myself pretty well. I fall in love fast. And that can be wonderful, but it can also mean chemistry can talk me out of asking the hard questions.",
    "So instead of finding out the answers three months in, I made a short little questionnaire. About three minutes long. No wrong answers at all, just honest ones.",
    "It's not about finding someone perfect. I'm not perfect. It's about finding out if your weird could match my weird, and if your vision of life could match mine. I hope so. That would be great.",
    "So if you'd like to find out, tap below."
  ],

  cta: {
    button: "I might be her ❤️",
    note: "About 3 minutes. One question at a time."
  },

  privacyNote:
    "Your answers are private and are only being used to figure out whether Stefan should ask you on a date. They aren't saved anywhere, and they will never be sold.",

  questionnaire: {
    intro: {
      title: "Chemistry is easy. Compatibility is harder.",
      body: "Let's check a few of the things that actually matter.",
      details: ["About 3 minutes", "One question at a time", "No wrong answers, just honest ones"],
      button: "Let's do it"
    },
    namePrompt: "First things first. What should I call you?",
    namePlaceholder: "First name",
    /** Little notes that appear under the progress bar. Keys are how far along she is (0 to 1). */
    progressMessages: {
      "0.5": "Halfway there. This is going better than most first dates.",
      "0.85": "Almost done. Thanks for being so honest."
    } as Record<string, string>,
    checking: "Shuffling the deck…",
    offlineMessage: "Your connection dropped somewhere in there.",
    retry: "Try again"
  },

  results: {
    compatible: {
      title: "Okay… this is promising. 👀",
      subtitle: "Apparently the internet thinks we should have a conversation.",
      textButton: "Text Stefan",
      saveButton: "Save contact",
      /** The text message she starts with. {name} is her first name. */
      textMessage: "Hi Stefan! It's {name} 👋 The questionnaire says we should talk.",
      notesTitle: "Add to your first text (optional)",
      notesKnow: "What's something I should know about you before I text you?",
      notesWhy: "What made you decide to fill this out?",
      notesButton: "Text Stefan with these",
      noNumber: "Stefan's number isn't set up yet. Say hi on social and he will find you."
    },
    notCompatible: {
      title: "Thanks for being wonderfully honest.",
      body: "Some of our answers suggest we may be looking for different things in life, and that's exactly what this little experiment is meant to discover early. I really appreciate you taking the time to do it.",
      signoff: "Stefan"
    },
    socialsTitle: "Come say hi",
    startOver: "Back to the start"
  },

  about: {
    title: "The guy behind the QR code",
    /** A small square photo in public/MyPerson/. Leave empty ("") for your initials instead. */
    photo: "/MyPerson/stefan.webp",
    roles: [
      "Magician",
      "Author",
      "Speaker",
      "Entrepreneur",
      "Software developer",
      "Content creator",
      "Professional drone pilot"
    ],
    blurb:
      "I love travel, creating things, fitness, personal growth, great conversations, experiences, family, performing, building businesses, and trying slightly ridiculous ideas. Like building a website to find the woman I'm going to marry.",
    /** Optional. Delete any you don't want to share. */
    funFacts: ["7,000+ street shows and 3,000+ theater shows", "Performed in 43 countries", "Air Force veteran"],
    /** The line above the social links. Leave empty ("") to hide it. */
    handleNote: "I'm @magictrickguy on just about everything."
  },

  /** Leave a url empty ("") to hide that link. */
  socials: [
    { id: "instagram", label: "Instagram", handle: "@magictrickguy", url: "https://www.instagram.com/magictrickguy" },
    { id: "youtube", label: "YouTube", handle: "@MagicTrickGuy", url: "https://www.youtube.com/@MagicTrickGuy" },
    { id: "tiktok", label: "TikTok", handle: "@magictrickguy", url: "https://www.tiktok.com/@magictrickguy" },
    { id: "facebook", label: "Facebook", handle: "MagicTrickGuy", url: "https://www.facebook.com/MagicTrickGuy" },
    { id: "linkedin", label: "LinkedIn", handle: "", url: "" },
    { id: "website", label: "Website", handle: "magictrickguy.com", url: "https://www.magictrickguy.com" }
  ],

  footer: {
    madeWith: "Made in Orlando with an unreasonable amount of hope."
  }
} as const;

/** Replace {tokens} in copy. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
