"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string; exact?: boolean };

const ownerLinks: NavLink[] = [
  { href: "/Acadia/portal/home", label: "My home", exact: true },
  { href: "/Acadia/portal/home/ledger", label: "Ledger" },
  { href: "/Acadia/portal/home/requests", label: "Requests" }
];

const boardLinks: NavLink[] = [
  { href: "/Acadia/portal/board", label: "All homes", exact: true },
  { href: "/Acadia/portal/board/billing", label: "Billing" },
  { href: "/Acadia/portal/board/requests", label: "Requests" },
  { href: "/Acadia/portal/board/settings", label: "Settings" },
  { href: "/Acadia/portal/board/log", label: "Change log" }
];

function isActive(link: NavLink, pathname: string) {
  if (pathname === link.href) return true;
  // A single home's page belongs to the "All homes" tab.
  if (link.href === "/Acadia/portal/board") return pathname.startsWith("/Acadia/portal/board/homes");
  return !link.exact && pathname.startsWith(`${link.href}/`);
}

function NavGroup({ title, links, pathname }: { title: string; links: NavLink[]; pathname: string }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.14em] text-acadia-gold">{title}</span>
      {links.map((link) => {
        const active = isActive(link, pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3 py-1.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold ${
              active ? "bg-white text-acadia-ink" : "text-white/90 hover:bg-white/15 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

export function PortalNav({ hasHome, isBoard }: { hasHome: boolean; isBoard: boolean }) {
  const pathname = usePathname() || "";

  return (
    <nav aria-label="Owner portal sections" className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-6">
      {hasHome ? <NavGroup title="Owner" links={ownerLinks} pathname={pathname} /> : null}
      {isBoard ? <NavGroup title="Board" links={boardLinks} pathname={pathname} /> : null}
    </nav>
  );
}
