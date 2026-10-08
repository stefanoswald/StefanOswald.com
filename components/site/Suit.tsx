import type { SuitName } from "@/data/site/home";

// Drawn as SVG instead of the ♠♥♦♣ characters, which iPhones like to turn into emoji.
const PATHS: Record<SuitName, string> = {
  hearts:
    "M50 90C47 86 40 80 31 72 15 58 5 46 5 31 5 17 15 7 28 7c9 0 17 5 22 13C55 12 63 7 72 7c13 0 23 10 23 24 0 15-10 27-26 41-9 8-16 14-19 18Z",
  diamonds: "M50 4c8 14 22 32 36 46-14 14-28 32-36 46-8-14-22-32-36-46C28 36 42 18 50 4Z",
  spades:
    "M50 5c5 10 16 21 28 32 10 9 17 17 17 28 0 12-9 21-21 21-8 0-14-4-18-10 1 9 5 15 12 19H32c7-4 11-10 12-19-4 6-10 10-18 10C14 86 5 77 5 65c0-11 7-19 17-28C34 26 45 15 50 5Z",
  clubs:
    "M50 6c11 0 19 9 19 19 0 5-2 10-5 13 3-2 7-3 11-3 11 0 19 9 19 19s-8 19-19 19c-8 0-15-5-18-12 1 12 6 22 13 30H30c7-8 12-18 13-30-3 7-10 12-18 12-11 0-19-8-19-19s8-19 19-19c4 0 8 1 11 3-3-3-5-8-5-13 0-10 8-19 19-19Z"
};

export const SUIT_LABEL: Record<SuitName, string> = {
  spades: "spades",
  hearts: "hearts",
  diamonds: "diamonds",
  clubs: "clubs"
};

export function isRedSuit(suit: SuitName) {
  return suit === "hearts" || suit === "diamonds";
}

export function Suit({
  suit,
  className,
  title
}: {
  suit: SuitName;
  className?: string;
  /** Give a title when the suit carries meaning on its own. Leave it out when nearby text already says it. */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={PATHS[suit]} />
    </svg>
  );
}
