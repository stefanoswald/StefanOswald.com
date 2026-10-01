import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { site } from "@/lib/myperson/site";
import "./myperson.css";

const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-soft-normal.woff2", style: "normal", weight: "100 900" },
    { path: "./fonts/fraunces-soft-italic.woff2", style: "italic", weight: "100 900" }
  ],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"]
});

const figtree = localFont({
  src: "./fonts/figtree-normal.woff2",
  weight: "300 900",
  style: "normal",
  variable: "--font-figtree",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"]
});

export const metadata: Metadata = {
  // Link previews (iMessage, WhatsApp) need full addresses.
  metadataBase: new URL("https://stefanoswald.com"),
  title: site.seo.title,
  description: site.seo.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    type: "website"
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false }
};

export const viewport: Viewport = {
  themeColor: "#173b33",
  viewportFit: "cover"
};

/** Everything under /MyPerson. The .mp class scopes its look so the rest of the site is untouched. */
export default function MyPersonLayout({ children }: { children: ReactNode }) {
  return <div className={`mp ${fraunces.variable} ${figtree.variable}`}>{children}</div>;
}
