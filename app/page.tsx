import { HomeView, type HomeModel } from "@/components/home-view";
import { Remember } from "@/components/remember";
import { devStandIns, getSite } from "@/lib/cms";
import { projects } from "@/lib/content";
import { keyForPath } from "@/lib/page-cache";

export default async function Home() {
  const site = await getSite();
  const featured = projects[0];
  const home: HomeModel = {
    image: site?.homeImage ?? null,
    homeText: site?.homeText ?? "",
    standIn:
      !site?.homeImage && devStandIns()
        ? {
            slug: featured.slug,
            title: featured.title,
            logline: featured.logline,
            frame: { motif: featured.frames[0].motif, palette: featured.frames[0].palette, flip: featured.frames[0].flip },
          }
        : null,
  };
  return (
    <>
      <Remember queryKey={keyForPath("/") ?? ["rosa", "home"]} data={home} />
      <HomeView home={home} />
    </>
  );
}
