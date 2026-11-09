"use client";

import Link from "next/link";
import { ArtworkImage } from "@/components/artwork-image";
import { Reel } from "@/components/reel";
import { Zoomable } from "@/components/zoomable";
import type { Shot } from "@/lib/shots";

export type ProjectModel = {
  title: string;
  logline: string;
  shots: Shot[];
  sections: { title: string; shots: Shot[] }[];
  cover: Shot | null;
};

export function ProjectView({ project }: { project: ProjectModel }) {
  return (
    <article className="mx-auto w-full max-w-4xl px-4 pb-8">
      <Link
        href="/projects"
        className="inline-flex min-h-11 items-center font-body text-lg leading-none text-ink underline decoration-2 underline-offset-8 transition-colors duration-300 hover:text-rose"
      >
        Back
      </Link>
      <h1 data-flow="copy" className="mt-6 pb-1 font-display text-5xl leading-[1.1] md:text-6xl">
        {project.title}
      </h1>
      <p data-flow="copy" className="mt-3 border-b-2 border-rose pb-2 font-body text-base leading-relaxed italic sm:text-lg">
        {project.logline}
      </p>
      {project.cover?.kind === "image" ? (
        <div data-flow="plate" className="mt-8 overflow-hidden border-2 border-ink">
          <ArtworkImage image={project.cover.image} sizes="(min-width: 56rem) 56rem, 100vw" priority className="w-full" />
        </div>
      ) : null}
      {project.shots.length > 0 ? (
        <div data-flow="plate" className="mt-8">
          <Reel frames={project.shots} priority />
        </div>
      ) : null}
      {project.shots.length > 1 ? (
        <div className="mt-16 flex flex-col gap-16">
          {project.shots.slice(1).map((shot) => (
            <figure key={`${shot.caption}-${shot.kind === "image" ? shot.image.id : shot.spec.motif}`} data-flow="plate">
              <Zoomable
                shot={shot}
                label={`Zoom in. ${shot.caption}`}
                className="block w-full cursor-pointer border-2 border-ink text-left hover:border-rose"
                plateClassName="aspect-[16/10] w-full"
              />
              {shot.caption ? (
                <figcaption className="mt-3 font-body text-base leading-relaxed text-ink sm:text-lg">{shot.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}
      {project.sections.map((section) => (
        <section key={section.title} className="mt-16">
          <h2 data-flow="copy" className="pb-1 font-display text-4xl leading-[1.1]">
            {section.title}
          </h2>
          <div className="mt-8 flex flex-col gap-16">
            {section.shots.map((shot) => (
              <figure key={`${section.title}-${shot.caption}-${shot.kind === "image" ? shot.image.id : shot.spec.motif}`} data-flow="plate">
                <Zoomable
                  shot={shot}
                  label={`Zoom in. ${shot.caption || section.title}`}
                  className="block w-full cursor-pointer border-2 border-ink text-left hover:border-rose"
                  plateClassName="aspect-[16/10] w-full"
                />
                {shot.caption ? (
                  <figcaption className="mt-3 font-body text-base leading-relaxed text-ink sm:text-lg">{shot.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
