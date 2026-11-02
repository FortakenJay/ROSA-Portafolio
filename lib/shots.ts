import type { CmsImage } from "@/lib/cms";
import type { PlateSpec } from "@/lib/content";

export type Shot =
  | { kind: "plate"; spec: PlateSpec; caption: string }
  | { kind: "image"; image: CmsImage; caption: string };
