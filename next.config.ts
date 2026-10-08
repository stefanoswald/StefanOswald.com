import type { NextConfig } from "next";

// The old Weebly-era pages (public/*.html) now live as real pages in app/(site).
// These redirects keep every old link and bookmark working.
const LEGACY_PAGES: Array<[string, string]> = [
  ["/index.html", "/"],
  ["/projects.html", "/AboutMe#projects"],
  ["/media.html", "/watch"],
  ["/books.html", "/writing"],
  ["/your-fullest-potential.html", "/your-fullest-potential"],
  ["/the-contingency.html", "/the-contingency"],
  ["/travel-gear.html", "/travel-gear"],
  ["/cybertruck.html", "/cybertruck"],
  ["/tophat.html", "/top-hat"],
  ["/the-magic-hostel.html", "/top-hat#the-magic-hostel"],
  ["/learn-magic.html", "/learn-magic"],
  ["/energy-for-energy.html", "/energy-for-energy"],
  ["/media", "/watch"],
  ["/books", "/writing"],
  ["/tophat", "/top-hat"],
  ["/projects", "/AboutMe#projects"],
  // Other ways people might type /AboutMe. "/aboutme" lives in vercel.json instead: these redirects ignore
  // letter case, so "/aboutme" here would also catch "/AboutMe" and loop forever.
  ["/about-me", "/AboutMe"],
  ["/about", "/AboutMe"]
];

const nextConfig: NextConfig = {
  async redirects() {
    return LEGACY_PAGES.map(([source, destination]) => ({ source, destination, permanent: true }));
  }
};

export default nextConfig;
