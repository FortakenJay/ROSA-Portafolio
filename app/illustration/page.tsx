import type { Metadata } from "next";
import { Gallery } from "@/components/gallery";
import { devStandIns, getIllustrations } from "@/lib/cms";
import { gallery } from "@/lib/content";
import type { Shot } from "@/lib/shots";

const standInPieces = gallery.map((piece) => ({
  title: piece.title,
  pictures: piece.pictures.map((picture) => ({ kind: "plate" as const, spec: picture, caption: picture.caption })),
}));

export const metadata: Metadata = {
  title: "Illustration",
};

export default async function IllustrationPage() {
  const fromDatabase = await getIllustrations();
  const pieces =
    fromDatabase.length > 0
      ? fromDatabase.flatMap((item) => {
          const pictures: Shot[] = item.pictures.map((picture) => ({
            kind: "image",
            image: picture.image,
            caption: picture.caption || item.caption || item.title,
          }));
          return pictures.length ? [{ title: item.title, pictures }] : [];
        })
      : devStandIns()
        ? standInPieces
        : [];

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-8">
      <h1 className="sr-only">Illustration</h1>
      {pieces.length > 0 ? <Gallery pieces={pieces} /> : <p className="font-body text-xl leading-relaxed">New work soon.</p>}
    </section>
  );
}
