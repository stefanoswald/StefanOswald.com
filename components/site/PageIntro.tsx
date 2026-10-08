import type { ReactNode } from "react";

/** The top of every inner page: a small italic label, a big title, and a short intro. */
export function PageIntro({ kicker, title, children }: { kicker?: string; title: string; children?: ReactNode }) {
  return (
    <header className="mx-auto max-w-6xl px-4 pb-10 pt-32 sm:px-6 lg:pb-14 lg:pt-40">
      {kicker ? <p className="font-so-display text-[1.35rem] italic text-so-gold">{kicker}</p> : null}
      <h1 className="so-balance mt-3 max-w-[18ch] font-so-display text-[clamp(3rem,8.5vw,5.8rem)] font-medium leading-[0.95] tracking-[-0.015em] text-so-paper">
        {title}
      </h1>
      {children ? (
        <div className="so-pretty mt-7 max-w-2xl space-y-4 text-[1.1rem] leading-[1.8] text-so-mute">{children}</div>
      ) : null}
    </header>
  );
}
