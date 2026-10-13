import Link from "next/link";
import { Plate } from "@/components/plate";
import { projects } from "@/lib/content";

export default function Home() {
  const featured = projects[0];

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-8">
      <Link
        href={`/projects/${featured.slug}`}
        aria-label={`${featured.title}. ${featured.logline}`}
        className="group block"
      >
        <div className="border-2 border-ink p-1.5 transition-colors group-hover:border-rose">
          <div className="border-2 border-ink">
            <Plate spec={featured.frames[0]} className="aspect-[16/10] w-full" />
          </div>
        </div>
      </Link>
    </section>
  );
}
