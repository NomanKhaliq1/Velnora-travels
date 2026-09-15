export function siteUrl(path = "") {
  const base = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
