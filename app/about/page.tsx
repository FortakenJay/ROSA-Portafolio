import type { Metadata } from "next";
import { AboutView, type AboutModel } from "@/components/about-view";
import { Remember } from "@/components/remember";
import { devStandIns, getSite } from "@/lib/cms";
import { aboutPortrait } from "@/lib/content";
import { keyForPath } from "@/lib/page-cache";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const site = await getSite();
  const standIn = devStandIns() && !site;
  const about: AboutModel = {
    image: site?.aboutImage ?? null,
    portrait: standIn ? aboutPortrait : null,
    paragraphs: site?.aboutDescription ? site.aboutDescription.split(/\n\s*\n/).filter(Boolean) : [],
    email: site?.email || "",
  };
  return (
    <>
      <Remember queryKey={keyForPath("/about") ?? ["rosa", "about"]} data={about} />
      <AboutView about={about} />
    </>
  );
}
