"use client";

import { useId, useState } from "react";
import { payhoaFees, payhoaPlanForHomes } from "@/data/acadiaSavingsPlan";

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function toNumber(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * A what-if calculator. The current HOA costs are left blank on purpose: they are not published on
 * this site yet, so nothing here should look like a real figure until someone types one in.
 * The PayHOA prices are real and come from data/acadiaSavingsPlan.ts.
 */
export function SavingsCalculator() {
  const [homes, setHomes] = useState("");
  const [management, setManagement] = useState("");
  const [attorneyNow, setAttorneyNow] = useState("");
  const [attorneyAfter, setAttorneyAfter] = useState("");
  const [cpaNow, setCpaNow] = useState("");
  const [cpaAfter, setCpaAfter] = useState("");
  const [paymentsPerYear, setPaymentsPerYear] = useState("4");
  const [absorbFees, setAbsorbFees] = useState(false);

  const homeCount = Math.floor(toNumber(homes));
  const plan = homeCount > 0 ? payhoaPlanForHomes(homeCount) : undefined;
  const softwareYearly = plan ? plan.annualBillingMonthly * 12 : 0;
  const feesYearly = absorbFees && homeCount > 0 ? homeCount * Number(paymentsPerYear) * payhoaFees.bankPayment : 0;

  // A blank "after" box means no quote yet, so the cost is assumed to stay the same as today.
  // That keeps the estimate from claiming savings nobody has quoted.
  const attorneyAfterYearly = attorneyAfter.trim() ? toNumber(attorneyAfter) : toNumber(attorneyNow);
  const cpaAfterYearly = cpaAfter.trim() ? toNumber(cpaAfter) : toNumber(cpaNow);

  const currentYearly = toNumber(management) * 12 + toNumber(attorneyNow) + toNumber(cpaNow);
  const proposedYearly = softwareYearly + feesYearly + attorneyAfterYearly + cpaAfterYearly;
  const difference = currentYearly - proposedYearly;
  const hasCurrentCosts = currentYearly > 0;
  const ready = hasCurrentCosts && Boolean(plan);
  const homesOutOfRange = homeCount > 50;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <form className="rounded-lg border border-acadia-moss/20 bg-white p-5 shadow-soft" onSubmit={(event) => event.preventDefault()}>
        <fieldset>
          <legend className="text-sm font-bold uppercase tracking-[0.14em] text-acadia-leaf">Today</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Homes in Acadia Estates" value={homes} onChange={setHomes} placeholder="Number of homes" />
            <Field label="Management fee per month" value={management} onChange={setManagement} placeholder="Enter amount" money />
            <Field label="Attorney cost per year" value={attorneyNow} onChange={setAttorneyNow} placeholder="Enter amount" money />
            <Field label="CPA and tax cost per year" value={cpaNow} onChange={setCpaNow} placeholder="Enter amount" money />
          </div>
        </fieldset>

        <fieldset className="mt-6 border-t border-acadia-moss/15 pt-5">
          <legend className="sr-only">Under the proposals</legend>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-acadia-leaf">Under the proposals</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Attorney review cost per year" value={attorneyAfter} onChange={setAttorneyAfter} placeholder="Quote needed" money />
            <Field label="CPA verify-and-file cost per year" value={cpaAfter} onChange={setCpaAfter} placeholder="Quote needed" money />
            <SelectField
              label="Dues payments per home each year"
              value={paymentsPerYear}
              onChange={setPaymentsPerYear}
              options={[
                { value: "1", label: "1 (yearly)" },
                { value: "2", label: "2 (twice a year)" },
                { value: "4", label: "4 (quarterly)" },
                { value: "12", label: "12 (monthly)" }
              ]}
            />
            <label className="flex items-start gap-3 rounded-md border border-acadia-moss/25 bg-acadia-cream px-3 py-3 text-sm leading-6 text-slate-700">
              <input
                type="checkbox"
                checked={absorbFees}
                onChange={(event) => setAbsorbFees(event.target.checked)}
                className="mt-1 h-4 w-4 accent-acadia-leaf"
              />
              <span>
                <strong className="block text-acadia-ink">HOA absorbs bank-payment fees</strong>
                Assumes every home pays online by bank transfer at ${payhoaFees.bankPayment.toFixed(2)} each.
              </span>
            </label>
          </div>
        </fieldset>
      </form>

      <div className="rounded-lg bg-acadia-ink p-5 text-white shadow-soft" aria-live="polite">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-gold">Yearly picture</p>

        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Cost today" value={hasCurrentCosts ? dollars.format(currentYearly) : "Enter today's costs"} />
          <Row
            label="HOA software"
            value={
              plan
                ? `${dollars.format(softwareYearly)} (${plan.label})`
                : homesOutOfRange
                  ? "Ask PayHOA for a quote"
                  : "Enter the number of homes"
            }
          />
          <Row label="Online payment fees absorbed" value={absorbFees ? dollars.format(feesYearly) : "$0 (paid by the payer)"} />
          <Row
            label="Attorney review"
            value={attorneyAfter.trim() ? dollars.format(attorneyAfterYearly) : `${dollars.format(attorneyAfterYearly)} (same as today until quoted)`}
          />
          <Row
            label="CPA verify and file"
            value={cpaAfter.trim() ? dollars.format(cpaAfterYearly) : `${dollars.format(cpaAfterYearly)} (same as today until quoted)`}
          />
          <Row label="Cost under the proposals" value={plan ? dollars.format(proposedYearly) : "Waiting on inputs"} strong />
        </dl>

        <div className="mt-5 rounded-md bg-white/10 px-4 py-4">
          {ready ? (
            <>
              <p className="text-sm text-white/75">{difference >= 0 ? "Estimated yearly savings" : "Estimated yearly increase"}</p>
              <p className="mt-1 text-4xl font-bold tracking-tight">{dollars.format(Math.abs(difference))}</p>
              <p className="mt-1 text-sm text-white/75">
                About {dollars.format(Math.abs(difference) / homeCount)} per home each year.
              </p>
            </>
          ) : (
            <p className="text-sm leading-6 text-white/80">
              Enter the number of homes and at least one of today&apos;s costs to see the difference.
            </p>
          )}
        </div>

        <p className="mt-4 text-xs leading-5 text-white/60">
          This is a planning tool. It is only as good as the numbers typed in. Software prices use
          PayHOA&apos;s annual billing rate. Until a review-only quote is entered, attorney and CPA costs
          are assumed to stay the same. Card fees are assumed to be paid by the owner who chooses a card.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  money = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  money?: boolean;
}) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-acadia-ink">
        {label}
      </label>
      <div className="relative mt-1">
        {money ? (
          <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            $
          </span>
        ) : null}
        <input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-md border border-acadia-moss/30 py-3 pr-3 text-base text-acadia-ink outline-none transition placeholder:text-slate-400 focus:border-acadia-leaf focus:ring-2 focus:ring-acadia-leaf/20 ${
            money ? "pl-7" : "pl-3"
          }`}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-acadia-ink">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-md border border-acadia-moss/30 bg-white px-3 py-3 text-base text-acadia-ink outline-none transition focus:border-acadia-leaf focus:ring-2 focus:ring-acadia-leaf/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-4 ${strong ? "border-t border-white/20 pt-3" : ""}`}>
      <dt className={strong ? "font-bold text-white" : "text-white/75"}>{label}</dt>
      <dd className={`text-right ${strong ? "text-base font-bold text-white" : "font-semibold text-white"}`}>{value}</dd>
    </div>
  );
}
