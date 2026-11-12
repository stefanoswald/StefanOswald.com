"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ACADIA_OPEN_CHAT_EVENT } from "@/components/AcadiaChatbot";

const links = [
  { href: "/Acadia", label: "Priorities", match: (path: string) => path === "/Acadia" || path.startsWith("/Acadia/projects") },
  { href: "/Acadia/savings", label: "Savings plan", match: (path: string) => path.startsWith("/Acadia/savings") },
  { href: "/Acadia/portal", label: "Owner portal", badge: "Preview", match: (path: string) => path.startsWith("/Acadia/portal") },
  { href: "/Acadia/documents", label: "Documents", match: (path: string) => path.startsWith("/Acadia/documents") }
];

export function AcadiaHeader() {
  const pathname = usePathname() || "";
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the phone menu after moving to another page.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function openChat() {
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent(ACADIA_OPEN_CHAT_EVENT));
  }

  return (
    <header className="sticky top-0 z-40 border-b border-acadia-moss/20 bg-white/95 backdrop-blur print:hidden">
      <a
        href="#acadia-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-acadia-ink focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/Acadia" className="flex items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold">
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-lg bg-acadia-ink">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-acadia-gold" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 11.5 12 4l9 7.5" />
              <path d="M5.5 10v9.5h13V10" />
              <path d="M10 19.5v-5h4v5" />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold text-acadia-ink">Acadia Estates</span>
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-acadia-leaf">Homeowners Association</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Acadia Estates sections">
          {links.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold ${
                  active ? "bg-acadia-sky text-acadia-ink" : "text-slate-700 hover:bg-acadia-sky/60 hover:text-acadia-ink"
                }`}
              >
                {link.label}
                {link.badge ? (
                  <span className="rounded bg-acadia-gold/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                    {link.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={openChat}
            className="ml-2 rounded-md bg-acadia-leaf px-4 py-2 text-sm font-bold text-white transition hover:bg-acadia-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold focus-visible:ring-offset-2"
          >
            Ask a question
          </button>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-acadia-moss/30 text-acadia-ink md:hidden"
          aria-expanded={menuOpen}
          aria-controls="acadia-mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {menuOpen ? (
        <nav id="acadia-mobile-menu" className="border-t border-acadia-moss/20 bg-white px-4 pb-4 pt-2 md:hidden" aria-label="Acadia Estates sections">
          <ul className="space-y-1">
            {links.map((link) => {
              const active = link.match(pathname);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between rounded-md px-3 py-3 text-base font-bold ${
                      active ? "bg-acadia-sky text-acadia-ink" : "text-slate-700"
                    }`}
                  >
                    {link.label}
                    {link.badge ? (
                      <span className="rounded bg-acadia-gold/25 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-900">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={openChat}
            className="mt-3 w-full rounded-md bg-acadia-leaf px-4 py-3 text-base font-bold text-white"
          >
            Ask a question
          </button>
        </nav>
      ) : null}
    </header>
  );
}
