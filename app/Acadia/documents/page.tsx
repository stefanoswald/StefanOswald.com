import Link from "next/link";
import { acadiaPublicDocuments } from "@/data/acadiaPublicDocuments";

export const metadata = {
  title: "Acadia Estates Source Documents and Redactions",
  description:
    "Review Acadia Estates project documents, estimates, professional opinions, and the limited privacy redactions applied to each public copy."
};

export default function AcadiaDocumentsPage() {
  return (
    <main className="min-h-screen bg-acadia-cream">
      <section className="border-b border-acadia-moss/20 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/Acadia"
            className="inline-flex text-sm font-bold text-acadia-leaf hover:text-acadia-ink"
          >
            Back to community priorities
          </Link>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">
            Transparency library
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-acadia-ink sm:text-5xl">
            Source documents and redactions
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
            Project records are published with their original substance intact. Redactions are
            limited to private identities, house numbers, access credentials, direct contact
            details, payment information, and document metadata.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="divide-y divide-acadia-moss/20 border-y border-acadia-moss/20 bg-white">
          {acadiaPublicDocuments.map((document) => (
            <article key={document.href} className="grid gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-acadia-ink">{document.title}</h2>
                  <span className="rounded-md bg-acadia-sky px-2 py-1 text-xs font-bold text-acadia-leaf">
                    {document.fileType}
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-slate-600">{document.statusLabel}</p>
                <p className="mt-3 text-sm leading-6 text-slate-700">{document.note}</p>
                <div className="mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Redaction log
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
                    {document.redactions.map((redaction) => (
                      <li key={redaction}>- {redaction}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <a
                href={document.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center self-start rounded-md bg-acadia-leaf px-4 py-2 font-bold text-white transition hover:bg-acadia-ink"
              >
                Open document
              </a>
            </article>
          ))}
        </div>

        <aside className="mt-6 border-l-4 border-amber-500 bg-amber-50 px-5 py-4 text-sm leading-6 text-slate-700">
          Labels such as <strong>agenda</strong>, <strong>estimate</strong>, and <strong>historical</strong>
          identify what a source proves. Publication does not turn a proposal into an adopted board
          decision or an expired quote into a current price.
        </aside>
      </section>
    </main>
  );
}
