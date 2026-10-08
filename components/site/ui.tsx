import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalMark, NewTabNote } from "@/components/site/ExternalMark";
import { discoveryCall } from "@/data/site/home";

/** Keeps a hyphenated word like "30-minute" on one line, so a line never breaks right after the hyphen. */
export function keepHyphenatedWordsWhole(text: string): ReactNode {
  const parts = text.split(/(\S*\w-\w\S*)/);
  if (parts.length === 1) return text;
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    )
  );
}

/** The big serif section heading used across the main site. */
export function SectionHeading({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <h2
      id={id}
      className={`so-balance font-so-display text-[clamp(2.5rem,5.6vw,4.1rem)] font-medium leading-[1.02] tracking-[-0.01em] text-so-paper ${className}`}
    >
      {typeof children === "string" ? keepHyphenatedWordsWhole(children) : children}
    </h2>
  );
}

/** Small italic gold label above a heading. Use it only where it names the section's subject. */
export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-so-display text-[1.35rem] italic text-so-gold ${className}`}>{children}</p>;
}

const GOLD_BUTTON =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-[3px] bg-so-gold px-5 py-3 text-[0.95rem] font-semibold text-so-ink transition-colors so-hover:bg-so-gold-2";

/** The discovery call button. Where it goes (email now, a booking page later) lives in data/site/home.ts. */
export function CallButton({ className = "", short = false }: { className?: string; short?: boolean }) {
  const label = short ? discoveryCall.shortLabel : discoveryCall.label;
  if (discoveryCall.external) {
    return (
      <a href={discoveryCall.href} target="_blank" rel="noopener noreferrer" className={`${GOLD_BUTTON} ${className}`}>
        {label}
        <NewTabNote />
      </a>
    );
  }
  return (
    <a href={discoveryCall.href} className={`${GOLD_BUTTON} ${className}`}>
      {label}
    </a>
  );
}

/** A gold text link to another page, with a small arrow when it leaves the site. */
export function TextLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const className =
    "mt-3 inline-flex items-center gap-1.5 text-[0.92rem] font-medium text-so-gold underline decoration-so-gold/40 underline-offset-4 transition-colors so-hover:text-so-gold-2";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
        <ExternalMark />
        <NewTabNote />
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
