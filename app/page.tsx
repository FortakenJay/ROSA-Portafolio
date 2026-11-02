import Link from "next/link";
import { ArtworkImage } from "@/components/artwork-image";
import { Plate } from "@/components/plate";
import { devStandIns, getSite } from "@/lib/cms";
import { projects } from "@/lib/content";

export default async function Home() {
  const site = await getSite();
  const featured = projects[0];
  const image = site?.homeImage;

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-8">
      {image ? (
        <div data-flow="plate" className="overflow-hidden border-2 border-ink">
          <ArtworkImage image={image} sizes="(min-width: 56rem) 56rem, 100vw" priority className="w-full" />
        </div>
      ) : devStandIns() ? (
        <Link
          href={`/projects/${featured.slug}`}
          aria-label={`${featured.title}. ${featured.logline}`}
          data-flow="plate"
          className="group block"
        >
          <div className="border-2 border-ink p-1.5 transition-colors duration-500 group-hover:border-rose">
            <div className="overflow-hidden border-2 border-ink transition-colors duration-500 group-hover:border-rose">
              <Plate
                spec={featured.frames[0]}
                className="aspect-[16/10] w-full origin-center transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>
          </div>
        </Link>
      ) : null}
      {site?.homeText ? (
        <p data-flow="copy" className="mt-6 max-w-xl font-body text-xl leading-relaxed">
          {site.homeText}
        </p>
      ) : null}
    </section>
  );
}
