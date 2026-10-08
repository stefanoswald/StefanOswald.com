"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Passion, SuitGroup, SuitName } from "@/data/site/types";
import { Suit, isRedSuit } from "@/components/site/Suit";

// Fixed, hand-picked tilts so the server and the browser draw the same "dealt on a table" spread.
const TILTS = [
  [-1.4, 0.8, -0.4, 1.2],
  [0.9, -1.1, 0.5, -0.7],
  [-0.6, 1.3, -1.2, 0.4],
  [1.1, -0.5, 0.9, -1.3]
];

const RANK_NAME: Record<Passion["rank"], string> = { A: "Ace", K: "King", Q: "Queen", J: "Jack" };

/**
 * The passions section. Every card is face up in the HTML, so the content is there without
 * JavaScript and for screen readers. With JavaScript and motion allowed, rows that are still
 * below the fold are quietly turned face down, then dealt face up one by one as each row
 * scrolls into view. That deal is the page's one bit of choreographed motion.
 */
export function PassionDeck({ groups }: { groups: SuitGroup[] }) {
  const rowRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [faceDown, setFaceDown] = useState<boolean[]>(() => groups.map(() => false));
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const rows = rowRefs.current;
    const below = rows.map((row) => Boolean(row && row.getBoundingClientRect().top > window.innerHeight * 0.85));
    if (!below.some(Boolean)) return;

    setFaceDown(below);
    // Turn the transition on only after the face-down state has painted, so nobody sees it happen.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setAnimate(true));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.row);
          setFaceDown((previous) => previous.map((value, i) => (i === index ? false : value)));
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.3 }
    );
    rows.forEach((row, index) => {
      if (row && below[index]) observer.observe(row);
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <ul className="space-y-10 lg:space-y-7">
      {groups.map((group, row) => (
        <li
          key={group.suit}
          ref={(element) => {
            rowRefs.current[row] = element;
          }}
          data-row={row}
          className="lg:grid lg:grid-cols-[8.5rem_1fr] lg:items-center lg:gap-6"
        >
          <h3 className="flex items-center gap-2.5 font-so-display text-[1.6rem] font-medium leading-none text-so-paper lg:flex-col lg:items-start lg:gap-3">
            <Suit
              suit={group.suit}
              className={`h-[1.1rem] w-[1.1rem] ${isRedSuit(group.suit) ? "text-[#d9545e]" : "text-so-paper"}`}
            />
            <span>
              {group.label}
              <span className="sr-only"> ({group.suit})</span>
            </span>
          </h3>

          <ul className="so-deck-row -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 py-3 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0 lg:mt-0 lg:max-w-[50rem] lg:gap-5">
            {group.cards.map((card, column) => (
              <PlayingCard
                key={card.title}
                card={card}
                suit={group.suit}
                down={faceDown[row]}
                animate={animate}
                order={column}
                tilt={TILTS[row % TILTS.length][column % 4]}
              />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function PlayingCard({
  card,
  suit,
  down,
  animate,
  order,
  tilt
}: {
  card: Passion;
  suit: SuitName;
  down: boolean;
  animate: boolean;
  order: number;
  tilt: number;
}) {
  const red = isRedSuit(suit);
  const style = { "--tilt": `${tilt}deg`, "--order": order } as CSSProperties;
  const name = `${RANK_NAME[card.rank]} of ${suit}`;

  const inner = (
    <div className={`so-card ${animate ? "so-card--animate" : ""}`} data-face={down ? "down" : "up"}>
      <div className={`so-card__face ${red ? "text-so-red" : "text-so-card-ink"} ${card.href ? "so-card__face--link" : ""}`}>
        <CardIndex rank={card.rank} suit={suit} />
        <CardIndex rank={card.rank} suit={suit} flipped />
        <div className="flex h-full flex-col items-center justify-center px-[13%] text-center">
          <Suit suit={suit} className="h-[1.35rem] w-[1.35rem] opacity-90" />
          <h4 className="so-card__title mt-2.5 font-so-display text-[1.4rem] font-semibold leading-[1.02] sm:text-[1.25rem] md:text-[1.5rem]">
            {card.title}
          </h4>
          <p className="mt-2 text-[0.76rem] leading-[1.42] text-[#4b453d] md:text-[0.82rem]">{card.line}</p>
        </div>
      </div>
      <div className="so-card__back" aria-hidden="true">
        <span className="so-card__monogram font-so-display">SO</span>
      </div>
    </div>
  );

  return (
    <li className="so-card-slot w-[10.25rem] shrink-0 snap-start sm:w-auto" style={style}>
      {card.href ? (
        <Link href={card.href} className="so-card-lift" aria-label={`${card.title}. ${card.line}`}>
          {inner}
        </Link>
      ) : (
        <div className="so-card-lift" role="group" aria-roledescription="playing card" aria-label={`${card.title}, the ${name}`}>
          {inner}
        </div>
      )}
    </li>
  );
}

function CardIndex({ rank, suit, flipped = false }: { rank: Passion["rank"]; suit: SuitName; flipped?: boolean }) {
  return (
    <div
      className={`absolute flex flex-col items-center leading-none ${
        flipped ? "bottom-[5%] right-[6%] rotate-180" : "left-[6%] top-[5%]"
      }`}
      aria-hidden="true"
    >
      <span className="font-so-display text-[1.3rem] font-semibold">{rank}</span>
      <Suit suit={suit} className="mt-0.5 h-[0.7rem] w-[0.7rem]" />
    </div>
  );
}
