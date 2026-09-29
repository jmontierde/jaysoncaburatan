import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectStudy } from "@/components/work/project-study";
import { adjacentProjects, getProject, projects } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { previous, next } = adjacentProjects(slug);
  return <ProjectStudy project={project} previous={previous} next={next} />;
}
