import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acadia Estates HOA Priorities",
  description:
    "A community feedback site for Acadia Estates homeowners to review HOA projects and share informal priority votes."
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
