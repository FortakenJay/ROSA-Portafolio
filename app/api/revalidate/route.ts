import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  if (request.headers.get("x-revalidate-secret") !== process.env.REVALIDATE_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = (await request.json()) as { tags?: unknown };
  if (!Array.isArray(body.tags)) return new Response("Bad request", { status: 400 });
  const tags = body.tags.filter((tag): tag is string => typeof tag === "string" && tag.length > 0 && tag.length <= 256).slice(0, 20);
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: tags });
}
