import type { Metadata } from "next";
import { Plate } from "@/components/plate";
import { aboutPortrait, contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center px-4 pb-8">
      <h1 className="sr-only">About</h1>
      <div data-flow="plate" className="size-56 overflow-hidden rounded-full border-2 border-ink sm:size-64">
        <Plate spec={aboutPortrait} className="h-full w-full" />
      </div>
      <div data-flow="copy" className="mt-10 max-w-prose text-left">
        <p className="font-body text-lg leading-relaxed">
          Rosa draws dresses, rooms, and the people who stand still inside them. The pictures lean
          cute, then go a little gothic: black ribbon, pale fruit, and a candle left on purpose.
        </p>
        <p className="mt-4 font-body text-lg leading-relaxed text-plum">
          This is a sample site. Swap the pictures and the sentences for the real portfolio.
        </p>
        <p className="mt-8 font-body text-lg">
          <a href={`mailto:${contact.email}`} className="border-b-2 border-rose">
            {contact.email}
          </a>
        </p>
      </div>
    </section>
  );
}
