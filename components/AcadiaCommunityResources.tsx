const resources = [
  {
    title: "Project source documents",
    description:
      "Read the public copies of project updates, agendas, estimates, and professional assessments, along with an exact log of the limited privacy redactions made to each file.",
    href: "/Acadia/documents",
    linkText: "Open the transparency library"
  },
  {
    title: "Curbside collection and bulk pickup",
    description:
      "Osceola County says eligible unincorporated addresses receive weekly bulk collection on the regular garbage day, generally up to three cubic yards. Appliances require separate scheduling. Confirm the service day for your address before placing items outside.",
    href: "https://www.osceola.org/My-Property/Waste-and-Recycling/Curbside-Collection-Services",
    linkText: "Check county collection guidance"
  },
  {
    title: "Contractor and vendor recommendations",
    description:
      "Neighbor recommendations can be useful leads, but they are not HOA endorsements. Verify a provider's current price, license, insurance, and scope directly before hiring.",
    href: "https://www.myfloridalicense.com/wl11.asp?SID=%00&mode=0",
    linkText: "Verify a Florida license"
  },
  {
    title: "Homeowner conversation",
    description:
      "The private Facebook group is the place for informal neighbor discussion. Project status and board decisions remain on this site so conversation is not mistaken for an official action.",
    href: "https://www.facebook.com/groups/862140876886038/",
    linkText: "Visit the homeowner Facebook group"
  }
];

export function AcadiaCommunityResources() {
  return (
    <section className="border-t border-acadia-moss/20 bg-white" aria-labelledby="resources-title">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">
          Neighbor resources
        </p>
        <h2 id="resources-title" className="mt-2 text-2xl font-bold text-acadia-ink">
          Useful information, checked at the source
        </h2>
        <div className="mt-6 divide-y divide-acadia-moss/20 border-y border-acadia-moss/20">
          {resources.map((resource) => (
            <article
              key={resource.title}
              className="grid gap-3 py-5 md:grid-cols-[minmax(180px,0.65fr)_1.35fr_auto] md:items-center md:gap-6"
            >
              <h3 className="font-bold text-acadia-ink">{resource.title}</h3>
              <p className="text-sm leading-6 text-slate-700">{resource.description}</p>
              <a
                href={resource.href}
                target={resource.href.startsWith("/") ? undefined : "_blank"}
                rel={resource.href.startsWith("/") ? undefined : "noreferrer"}
                className="font-bold text-acadia-leaf underline decoration-acadia-moss/50 underline-offset-4 hover:text-acadia-ink"
              >
                {resource.linkText}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
