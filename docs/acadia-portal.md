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

## What is not known yet

The savings calculator starts empty because these figures are not published on the site:

- the current management fee and the contract's notice or exit terms
- current attorney and CPA costs
- what the attorney and CPA would charge for review-only work
- the exact number of homes (PayHOA's price changes at 26 homes)

When the board is ready to publish them, add them to `data/acadiaSavingsPlan.ts` and pass them to
`SavingsCalculator` as starting values.

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
