# Acadia owner portal preview and savings plan

Two pages were added for the proposal to move from a management company to HOA software.

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

## How a real portal would connect

There are two ways to turn the preview into something real.

1. **Use PayHOA (recommended).** PayHOA hosts the owner portal and holds all payment data. This site
   gets one "Pay dues" button that links to it. No payment data touches this site. The real screens
   will be PayHOA's, so they will not match the preview exactly. No public PayHOA API was found, so
   live balances cannot be shown on this site.
2. **Build it here.** This site would need owner sign-in, a payment processor such as Stripe, an
   owner ledger, bank reconciliation, late-fee rules, and receipts. That turns the site into the
   association's accounting system. It is more work and more risk than the subscription costs.

The pieces marked "Acadia extra" on the preview page are not part of PayHOA. They would be built on
this site from PayHOA's exported reports.
