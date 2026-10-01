import { site } from "@/lib/myperson/site";

export function SocialLinks({
  tone = "felt",
  showHandles = true
}: {
  tone?: "felt" | "card";
  showHandles?: boolean;
}) {
  const links = site.socials.filter((social) => social.url);
  if (!links.length) return null;

  const base =
    tone === "card"
      ? "border-mp-cream-3 bg-mp-cream-2 text-mp-ink mp-hover:border-mp-ember"
      : "border-mp-felt-line bg-mp-felt-2 text-mp-mist mp-hover:border-mp-sage";

  return (
    <ul className="flex flex-wrap justify-center gap-2">
      {links.map((social) => (
        <li key={social.id}>
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-mp-pill border px-4 py-2.5 text-sm font-semibold transition-colors ${base}`}
          >
            {social.label}
            {showHandles && social.handle ? (
              <span className={tone === "card" ? "text-mp-ink-muted" : "text-mp-sage"}>{social.handle}</span>
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
