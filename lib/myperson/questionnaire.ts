import "server-only";
import type { QuestionnaireConfig } from "./types";

/**
 * ============================================================================
 *  FIND MY PERSON: THE QUESTIONNAIRE  (stefanoswald.com/MyPerson)
 * ============================================================================
 *
 *  Every question, answer, weight, dealbreaker, and threshold lives here.
 *  This file only runs on the server. None of the scoring is ever sent to her
 *  phone, so she cannot see which answers matter or how. Her answers are not
 *  saved anywhere. They are scored once, and your number is sent only if
 *  they line up.
 *
 *  HOW THE RESULT IS DECIDED
 *   1. Any answer marked `dealbreaker: true` means "not compatible". Done.
 *   2. Any combo rule (bottom of file) with effect "dealbreaker" that matches
 *      also means "not compatible".
 *   3. Answers marked `flag: true` are soft red flags. More than
 *      `thresholds.maxFlags` of them means "not compatible".
 *   4. Everything else becomes a score from 0 to 100. Each answer's `score`
 *      (0 to 1) is multiplied by its question's weight. At or above
 *      `thresholds.compatibleScore` means "compatible". Below it does not.
 *
 *  THE ORDER SHE SEES
 *   1. Every "dealbreaker" question comes first, with no progress bar.
 *   2. If a dealbreaker answer came up, she only gets the questions in
 *      `flow.afterDealbreaker`, then `flow.finalQuestion`, then a warm goodbye.
 *   3. Otherwise the rest follow in the order below, with a progress bar that
 *      never says how many are left. The moment a match becomes impossible
 *      (too many red flags, or a score that could not reach the bar even with
 *      perfect answers from here on), she skips to `flow.finalQuestion`.
 *
 *  IMPORTANCE LEVELS (the `importance` field)
 *   "dealbreaker"  Has at least one instant-no answer. Also counts toward the score.
 *   "strong"       Counts a lot. Can have soft red flags.
 *   "nice"         Counts a little.
 *   "info"         Never affects the result. (Nothing is saved, so use it sparingly.)
 *
 *  EDITING TIPS
 *   - Change wording freely.
 *   - Bump `version` whenever you change anything. It resets any questionnaire
 *     someone has half finished on their phone.
 *   - If you make a mistake (a typo in an id, a score above 1), the build on
 *     Vercel fails with a message saying what is wrong, and the live site stays
 *     as it was.
 * ============================================================================
 */
