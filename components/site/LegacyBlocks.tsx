import { YouTubeLite } from "@/components/site/YouTubeLite";

/**
 * Renders the long-form pages that came over from the old Weebly site (data/site/legacy/*.json).
 * Those files were made by a one-time conversion that kept only headings, paragraphs, lists,
 * links, bold, italics, images, and YouTube videos. The text is Stefan's, unchanged.
 */
export type LegacyBlock =
  | { t: "h1" | "h2" | "h3"; text: string }
  | { t: "p"; html: string }
  | { t: "ul"; items: string[] }
  | { t: "video"; id: string }
  | { t: "img"; src: string; alt: string }
  | { t: "hr" };

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function legacyHeadings(blocks: LegacyBlock[]) {
  return blocks
    .filter((block): block is { t: "h2"; text: string } => block.t === "h2")
    .map((block) => ({ id: slugify(block.text), text: block.text.replace(/:$/, "") }));
}

export function LegacyBlocks({ blocks, videoTitles = {} }: { blocks: LegacyBlock[]; videoTitles?: Record<string, string> }) {
  return (
    <div className="so-prose">
      {blocks.map((block, index) => {
        switch (block.t) {
          case "h1":
          case "h2":
            return (
              <h2 key={index} id={slugify(block.text)}>
                {block.text.replace(/:$/, "")}
              </h2>
            );
          case "h3":
            return <h3 key={index}>{block.text}</h3>;
          case "p":
            return <p key={index} dangerouslySetInnerHTML={{ __html: block.html }} />;
          case "ul":
            return (
              <ul key={index}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            );
          case "video":
            return (
              <figure key={index} className="not-prose">
                <YouTubeLite id={block.id} title={videoTitles[block.id] ?? "Video"} />
              </figure>
            );
          case "img":
            return (
              <figure key={index}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={block.src} alt={block.alt} loading="lazy" className="mx-auto h-auto max-w-full rounded-[3px]" />
              </figure>
            );
          case "hr":
            return <hr key={index} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
