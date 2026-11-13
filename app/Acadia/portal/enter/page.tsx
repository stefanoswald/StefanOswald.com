import { EnterForm } from "@/components/acadia/portal-app/EnterForm";

export const metadata = {
  title: "Sign in | Acadia Estates HOA",
  robots: { index: false, follow: false },
  // Keeps the private link from being passed along if the page ever links out.
  referrer: "no-referrer" as const
};

export default function PortalEnterPage() {
  return (
    <main className="min-h-screen bg-acadia-cream">
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">Owner portal</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-acadia-ink">Welcome to the Acadia Estates owner portal</h1>
        <div className="mt-6 rounded-xl border border-acadia-moss/20 bg-white p-6">
          <EnterForm />
        </div>
      </div>
    </main>
  );
}
