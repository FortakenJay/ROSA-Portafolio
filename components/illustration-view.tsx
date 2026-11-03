"use client";

import { Gallery } from "@/components/gallery";
import type { Shot } from "@/lib/shots";

export type IllustrationModel = {
  pieces: { title: string; pictures: Shot[] }[];
};

export function IllustrationView({ illustration }: { illustration: IllustrationModel }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-8">
      <h1 className="sr-only">Illustration</h1>
      {illustration.pieces.length > 0 ? (
        <Gallery pieces={illustration.pieces} />
      ) : (
        <p className="font-body text-xl leading-relaxed">New work soon.</p>
      )}
    </section>
  );
}
