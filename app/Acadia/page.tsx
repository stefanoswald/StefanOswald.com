import { acadiaProjects } from "@/data/acadiaProjects";
import { ProjectCard } from "@/components/ProjectCard";
import { AcadiaTransparencyNotice } from "@/components/AcadiaTransparencyNotice";
import { AcadiaCommunityResources } from "@/components/AcadiaCommunityResources";
import { AcadiaGoverningDocuments } from "@/components/AcadiaGoverningDocuments";

export const metadata = {
  title: "Acadia Estates HOA Priorities",
  description:
    "Review current Acadia Estates HOA projects and share informal thumbs up or thumbs down feedback."
};

export default function AcadiaHomePage() {
  return (
    <main className="min-h-screen bg-acadia-cream">
      <section className="bg-acadia-sky">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
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
        </div>
      </section>

      <AcadiaGoverningDocuments />

      <AcadiaTransparencyNotice />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-acadia-ink">Current HOA items</h2>
            <p className="mt-1 text-slate-600">
              {acadiaProjects.length} items are listed. Information reviewed through August 10,
              2026.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {acadiaProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
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
