import Link from "next/link";
import { SavingsCalculator } from "@/components/acadia/SavingsCalculator";
import { StatusBadge } from "@/components/StatusBadge";
import { VoteButtons } from "@/components/VoteButtons";
import { getAcadiaProject } from "@/data/acadiaProjects";
import {
  BUDGET_SOURCE,
  PAYHOA_PRICING_URL,
  PAYHOA_REVIEWED,
  PROCESSOR_PRICING_URL,
  PROCESSOR_REVIEWED,
  SAVINGS_REVIEWED,
  acadiaBudget,
  dutyMap,
  floridaNotes,
  otherSavings,
  payhoaFees,
  payhoaPlanForHomes,
  portalRunningCostEstimate,
  processorBankFee,
  processorCardFee,
  processorFees,
  safeguards,
  savingsOpenQuestions,
  savingsProposals
} from "@/data/acadiaSavingsPlan";

export const metadata = {
  title: "Savings Plan | Acadia Estates HOA",
  description:
    "Board proposals to lower Acadia Estates operating costs: an owner portal built into this site in place of a management company, attorney review of AI-prepared documents, and CPA verification of AI-prepared tax work."
};

const voteProjects = ["self-management-software", "professional-review-model"]
  .map((projectId) => getAcadiaProject(projectId))
  .filter((project): project is NonNullable<typeof project> => Boolean(project));

const wholeDollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// The headline comparison: what the budget lists for the management company against the two
// software paths. Acadia's own portal is the plan shown on this site. PayHOA is the benchmark.
const acadiaPlan = payhoaPlanForHomes(acadiaBudget.homes);
const payhoaPerYear = acadiaPlan ? acadiaPlan.annualBillingMonthly * 12 : 0;
const managementPerYear = acadiaBudget.proposed2027.managementCompanyTotal;
const quarterlyDues = acadiaBudget.proposed2027.quarterlyDues;
const ownPortalDifference = managementPerYear - portalRunningCostEstimate;
const payhoaDifference = managementPerYear - payhoaPerYear;

const glanceStats = [
  { value: String(acadiaBudget.homes), label: "homes in Acadia Estates" },
  { value: wholeDollars.format(managementPerYear), label: "budgeted for the management company in 2027" },
  {
    value: `About ${wholeDollars.format(portalRunningCostEstimate)}`,
    label: "a year to run Acadia's own portal. This is an estimate."
  },
  { value: wholeDollars.format(payhoaPerYear), label: "a year for PayHOA, the off-the-shelf option" }
];

