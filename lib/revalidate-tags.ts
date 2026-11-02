export function tagsFromBody(body: unknown) {
  if (!body || typeof body !== "object" || !("tags" in body)) return null;
  const tags = (body as { tags?: unknown }).tags;
  if (!Array.isArray(tags)) return null;
  return tags
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0 && tag.length <= 256)
    .slice(0, 20);
}
