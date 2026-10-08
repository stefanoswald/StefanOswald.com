import type React from "react";
import type { Metadata } from "next";
import { AcadiaChatbot } from "@/components/AcadiaChatbot";

// These used to be the whole site's defaults. They live here now so only the Acadia pages use them.
export const metadata: Metadata = {
  title: "Acadia Estates HOA Priorities",
  description:
    "A community feedback site for Acadia Estates homeowners to review HOA projects and share informal priority votes."
};

export default function AcadiaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AcadiaChatbot />
    </>
  );
}