export default function AcadiaSavingsPage() {
  return (
    <main className="min-h-screen bg-acadia-cream">
      <section className="bg-acadia-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-acadia-gold">Savings plan</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Pay for judgment. Let software do the busy work.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
            Three proposals would change how Acadia Estates pays for management, legal work, and tax
            work. The idea is simple. Software and AI tools handle routine preparation. Licensed
            professionals review the result and stand behind it.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-md bg-acadia-gold px-3 py-1.5 font-bold text-acadia-ink">
              Proposals only. Nothing on this page has been approved.
            </span>
            <span className="text-white/65">Reviewed {SAVINGS_REVIEWED}</span>
          </div>
        </div>
      </section>

      <section className="border-b border-acadia-moss/20 bg-white" aria-labelledby="glance-title">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <h2 id="glance-title" className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">
            The numbers at a glance
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {glanceStats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-acadia-moss/20 bg-acadia-cream p-4">
                <dd className="text-3xl font-bold tracking-tight text-acadia-ink">{stat.value}</dd>
                <dt className="mt-1 text-sm leading-6 text-slate-700">{stat.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-4 max-w-4xl leading-7 text-slate-700">
            Either software path costs far less than the management company line. The difference is
            about {wholeDollars.format(payhoaDifference)} to {wholeDollars.format(ownPortalDifference)} a year,
            or roughly {wholeDollars.format(payhoaDifference / acadiaBudget.homes)} to{" "}
            {wholeDollars.format(ownPortalDifference / acadiaBudget.homes)} per home.
          </p>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
            The management figure is the company&apos;s $200 monthly fee plus the postage, printing,
            supplies, and other admin charges billed through it. Some of those costs would remain
            after a change. Online payment fees would be extra if the association chose to absorb
            them, and volunteer time is not counted. Source: {BUDGET_SOURCE}. The budget was
            scheduled for a vote on November 12, 2026.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="proposals-title">
        <h2 id="proposals-title" className="text-2xl font-bold text-acadia-ink">
          The three proposals
        </h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {savingsProposals.map((proposal) => (
            <article key={proposal.number} className="flex flex-col rounded-lg border border-acadia-moss/20 bg-white p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-acadia-leaf text-base font-bold text-white">
                  {proposal.number}
                </span>
                <StatusBadge status="Proposed" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-acadia-ink">{proposal.title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-700">{proposal.summary}</p>
              <p className="mt-3 rounded-md bg-acadia-sky px-3 py-2 text-sm leading-6 text-acadia-ink">
                <strong className="block">In the budget today</strong>
                {proposal.budgetLine}
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                {proposal.howItWorks.map((step) => (
                  <li key={step} className="flex gap-2">
                    <CheckIcon />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 space-y-3 border-t border-acadia-moss/15 pt-4 text-sm leading-6">
                <p className="text-slate-700">
                  <strong className="block text-acadia-ink">What the HOA still pays for</strong>
                  {proposal.stillPayFor}
                </p>
                <p className="rounded-md bg-amber-50 px-3 py-2 text-amber-900">
                  <strong className="block">Watch for</strong>
                  {proposal.watchFor}
                </p>
              </div>
              <Link
                href={`/Acadia/projects/${proposal.projectId}`}
                className="mt-5 block rounded-md border border-acadia-leaf px-4 py-3 text-center font-bold text-acadia-leaf transition hover:bg-acadia-leaf hover:text-white"
              >
                Open the full record
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-acadia-moss/20 bg-white" aria-labelledby="software-title">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">Build or buy</p>
          <h2 id="software-title" className="mt-2 text-2xl font-bold text-acadia-ink">
            Two ways to get the software
          </h2>
          <p className="mt-2 max-w-3xl leading-7 text-slate-700">
            The plan shown on this site is a portal built for Acadia Estates and run on this site.
            PayHOA is the off-the-shelf product it is measured against. Both cost far less than a
            management company.
          </p>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <article className="rounded-lg border-2 border-acadia-leaf bg-acadia-cream p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-acadia-ink">Acadia&apos;s own portal</h3>
                <span className="rounded-md bg-acadia-leaf px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Shown in the preview
                </span>
              </div>
              <p className="mt-3 leading-7 text-slate-700">
                Built into this site and shaped around how Acadia works. Owners sign in here. A
                licensed payment processor moves the money, so card and bank numbers never touch
                this site.
              </p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <Fee term="Subscription" detail="None" />
                <Fee term="Running cost" detail={`About $${portalRunningCostEstimate} a year (estimate)`} />
                <Fee
                  term="Bank payment"
                  detail={`${processorFees.bankPercent}%, capped at $${processorFees.bankCap}`}
                />
                <Fee
                  term="Card payment"
                  detail={`${processorFees.cardPercent}% plus $${processorFees.cardFixed.toFixed(2)}`}
                />
              </dl>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                <li className="flex gap-2">
                  <CheckIcon />
                  <span>Goes beyond the off-the-shelf option: answers from the governing documents with page links, open books for every owner, and AI drafts that wait for attorney or CPA review.</span>
                </li>
                <li className="flex gap-2">
                  <CheckIcon />
                  <span>The association owns its data and can change the portal as needs change.</span>
                </li>
                <li className="flex gap-2">
                  <CheckIcon />
                  <span>On a ${quarterlyDues.toLocaleString("en-US")} quarterly payment, the bank fee would be ${processorBankFee(quarterlyDues).toFixed(2)} and the card fee ${processorCardFee(quarterlyDues).toFixed(2)}.</span>
                </li>
              </ul>
              <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
                <strong className="block">Watch for</strong>
                Volunteers build it and keep it running. The association needs a second person who
                can maintain it, and a written handoff plan.
              </p>
            </article>

            <article className="rounded-lg border border-acadia-moss/25 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-acadia-ink">PayHOA</h3>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-700">
                  Off-the-shelf option
                </span>
              </div>
              <p className="mt-3 leading-7 text-slate-700">
                Subscription software for self-managed associations. Every plan includes every
                feature. There is no contract, no setup fee, and a 30-day free trial.
              </p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <Fee
                  term={`Subscription at ${acadiaBudget.homes} homes`}
                  detail={acadiaPlan ? `$${acadiaPlan.annualBillingMonthly} a month, $${payhoaPerYear} a year` : "Ask for a quote"}
                />
                <Fee term="Month to month" detail={acadiaPlan ? `$${acadiaPlan.monthToMonth} a month` : "Ask for a quote"} />
                <Fee term="Bank payment" detail={`$${payhoaFees.bankPayment.toFixed(2)} flat`} />
                <Fee term="Card payment" detail={`${payhoaFees.cardPercent}% plus $${payhoaFees.cardFixed.toFixed(2)}`} />
              </dl>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                <li className="flex gap-2">
                  <CheckIcon />
                  <span>Ready now, with bank sync, reconciliation, more than 40 reports, and mailed letters.</span>
                </li>
                <li className="flex gap-2">
                  <CheckIcon />
                  <span>The vendor maintains it, so it does not depend on one volunteer.</span>
                </li>
                <li className="flex gap-2">
                  <CheckIcon />
                  <span>Its flat bank fee is lower than the processor fee on a payment of Acadia&apos;s size.</span>
                </li>
              </ul>
              <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
                <strong className="block">Watch for</strong>
                Its AI add-on is turned on by default and becomes a paid extra after three months,
                about ${payhoaFees.aiAddOnMonthlySmallestPlan.toFixed(2)} a month on the smallest plan,
                unless it is turned off.
              </p>
            </article>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/Acadia/portal"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-acadia-leaf px-5 py-3 font-bold text-white shadow-soft transition hover:bg-acadia-ink"
            >
              Try the owner portal preview
            </Link>
            <Link
              href="/Acadia/portal#compare"
              className="text-sm font-bold text-acadia-leaf underline underline-offset-4 hover:text-acadia-ink"
            >
              See the feature-by-feature comparison
            </Link>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            PayHOA prices read from{" "}
            <a href={PAYHOA_PRICING_URL} target="_blank" rel="noreferrer" className="font-bold text-acadia-leaf underline underline-offset-4">
              PayHOA&apos;s pricing page
            </a>{" "}
            on {PAYHOA_REVIEWED}. Processor rates are{" "}
            <a href={PROCESSOR_PRICING_URL} target="_blank" rel="noreferrer" className="font-bold text-acadia-leaf underline underline-offset-4">
              Stripe&apos;s published US rates
            </a>{" "}
            as of {PROCESSOR_REVIEWED}. The portal running cost is a planning estimate for the AI
            helper, email, and hosting. No quote or contract is on file for either path.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="calculator-title">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">Run the numbers</p>
        <h2 id="calculator-title" className="mt-2 text-2xl font-bold text-acadia-ink">
          Savings calculator
        </h2>
        <p className="mt-2 max-w-3xl leading-7 text-slate-700">
          The boxes start with Acadia&apos;s figures from the proposed 2027 budget. Switch between
          Acadia&apos;s own portal and PayHOA to compare them. The attorney and CPA boxes under the
          proposals stay empty until a review-only quote comes in, so no savings are counted for
          them yet. Nothing you enter is saved or sent anywhere.
        </p>
        <div className="mt-6">
          <SavingsCalculator
            start={{
              homes: acadiaBudget.homes,
              managementPerYear: acadiaBudget.proposed2027.managementCompanyTotal,
              attorneyPerYear: acadiaBudget.proposed2027.legalFees,
              cpaPerYear: acadiaBudget.proposed2027.taxPreparation,
              paymentsPerYear: acadiaBudget.duesPaymentsPerYear,
              duesPerPayment: acadiaBudget.proposed2027.quarterlyDues
            }}
          />
        </div>
      </section>

      <section className="border-y border-acadia-moss/20 bg-white" aria-labelledby="duties-title">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">Who does what</p>
          <h2 id="duties-title" className="mt-2 text-2xl font-bold text-acadia-ink">
            Every duty needs a new home
          </h2>
          <p className="mt-2 max-w-3xl leading-7 text-slate-700">
            Ending a management contract does not end the work. This table shows where each duty
            would go. The first column shows who usually handles it under professional management.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-acadia-moss/30 text-xs uppercase tracking-wide text-slate-500">
                  <th scope="col" className="py-2 pr-4 font-bold">Duty</th>
                  <th scope="col" className="py-2 pr-4 font-bold">Under management</th>
                  <th scope="col" className="py-2 font-bold">Under the proposals</th>
                </tr>
              </thead>
              <tbody>
                {dutyMap.map((row) => (
                  <tr key={row.duty} className="border-b border-acadia-moss/15 align-top">
                    <th scope="row" className="py-3 pr-4 font-bold text-acadia-ink">{row.duty}</th>
                    <td className="py-3 pr-4 text-slate-600">{row.underManagement}</td>
                    <td className="py-3 leading-6 text-slate-700">{row.proposed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="safeguards-title">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">Safeguards</p>
        <h2 id="safeguards-title" className="mt-2 text-2xl font-bold text-acadia-ink">
          Lower cost should not mean lower care
        </h2>
        <p className="mt-2 max-w-3xl leading-7 text-slate-700">
          These controls are part of the proposals. They would need to be in place before any
          change takes effect.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safeguards.map((item) => (
            <div key={item.title} className="rounded-lg border border-acadia-moss/20 bg-white p-5">
              <h3 className="font-bold text-acadia-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-acadia-moss/20 bg-acadia-sky" aria-labelledby="rules-title">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">Checked at the source</p>
          <h2 id="rules-title" className="mt-2 text-2xl font-bold text-acadia-ink">
            What the rules say
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {floridaNotes.map((note) => (
              <article key={note.title} className="rounded-lg border border-acadia-moss/20 bg-white p-5">
                <h3 className="font-bold text-acadia-ink">{note.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{note.text}</p>
                <a
                  href={note.sourceHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-bold text-acadia-leaf underline decoration-acadia-moss/50 underline-offset-4 hover:text-acadia-ink"
                >
                  {note.sourceLabel}
                </a>
              </article>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">
            These are plain-language summaries for homeowners. They are not legal or tax advice.
            Each point should be confirmed with the association&apos;s attorney and CPA before any
            vote.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
        <div aria-labelledby="other-title">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">Also under review</p>
          <h2 id="other-title" className="mt-2 text-2xl font-bold text-acadia-ink">
            Other ways the board is looking to save
          </h2>
          <div className="mt-5 divide-y divide-acadia-moss/20 border-y border-acadia-moss/20">
            {otherSavings.map((item) => {
              const project = getAcadiaProject(item.projectId);
              if (!project) return null;
              return (
                <Link
                  key={item.projectId}
                  href={`/Acadia/projects/${item.projectId}`}
                  className="grid gap-2 py-4 transition hover:bg-white sm:grid-cols-[180px_1fr_auto] sm:items-center sm:gap-5 sm:px-3"
                >
                  <span className="font-bold text-acadia-ink">{item.title}</span>
                  <span className="text-sm leading-6 text-slate-700">{item.note}</span>
                  <StatusBadge status={project.status} />
                </Link>
              );
            })}
          </div>

          <div className="mt-8 rounded-lg border border-amber-300 bg-amber-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">Pending confirmation</p>
            <h2 className="mt-2 text-xl font-bold text-acadia-ink">What still needs an answer</h2>
            <ul className="mt-4 space-y-3 text-base leading-7 text-slate-700">
              {savingsOpenQuestions.map((question) => (
                <li key={question} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 bg-amber-500" />
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="h-fit space-y-5">
          <div className="rounded-lg border border-acadia-moss/20 bg-white p-5 shadow-soft">
            <h2 className="text-xl font-bold text-acadia-ink">Tell the board what you think</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Votes are informal feedback. Totals are public. House numbers are stored privately
              only to prevent duplicate votes.
            </p>
          </div>
          {voteProjects.map((project) => (
            <div key={project.id} className="rounded-lg border border-acadia-moss/20 bg-white p-5 shadow-soft">
              <h3 className="font-bold text-acadia-ink">{project.title}</h3>
              <div className="mt-4">
                <VoteButtons projectId={project.id} projectTitle={project.title} compact />
              </div>
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}

function Fee({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="rounded-md border border-acadia-moss/20 bg-acadia-cream px-3 py-2">
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{term}</dt>
      <dd className="mt-0.5 font-bold text-acadia-ink">{detail}</dd>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0 text-acadia-leaf" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
    </svg>
  );
}
