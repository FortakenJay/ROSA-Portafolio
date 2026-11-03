import type { Metadata } from "next";
import { IllustrationView, type IllustrationModel } from "@/components/illustration-view";
import { Remember } from "@/components/remember";
import { devStandIns, getIllustrations } from "@/lib/cms";
import { gallery } from "@/lib/content";
import { keyForPath } from "@/lib/page-cache";
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
  const pieces: IllustrationModel["pieces"] =
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
  const illustration = { pieces };

  return (
    <>
      <Remember queryKey={keyForPath("/illustration") ?? ["rosa", "illustrations"]} data={illustration} />
      <IllustrationView illustration={illustration} />
    </>
  );
}