export const questionnaire: QuestionnaireConfig = {
  version: "2026-09-30.1",

  weights: {
    dealbreaker: 4,
    strong: 3,
    nice: 1,
    info: 0
  },

  thresholds: {
    /** Lowest score (0 to 100) that reveals your number. */
    compatibleScore: 72,
    /** Most soft red flags allowed. One more means a warm goodbye. */
    maxFlags: 1
  },

  /**
   * THE ORDER SHE SEES (see the top of this file).
   * `afterDealbreaker`: the only questions she still gets after a dealbreaker answer,
   *   so the goodbye does not arrive abruptly. Use [] to go straight to the final question.
   * `finalQuestion`: everyone finishes on this one.
   */
  flow: {
    afterDealbreaker: ["travel"],
    finalQuestion: "magic"
  },

  sections: [
    { id: "big", title: "The big stuff" },
    { id: "adventure", title: "The adventure" },
    { id: "love", title: "Love, day to day" },
    { id: "habits", title: "Habits" },
    { id: "you", title: "Just for fun" }
  ],

  questions: [
    /* ---------------------------------------------------------------- */
    /* THE BIG STUFF. Every dealbreaker question, asked first.          */
    /* ---------------------------------------------------------------- */
    {
      id: "looking_for",
      section: "big",
      type: "single",
      importance: "dealbreaker",
      prompt: "What are you hoping to find right now?",
      choices: [
        { id: "my_person", label: "My person. The real, long-term thing.", score: 1 },
        { id: "serious", label: "Something serious, if it's the right fit.", score: 0.9 },
        { id: "see_where", label: "Let's date and see where it goes.", score: 0.5 },
        { id: "casual", label: "Something casual and fun.", dealbreaker: true },
        { id: "taken", label: "I'm actually taken. Just curious. 🙈", dealbreaker: true },
      ],
      why: "You want a long-term partner. Casual, or already taken, is an instant no.",
    },
    {
      id: "marriage",
      section: "big",
      type: "single",
      importance: "dealbreaker",
      prompt: "Where do you stand on marriage?",
      choices: [
        { id: "want_it", label: "I want it. Vows, cake, the whole thing.", score: 1 },
        { id: "right_person", label: "Yes, with the right person.", score: 0.9 },
        { id: "unsure", label: "I'm not sure it's for me.", score: 0.3, flag: true },
        { id: "no", label: "Marriage isn't for me.", dealbreaker: true },
      ],
      why: "The whole point is finding the woman you marry.",
    },
    {
      id: "structure",
      section: "big",
      type: "single",
      importance: "dealbreaker",
      prompt: "What kind of relationship feels right to you?",
      choices: [
        { id: "monogamy", label: "Monogamy. Just the two of us.", score: 1 },
        { id: "figuring", label: "I'm still figuring that out.", score: 0.3, flag: true },
        { id: "open", label: "Open or non-monogamous.", dealbreaker: true },
      ],
      why: "Assumes you want monogamy. Change this if that's wrong.",
    },
    {
      id: "kids",
      section: "big",
      type: "single",
      importance: "dealbreaker",
      prompt: "Kids. What's your story?",
      choices: [
        { id: "want", label: "No kids yet, and I want them.", score: 1 },
        { id: "probably", label: "No kids yet. Probably, with the right person.", score: 0.8 },
        { id: "unsure", label: "No kids, and I'm not sure I want them.", score: 0.3, flag: true },
        { id: "no", label: "No kids, and I don't want any.", dealbreaker: true },
        { id: "has_kids", label: "I already have kids.", dealbreaker: true },
      ],
      why: "You want kids of your own. You said her already having kids is a dealbreaker.",
    },
    {
      id: "intimacy",
      section: "big",
      type: "single",
      importance: "dealbreaker",
      prompt: "How important is physical intimacy in a relationship for you?",
      helper: "No details needed. Just the big picture.",
      choices: [
        { id: "very", label: "Very. It's a big part of how I connect.", score: 1 },
        { id: "important", label: "Important, alongside everything else.", score: 0.85 },
        { id: "in_person", label: "I'd rather talk about that in person. 😊", score: 0.6 },
        { id: "not_priority", label: "Nice, but not a priority.", score: 0.25, flag: true },
        { id: "not_important", label: "Not important to me.", dealbreaker: true },
      ],
      why: "You said intimacy is an important part of a relationship.",
    },
    {
      id: "smoking",
      section: "big",
      type: "single",
      importance: "dealbreaker",
      prompt: "Smoking or vaping?",
      choices: [
        { id: "never", label: "Never.", score: 1 },
        { id: "quit", label: "I quit for good.", score: 0.9 },
        { id: "rarely", label: "Once in a blue moon, at a party.", score: 0.2, flag: true },
        { id: "quitting", label: "I'm trying to quit.", score: 0.1, flag: true },
        { id: "yes", label: "Yes, regularly.", dealbreaker: true },
      ],
      why: "You live fully sober. Regular smoking or vaping is an instant no.",
    },
    {
      id: "drugs",
      section: "big",
      type: "single",
      importance: "dealbreaker",
      prompt: "Recreational drugs?",
      choices: [
        { id: "never", label: "Not my thing.", score: 1 },
        { id: "past", label: "In the past. Not anymore.", score: 0.85 },
        { id: "cannabis", label: "Cannabis now and then.", dealbreaker: true },
        { id: "party", label: "Sometimes, at parties or festivals.", dealbreaker: true },
      ],
      why: "You live fully sober, so any current use is an instant no, weed included.",
    },

    /* ---------------------------------------------------------------- */
    /* THE ADVENTURE                                                    */
    /* ---------------------------------------------------------------- */
    {
      id: "travel",
      section: "adventure",
      type: "single",
      importance: "strong",
      prompt: "How much travel sounds fun?",
      choices: [
        { id: "homebody", label: "Home is my happy place.", score: 0.15, flag: true },
        { id: "few_trips", label: "A few trips a year.", score: 0.7 },
        { id: "passport", label: "Give me a passport and a boarding pass.", score: 1 },
        { id: "luggage", label: "I have considered replacing my home with luggage.", score: 1 },
      ],
    },
    {
      id: "family_travel",
      section: "adventure",
      type: "single",
      importance: "strong",
      prompt: "Picture life with kids someday. Does travel stay part of it?",
      choices: [
        { id: "always", label: "Absolutely. Tiny passports, big adventures.", score: 1 },
        { id: "some", label: "Yes, a few family trips a year.", score: 0.75 },
        { id: "later", label: "Maybe, once they're a little older.", score: 0.35 },
        { id: "settle", label: "No, that's when we'd settle down for good.", score: 0.05, flag: true },
      ],
      why: "You plan to keep traveling after kids, so a partner who would stop for good is a red flag.",
    },
    {
      id: "lifestyle",
      section: "adventure",
      type: "single",
      importance: "strong",
      prompt:
        "My life isn't a 9 to 5. Shows, big ideas at 2am, last-minute trips. How does that sound?",
      choices: [
        { id: "same", label: "Fun. I'm the same kind of chaos.", score: 1 },
        { id: "fun_with_time", label: "Exciting, as long as we make real time for us.", score: 1 },
        { id: "adapt", label: "A little stressful, but I could adapt.", score: 0.5 },
        { id: "routine", label: "I really need a steady routine.", score: 0.1, flag: true },
      ],
    },
    {
      id: "togetherness",
      section: "adventure",
      type: "scale",
      importance: "strong",
      prompt:
        "Every couple has a sweet spot between independence and togetherness. Where's yours?",
      scaleLabels: ["Two full lives", "Together 24/7"],
      choices: [
        { id: "1", label: "Very independent. I need lots of my own space.", score: 0.4 },
        { id: "2", label: "Independent, with plenty of quality time.", score: 1 },
        { id: "3", label: "A healthy mix of both.", score: 1 },
        { id: "4", label: "Together as much as we can be.", score: 0.6 },
        { id: "5", label: "Attached at the hip. All day, every day.", score: 0.15, flag: true },
      ],
    },
    {
      id: "crowd",
      section: "adventure",
      type: "single",
      importance: "strong",
      prompt: "After one of my shows, 40 strangers want photos and a chat. You're...",
      choices: [
        { id: "mingling", label: "Making friends with all of them.", score: 1 },
        { id: "a_bit", label: "Mingling for a bit, then ready for a quiet dinner.", score: 1 },
        { id: "proud", label: "Proudly watching from the back of the room.", score: 0.8 },
        { id: "nightmare", label: "Honestly? That's my nightmare.", score: 0.2, flag: true },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* LOVE, DAY TO DAY                                                 */
    /* ---------------------------------------------------------------- */
    {
      id: "communication",
      section: "love",
      type: "single",
      importance: "strong",
      prompt: "When something's bothering you, you usually...",
      choices: [
        { id: "direct", label: "Say it. Kindly, but directly.", score: 1 },
        { id: "process", label: "Take some time, then talk it through.", score: 0.9 },
        { id: "hints", label: "Drop hints and hope they land.", score: 0.3 },
        { id: "bottle", label: "Keep it inside and hope it passes.", score: 0.1, flag: true },
      ],
    },
    {
      id: "conflict",
      section: "love",
      type: "single",
      importance: "strong",
      prompt: "In a disagreement, what's your move?",
      choices: [
        { id: "talk", label: "Talk it out until we both feel heard.", score: 1 },
        { id: "cool_off", label: "Cool off first, then come back and talk.", score: 0.9 },
        { id: "let_go", label: "Let it go and move on.", score: 0.45 },
        { id: "win", label: "Win. Obviously. 😇", score: 0.4 },
        { id: "silent", label: "The silent treatment.", score: 0.05, flag: true },
      ],
    },
    {
      id: "affection",
      section: "love",
      type: "single",
      importance: "strong",
      prompt: "How affectionate are you?",
      choices: [
        { id: "very", label: "Very. Hand-holding, hugs, all of it.", score: 1 },
        { id: "own_way", label: "Affectionate, in my own way.", score: 0.8 },
        { id: "actions", label: "I show love more through actions than touch.", score: 0.5 },
        { id: "not_touchy", label: "Not really a touchy person.", score: 0.15 },
      ],
    },
    {
      id: "trust",
      section: "love",
      type: "single",
      importance: "strong",
      prompt:
        "My work means meeting lots of people, fans included. How does trust usually work for you?",
      choices: [
        { id: "default_trust", label: "I trust until there's a real reason not to.", score: 1 },
        { id: "earned", label: "Trust takes time. Then I'm secure.", score: 0.85 },
        { id: "owns_it", label: "I get jealous sometimes, but I own it and talk about it.", score: 0.6 },
        { id: "jealous", label: "I get jealous pretty easily, not gonna lie.", score: 0.15, flag: true },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* HABITS                                                           */
    /* ---------------------------------------------------------------- */
    {
      id: "fitness",
      section: "habits",
      type: "single",
      importance: "strong",
      prompt: "What's your relationship with fitness?",
      choices: [
        { id: "lifestyle", label: "It's a lifestyle. I train most days.", score: 1 },
        { id: "active", label: "I stay active and try to eat well.", score: 0.95 },
        { id: "working", label: "Working on it. For real this time.", score: 0.6 },
        { id: "fridge", label: "My cardio is walking to the fridge.", score: 0.2 },
      ],
    },
    {
      id: "alcohol",
      section: "habits",
      type: "single",
      importance: "strong",
      prompt: "What's your relationship with alcohol?",
      choices: [
        { id: "none", label: "I don't drink.", score: 1 },
        { id: "rarely", label: "Rarely. A toast at a wedding.", score: 0.9 },
        { id: "social", label: "Socially. A drink or two on the weekend.", score: 0.5 },
        {
          id: "regular",
          label: "Pretty regularly. Wine with dinner, drinks with friends.",
          score: 0.1,
          flag: true,
        },
        { id: "big_nights", label: "A big night out is kind of my thing.", score: 0, flag: true },
      ],
      why: "You live fully sober. Regular drinking hurts the score a lot, but is not an instant no.",
    },
    {
      id: "money",
      section: "habits",
      type: "single",
      importance: "strong",
      prompt: "Which sounds most like your money philosophy?",
      choices: [
        { id: "build", label: "Build, invest, and play the long game.", score: 1 },
        { id: "experiences", label: "Save smart, spend on experiences.", score: 1 },
        { id: "security", label: "Security first. I like a big safety net.", score: 0.6 },
        { id: "yolo", label: "Money comes and goes. Enjoy it now.", score: 0.3 },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* JUST FOR FUN (mostly)                                            */
    /* ---------------------------------------------------------------- */
    {
      id: "growth",
      section: "you",
      type: "single",
      importance: "strong",
      prompt: "How do you feel about personal growth?",
      choices: [
        { id: "always", label: "I'm always working on the next version of me.", score: 1 },
        { id: "own_pace", label: "I love to learn and grow, at my own pace.", score: 0.9 },
        { id: "content", label: "I'm pretty happy as I am.", score: 0.4 },
        { id: "podcast", label: "If one more person recommends a podcast...", score: 0.2 },
      ],
    },
    {
      id: "curiosity",
      section: "you",
      type: "single",
      importance: "nice",
      prompt: "Something new catches your curiosity. What happens next?",
      choices: [
        { id: "rabbit_hole", label: "A 2am research rabbit hole.", score: 1 },
        { id: "try_it", label: "I sign up and try it myself.", score: 1 },
        { id: "read", label: "I read or watch something about it.", score: 0.85 },
        { id: "pass", label: "It passes. I'm good.", score: 0.3 },
      ],
    },
    {
      id: "social_media",
      section: "you",
      type: "single",
      importance: "nice",
      prompt: "Your social media habits, honestly?",
      choices: [
        { id: "barely", label: "I barely use it.", score: 0.9 },
        { id: "normal", label: "I scroll and post sometimes. Normal human stuff.", score: 1 },
        { id: "creator", label: "I make content too.", score: 1 },
        { id: "online", label: "Chronically online. Send help.", score: 0.4 },
      ],
    },
    {
      id: "on_camera",
      section: "you",
      type: "single",
      importance: "nice",
      prompt: "I make videos for a living. How do you feel about the occasional cameo?",
      choices: [
        { id: "star", label: "Put me in, coach.", score: 1 },
        { id: "approve", label: "Sure, if I approve the angle.", score: 1 },
        { id: "behind", label: "Happier behind the camera.", score: 0.8 },
        { id: "offline", label: "I'd rather stay totally offline.", score: 0.4 },
      ],
    },

    /* ---------------------------------------------------------------- */
    /* THE LAST QUESTION. Everyone ends here (see flow.finalQuestion).  */
    /* ---------------------------------------------------------------- */
    {
      id: "magic",
      section: "you",
      type: "single",
      importance: "nice",
      prompt: "At some point, I will pull a coin from behind your ear. Your reaction?",
      choices: [
        { id: "how", label: "Demand to know how you did it.", score: 1 },
        { id: "every_time", label: "Gasp like it's the first time. Every time.", score: 1 },
        { id: "eye_roll", label: "Roll my eyes. Secretly delighted.", score: 0.9 },
        { id: "ears", label: "Please don't touch my ears.", score: 0.3 },
      ],
    },
  ],

  /**
   * COMBO RULES look at two or more answers together.
   * Every condition in `when` must match for the rule to fire.
   */
  combos: [
    // Example, if you ever want one:
    // {
    //   id: "homebody_parent",
    //   label: "Homebody who wants to settle down with kids",
    //   when: [
    //     { question: "travel", anyOf: ["homebody"] },
    //     { question: "family_travel", anyOf: ["settle"] }
    //   ],
    //   effect: "dealbreaker"
    // }
  ]
};
