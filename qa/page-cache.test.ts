import assert from "node:assert/strict";
import test from "node:test";
import { keyForPath } from "../lib/page-cache.ts";

test("each public page keeps one address", () => {
  assert.deepEqual(keyForPath("/"), ["rosa", "home"]);
  assert.deepEqual(keyForPath("/about"), ["rosa", "about"]);
  assert.deepEqual(keyForPath("/projects/"), ["rosa", "projects"]);
  assert.deepEqual(keyForPath("/illustration"), ["rosa", "illustrations"]);
  assert.deepEqual(keyForPath("/projects/night%20orchard"), ["rosa", "project", "night orchard"]);
  assert.deepEqual(keyForPath("/projects/night-orchard"), keyForPath("/projects/night-orchard"));
  assert.equal(keyForPath("/projects/night-orchard/edit"), null);
  assert.equal(keyForPath("/missing"), null);
});
