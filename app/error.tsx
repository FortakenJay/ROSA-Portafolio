"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto max-w-xl px-4 py-16">
      <h1 className="pb-1 font-display text-5xl leading-[1.1]">This page did not open.</h1>
      <p className="mt-4 font-body text-lg leading-relaxed text-plum">
        Something went wrong while loading it. Try again, or go back to the preview.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full border-2 border-ink px-5 py-2 font-body text-lg hover:bg-ink hover:text-lace"
      >
        Try again
      </button>
    </section>
  );
}
