"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { keyForPath } from "@/lib/page-cache";

export function DropMissing() {
  const pathname = usePathname();
  const client = useQueryClient();
  useEffect(() => {
    const key = keyForPath(pathname);
    if (key) client.removeQueries({ queryKey: [...key] });
  }, [client, pathname]);
  return null;
}
