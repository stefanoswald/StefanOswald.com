"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectStatus } from "@/types/acadia";
import { ProjectCard } from "@/components/ProjectCard";

const STATUS_ORDER: ProjectStatus[] = [
  "Proposed",
  "Researching",
  "Quoted",
  "Negotiating",
  "Attorney Review",
  "Approved",
  "In Progress",
  "Complete"
];

/** The list of HOA items with a search box and status filters. */
export function ProjectBrowser({ projects }: { projects: Project[] }) {
  const [status, setStatus] = useState<ProjectStatus | "All">("All");
  const [query, setQuery] = useState("");

  const statusCounts = useMemo(() => {
    const counts = new Map<ProjectStatus, number>();
    for (const project of projects) counts.set(project.status, (counts.get(project.status) || 0) + 1);
    return STATUS_ORDER.filter((item) => counts.has(item)).map((item) => ({ status: item, count: counts.get(item) || 0 }));
  }, [projects]);

  const visible = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);

    return projects.filter((project) => {
      if (status !== "All" && project.status !== status) return false;
      if (!words.length) return true;
      const haystack = `${project.title} ${project.shortDescription} ${project.status}`.toLowerCase();
      return words.every((word) => haystack.includes(word));
    });
  }, [projects, query, status]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter items by status">
          <FilterChip label="All" count={projects.length} active={status === "All"} onClick={() => setStatus("All")} />
          {statusCounts.map((item) => (
            <FilterChip
              key={item.status}
              label={item.status}
              count={item.count}
              active={status === item.status}
              onClick={() => setStatus(item.status)}
            />
          ))}
        </div>
        <div className="relative lg:w-72">
          <label htmlFor="acadia-item-search" className="sr-only">
            Search HOA items
          </label>
          <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="9" cy="9" r="5.5" />
            <path d="M13.5 13.5 17 17" />
          </svg>
          <input
            id="acadia-item-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search items"
            className="w-full rounded-md border border-acadia-moss/30 bg-white py-2.5 pl-9 pr-3 text-base text-acadia-ink outline-none transition placeholder:text-slate-400 focus:border-acadia-leaf focus:ring-2 focus:ring-acadia-leaf/20 sm:text-sm"
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-600" aria-live="polite">
        Showing {visible.length} of {projects.length} items.
      </p>

      {visible.length ? (
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-acadia-moss/40 bg-white px-5 py-8 text-center">
          <p className="font-bold text-acadia-ink">No items match that search.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("All");
            }}
            className="mt-2 text-sm font-bold text-acadia-leaf underline decoration-acadia-moss/50 underline-offset-4 hover:text-acadia-ink"
          >
            Show all items
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold ${
        active
          ? "border-acadia-ink bg-acadia-ink text-white"
          : "border-acadia-moss/30 bg-white text-acadia-ink hover:border-acadia-leaf"
      }`}
    >
      {label}
      <span className={`rounded-full px-1.5 text-xs ${active ? "bg-white/20 text-white" : "bg-acadia-sky text-acadia-ink"}`}>
        {count}
      </span>
    </button>
  );
}
