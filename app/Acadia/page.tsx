import { acadiaProjects } from "@/data/acadiaProjects";
import { ProjectCard } from "@/components/ProjectCard";

export const metadata = {
  title: "Acadia Estates HOA Priorities",
  description:
    "Review current Acadia Estates HOA projects and share informal thumbs up or thumbs down feedback."
};

export default function AcadiaHomePage() {
  return (
    <main className="min-h-screen bg-acadia-cream">
      <section className="bg-gradient-to-b from-acadia-sky to-acadia-cream">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-acadia-leaf">
              Acadia Estates HOA
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-acadia-ink sm:text-6xl">
              Community priorities
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              Review current neighborhood projects and share a thumbs up or thumbs down
              so the HOA board can better understand homeowner priorities.
            </p>
            <p className="mt-4 rounded-lg border border-acadia-moss/25 bg-white/80 px-4 py-3 text-sm font-medium leading-6 text-acadia-ink">
              Votes are used as informal community feedback to help the HOA board understand
              homeowner priorities.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-acadia-ink">Current HOA items</h2>
            <p className="mt-1 text-slate-600">{acadiaProjects.length} items are listed.</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {acadiaProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
