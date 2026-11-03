export function keyForPath(pathname: string): readonly string[] | null {
  const path = normalize(pathname);
  if (path === "/") return ["rosa", "home"];
  if (path === "/about") return ["rosa", "about"];
  if (path === "/projects") return ["rosa", "projects"];
  if (path === "/illustration") return ["rosa", "illustrations"];
  const project = /^\/projects\/([^/]+)$/.exec(path);
  if (project) return ["rosa", "project", decode(project[1])];
  return null;
}

function normalize(pathname: string) {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  try {
    return decodeURI(path);
  } catch {
    return path;
  }
}

function decode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
