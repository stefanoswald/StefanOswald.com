import Link from "next/link";
import { SetupForm } from "@/components/acadia/portal-app/SetupForm";
import { isPortalConfigured } from "@/lib/acadia-portal/db";

export const metadata = {
  title: "Board Setup | Acadia Estates HOA",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

export default function PortalSetupPage() {
  const ready = isPortalConfigured() && (process.env.ACADIA_ADMIN_KEY || "").length >= 24;

  return (
    <main className="min-h-screen bg-acadia-cream">
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">Owner portal</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-acadia-ink">Board setup</h1>
        <p className="mt-3 text-base leading-7 text-slate-700">
          This page is for board members. It is how the first board member gets in. It is also the way back in if
          every board member loses access. Owners do not need this page.
        </p>

        <div className="mt-6 rounded-xl border border-acadia-moss/20 bg-white p-6">
          {ready ? (
            <SetupForm />
          ) : (
            <p className="text-sm leading-6 text-slate-700">
              Setup is not available yet. The site needs three settings on Vercel first: ACADIA_DATA_URL,
              ACADIA_DATA_KEY, and ACADIA_ADMIN_KEY. The steps are in services/acadia-data/README.md.
            </p>
          )}
        </div>

        <Link href="/Acadia/portal/sign-in" className="mt-6 inline-block text-sm font-bold text-acadia-leaf underline">
          Back to sign-in
        </Link>
      </div>
    </main>
  );
}
