"use client";

import Link from "next/link";
import { ArtworkImage } from "@/components/artwork-image";
import { Plate } from "@/components/plate";
import type { CmsImage } from "@/lib/cms";
import type { PlateSpec } from "@/lib/content";

export type HomeModel = {
  image: CmsImage | null;
  homeText: string;
  standIn: { slug: string; title: string; logline: string; frame: PlateSpec } | null;
};

export function HomeView({ home }: { home: HomeModel }) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-8">
      {home.image ? (
        <div data-flow="plate" className="overflow-hidden border-2 border-ink">
          <ArtworkImage image={home.image} sizes="(min-width: 56rem) 56rem, 100vw" priority className="w-full" />
        </div>
      ) : home.standIn ? (
        <Link
          href={`/projects/${home.standIn.slug}`}
          aria-label={`${home.standIn.title}. ${home.standIn.logline}`}
          data-flow="plate"
          className="group block"
        >
          <div className="border-2 border-ink p-1.5 transition-colors duration-500 group-hover:border-rose">
            <div className="overflow-hidden border-2 border-ink transition-colors duration-500 group-hover:border-rose">
              <Plate
                spec={home.standIn.frame}
                className="aspect-[16/10] w-full origin-center transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>
          </div>
        </Link>
      ) : null}
      {home.homeText ? (
        <p data-flow="copy" className="mt-6 font-body text-base leading-relaxed sm:text-lg">
          {home.homeText}
        </p>
      ) : null}
    </section>
  );
}
