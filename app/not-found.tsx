import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-16">
      <h1 className="pb-1 font-display text-5xl leading-[1.1]">That page is not here.</h1>
      <p className="mt-4 font-body text-lg leading-relaxed text-plum">
        The address does not match a project or a page on this site.
      </p>
      <Link href="/" className="mt-8 inline-block rounded-full border-2 border-ink px-5 py-2 font-body text-lg">
        Back to the preview
      </Link>
    </section>
  );
}
