"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="font-body text-xl leading-relaxed">This page could not be loaded.</p>
      <button type="button" onClick={reset} className="mt-6 min-h-11 border-2 border-ink px-4 font-body text-base">
        Try again
      </button>
    </section>
  );
}
