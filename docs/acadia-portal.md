# Acadia owner portal preview and savings plan

Direction, set November 12, 2026: the goal is Acadia's own owner portal, built into this site and
better than off-the-shelf HOA software. PayHOA is the benchmark it is measured against, not the plan.

Two pages were added for the proposal to move from a management company to self-management.

| Page | Path | What it is |
| --- | --- | --- |
| Owner portal preview | `/Acadia/portal` | A clickable mockup of an owner portal. Sample data only. |
| Savings plan | `/Acadia/savings` | The three cost proposals, PayHOA's published prices, a calculator, and safeguards. |

Both proposals are also listed as HOA items so homeowners can vote on them:

- `/Acadia/projects/self-management-software`
- `/Acadia/projects/professional-review-model`

## The preview is not a payment system

- Everything in `components/acadia/portal/sampleData.ts` is made up. Keep it that way. Do not put a
  real owner, balance, bank balance, or vendor amount in that file.
- The page takes no card or bank numbers. The pay flow only picks between two sample methods.
- Nothing is sent to a server or saved. State lives in the browser tab and resets on reload.
- The page is marked `noindex` and carries a preview banner at the top and inside the portal frame.

## What is real on these pages

- PayHOA prices and fees in `data/acadiaSavingsPlan.ts`. They were read from PayHOA's public pricing
  page on the date in `PAYHOA_REVIEWED`. Re-check them before a board vote and update the date.
- The Florida and IRS notes in the same file. Each one links to its source.
- Links to the governing documents, the source document library, and the document helper.

## Acadia's own figures

`data/acadiaSavingsPlan.ts` holds these in `acadiaBudget`:

- 32 homes, with dues billed quarterly
- From the proposed 2027 budget sent to homeowners on November 8, 2026: $3,948 for the management
  company ($2,400 fee plus admin charges), $2,040 for legal fees, $1,400 for tax preparation
- From the 2026 budget: $1,000 for legal fees and $1,250 for the tax return

The savings calculator starts from the 2027 figures. If the adopted budget differs, change the
numbers in `acadiaBudget` and the `BUDGET_SOURCE` line. The page and the two HOA items repeat a few
of these numbers in their text, so search for the old amount after changing one.

## What is not known yet

- the management contract's notice period and any exit fee
- what the attorney and CPA would charge for review-only work
- how much postage, printing, and admin cost would remain after a change

## Building the real portal

The preview is step one. The real portal would be built in steps, and each step should be tested by
the board before owners use it.

1. **Preview** (done). Sample data, no sign-in, no payments.
2. **Sign-in and records.** Owners sign in with an emailed link. Real ledger, receipts, requests,
   documents, and announcements. The treasurer enters payments by hand at first. Project votes move
   to the same database so they no longer depend on Supabase.
3. **Online payments.** A payment processor (Stripe) handles bank and card payments, autopay, and
   receipts. The ledger updates from the processor's confirmations. Late fees follow the policy the
   board adopts.
4. **Board tools.** Collections view, two-person bill approval, AI drafts with attorney and CPA
   review, budget against actual, and exports for the CPA.

Rules for the build:

- Card and bank numbers never touch this site. The processor's own hosted pages collect them.
- The processor account and the bank account belong to the association, never to a volunteer.
- Owner data sits behind sign-in. Nothing private is rendered on a public page.
- Every change to money records is logged with who made it and when.
- A second person must be able to run and repair the portal. Keep these notes current.

Things PayHOA does that this plan does not try to match at first: automatic bank sync and
reconciliation, mailed letters, and check printing. PayHOA's flat $2.45 bank fee is also lower than
the processor's fee on a payment of Acadia's size ($5 on a $1,035 quarterly payment).

Needed before step 2: a database that does not pause (managed Postgres is the working choice), an
email sender for sign-in links, and a decision on a dedicated Acadia domain.
Needed before step 3: a Stripe account opened by the association, board approval, and a decision on
who pays the processing fee.
