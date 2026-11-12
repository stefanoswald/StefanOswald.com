import Link from "next/link";

const siteLinks = [
  { href: "/Acadia", label: "Community priorities" },
  { href: "/Acadia/savings", label: "Savings plan" },
  { href: "/Acadia/portal", label: "Owner portal preview" },
  { href: "/Acadia/documents", label: "Source documents" },
  { href: "/Acadia#governing-documents", label: "Governing documents" }
];

export function AcadiaFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#10241f] text-white/70 print:hidden">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr_1.2fr] lg:px-8">
        <div>
          <p className="text-base font-bold text-white">Acadia Estates Homeowners Association</p>
          <p className="mt-2 text-sm leading-6">
            A homeowner information site for Acadia Estates in Kissimmee, Florida. Project facts and
            board decisions are posted here so neighbors can check them at the source.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-gold">On this site</p>
          <ul className="mt-3 space-y-2 text-sm">
            {siteLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="underline decoration-white/25 underline-offset-4 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-gold">Good to know</p>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            <li>Votes on this site are informal feedback. They are not a binding election.</li>
            <li>The document helper gives information, not legal advice.</li>
            <li>The owner portal is a preview with sample data. It takes no payments.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
