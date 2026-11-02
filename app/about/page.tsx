import type { Metadata } from "next";
import { ArtworkImage } from "@/components/artwork-image";
import { Plate } from "@/components/plate";
import { devStandIns, getSite } from "@/lib/cms";
import { aboutPortrait } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const site = await getSite();
  const standIn = devStandIns() && !site;
  const paragraphs = site?.aboutDescription ? site.aboutDescription.split(/\n\s*\n/).filter(Boolean) : [];
  const email = site?.email || "";

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center px-4 pb-8">
      <h1 className="sr-only">About</h1>
      {site?.aboutImage || standIn ? (
        <div data-flow="plate" className="size-56 overflow-hidden rounded-full border-2 border-ink sm:size-64">
          {site?.aboutImage ? (
            <ArtworkImage image={site.aboutImage} sizes="256px" priority className="h-full w-full object-contain" />
          ) : (
            <Plate spec={aboutPortrait} className="h-full w-full" />
          )}
        </div>
      ) : null}
      <div data-flow="copy" className="mt-10 max-w-prose text-left">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-4 font-body text-lg leading-relaxed first:mt-0">
            {paragraph}
          </p>
        ))}
        {email ? (
          <p className="mt-8 font-body text-lg">
            <a href={`mailto:${email}`} className="border-b-2 border-rose">
              {email}
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
