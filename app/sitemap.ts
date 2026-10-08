import type { MetadataRoute } from "next";

const BASE = "https://www.stefanoswald.com";

// Only the main site. Acadia, Willowbrook, Find Stefan's Person, and the app experiments are left out on purpose.
const PAGES = [
  { path: "/", priority: 1 },
  { path: "/watch", priority: 0.7 },
  { path: "/writing", priority: 0.6 },
  { path: "/your-fullest-potential", priority: 0.6 },
  { path: "/the-contingency", priority: 0.5 },
  { path: "/top-hat", priority: 0.6 },
  { path: "/energy-for-energy", priority: 0.5 },
  { path: "/travel-gear", priority: 0.6 },
  { path: "/cybertruck", priority: 0.5 },
  { path: "/learn-magic", priority: 0.5 }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-08");
  return PAGES.map((page) => ({ url: `${BASE}${page.path}`, lastModified, priority: page.priority }));
}
