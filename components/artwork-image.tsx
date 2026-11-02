import { thumbHashToDataURL } from "thumbhash";
import type { CmsImage } from "@/lib/cms";

const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/`;

export function ArtworkImage({
  image,
  sizes,
  priority = false,
  className,
}: {
  image: CmsImage;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const set = (format: "avif" | "webp") => image.variants.widths.map((width) => `${base}${image.variants[format][String(width)]} ${width}w`).join(", ");
  const fallback = image.variants.webp[String(image.variants.widths.at(-1))];
  const thumb = thumbUrl(image.thumbhash);
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`${base}${fallback}`}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={className}
        style={{
          aspectRatio: `${image.width} / ${image.height}`,
          backgroundColor: image.dominantColor ?? undefined,
          backgroundImage: thumb ? `url(${thumb})` : undefined,
          backgroundSize: "cover",
        }}
      />
    </picture>
  );
}

function thumbUrl(value: string | null) {
  if (!value) return null;
  try {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return thumbHashToDataURL(bytes);
  } catch {
    return null;
  }
}
