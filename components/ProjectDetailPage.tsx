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
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-bold text-acadia-leaf">Open</span>
                  </a>
                ))}
              </div>
            ) : (
              <>
                <p className="mt-3 text-slate-700">
                  Public documents, quotes, meeting packets, or board reference files can be added
                  here later.
                </p>
                <div className="mt-4 rounded-md bg-acadia-sky px-4 py-3 text-sm font-medium text-acadia-ink">
                  No public documents are attached yet.
                </div>
              </>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-lg border border-acadia-moss/20 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold text-acadia-ink">Community feedback</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Votes are used as informal community feedback to help the HOA board understand
            homeowner priorities.
          </p>
          <div className="mt-5">
            <VoteButtons projectId={project.id} projectTitle={project.title} />
          </div>
        </aside>
      </section>
    </main>
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
