import { notFound } from "next/navigation";
import { acadiaProjects, getAcadiaProject } from "@/data/acadiaProjects";
import { ProjectDetailPage } from "@/components/ProjectDetailPage";

type PageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export function generateStaticParams() {
  return acadiaProjects.map((project) => ({
    projectId: project.id
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { projectId } = await params;
  const project = getAcadiaProject(projectId);

  if (!project) {
    return {
      title: "Project not found | Acadia Estates"
    };
  }

  return {
    title: `${project.title} | Acadia Estates HOA Priorities`,
    description: project.shortDescription
  };
}

export default async function AcadiaProjectPage({ params }: PageProps) {
  const { projectId } = await params;
  const project = getAcadiaProject(projectId);

  if (!project) {
    notFound();
  }

  return <ProjectDetailPage project={project} />;
}
