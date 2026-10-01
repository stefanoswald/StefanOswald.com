import Image from "next/image";
import { site } from "@/lib/myperson/site";
import { SocialLinks } from "./SocialLinks";

function Monogram() {
  const initials = site.person.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
  return (
    <span
      aria-hidden
      className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-mp-felt font-mp-display text-xl text-mp-mist"
    >
      {initials}
    </span>
  );
}

export function About() {
  const { about, person } = site;
  return (
    <section className="shell mt-14" id="about">
      <div className="card p-6">
        <div className="flex items-center gap-4">
          {about.photo ? (
            <Image
              src={about.photo}
              unoptimized
              alt={person.fullName}
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-full object-cover"
            />
          ) : (
            <Monogram />
          )}
          <div>
            <h2 className="text-[1.6rem] leading-tight">{person.fullName}</h2>
            <p className="text-sm text-mp-ink-muted">{person.location}</p>
          </div>
        </div>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {about.roles.map((role) => (
            <li
              key={role}
              className="rounded-mp-pill border border-mp-cream-3 bg-mp-cream-2 px-3 py-1 text-[0.8rem] font-semibold text-mp-ink-muted"
            >
              {role}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-mp-ink">{about.blurb}</p>

        {about.funFacts.length ? (
          <ul className="mt-5 grid gap-1.5 border-t border-mp-cream-3 pt-4 text-sm text-mp-ink-muted">
            {about.funFacts.map((fact) => (
              <li key={fact} className="flex gap-2">
                <span aria-hidden className="text-mp-heart">
                  ♥
                </span>
                {fact}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-6 border-t border-mp-cream-3 pt-5">
          {about.handleNote ? <p className="mb-3 text-center text-sm text-mp-ink-muted">{about.handleNote}</p> : null}
          <SocialLinks tone="card" showHandles={false} />
        </div>
      </div>
    </section>
  );
}
