import { thumbHashToDataURL } from "thumbhash";
import { VideoStill } from "@/components/video-still";
import type { CmsImage } from "@/lib/cms";

const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/`;

export function ArtworkImage({
  image,
  sizes,
  priority = false,
  className,
  controls = true,
}: {
  image: CmsImage;
  sizes: string;
  priority?: boolean;
  className?: string;
  controls?: boolean;
}) {
  if (image.variants.video) {
    return (
      <VideoStill
        src={`${base}${image.variants.video}`}
        poster={image.variants.poster ? `${base}${image.variants.poster}` : null}
        width={image.width}
        height={image.height}
        alt={image.alt}
        className={className}
        controls={controls}
      />
    );
  }
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
