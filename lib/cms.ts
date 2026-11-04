import { cacheLife, cacheTag } from "next/cache";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type CmsImage = {
  id: string;
  width: number;
  height: number;
  alt: string;
  thumbhash: string | null;
  dominantColor: string | null;
  variants: {
    widths: number[];
    avif: Record<string, string>;
    webp: Record<string, string>;
    lightbox: string;
    video?: string;
  };
};

export type CmsSection = { title: string; images: CmsPicture[] };

export type CmsPicture = { image: CmsImage; caption: string };

export type SiteContent = {
  name: string;
  description: string;
  homeText: string;
  homeImage: CmsImage | null;
  aboutDescription: string;
  aboutImage: CmsImage | null;
  email: string;
  socials: { name: string; href: string }[];
};

export type CmsProject = {
  slug: string;
  title: string;
  subheading: string;
  images: CmsPicture[];
  sections: CmsSection[];
};

export type CmsIllustration = {
  title: string;
  caption: string;
  pictures: CmsPicture[];
};

export function devStandIns() {
  return process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_SUPABASE_URL;
}

const IMAGE_FIELDS = "id, processing_status, variants, width, height, alt_text, thumbhash, dominant_color";

function reader() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function asImage(row: Record<string, unknown> | null): CmsImage | null {
  if (!row || row.processing_status !== "ready") return null;
  const variants = row.variants as CmsImage["variants"] | null;
  const width = Number(row.width);
  const height = Number(row.height);
  if (variants?.video) {
    return {
      id: String(row.id),
      width: width || 16,
      height: height || 9,
      alt: String(row.alt_text ?? ""),
      thumbhash: null,
      dominantColor: null,
      variants: { widths: [], avif: {}, webp: {}, lightbox: "", video: variants.video },
    };
  }
  if (!variants?.widths?.length || !variants.webp || !variants.avif || !variants.lightbox || !width || !height) return null;
  return {
    id: String(row.id),
    width,
    height,
    alt: String(row.alt_text ?? ""),
    thumbhash: (row.thumbhash as string | null) ?? null,
    dominantColor: (row.dominant_color as string | null) ?? null,
    variants,
  };
}

function picturesOf(rows: unknown): CmsPicture[] {
  const list = Array.isArray(rows) ? rows : [];
  return list
    .map((row) => row as { caption?: string; sort?: number; image?: Record<string, unknown> | Record<string, unknown>[] | null })
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .flatMap((row) => {
      const image = asImage(Array.isArray(row.image) ? (row.image[0] ?? null) : (row.image ?? null));
      if (!image) return [];
      return [{ image, caption: row.caption ?? "" }];
    });
}

async function imageForPath(supabase: SupabaseClient, path: string | null) {
  if (!path) return null;
  const { data, error } = await supabase.from("images").select(IMAGE_FIELDS).eq("original_path", path).maybeSingle();
  if (error) {
    console.error(error.message);
    throw new Error("The portfolio could not be loaded.");
  }
  return asImage(data as Record<string, unknown> | null);
}

export async function getSite(): Promise<SiteContent | null> {
  "use cache";
  cacheLife("max");
  cacheTag("site");
  const supabase = reader();
  if (!supabase) return null;
  const { data, error } = await supabase.from("site").select("*").eq("id", 1).maybeSingle();
  if (error) {
    console.error(error.message);
    throw new Error("The portfolio could not be loaded.");
  }
  if (!data) return null;
  const socials = [
    { name: "Instagram", href: data.instagram_url as string },
    { name: "LinkedIn", href: data.linkedin_url as string },
    { name: "YouTube", href: data.youtube_url as string },
    { name: "Linktree", href: data.linktree_url as string },
  ].filter((item) => item.href);
  const [homeImage, aboutImage] = await Promise.all([
    imageForPath(supabase, data.home_image_path as string | null),
    imageForPath(supabase, data.about_image_path as string | null),
  ]);
  return {
    name: data.name as string,
    description: (data.description as string) ?? "",
    homeText: data.home_text as string,
    homeImage,
    aboutDescription: data.about_description as string,
    aboutImage,
    email: data.email as string,
    socials,
  };
}

export async function getProjects(): Promise<CmsProject[]> {
  "use cache";
  cacheLife("max");
  cacheTag("projects");
  const supabase = reader();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select(`slug, title, subheading, project_images(caption, sort, image:images(${IMAGE_FIELDS}))`)
    .not("published_at", "is", null)
    .order("sort");
  if (error) {
    console.error(error.message);
    throw new Error("The portfolio could not be loaded.");
  }
  return (data ?? []).map((row) => ({
    slug: row.slug as string,
    title: row.title as string,
    subheading: row.subheading as string,
    images: picturesOf(row.project_images),
    sections: [],
  }));
}

export async function getProject(slug: string): Promise<CmsProject | null> {
  "use cache";
  cacheLife("max");
  cacheTag("projects", `project:${slug}`);
  const supabase = reader();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("projects")
    .select(`slug, title, subheading, project_images(caption, sort, section_id, image:images(${IMAGE_FIELDS})), project_sections(id, title, sort)`)
    .eq("slug", slug)
    .not("published_at", "is", null)
    .maybeSingle();
  if (error) {
    console.error(error.message);
    throw new Error("The portfolio could not be loaded.");
  }
  if (!data) return null;
  const joins = Array.isArray(data.project_images) ? data.project_images : [];
  const sectionRows = Array.isArray(data.project_sections) ? data.project_sections : [];
  return {
    slug: data.slug as string,
    title: data.title as string,
    subheading: data.subheading as string,
    images: picturesOf(joins.filter((row) => !(row as { section_id?: string | null }).section_id)),
    sections: sectionRows
      .map((section) => section as { id: string; title: string; sort?: number })
      .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
      .map((section) => ({
        title: section.title,
        images: picturesOf(joins.filter((row) => (row as { section_id?: string | null }).section_id === section.id)),
      })),
  };
}

export async function getIllustrations(): Promise<CmsIllustration[]> {
  "use cache";
  cacheLife("max");
  cacheTag("illustrations");
  const supabase = reader();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("illustrations")
    .select(`title, caption, illustration_images(caption, sort, image:images(${IMAGE_FIELDS}))`)
    .not("published_at", "is", null)
    .order("sort");
  if (error) {
    console.error(error.message);
    throw new Error("The portfolio could not be loaded.");
  }
  return (data ?? []).map((row) => ({
    title: row.title as string,
    caption: row.caption as string,
    pictures: picturesOf(row.illustration_images),
  }));
}
