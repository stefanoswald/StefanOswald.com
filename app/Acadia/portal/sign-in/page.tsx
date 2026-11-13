import Link from "next/link";
import { redirect } from "next/navigation";
import { Flash } from "@/components/acadia/portal-app/parts";
import { getPortalState, LINK_DAYS } from "@/lib/acadia-portal/auth";

export const metadata = {
  title: "Owner Sign-in | Acadia Estates HOA",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default async function PortalSignInPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const state = await getPortalState();
  if (state.status === "signed_in") redirect(state.viewer.homeId !== null ? "/Acadia/portal/home" : "/Acadia/portal/board");

  return (
    <main className="min-h-screen bg-acadia-cream">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">Owner portal</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-acadia-ink">Sign in</h1>

        <div className="mt-6">
          <Flash ok={ok} error={error} />
        </div>

        {state.status === "unconfigured" ? (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-5">
            <h2 className="text-lg font-bold text-amber-950">The owner portal is not turned on yet</h2>
            <p className="mt-2 text-sm leading-6 text-amber-950">
              The board is still setting it up. Until then, you can try the preview with sample data.
            </p>
          </div>
        ) : null}

        {state.status === "offline" ? (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-5">
            <h2 className="text-lg font-bold text-amber-950">The records server is not answering right now</h2>
            <p className="mt-2 text-sm leading-6 text-amber-950">
              Your records are safe. Please try again in a few minutes. If this keeps happening, tell a board member.
            </p>
          </div>
        ) : null}

        <div className="mt-6 rounded-xl border border-acadia-moss/20 bg-white p-6">
          <h2 className="text-lg font-bold text-acadia-ink">How sign-in works</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-base leading-7 text-slate-700">
            <li>A board member sends you a private sign-in link.</li>
            <li>Open the link on your phone or computer and press the sign-in button.</li>
            <li>You stay signed in on that device for 30 days.</li>
          </ol>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            There is no password to remember. Each link works one time and expires after {LINK_DAYS} days. If your link has
            been used or has expired, ask a board member for a new one.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
          <Link href="/Acadia/portal" className="text-acadia-leaf underline">
            Try the preview with sample data
          </Link>
          <Link href="/Acadia/portal/setup" className="text-slate-600 underline">
            Board setup
          </Link>
        </div>
      </div>
    </main>
  );
}
