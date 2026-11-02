import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reel } from "@/components/reel";
import { Zoomable } from "@/components/zoomable";
import { devStandIns, getProject, getProjects } from "@/lib/cms";
import { projects } from "@/lib/content";
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
  const title = fromDatabase?.title ?? standIn?.title ?? "";
  const logline = fromDatabase?.subheading ?? standIn?.logline ?? "";
  const shots: Shot[] = fromDatabase
    ? fromDatabase.images.map((item) => ({ kind: "image", image: item.image, caption: item.caption }))
    : (standIn?.frames ?? []).map((frame) => ({ kind: "plate", spec: frame, caption: frame.caption }));

  return (
    <article className="mx-auto w-full max-w-4xl px-4 pb-8">
      <Link
        href="/projects"
        className="inline-block rounded-full border-2 border-primary-300 bg-primary-200 px-3 py-1.5 font-body text-base leading-none text-ink hover:bg-primary-300 sm:px-5 sm:text-lg"
      >
        Back
      </Link>
      <h1 data-flow="copy" className="mt-6 pb-1 font-display text-5xl leading-[1.1] md:text-6xl">
        {title}
      </h1>
      <p data-flow="copy" className="mt-3 max-w-md border-b-2 border-rose pb-2 font-body text-xl leading-relaxed italic">
        {logline}
      </p>
      {shots.length > 0 ? (
        <div data-flow="plate" className="mt-8">
          <Reel frames={shots} priority />
        </div>
      ) : null}
      {shots.length > 1 ? (
        <div className="mt-16 flex flex-col gap-16">
          {shots.slice(1).map((shot) => (
            <figure key={`${shot.caption}-${shot.kind === "image" ? shot.image.id : shot.spec.motif}`} data-flow="plate">
              <Zoomable
                shot={shot}
                label={`Zoom in. ${shot.caption}`}
                className="block w-full cursor-pointer border-2 border-ink text-left hover:border-rose"
                plateClassName="aspect-[16/10] w-full"
              />
              {shot.caption ? (
                <figcaption className="mt-3 max-w-prose font-body text-lg leading-relaxed text-plum">{shot.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}
    </article>
  );
}
