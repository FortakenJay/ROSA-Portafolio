import Link from "next/link";
import { DropMissing } from "@/components/drop-missing";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-16">
      <DropMissing />
      <h1 className="pb-1 font-display text-5xl leading-[1.1]">That page is not here.</h1>
      <p className="mt-4 font-body text-lg leading-relaxed text-plum">
        The address does not match a project or a page on this site.
      </p>
      <Link href="/" className="mt-8 inline-flex min-h-11 items-center font-body text-lg leading-none text-ink underline decoration-2 underline-offset-8 transition-colors duration-300 hover:text-rose">
        Back to the preview
      </Link>
    </section>
  );
}
