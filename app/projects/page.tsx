import type { Metadata } from "next";
import Link from "next/link";
import { ArtworkImage } from "@/components/artwork-image";
import { Plate } from "@/components/plate";
import { devStandIns, getProjects } from "@/lib/cms";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const fromDatabase = await getProjects();
  const standIn = fromDatabase.length === 0 && devStandIns();
  const list = standIn
    ? projects.map((project) => ({
        slug: project.slug,
        title: project.title,
        logline: project.logline,
        image: null,
        frame: project.frames[0],
      }))
    : fromDatabase.map((project) => ({
        slug: project.slug,
        title: project.title,
        logline: project.subheading,
        image: project.images[0]?.image ?? null,
        frame: null,
      }));

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-8">
      <h1 className="sr-only">Projects</h1>
      {list.length === 0 ? <p className="font-body text-xl leading-relaxed">New work soon.</p> : null}
      <ul className="flex flex-col gap-20">
        {list.map((project) => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`} className="group block">
              <h2
                data-flow="copy"
                className="pb-1 font-display text-4xl leading-[1.1] transition-colors duration-500 group-hover:text-rose md:text-5xl"
              >
                {project.title}
              </h2>
              <p
                data-flow="copy"
                className="mt-2 max-w-md border-b-2 border-rose pb-2 font-body text-xl leading-relaxed italic"
              >
                {project.logline}
              </p>
              {project.image || project.frame ? (
                <div
                  data-flow="plate"
                  className="mt-6 overflow-hidden border-2 border-ink transition-colors duration-500 group-hover:border-rose"
                >
                  {project.image ? (
                    <ArtworkImage
                      image={project.image}
                      sizes="(min-width: 48rem) 48rem, 100vw"
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
