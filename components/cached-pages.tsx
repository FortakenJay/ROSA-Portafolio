"use client";

import { AboutView, type AboutModel } from "@/components/about-view";
import { HomeView, type HomeModel } from "@/components/home-view";
import { IllustrationView, type IllustrationModel } from "@/components/illustration-view";
import { ProjectView, type ProjectModel } from "@/components/project-view";
import { ProjectsView, type ProjectCard } from "@/components/projects-view";

export function CachedPage({ pathname, data }: { pathname: string; data: unknown }) {
  if (pathname === "/") return <HomeView home={data as HomeModel} />;
  if (pathname === "/about") return <AboutView about={data as AboutModel} />;
  if (pathname === "/projects") return <ProjectsView projects={data as ProjectCard[]} />;
  if (pathname === "/illustration") return <IllustrationView illustration={data as IllustrationModel} />;
  if (pathname.startsWith("/projects/")) return <ProjectView project={data as ProjectModel} />;
  return null;
}
