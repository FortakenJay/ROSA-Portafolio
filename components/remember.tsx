"use client";

import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { useEffect } from "react";

export function Remember({ queryKey, data }: { queryKey: QueryKey; data: unknown }) {
  const client = useQueryClient();
  const id = JSON.stringify(queryKey);
  useEffect(() => {
    client.setQueryData(JSON.parse(id) as QueryKey, data);
  }, [client, data, id]);
  return null;
}
