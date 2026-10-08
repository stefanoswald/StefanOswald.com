import type { Metadata } from "next";
import "./globals.css";

// Site-wide fallback only. The main site (app/(site)), Acadia, Find Stefan's Person, and the
// YFP privacy page each set their own titles and descriptions.
export const metadata: Metadata = {
  metadataBase: new URL("https://www.stefanoswald.com"),
  title: "Stefan Oswald",
  description: "Stefan Oswald, AI consultant and corporate entertainer near Orlando, Florida."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
