"use client";

import { ArtworkImage } from "@/components/artwork-image";
import { Plate } from "@/components/plate";
import type { CmsImage } from "@/lib/cms";
import type { PlateSpec } from "@/lib/content";

export type AboutModel = {
  image: CmsImage | null;
  portrait: PlateSpec | null;
  paragraphs: string[];
  email: string;
};

export function AboutView({ about }: { about: AboutModel }) {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center px-4 pb-8">
      <h1 className="sr-only">About</h1>
      {about.image || about.portrait ? (
        <div data-flow="plate" className="size-56 overflow-hidden rounded-full border-2 border-ink sm:size-64">
          {about.image ? (
            <ArtworkImage image={about.image} sizes="256px" priority className="h-full w-full object-contain" />
          ) : about.portrait ? (
            <Plate spec={about.portrait} className="h-full w-full" />
          ) : null}
        </div>
      ) : null}
      <div data-flow="copy" className="mt-10 max-w-prose text-left">
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-4 font-body text-lg leading-relaxed first:mt-0">
            {paragraph}
          </p>
        ))}
        {about.email ? (
          <p className="mt-8 font-body text-lg">
            <a href={`mailto:${about.email}`} className="border-b-2 border-rose">
              {about.email}
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
