"use client";

import Link from "next/link";
import { ArtworkImage } from "@/components/artwork-image";
import { Plate } from "@/components/plate";
import type { CmsImage } from "@/lib/cms";
import type { PlateSpec } from "@/lib/content";

export type ProjectCard = {
  slug: string;
  title: string;
  logline: string;
  image: CmsImage | null;
  frame: PlateSpec | null;
};

export function ProjectsView({ projects }: { projects: ProjectCard[] }) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-8">
      <h1 className="sr-only">Projects</h1>
      {projects.length === 0 ? <p className="font-body text-xl leading-relaxed">New work soon.</p> : null}
      <ul className="flex flex-col gap-20">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`} className="group block">
              <h2
                data-flow="copy"
                className="pb-1 font-display text-4xl leading-[1.1] transition-colors duration-500 group-hover:text-rose md:text-5xl"
              >
                {project.title}
              </h2>
              <p data-flow="copy" className="mt-2 border-b-2 border-rose pb-2 font-body text-base leading-relaxed italic sm:text-lg">
                {project.logline}
              </p>
              {project.image || project.frame ? (
                <div data-flow="plate" className="mt-6 overflow-hidden border-2 border-ink transition-colors duration-500 group-hover:border-rose">
                  {project.image ? (
                    <ArtworkImage
                      image={project.image}
                      sizes="(min-width: 48rem) 48rem, 100vw"
                      controls={false}
                      className="w-full origin-center transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  ) : project.frame ? (
                    <Plate
                      spec={project.frame}
                      className="aspect-[16/10] w-full origin-center transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  ) : null}
                </div>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
