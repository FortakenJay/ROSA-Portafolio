import type { ReactNode } from "react";

export function PageSkeleton({ pathname }: { pathname: string }) {
  if (pathname === "/") return <FrameSkeleton width="max-w-4xl" />;
  if (pathname === "/about") return <AboutSkeleton />;
  if (pathname === "/projects") return <ListSkeleton />;
  if (pathname === "/illustration") return <WallSkeleton />;
  if (pathname.startsWith("/projects/")) return <ProjectSkeleton />;
  return <FrameSkeleton width="max-w-4xl" />;
}

function Blocks({ children, width }: { children: ReactNode; width: string }) {
  return (
    <div className={`mx-auto w-full px-4 pb-8 ${width}`} aria-busy="true">
      <p className="sr-only">Loading this page.</p>
      <div className="flex flex-col gap-6" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}

function FrameSkeleton({ width }: { width: string }) {
  return (
    <Blocks width={width}>
      <div className="page-skeleton aspect-[16/10] w-full" />
      <div className="page-skeleton h-6 w-2/3" />
    </Blocks>
  );
}

function AboutSkeleton() {
  return (
    <Blocks width="max-w-xl">
      <div className="page-skeleton mx-auto size-56 rounded-full sm:size-64" />
      <div className="page-skeleton h-5 w-full" />
      <div className="page-skeleton h-5 w-5/6" />
      <div className="page-skeleton h-5 w-2/3" />
    </Blocks>
  );
}

function ListSkeleton() {
  return (
    <Blocks width="max-w-3xl">
      <div className="page-skeleton h-12 w-2/3" />
      <div className="page-skeleton aspect-[16/10] w-full" />
      <div className="page-skeleton mt-8 h-12 w-1/2" />
      <div className="page-skeleton aspect-[16/10] w-full" />
    </Blocks>
  );
}

function ProjectSkeleton() {
  return (
    <Blocks width="max-w-4xl">
      <div className="page-skeleton h-9 w-28 rounded-full" />
      <div className="page-skeleton h-14 w-3/4" />
      <div className="page-skeleton aspect-[16/10] w-full" />
    </Blocks>
  );
}

function WallSkeleton() {
  return (
    <Blocks width="max-w-5xl">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="page-skeleton aspect-square" />
        <div className="page-skeleton aspect-square" />
        <div className="page-skeleton aspect-square" />
        <div className="page-skeleton aspect-square" />
      </div>
    </Blocks>
  );
}
