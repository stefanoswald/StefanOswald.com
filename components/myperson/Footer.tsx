import { site } from "@/lib/myperson/site";

export function Footer() {
  return (
    <footer className="shell mt-16 pb-[calc(env(safe-area-inset-bottom)+28px)] text-center">
      <p className="mx-auto max-w-[40ch] text-sm text-mp-sage">{site.privacyNote}</p>
      <p className="mt-6 text-xs text-mp-sage/70">{site.footer.madeWith}</p>
    </footer>
  );
}
