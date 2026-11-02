import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/cms";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const base = "https://rosachenliang.com";
  return ["", "/projects", "/illustration", "/about", ...projects.map((project) => `/projects/${project.slug}`)].map((path) => ({
    url: `${base}${path}`,
  }));
}
