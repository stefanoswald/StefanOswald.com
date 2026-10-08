// Shared shapes for the main site's content files (data/site/home.ts and data/site/about.ts).

export type SuitName = "spades" | "hearts" | "diamonds" | "clubs";

export type Passion = {
  rank: "A" | "K" | "Q" | "J";
  title: string;
  line: string;
  href?: string;
  external?: boolean;
};

export type SuitGroup = { suit: SuitName; label: string; cards: Passion[] };

export type Project = {
  name: string;
  body: string;
  href?: string;
  linkLabel?: string;
  external?: boolean;
};

export type Photo = { src: string; alt: string; width: number; height: number };
