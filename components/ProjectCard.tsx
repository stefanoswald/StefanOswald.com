import Link from "next/link";
import type { Project } from "@/types/acadia";
import { StatusBadge } from "@/components/StatusBadge";
import { VoteButtons } from "@/components/VoteButtons";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col justify-between rounded-lg border border-acadia-moss/20 bg-white p-5 shadow-soft">
      <div>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-xl font-bold text-acadia-ink">{project.title}</h2>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-base leading-7 text-slate-700">{project.shortDescription}</p>
      </div>

      <div className="mt-5 space-y-4">
        <VoteButtons projectId={project.id} projectTitle={project.title} compact />
        <Link
          href={`/Acadia/projects/${project.id}`}
          className="block rounded-md border border-acadia-leaf px-4 py-3 text-center font-bold text-acadia-leaf transition hover:bg-acadia-leaf hover:text-white"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
