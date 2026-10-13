import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Zoomable } from "@/components/zoomable";
import { Reel } from "@/components/reel";
import { projects } from "@/lib/content";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return { title: project?.title ?? "Project" };
}

export const instant = false;

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <article className="mx-auto w-full max-w-4xl px-4 pb-8">
      <Link
        href="/projects"
        className="inline-block rounded-full border-2 border-primary-300 bg-primary-200 px-3 py-1.5 font-body text-base leading-none text-ink hover:bg-primary-300 sm:px-5 sm:text-lg"
      >
        Back
      </Link>
      <h1 data-flow="copy" className="mt-6 pb-1 font-display text-5xl leading-[1.1] md:text-6xl">
        {project.title}
      </h1>
      <p
        data-flow="copy"
        className="mt-3 max-w-md border-b-2 border-rose pb-2 font-body text-xl leading-relaxed italic"
      >
        {project.logline}
      </p>
      <div data-flow="plate" className="mt-8">
        <Reel frames={project.frames} />
      </div>
      <div className="mt-16 flex flex-col gap-16">
        {project.frames.slice(1).map((frame) => (
          <figure key={frame.caption} data-flow="plate">
            <Zoomable
              spec={frame}
              label={`Zoom in. ${frame.caption}`}
              caption={frame.caption}
              className="block w-full cursor-pointer border-2 border-ink text-left hover:border-rose"
              plateClassName="aspect-[16/10] w-full"
            />
            <figcaption className="mt-3 max-w-prose font-body text-lg leading-relaxed text-plum">
              {frame.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </article>
  );
}
