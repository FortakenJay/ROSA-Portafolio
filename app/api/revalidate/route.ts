import { revalidateTag } from "next/cache";
import { tagsFromBody } from "@/lib/revalidate-tags";

export async function POST(request: Request) {
  if (request.headers.get("x-revalidate-secret") !== process.env.REVALIDATE_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const tags = tagsFromBody(body);
  if (!tags) return new Response("Bad request", { status: 400 });
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: tags });
}
