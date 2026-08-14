export function AcadiaTransparencyNotice() {
  return (
    <section className="border-y border-acadia-moss/20 bg-white" aria-labelledby="transparency-title">
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-6 sm:px-6 md:grid-cols-[220px_1fr] lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">
            How updates work
          </p>
          <h2 id="transparency-title" className="mt-2 text-xl font-bold text-acadia-ink">
            Transparent, with context
          </h2>
        </div>
        <div className="grid gap-4 text-sm leading-6 text-slate-700 sm:grid-cols-3">
          <p>
            <strong className="block text-acadia-ink">Facts stay traceable</strong>
            Decisions, estimates, professional opinions, and community feedback are labeled
            separately.
          </p>
          <p>
            <strong className="block text-acadia-ink">Uncertainty stays visible</strong>
            Conflicting or expired information remains marked pending instead of being presented as
            settled.
          </p>
          <p>
            <strong className="block text-acadia-ink">Privacy still matters</strong>
            Source documents and direct community excerpts are published with narrow redactions
            for access codes, private identities, house numbers, direct contacts, and payment data.
          </p>
        </div>
      </div>
    </section>
  );
}
