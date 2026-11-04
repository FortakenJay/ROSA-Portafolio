import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectView, type ProjectModel } from "@/components/project-view";
import { Remember } from "@/components/remember";
import { devStandIns, getProject, getProjects } from "@/lib/cms";
import { projects } from "@/lib/content";
import { keyForPath } from "@/lib/page-cache";
import type { Shot } from "@/lib/shots";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const published = await getProjects();
  if (published.length === 0) return [{ slug: "draft" }];
  return published.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  const standIn = !project && devStandIns() ? projects.find((item) => item.slug === slug) : undefined;
  const image = project?.images[0]?.image;
  const src = image ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${image.variants.lightbox}` : undefined;
  return {
    title: project?.title ?? standIn?.title ?? "Project",
    openGraph: src ? { images: [{ url: src, alt: image?.alt }] } : undefined,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const fromDatabase = await getProject(slug);
  const standIn = !fromDatabase && devStandIns() ? projects.find((item) => item.slug === slug) : undefined;
  if (!fromDatabase && !standIn) notFound();
  const project: ProjectModel = {
    title: fromDatabase?.title ?? standIn?.title ?? "",
    logline: fromDatabase?.subheading ?? standIn?.logline ?? "",
    shots: fromDatabase
      ? fromDatabase.images.map((item) => ({ kind: "image", image: item.image, caption: item.caption }))
      : (standIn?.frames ?? []).map((frame): Shot => ({ kind: "plate", spec: frame, caption: frame.caption })),
    sections: (fromDatabase?.sections ?? []).map((section) => ({
      title: section.title,
      shots: section.images.map((item) => ({ kind: "image" as const, image: item.image, caption: item.caption })),
    })),
  };

  return (
    <>
      <Remember queryKey={keyForPath(`/projects/${slug}`) ?? ["rosa", "project", slug]} data={project} />
      <ProjectView project={project} />
    </>
  );
}
