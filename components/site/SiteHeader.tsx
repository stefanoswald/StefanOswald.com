"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

const NAV = [
  { href: "/#ai", label: "AI consulting" },
  { href: "/#entertainment", label: "Entertainment" },
  { href: "/#projects", label: "Projects" },
  { href: "/#more", label: "Passions" },
  { href: "/#about", label: "About" }
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the phone menu with Escape, and keep the page from scrolling behind it.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-so-line bg-so-ink/90 backdrop-blur-md" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-[72px]">
        <Link
          href="/"
          className="font-so-display text-[1.3rem] font-semibold uppercase tracking-[0.14em] text-so-paper"
          onClick={() => setOpen(false)}
        >
          Stefan Oswald
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.92rem] text-so-paper/80">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors so-hover:text-so-gold-2">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#contact"
            className="hidden rounded-[3px] bg-so-gold px-4 py-2 text-[0.88rem] font-semibold text-so-ink transition-colors so-hover:bg-so-gold-2 sm:inline-block"
          >
            Let’s talk
          </Link>
          <button
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-so-paper lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 8h16M4 16h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-so-line bg-so-ink px-4 pb-10 pt-6 sm:px-6 lg:hidden"
      >
        <nav aria-label="Main">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-3 font-so-display text-[2rem] leading-tight text-so-paper"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/#contact"
          className="mt-8 inline-block rounded-[3px] bg-so-gold px-5 py-3 font-semibold text-so-ink"
          onClick={() => setOpen(false)}
        >
          Let’s talk
        </Link>
      </div>
    </header>
  );
}
