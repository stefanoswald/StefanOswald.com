import Link from "next/link";
import { site } from "@/lib/myperson/site";
import { VideoCard } from "./VideoCard";
import { Wordmark } from "./Wordmark";

function Headline() {
  const { headline, emphasis } = site.hero;
  const at = headline.indexOf(emphasis);
  if (at < 0) return <>{headline}</>;
  return (
    <>
      {headline.slice(0, at)}
      <em className="text-mp-ember">{emphasis}</em>
      {headline.slice(at + emphasis.length)}
    </>
  );
}

export function Hero() {
  return (
    <section className="pt-[calc(env(safe-area-inset-top)+18px)]">
      <div className="shell flex justify-center">
        <Wordmark asLink={false} />
      </div>

      <div className="shell mt-8 text-center">
        <h1 className="rise text-[clamp(2.3rem,10vw,3.1rem)]">
          <Headline />
        </h1>
        <p className="rise rise-1 mx-auto mt-4 max-w-[34ch] text-[1.05rem] text-mp-sage">{site.hero.subheading}</p>
      </div>

      <div className="rise rise-2">
        <VideoCard />
      </div>

      <div className="shell rise rise-3 mt-7 grid gap-3">
        <Link href={`${site.path}/q`} className="btn btn-primary text-[1.05rem]">
          {site.cta.button}
        </Link>
        <p className="mt-1 text-center text-sm text-mp-sage">{site.cta.note}</p>
      </div>
    </section>
  );
}
