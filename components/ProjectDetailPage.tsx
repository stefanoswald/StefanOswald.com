import Link from "next/link";
import type { Project } from "@/types/acadia";
import { StatusBadge } from "@/components/StatusBadge";
import { VoteButtons } from "@/components/VoteButtons";

export function ProjectDetailPage({ project }: { project: Project }) {
  return (
    <main className="min-h-screen bg-acadia-cream">
      <section className="border-b border-acadia-moss/20 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/Acadia"
            className="mb-6 inline-flex rounded-md text-sm font-bold text-acadia-leaf hover:text-acadia-ink"
          >
            Back to all priorities
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-acadia-ink sm:text-5xl">
                {project.title}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
                {project.fullDescription}
              </p>
              <p className="mt-4 text-sm font-semibold text-slate-500">
                Information reviewed {project.lastReviewed || "August 10, 2026"}
              </p>
            </div>
            <StatusBadge status={project.status} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="space-y-6">
          <DetailPanel title="Estimated cost">{project.estimatedCost}</DetailPanel>
          <DetailPanel title="Estimated timeline">{project.estimatedTimeline}</DetailPanel>
          <DetailPanel title="Current board notes">{project.boardNotes}</DetailPanel>
          <DetailPanel title="Vendor / quote notes">
            {project.vendorQuoteNotes || "No vendor or quote notes are available yet."}
          </DetailPanel>
          {project.openQuestions?.length ? (
            <section className="rounded-lg border border-amber-300 bg-amber-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">
                Pending confirmation
              </p>
              <h2 className="mt-2 text-xl font-bold text-acadia-ink">What still needs an answer</h2>
              <ul className="mt-4 space-y-3 text-base leading-7 text-slate-700">
                {project.openQuestions.map((question) => (
                  <li key={question} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 bg-amber-500" />
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {project.sourceNotes?.length ? (
            <section className="rounded-lg border border-acadia-moss/20 bg-white p-5">
              <h2 className="text-xl font-bold text-acadia-ink">Evidence and source status</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                These labels distinguish confirmed records from estimates, pending questions, and
                older material retained for context.
              </p>
              <div className="mt-4 divide-y divide-acadia-moss/15 border-y border-acadia-moss/15">
                {project.sourceNotes.map((source) => (
                  <div key={`${source.title}-${source.date}`} className="py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-acadia-ink">
                          {source.href ? (
                            <a
                              href={source.href}
                              target="_blank"
                              rel="noreferrer"
                              className="underline decoration-acadia-moss/50 underline-offset-4 hover:text-acadia-leaf"
                            >
                              {source.title}
                            </a>
                          ) : (
                            source.title
                          )}
                        </h3>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {source.sourceType} · {source.date}
                        </p>
                      </div>
                      <SourceStatusBadge status={source.status} />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{source.summary}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          {project.communityFeedback?.length ? (
            <section className="rounded-lg border border-acadia-moss/20 bg-acadia-sky p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-acadia-leaf">
                Community voice
              </p>
              <h2 className="mt-2 text-xl font-bold text-acadia-ink">What neighbors are raising</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Direct excerpts keep the original wording. Names, house numbers, and private
                contact details are withheld; summaries are explicitly labeled. Community feedback
                is not an HOA decision or a verified vendor claim.
              </p>
              <div className="mt-4 space-y-3">
                {project.communityFeedback.map((feedback) => (
                  <blockquote
                    key={`${feedback.text}-${feedback.date}`}
                    className="border-l-4 border-acadia-moss px-4 py-2 text-sm leading-6 text-slate-700"
                  >
                    <p>{feedback.text}</p>
                    <footer className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {feedback.format} · {feedback.source} · {feedback.date}
                    </footer>
                    {feedback.redactionNote ? (
                      <p className="mt-2 text-xs italic leading-5 text-slate-500">
                        {feedback.redactionNote}
                      </p>
                    ) : null}
                  </blockquote>
                ))}
              </div>
            </section>
          ) : null}
          <section className="rounded-lg border border-dashed border-acadia-moss/40 bg-white p-5">
            <h2 className="text-xl font-bold text-acadia-ink">Related documents</h2>
            {project.relatedDocuments?.length ? (
              <div className="mt-4 space-y-3">
                {project.relatedDocuments.map((document) => (
                  <a
                    key={document.href}
                    href={document.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-4 rounded-md border border-acadia-moss/20 bg-acadia-sky px-4 py-3 text-acadia-ink transition hover:border-acadia-leaf hover:bg-white"
                  >
                    <span>
                      <span className="block text-sm font-bold">{document.title}</span>
                      <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {document.fileType}
                        {document.statusLabel ? ` · ${document.statusLabel}` : ""}
                      </span>
                      {document.note ? (
                        <span className="mt-1 block text-xs leading-5 text-slate-600">
                          {document.note}
                        </span>
                      ) : null}
                    </span>
                    <span className="shrink-0 text-sm font-bold text-acadia-leaf">Open</span>
                  </a>
                ))}
              </div>
            ) : (
              <>
                <p className="mt-3 text-slate-700">
                  No source attachment has been received for this item yet. When one is available,
                  it will be published with only the privacy redactions genuinely required.
                </p>
                <div className="mt-4 rounded-md bg-acadia-sky px-4 py-3 text-sm font-medium text-acadia-ink">
                  No public attachment is available for this item yet.
                </div>
              </>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-lg border border-acadia-moss/20 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold text-acadia-ink">Community feedback</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Votes are used as informal community feedback to help the HOA board understand
            homeowner priorities. Totals are shared publicly; house numbers are stored privately
            only to prevent duplicate votes.
          </p>
          <div className="mt-5">
            <VoteButtons projectId={project.id} projectTitle={project.title} />
          </div>
        </aside>
      </section>
    </main>
  );
}

function SourceStatusBadge({ status }: { status: NonNullable<Project["sourceNotes"]>[number]["status"] }) {
  const styles = {
    Verified: "bg-emerald-100 text-emerald-800",
    Estimate: "bg-amber-100 text-amber-800",
    Pending: "bg-slate-100 text-slate-700",
    Historical: "bg-zinc-100 text-zinc-700"
  }[status];

  return (
    <span className={`inline-flex rounded-md px-3 py-1 text-xs font-bold ${styles}`}>
      {status}
    </span>
  );
}

function DetailPanel({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-acadia-moss/20 bg-white p-5">
      <h2 className="text-xl font-bold text-acadia-ink">{title}</h2>
      <p className="mt-3 text-base leading-7 text-slate-700">{children}</p>
    </section>
  );
}
