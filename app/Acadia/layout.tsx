import type React from "react";
import { AcadiaChatbot } from "@/components/AcadiaChatbot";

export default function AcadiaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AcadiaChatbot />
    </>
  );
}
