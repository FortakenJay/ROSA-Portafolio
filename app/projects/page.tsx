import type { Metadata } from "next";
import Link from "next/link";
import { Plate } from "@/components/plate";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-8">
      <h1 className="sr-only">Projects</h1>
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
              <p
                data-flow="copy"
                className="mt-2 max-w-md border-b-2 border-rose pb-2 font-body text-xl leading-relaxed italic"
              >
                {project.logline}
              </p>
              <div
                data-flow="plate"
                className="mt-6 overflow-hidden border-2 border-ink transition-colors duration-500 group-hover:border-rose"
              >
                <Plate
                  spec={project.frames[0]}
                  className="aspect-[16/10] w-full origin-center transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
