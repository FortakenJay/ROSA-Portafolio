"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CachedPage } from "@/components/cached-pages";
import { PageSkeleton } from "@/components/page-skeletons";
import { usePagePreview } from "@/components/query-provider";

export function RoutePreview({ children }: { children: ReactNode }) {
  const preview = usePagePreview();
  const pathname = usePathname();
  if (!preview || preview.pathname === pathname) return children;
  if (preview.data == null) return <PageSkeleton pathname={preview.pathname} />;
  return <CachedPage pathname={preview.pathname} data={preview.data} />;
}
