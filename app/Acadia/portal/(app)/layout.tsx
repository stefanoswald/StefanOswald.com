import type React from "react";
import type { Metadata } from "next";
import { signOutAction } from "@/app/Acadia/portal/actions";
import { PortalNav } from "@/components/acadia/portal-app/PortalNav";
import { getPortalState } from "@/lib/acadia-portal/auth";

export const metadata: Metadata = {
  title: "Owner Portal | Acadia Estates HOA",
  robots: { index: false, follow: false }
};

// These pages show private records. They are built fresh for each signed-in visitor and never cached.
export const dynamic = "force-dynamic";

export default async function PortalAppLayout({ children }: { children: React.ReactNode }) {
  const state = await getPortalState();
  const viewer = state.status === "signed_in" ? state.viewer : null;

  return (
    <main className="min-h-screen bg-acadia-cream">
      {viewer ? (
        <div className="bg-acadia-ink text-white print:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm">
                <span className="font-bold">Owner portal</span>
                <span className="mx-2 text-white/40">|</span>
                {viewer.name}
                {viewer.houseNumber ? <span className="text-white/80">, home {viewer.houseNumber}</span> : null}
                {viewer.isBoard ? <span className="ml-2 rounded bg-acadia-gold px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-acadia-ink">Board</span> : null}
              </p>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-md border border-white/40 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white hover:text-acadia-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold"
                >
                  Sign out
                </button>
              </form>
            </div>
            <PortalNav hasHome={viewer.homeId !== null} isBoard={viewer.isBoard} />
          </div>
        </div>
      ) : null}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
}
