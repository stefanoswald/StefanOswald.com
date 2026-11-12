"use client";

import type React from "react";
import { useFormStatus } from "react-dom";

const tones = {
  primary: "bg-acadia-leaf text-white hover:bg-acadia-ink",
  quiet: "border border-acadia-moss/40 bg-white text-acadia-ink hover:border-acadia-leaf hover:bg-acadia-sky",
  danger: "border border-red-300 bg-white text-red-800 hover:bg-red-50"
};

/** A form button that turns itself off while the form is being sent, so a double click cannot send twice. */
export function SubmitButton({
  children,
  tone = "primary",
  small = false,
  className = ""
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  small?: boolean;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`inline-flex items-center justify-center rounded-md font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 ${
        small ? "min-h-9 px-3 py-1.5 text-xs" : "min-h-11 px-4 py-2.5 text-sm"
      } ${tones[tone]} ${className}`}
    >
      {pending ? "Working..." : children}
    </button>
  );
}
