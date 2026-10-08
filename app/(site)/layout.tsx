import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import "./site.css";

// Same faces as MagicTrickGuy.com (Cormorant Garamond and Inter), served from this site.
const display = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-latin-wght-normal.woff2", style: "normal", weight: "300 700" },
    { path: "./fonts/cormorant-garamond-latin-wght-italic.woff2", style: "italic", weight: "300 700" }
  ],
  variable: "--font-so-display",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"]
});

const sans = localFont({
  src: [{ path: "./fonts/inter-latin-wght-normal.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-so-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"]
});

// Each page sets its own title, description, and share preview with pageMetadata() (lib/site/meta.ts).
export const metadata: Metadata = {
  metadataBase: new URL("https://www.stefanoswald.com"),
  title: { default: "Stefan Oswald | AI Consultant and Corporate Entertainer", template: "%s | Stefan Oswald" },
  icons: { icon: "/images/site/favicon.svg", apple: "/images/site/apple-touch-icon.png" }
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
  colorScheme: "dark"
};

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`so-site ${display.variable} ${sans.variable}`}>
      <a href="#main" className="so-skip">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </div>
  );
}
