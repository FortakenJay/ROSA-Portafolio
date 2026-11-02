import assert from "node:assert/strict";
import test from "node:test";
import { tagsFromBody } from "../lib/revalidate-tags.ts";

const hostile = [
  "",
  " ",
  "\0",
  "\n\r\t",
  "<script>alert(1)</script>",
  "'; drop table site; --",
  "../../etc/passwd",
  "a".repeat(10_000),
  "🎨🌹",
  "Ä Ö 中文",
  "site\u0000projects",
];

function seedOf(label: string) {
  const source = `${process.env.GITHUB_SHA ?? "local"}:${label}`;
  let hash = 2166136261;
  for (const char of source) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function random(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function mutate(input: string, next: () => number) {
  const roll = next();
  if (roll < 0.2) return input.slice(0, Math.floor(next() * (input.length + 1)));
  if (roll < 0.4) return `${input}${input}`;
  if (roll < 0.6) return `${input}\0${String.fromCharCode(Math.floor(next() * 32))}`;
  if (roll < 0.8) return `${" ".repeat(Math.floor(next() * 12))}${input}`;
  return input.toUpperCase();
}

function assertTags(tags: string[]) {
  assert.ok(tags.length <= 20);
  for (const tag of tags) {
    assert.equal(typeof tag, "string");
    assert.ok(tag.length > 0 && tag.length <= 256);
  }
}

test("revalidate rejects bodies that are not a tag list", () => {
  for (const body of [null, undefined, "", 0, 1, true, [], {}, { tags: "site" }, { tags: { site: true } }]) {
    assert.equal(tagsFromBody(body), null);
  }
});

test("revalidate keeps only short strings and drops the rest", () => {
  const tags = tagsFromBody({
    tags: ["site", "", "  ", 4, null, "a".repeat(256), "a".repeat(257), "project:one"],
  });
  assert.deepEqual(tags, ["site", "a".repeat(256), "project:one"]);
});

test("chaos monkey fuzzes revalidate tags without throwing", () => {
  const next = random(seedOf("revalidate"));
  for (let trial = 0; trial < 400; trial += 1) {
    const base = hostile[Math.floor(next() * hostile.length)] ?? "";
    const tag = mutate(base, next);
    const kill = next() < 0.2;
    const body = kill ? next() : { tags: [tag, mutate(tag, next), next() < 0.5 ? "" : "site"] };
    const tags = tagsFromBody(body);
    if (tags === null) continue;
    assertTags(tags);
  }
});
