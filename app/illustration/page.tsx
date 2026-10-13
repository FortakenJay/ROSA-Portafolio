import type { Metadata } from "next";
import { Gallery } from "@/components/gallery";
import { gallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Illustration",
};

export default function IllustrationPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-8">
      <h1 className="sr-only">Illustration</h1>
      <Gallery pieces={gallery} />
    </section>
  );
}
