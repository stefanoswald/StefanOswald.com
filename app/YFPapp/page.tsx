import type { ReactNode } from "react";

export const metadata = {
  title: "YFP Privacy Policy",
  description:
    "How YFP — Your Fullest Potential, the twenty-sided die for your day — handles your data. Everything stays on your phone except the Life Coach."
};

const EFFECTIVE = "17 September 2026";

const STAYS = [
  "Every side you roll, and when",
  "Your ideal day, and how it actually went",
  "Workouts: sets, reps, loads, notes",
  "Body weight, body fat, energy, pain",
  "Your food log and your journal",
  "Sleep, resting heart rate and HRV read from Apple Health",
  "Today's calendar events",
  "Everything under Tools — values, North Star, dreamline, quests, needs, rules, year plan, 80/20 audit, abundance, eulogy, habits"
];

const LEAVES = [
  "What you type to the Life Coach",
  "The rest of that conversation",
  "A seven-day summary of the data on the left, sent with every Life Coach message",
  "Anything you export and hand to someone yourself"
];

const NOT_DONE: Array<[string, string]> = [
  ["Accounts, sign-in, passwords", "none"],
  ["Analytics, telemetry, crash reporting", "none"],
  ["Advertising, ad identifiers, tracking", "none"],
  ["Third-party SDKs of any kind", "none"],
  ["Location", "never requested"],
  ["Camera, photos, microphone, contacts", "never requested"],
  ["Selling or sharing your data", "never"],
  ["Profiling you for anyone", "never"]
];

const CONTROLS: Array<[string, string]> = [
  ["See everything YFP holds", "Setup → Export"],
  ["Take it with you", "Export, then share the file"],
  ["Delete everything", "delete the app"],
  ["Stop reading Health", "Setup, or iOS Settings"],
  ["Stop reading Calendar", "Setup, or iOS Settings"],
  ["Stop watching for calls", "Setup"],
  ["Send nothing to any model", "don't use the Life Coach tab"]
];

function Clause({
  n,
  title,
  chip,
  children
}: {
  n: string;
  title: string;
  chip?: "optional" | "network";
  children: ReactNode;
}) {
  return (
    <section className="border-t border-white/10 py-9">
      <h2 className="flex flex-wrap items-baseline gap-x-3 gap-y-2 text-2xl font-semibold tracking-tight text-white">
        <span className="pt-1 font-mono text-xs font-medium tracking-wide text-[#9478FA]">{n}</span>
        <span>{title}</span>
        {chip === "optional" ? (
          <span className="rounded bg-[#10241D] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[#5ED6A0]">
            optional
          </span>
        ) : null}
        {chip === "network" ? (
          <span className="rounded bg-[#261C0E] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[#F2B457]">
            network
          </span>
        ) : null}
      </h2>
      <div className="mt-3 space-y-4 text-[0.975rem] leading-7 text-[#C8C6D8] sm:pl-11">{children}</div>
    </section>
  );
}

