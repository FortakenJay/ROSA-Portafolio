"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { keyForPath } from "@/lib/page-cache";

export type PagePreview = { pathname: string; data: unknown };

const PreviewContext = createContext<PagePreview | null>(null);

let browserClient: QueryClient | undefined;

function makeClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Number.POSITIVE_INFINITY,
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}

function getQueryClient() {
  if (typeof window === "undefined") return makeClient();
  browserClient ??= makeClient();
  return browserClient;
}

export function usePagePreview() {
  return useContext(PreviewContext);
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(getQueryClient);
  const pathname = usePathname();
  const [preview, setPreview] = useState<PagePreview | null>(null);
  const [trackedPath, setTrackedPath] = useState(pathname);

  if (pathname !== trackedPath) {
    setTrackedPath(pathname);
    setPreview(null);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ClickCatcher queryClient={queryClient} setPreview={setPreview}>
        <PreviewContext.Provider value={preview}>{children}</PreviewContext.Provider>
      </ClickCatcher>
    </QueryClientProvider>
  );
}

function ClickCatcher({
  children,
  queryClient,
  setPreview,
}: {
  children: ReactNode;
  queryClient: QueryClient;
  setPreview: (preview: PagePreview | null) => void;
}) {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) return;
      let url: URL;
      try {
        url = new URL(anchor.href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin || (url.protocol !== "http:" && url.protocol !== "https:")) return;
      const nextPath = decodePath(url.pathname);
      if (nextPath === decodePath(location.pathname)) return;
      const key = keyForPath(nextPath);
      if (!key) return;
      setPreview({ pathname: nextPath, data: queryClient.getQueryData([...key]) ?? null });
      window.scrollTo(0, 0);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [queryClient, setPreview]);
  return children;
}

function decodePath(pathname: string) {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  try {
    return decodeURI(path);
  } catch {
    return path;
  }
}
