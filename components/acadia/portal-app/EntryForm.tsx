import { randomUUID } from "node:crypto";
import { postEntryAction } from "@/app/Acadia/portal/actions";
import { Field, inputClass } from "@/components/acadia/portal-app/parts";
import { SubmitButton } from "@/components/acadia/portal-app/SubmitButton";
import { todayInFlorida } from "@/lib/acadia-portal/format";

const copy = {
  payment: { button: "Record payment", memoHint: "Optional. For example: Q1 2027 dues." },
  charge: { button: "Post charge", memoHint: "What the charge is for. For example: Q1 2027 dues." },
  credit: { button: "Post credit", memoHint: "Why the credit is being given." }
};

/**
 * A board form that adds one line to a home's ledger. Give homeId for a fixed home, or homes to
 * show a picker. Each form carries a one-time mark, so sending it twice cannot post twice.
 */
export function EntryForm({
  kind,
  homeId,
  homes,
  returnTo
}: {
  kind: "payment" | "charge" | "credit";
  homeId?: number;
  homes?: { id: number; house_number: string }[];
  returnTo: string;
}) {
  const today = todayInFlorida();

  return (
    <form action={postEntryAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="nonce" value={randomUUID()} />
      <input type="hidden" name="returnTo" value={returnTo} />
      {homeId !== undefined ? (
        <input type="hidden" name="homeId" value={homeId} />
      ) : (
        <Field label="Home" className="sm:col-span-2">
          <select name="homeId" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Pick a home
            </option>
            {(homes || []).map((home) => (
              <option key={home.id} value={home.id}>
                {home.house_number}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Amount in dollars">
        <input name="amount" required inputMode="decimal" placeholder="0.00" pattern="\$?[0-9,]+(\.[0-9]{1,2})?" title="Dollars, like 1035 or 1035.00" className={inputClass} />
      </Field>
      <Field label={kind === "payment" ? "Date received" : "Date"}>
        <input name="effectiveDate" type="date" required defaultValue={today} className={inputClass} />
      </Field>
      {kind === "payment" ? (
        <>
          <Field label="Paid by">
            <select name="method" defaultValue="Check" className={inputClass}>
              <option>Check</option>
              <option>Cash</option>
              <option>Bank transfer</option>
              <option>Money order</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="Check number or reference" hint="Optional.">
            <input name="reference" maxLength={60} className={inputClass} />
          </Field>
        </>
      ) : null}
      {kind === "charge" ? (
        <Field label="Due date" hint="Optional. The charge counts as past due after this date.">
          <input name="dueDate" type="date" className={inputClass} />
        </Field>
      ) : null}
      <Field label="Description" hint={copy[kind].memoHint} className={kind === "charge" ? "" : "sm:col-span-2"}>
        <input name="memo" required={kind !== "payment"} maxLength={200} className={inputClass} />
      </Field>
      <div className="sm:col-span-2">
        <SubmitButton>{copy[kind].button}</SubmitButton>
      </div>
    </form>
  );
}
