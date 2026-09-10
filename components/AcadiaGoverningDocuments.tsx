import { acadiaGoverningDocuments } from "@/data/acadiaGoverningDocuments";

// One ZIP of every file in public/acadia-documents/governing.
// Rebuild it with `npm run acadia:zip` whenever a governing document is added or replaced,
// then update ZIP_SIZE_LABEL to match the new file size.
const ZIP_HREF = "/acadia-documents/acadia-estates-governing-documents.zip";
const ZIP_SIZE_LABEL = "7.9 MB";

const documentGroups: { title: string; ids: string[] }[] = [
  {
    title: "Bylaws",
    ids: ["acadia-estates-by-laws-exhibit-b", "by-laws-fgm"]
  },
  {
    title: "Declarations and covenants",
    ids: ["master-declaration-covenants-easements-restrictions", "wyndham-pointe-declaration"]
  },
  {
    title: "Amendments",
    ids: ["amendment-to-master-declaration", "amendment-to-acadia-estates-2003"]
  },
  {
    title: "Articles, plat, and exhibits",
    ids: [
      "acadia-estates-articles-of-incorporation-exhibit-a",
      "articles-of-incorporation-wp-2002",
      "plat-book-document",
      "exhibit-a"
    ]
  }
];

const documentsById = new Map(acadiaGoverningDocuments.map((doc) => [doc.id, doc]));

function fileNameFromHref(href: string) {
  return href.split("/").pop() ?? undefined;
}

export function AcadiaGoverningDocuments() {
  return (
    <section
      id="governing-documents"
      className="scroll-mt-6 border-t border-acadia-moss/20 bg-white"
      aria-labelledby="governing-documents-title"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">
              Governing documents
            </p>
            <h2 id="governing-documents-title" className="mt-2 text-2xl font-bold text-acadia-ink">
              Bylaws, declarations, and HOA rules
            </h2>
            <p className="mt-2 leading-7 text-slate-700">
              Download the recorded documents that govern Acadia Estates. The set includes the
              bylaws, declarations, amendments, articles of incorporation, and plat.
            </p>
          </div>
          <a
            href={ZIP_HREF}
            download
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-acadia-leaf px-5 py-3 text-center font-bold text-white shadow-soft transition hover:bg-acadia-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold focus-visible:ring-offset-2"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0">
              <path d="M10 2.5a1 1 0 0 1 1 1v7.09l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42L9 10.59V3.5a1 1 0 0 1 1-1Z" />
              <path d="M3.5 13a1 1 0 0 1 1 1v1.5h11V14a1 1 0 1 1 2 0v2.5a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1V14a1 1 0 0 1 1-1Z" />
            </svg>
            <span>
              Download all {acadiaGoverningDocuments.length} documents
              <span className="block text-xs font-medium text-white/80">ZIP file, {ZIP_SIZE_LABEL}</span>
            </span>
          </a>
        </div>

        <div className="mt-6 grid gap-x-8 gap-y-5 border-t border-acadia-moss/20 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {documentGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-bold text-acadia-ink">{group.title}</h3>
              <ul className="mt-2 space-y-2">
                {group.ids.map((id) => {
                  const doc = documentsById.get(id);
                  if (!doc) return null;
                  return (
                    <li key={id}>
                      <a
                        href={doc.href}
                        download={fileNameFromHref(doc.href)}
                        className="text-sm leading-6 text-acadia-leaf underline decoration-acadia-moss/50 underline-offset-4 hover:text-acadia-ink"
                      >
                        {doc.title}
                      </a>
                      <span className="ml-1 text-xs text-slate-500">{doc.fileType}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-6 rounded-lg border border-acadia-moss/25 bg-acadia-cream px-4 py-3 text-sm leading-6 text-slate-700">
          <strong className="text-acadia-ink">About rules and regulations:</strong> Acadia Estates
          does not have a separate, adopted Rules and Regulations document yet. The board is
          reviewing whether one is needed. Follow that work on the{" "}
          <a
            href="/Acadia/projects/bylaw-review"
            className="font-bold text-acadia-leaf underline decoration-acadia-moss/50 underline-offset-4 hover:text-acadia-ink"
          >
            governing document review
          </a>{" "}
          page. The older{" "}
          <a
            href="/acadia-documents/acadia-estates-community-reminders.docx"
            download
            className="font-bold text-acadia-leaf underline decoration-acadia-moss/50 underline-offset-4 hover:text-acadia-ink"
          >
            Homeowner Reminders
          </a>{" "}
          sheet is also available. Parts of it are still under review, so it is not binding.
        </p>
      </div>
    </section>
  );
}
