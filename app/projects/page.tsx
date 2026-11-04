import type { Metadata } from "next";
import { ProjectsView, type ProjectCard } from "@/components/projects-view";
import { Remember } from "@/components/remember";
import { devStandIns, getProjects } from "@/lib/cms";
import { projects } from "@/lib/content";
import { keyForPath } from "@/lib/page-cache";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const fromDatabase = await getProjects();
  const standIn = fromDatabase.length === 0 && devStandIns();
  const list: ProjectCard[] = standIn
    ? projects.map((project) => ({
        slug: project.slug,
        title: project.title,
        logline: project.logline,
        image: null,
        frame: { motif: project.frames[0].motif, palette: project.frames[0].palette, flip: project.frames[0].flip },
      }))
    : fromDatabase.map((project) => ({
        slug: project.slug,
        title: project.title,
        logline: project.subheading,
        image: project.cover ?? project.images[0]?.image ?? null,
        frame: null,
      }));

  return (
    <>
      <Remember queryKey={keyForPath("/projects") ?? ["rosa", "projects"]} data={list} />
      <ProjectsView projects={list} />
    </>
  );
}
