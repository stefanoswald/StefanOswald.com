import type { MetadataRoute } from "next";

const BASE = "https://www.stefanoswald.com";

// The site sells AI consulting, so only the home page and /AboutMe are listed. The pages linked from /AboutMe
// (watch, writing, travel gear, and the rest) still work, they just aren't promoted. Acadia, Willowbrook,
// Find Stefan's Person, and the app experiments are left out on purpose.
const PAGES = [
  { path: "/", priority: 1 },
  { path: "/AboutMe", priority: 0.6 }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-08");
  return PAGES.map((page) => ({ url: `${BASE}${page.path}`, lastModified, priority: page.priority }));
}
