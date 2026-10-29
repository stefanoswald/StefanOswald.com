import type { MetadataRoute } from "next";

const BASE = "https://www.stefanoswald.com";

// The home page sells AI consulting, corporate entertainment, and murals. The rest of the main site is listed too.
// Acadia, Willowbrook, Find Stefan's Person, and the app experiments are left out on purpose.
const PAGES = [
  { path: "/", priority: 1 },
  { path: "/AboutMe", priority: 0.7 },
  { path: "/travel", priority: 0.6 },
  { path: "/watch", priority: 0.6 },
  { path: "/writing", priority: 0.5 },
  { path: "/your-fullest-potential", priority: 0.5 },
  { path: "/the-contingency", priority: 0.4 },
  { path: "/top-hat", priority: 0.4 },
  { path: "/energy-for-energy", priority: 0.3 },
  { path: "/travel-gear", priority: 0.4 },
  { path: "/cybertruck-rental", priority: 0.3 },
  { path: "/learn-magic", priority: 0.4 }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-17");
  return PAGES.map((page) => ({ url: `${BASE}${page.path}`, lastModified, priority: page.priority }));
}
