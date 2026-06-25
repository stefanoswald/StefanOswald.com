import type { ProjectStatus } from "@/types/acadia";

const statusStyles: Record<ProjectStatus, string> = {
  Proposed: "bg-slate-100 text-slate-700 ring-slate-200",
  Researching: "bg-acadia-sky text-acadia-ink ring-acadia-moss/25",
  Quoted: "bg-amber-100 text-amber-800 ring-amber-200",
  "Attorney Review": "bg-purple-100 text-purple-800 ring-purple-200",
  Approved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  "In Progress": "bg-blue-100 text-blue-800 ring-blue-200",
  Complete: "bg-zinc-100 text-zinc-700 ring-zinc-200"
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
