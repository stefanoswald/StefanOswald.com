import Link from "next/link";
import { acadiaProjects } from "@/data/acadiaProjects";
import { acadiaGoverningDocuments } from "@/data/acadiaGoverningDocuments";
import { ProjectBrowser } from "@/components/acadia/ProjectBrowser";
import { AcadiaTransparencyNotice } from "@/components/AcadiaTransparencyNotice";
import { AcadiaCommunityResources } from "@/components/AcadiaCommunityResources";
import { AcadiaGoverningDocuments } from "@/components/AcadiaGoverningDocuments";

export const metadata = {
  title: "Acadia Estates HOA Priorities",
  description:
    "Review current Acadia Estates HOA projects and share informal thumbs up or thumbs down feedback."
};

const quickLinks = [
  {
    href: "#current-items",
    title: "Current HOA items",
    text: `${acadiaProjects.length} items. See where each one stands and share your vote.`
  },
  {
    href: "/Acadia/savings",
    title: "Savings plan",
    text: "Three proposals to lower what the HOA pays for management, legal, and tax work.",
    badge: "New"
  },
  {
    href: "/Acadia/portal",
    title: "Owner portal preview",
    text: "Try online payments, autopay, and requests with sample data.",
    badge: "Preview"
  },
  {
    href: "#governing-documents",
    title: "Governing documents",
    text: `Download all ${acadiaGoverningDocuments.length} recorded documents, or ask the helper a question.`
  }
];

export default function AcadiaHomePage() {
  return (
    <main className="min-h-screen bg-acadia-cream">
      <section className="bg-acadia-sky">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-acadia-leaf">
              Acadia Estates HOA
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-acadia-ink sm:text-6xl">
              Community priorities
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              Follow current neighborhood projects, see what is verified and what is still being
              checked, and share a thumbs up or thumbs down so the HOA board can better understand
              homeowner priorities.
            </p>
            <p className="mt-4 rounded-lg border border-acadia-moss/25 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-acadia-ink">
              Votes are used as informal community feedback to help the HOA board understand
              homeowner priorities.
            </p>
          </div>

          <nav aria-label="Popular sections" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col rounded-lg border border-acadia-moss/25 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-acadia-leaf focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-base font-bold text-acadia-ink">{link.title}</span>
                  {link.badge ? (
                    <span className="rounded bg-acadia-gold/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                      {link.badge}
                    </span>
                  ) : null}
                </span>
                <span className="mt-1.5 text-sm leading-6 text-slate-600">{link.text}</span>
                <span className="mt-3 text-sm font-bold text-acadia-leaf group-hover:text-acadia-ink">Open</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <AcadiaGoverningDocuments />

      <AcadiaTransparencyNotice />

      <section id="current-items" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-acadia-ink">Current HOA items</h2>
          <p className="mt-1 text-slate-600">
            {acadiaProjects.length} items are listed. Each card shows the date its information was
            last reviewed.
          </p>
        </div>

        <ProjectBrowser projects={acadiaProjects} />
      </section>

      <AcadiaCommunityResources />

      <section className="border-t border-acadia-moss/20 bg-acadia-ink text-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-bold">Stay connected</h2>
            <p className="mt-2 max-w-3xl leading-7 text-white/75">
              Join the homeowner Facebook group for day-to-day conversation. Project facts and
              official status remain here so community discussion is not mistaken for a board
              decision.
            </p>
          </div>
          <a
            href="https://www.facebook.com/groups/862140876886038/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-5 py-3 font-bold text-acadia-ink transition hover:bg-acadia-sky"
          >
            Open homeowner group
          </a>
        </div>
      </section>
    </main>
  );
}
