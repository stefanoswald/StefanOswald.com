import { site } from "@/lib/myperson/site";

function TranscriptBody() {
  return (
    <div className="space-y-3 text-[0.95rem] leading-relaxed text-mp-ink">
      {site.transcript.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
      <p className="font-mp-display text-lg italic text-mp-ember-deep">- {site.person.firstName}</p>
    </div>
  );
}

/** Shown under the video, for anyone who can't play sound right now. */
export function TranscriptToggle() {
  return (
    <details className="group mt-3">
      <summary className="link-quiet mx-auto w-fit cursor-pointer list-none text-center text-sm">
        Can&apos;t play sound right now? Read it instead.
      </summary>
      <div className="card card-pip mt-3 p-5 pt-6">
        <TranscriptBody />
      </div>
    </details>
  );
}

/** Shown in place of the video if there is no video file. */
export function ScriptCard() {
  return (
    <div className="card card-pip p-6 pt-8">
      <TranscriptBody />
    </div>
  );
}
