import type { Metadata } from "next";

const OG_IMAGE = {
  url: "/images/site/og.jpg",
  width: 1200,
  height: 630,
  alt: "Stefan Oswald, AI consultant and corporate entertainer"
};

/**
 * Title, description, canonical link, and share preview for one page of the main site.
 * Every page sets its own, so a shared link to /travel-gear never shows the home page's preview.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = path === "/" ? title : `${title} | Stefan Oswald`;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Stefan Oswald",
      title: fullTitle,
      description,
      url: path,
      images: [OG_IMAGE]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url]
    }
  };
}
