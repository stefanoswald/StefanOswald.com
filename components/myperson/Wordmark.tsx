import Link from "next/link";
import { site } from "@/lib/myperson/site";

export function Wordmark({ asLink = true }: { asLink?: boolean }) {
  const content = (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className="grid h-6 w-[18px] -rotate-6 place-items-center rounded-[4px] bg-mp-cream text-[11px] leading-none text-mp-heart shadow-[0_2px_6px_rgba(0,0,0,.35)]"
      >
        ♥
      </span>
      <span className="eyebrow text-mp-sage">{site.name}</span>
    </span>
  );
  if (!asLink) return content;
  return (
    <Link href={site.path} className="rounded-lg transition-opacity mp-hover:opacity-80">
      {content}
    </Link>
  );
}