function Board({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="max-w-xl overflow-hidden rounded-md border border-white/10 bg-white/[0.04]">
      {rows.map(([what, how], index) => (
        <div
          key={what}
          className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-2.5 text-[0.92rem] ${
            index === 0 ? "" : "border-t border-white/10"
          }`}
        >
          <span className="text-white">{what}</span>
          <span className="font-mono text-[0.72rem] tracking-wide text-[#918FA8]">{how}</span>
        </div>
      ))}
    </div>
  );
}

export default function YFPPrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0E0E1A] antialiased">
      <div className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        <header className="border-b border-white/10 pb-9 pt-14">
          <div className="mb-7 flex items-center gap-3">
            <svg viewBox="0 0 40 40" aria-hidden="true" className="h-8 w-8 shrink-0">
              <polygon
                points="20,2 37,12 37,28 20,38 3,28 3,12"
                fill="none"
                stroke="#9478FA"
                strokeWidth="1.6"
              />
              <polygon points="20,10 29,15.5 29,26 20,31 11,26 11,15.5" fill="#9478FA" opacity="0.16" />
              <path
                d="M20 2 L20 10 M37 12 L29 15.5 M37 28 L29 26 M20 38 L20 31 M3 28 L11 26 M3 12 L11 15.5"
                stroke="#9478FA"
                strokeWidth="1"
                opacity="0.5"
              />
              <polygon
                points="20,10 29,15.5 29,26 20,31 11,26 11,15.5"
                fill="none"
                stroke="#9478FA"
                strokeWidth="1.2"
              />
            </svg>
            <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[#918FA8]">
              YFP · Your Fullest Potential
            </p>
          </div>

          <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl">
            Your day stays <em className="font-normal italic text-[#9478FA]">on your phone</em>.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#C8C6D8]">
            YFP has no account to sign into, no server of mine to sign into, and nothing it phones
            home about. There is exactly one feature that sends anything anywhere, and this page is
            mostly about that one.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-1 font-mono text-[0.72rem] tracking-wide text-[#918FA8]">
            <span>
              <b className="font-medium text-[#C8C6D8]">Effective</b> {EFFECTIVE}
            </span>
            <span>
              <b className="font-medium text-[#C8C6D8]">Applies to</b> YFP for iPhone
            </span>
            <span>
              <b className="font-medium text-[#C8C6D8]">Version</b> 1.0
            </span>
          </div>
        </header>

        <div className="my-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-white/10 bg-white/[0.04] p-5">
            <h2 className="flex items-baseline gap-2 border-b border-white/10 pb-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[#5ED6A0]">
              Never leaves your phone
              <span className="ml-auto text-[0.66rem] normal-case tracking-wide text-[#918FA8]">
                by default
              </span>
            </h2>
            <ul className="mt-3 space-y-1.5">
              {STAYS.map((item) => (
                <li key={item} className="grid grid-cols-[9px_1fr] gap-2.5 text-[0.9rem] leading-6 text-[#C8C6D8]">
                  <span className="mt-[9px] h-[7px] w-[7px] rounded-sm bg-[#5ED6A0]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-dashed border-white/10 pt-3 text-[0.84rem] text-[#918FA8]">
              One file inside the app's own storage. Delete the app and it is gone.
            </p>
          </div>

          <div className="rounded-md border border-white/10 bg-white/[0.04] p-5">
            <h2 className="flex items-baseline gap-2 border-b border-white/10 pb-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[#F2B457]">
              Leaves your phone
              <span className="ml-auto text-[0.66rem] normal-case tracking-wide text-[#918FA8]">
                only if you use it
              </span>
            </h2>
            <ul className="mt-3 space-y-1.5">
              {LEAVES.map((item) => (
                <li key={item} className="grid grid-cols-[9px_1fr] gap-2.5 text-[0.9rem] leading-6 text-[#C8C6D8]">
                  <span className="mt-[9px] h-[7px] w-[7px] rounded-sm bg-[#F2B457]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-dashed border-white/10 pt-3 text-[0.84rem] text-[#918FA8]">
              Goes to OpenRouter and the model's provider. Never to a server I run — I don't run one.
            </p>
          </div>
        </div>

        <Clause n="01" title="Who this is">
          <p className="text-white">
            YFP — Your Fullest Potential — is an iPhone app written by Stefan Oswald. It is a
            twenty-sided die for your day and a companion to the book of the same name. It is a
            one-person project: there is no company behind it, no staff, and no back end.
          </p>
          <p>
            "I" and "me" below mean Stefan. "You" means whoever is holding the phone.
          </p>
        </Clause>

        <Clause n="02" title="What YFP stores, and where">
          <p className="text-white">
            Everything YFP knows about you lives in a single file inside the app's own sandbox on
            your iPhone. iOS keeps that file private to the app. No part of it is uploaded, synced,
            mirrored or backed up to anything of mine.
          </p>
          <p>
            That includes your rolls, your ideal day, your training sessions and every number in
            them, your food log, your journal, your rewards, and every word you write in the Tools
            tab.
          </p>
          <p>
            <strong className="font-semibold text-white">Deleting the app deletes all of it.</strong>{" "}
            There is no copy anywhere else, which also means I cannot restore it for you — if you
            want to keep it, export it first (Setup → Export).
          </p>
          <p>
            If your iPhone backs itself up to iCloud or to a computer, that file rides along inside
            the backup, encrypted and handled under{" "}
            <a
              className="text-[#9478FA] underline underline-offset-2"
              href="https://www.apple.com/legal/privacy/"
              rel="noopener"
            >
              Apple's privacy policy
            </a>
            , not mine. I have no access to your backups.
          </p>
        </Clause>

        <Clause n="03" title="Apple Health" chip="optional">
          <p className="text-white">
            Off until you turn it on in Setup. When it is on, YFP reads three things and writes
            nothing:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong className="font-semibold text-white">Sleep analysis</strong> — so the die can
              log last night's sleep for you instead of you doing it by hand, and so the app can work
              out a sleep score.
            </li>
            <li>
              <strong className="font-semibold text-white">Resting heart rate</strong> and{" "}
              <strong className="font-semibold text-white">heart rate variability</strong> — compared
              against your own recent baseline, so training eases off on the days your body is
              telling you it is fighting something.
            </li>
          </ul>
          <p>
            YFP never writes to Health. iOS asks for write permission anyway, because of how the
            permission sheet works; you can decline that half and everything still works.
          </p>
          <p>
            These numbers stay on the phone like everything else — except that a sleep score can
            appear in the seven-day summary the Life Coach sees, if you use it. Clause 06 covers
            that.
          </p>
          <p>
            Turn it off any time in Setup, or revoke it outright in{" "}
            <strong className="font-semibold text-white">
              iOS Settings → Privacy &amp; Security → Health → YFP
            </strong>
            .
          </p>
        </Clause>

        <Clause n="04" title="Calendar" chip="optional">
          <p className="text-white">
            Off until you turn it on. Read-only. YFP reads today's events so your ideal day can bend
            around the meetings that are actually in it rather than pretending they aren't.
          </p>
          <p>
            Nothing is written back to your calendar, and nothing is stored beyond what is needed to
            draw today's plan. Revoke it in{" "}
            <strong className="font-semibold text-white">
              iOS Settings → Privacy &amp; Security → Calendars
            </strong>
            .
          </p>
        </Clause>

        <Clause n="05" title="Phone calls" chip="optional">
          <p className="text-white">
            Off until you turn it on. When it is on, YFP asks iOS to tell it one bit of information:
            whether a call is in progress. That is how the die can flip itself to "Making calls" when
            you pick up, and flip back when you hang up.
          </p>
          <p>
            It gets{" "}
            <strong className="font-semibold text-white">
              no number, no name, no contents, and no call history
            </strong>
            . iOS does not offer those to an app doing this, and YFP does not ask for them.
          </p>
        </Clause>

        <Clause n="06" title="The Life Coach — the one thing that leaves" chip="network">
          <p className="text-white">
            The Life Coach tab talks to a large language model over the internet. This is the only part of
            YFP that sends your data anywhere, and it only does so when you send a message.
          </p>
          <p>
            <strong className="font-semibold text-white">What is sent, on every Life Coach message:</strong>
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>The message you just typed.</li>
            <li>The conversation so far in that tab.</li>
            <li>
              A <strong className="font-semibold text-white">seven-day export of your YFP data</strong>{" "}
              — your day log, your training sessions and their numbers, your food log, your sleep
              score, your standing meal targets, and whatever you have filled in under Tools. The
              Life Coach gets this every turn, because a coach that can only see your week on the first
              message of the day spends the rest of the day guessing.
            </li>
          </ul>
          <p>
            <strong className="font-semibold text-white">Where it goes:</strong> straight from your
            phone to{" "}
            <a className="text-[#9478FA] underline underline-offset-2" href="https://openrouter.ai/" rel="noopener">
              OpenRouter
            </a>
            , which routes it to the provider of whichever model is configured. In the beta that is
            GLM 5.3 Flash, served by Z.ai. It does not pass through any machine of mine, and I keep no
            copy of it.
          </p>
          <p>
            What OpenRouter and the model's provider retain is governed by their policies, not by this
            one. Read{" "}
            <a
              className="text-[#9478FA] underline underline-offset-2"
              href="https://openrouter.ai/privacy"
              rel="noopener"
            >
              OpenRouter's privacy policy
            </a>{" "}
            and{" "}
            <a
              className="text-[#9478FA] underline underline-offset-2"
              href="https://openrouter.ai/terms"
              rel="noopener"
            >
              terms
            </a>{" "}
            before you decide how much to tell the Life Coach.
          </p>
          <blockquote className="max-w-xl space-y-3 rounded-r-md border-l-2 border-[#9478FA] bg-[#1E1B38] px-5 py-4">
            <p className="text-[0.95rem] text-white">
              <strong className="font-semibold">The practical rule:</strong> treat the Life Coach the way
              you would treat typing into any AI chat window. Everything else in YFP is as private as
              a notebook in a drawer. The Life Coach is a phone call to a company.
            </p>
            <p className="text-[0.95rem] text-white">
              Never use the Life Coach tab, and nothing about you ever leaves your phone. Every other
              feature works without it.
            </p>
          </blockquote>
          <p>
            <strong className="font-semibold text-white">During the beta I am paying for the model</strong>
            , so testers are not asked for a card or an account. Each tester gets their own
            spend-capped key. That key identifies the key, not the person: it is not tied to your
            name, your email, or your device, and I do not receive your conversations with it — only
            the running cost.
          </p>
          <p>
            YFP also has a second, entirely manual route: Setup → Export gives you a block of text you
            can paste into ChatGPT, Claude, Gemini or anything else. That is you sending your own data
            somewhere, under that service's terms. YFP does not do it for you.
          </p>
        </Clause>

        <Clause n="07" title="What YFP does not do">
          <p className="text-white">This list is as much of the policy as most people need.</p>
          <Board rows={NOT_DONE} />
          <p>YFP contains no code that sends data to me. There is no endpoint to send it to.</p>
        </Clause>

        <Clause n="08" title="Your controls, in one place">
          <Board rows={CONTROLS} />
          <p>
            There is nothing to request from me, because there is nothing held by me. Everything above
            is a switch you already have.
          </p>
        </Clause>

        <Clause n="09" title="Beta testing through TestFlight">
          <p className="text-white">
            While YFP is in beta it is distributed through Apple's TestFlight. Apple — not YFP — shows
            me the email address you joined with, how many times the build was installed, crash
            reports, and any feedback you choose to send from TestFlight itself.
          </p>
          <p>
            That information is collected by Apple under{" "}
            <a
              className="text-[#9478FA] underline underline-offset-2"
              href="https://www.apple.com/legal/privacy/"
              rel="noopener"
            >
              Apple's privacy policy
            </a>{" "}
            and Apple's TestFlight terms. It comes from the distribution channel, not from anything
            inside the app.
          </p>
        </Clause>

        <Clause n="10" title="Children">
          <p className="text-white">
            YFP is not directed at children and is not intended for anyone under 13. I do not
            knowingly collect anything from a child — there is no collection mechanism to do it with.
          </p>
        </Clause>

        <Clause n="11" title="Not medical advice">
          <p className="text-white">
            YFP tracks training, sleep and food, and its Life Coach will have opinions about all three.
            None of it is medical advice, and none of it comes from a clinician. If something hurts,
            or a number worries you, ask a doctor rather than a die.
          </p>
        </Clause>

        <Clause n="12" title="Changes, and how to ask">
          <p className="text-white">
            The effective date at the top of this page is the only version marker. If a change matters
            — if YFP ever starts sending something it doesn't send today — it will be called out in
            the app or in the TestFlight release note, not quietly edited in here.
          </p>
          <p>
            Questions about any of this reach me through{" "}
            <a className="text-[#9478FA] underline underline-offset-2" href="/">
              stefanoswald.com
            </a>
            .
          </p>
        </Clause>

        <footer className="mt-10 max-w-xl space-y-3 border-t border-white/10 pt-7 text-[0.85rem] leading-6 text-[#918FA8]">
          <p>
            YFP — Your Fullest Potential. Written and maintained by Stefan Oswald. Companion to the
            book of the same name.
          </p>
          <p>
            This page describes the app as it ships in the beta dated at the top. It covers the iPhone
            app only, not the rest of this site.
          </p>
        </footer>
      </div>
    </main>
  );
}
