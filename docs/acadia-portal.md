# Acadia owner portal preview and savings plan

Direction, set November 12, 2026: the goal is Acadia's own owner portal, built into this site and
better than off-the-shelf HOA software. PayHOA is the benchmark it is measured against, not the plan.

These pages support the proposal to move from a management company to self-management.

| Page | Path | What it is |
| --- | --- | --- |
| Owner portal preview | `/Acadia/portal` | A clickable mockup of an owner portal. Sample data only. |
| Real owner portal | `/Acadia/portal/home` and `/Acadia/portal/board` | Sign-in, ledger, receipts, requests, board tools. See "Step 2" below. |
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

The real portal is built in steps. The board tests each step before owners use it.

1. **Preview** (done). Sample data, no sign-in, no payments. Lives at `/Acadia/portal`.
2. **Sign-in and records** (built November 12, 2026, waiting to be turned on). See the next section.
3. **Online payments.** A payment processor (Stripe) handles bank and card payments, autopay, and
   receipts. The ledger updates from the processor's confirmations. Late fees follow the policy the
   board adopts.
4. **More board tools.** Two-person bill approval, AI drafts with attorney and CPA review, budget
   against actual.

Rules for the build:

- Card and bank numbers never touch this site. The processor's own hosted pages collect them.
- The processor account and the bank account belong to the association, never to a volunteer.
- Owner data sits behind sign-in. Nothing private is rendered on a public page.
- Every change to money records is logged with who made it and when.
- A second person must be able to run and repair the portal. Keep these notes current.
- No real owner data goes in this repository. It is public.

Things PayHOA does that this plan does not try to match at first: automatic bank sync and
reconciliation, mailed letters, and check printing. PayHOA's flat $2.45 bank fee is also lower than
the processor's fee on a payment of Acadia's size ($5 on a $1,035 quarterly payment).

## Step 2: sign-in and records

### Where the records live

The board chose not to use Supabase, Postgres, or any other hosted database. The records live in one
SQLite file on a machine the board runs itself. A small program, the Acadia data service, sits next
to that file. The website on Vercel reaches it over HTTPS through a secure tunnel, using a long
shared key. Setup steps, backups, and restore are in
[`services/acadia-data/README.md`](../services/acadia-data/README.md).

The trade-off: when that machine or its internet is down, owners cannot sign in and vote totals show
as unavailable. The rest of the Acadia site keeps working, and nothing is lost.

The site needs three server-only settings on Vercel, for Production only:

- `ACADIA_DATA_URL`: the tunnel address. It must start with `https://`.
- `ACADIA_DATA_KEY`: the shared key.
- `ACADIA_ADMIN_KEY`: a second secret, at least 24 characters, for the first board sign-in.

Until those are set, the portal pages say the portal is not turned on yet.

### Pages

| Path | Who | What |
| --- | --- | --- |
| `/Acadia/portal/sign-in` | Everyone | Explains sign-in. Shows a notice if the records server is offline. |
| `/Acadia/portal/enter` | Owners | Where a private sign-in link lands. |
| `/Acadia/portal/setup` | Board | First board sign-in with the admin key. Also the way back in. |
| `/Acadia/portal/home` | Owners | Balance, past due, recent activity, open requests, notices, how to pay. |
| `/Acadia/portal/home/ledger` | Owners | Every line for the home, with a running balance. |
| `/Acadia/portal/home/requests` | Owners | Send a request and follow its thread. |
| `/Acadia/portal/receipt/[id]` | Owners, board | A printable receipt for a payment. |
| `/Acadia/portal/board` | Board | Every home with its balance and past-due amount. |
| `/Acadia/portal/board/homes/[id]` | Board | People, sign-in links, ledger, payments, charges, credits, reversals. |
| `/Acadia/portal/board/billing` | Board | Post a charge to every home. Record a payment. Export the ledger for the CPA. |
| `/Acadia/portal/board/requests` | Board | Reply to requests, add board-only notes, set status. |
| `/Acadia/portal/board/settings` | Board | Notices, the how-to-pay note, homes, board members, backups. |
| `/Acadia/portal/board/log` | Board | Who did what, and when. |

### How sign-in works

- There are no passwords. A board member creates a private link for a person and sends it to them.
- A link works one time and expires after 7 days. It starts a session that lasts 30 days.
- The secret part of a link sits after the `#`. Browsers never send that part to a server, so it does
  not land in logs. The owner must press a button to use it, so a link preview cannot use it up.
- The database stores only hashes of links and sessions.
- Turning off a person ends their sessions at once.
- The admin key page locks for 15 minutes after 8 wrong tries.
- Email delivery of links can be added later. It needs an email sending service.

### How money is kept

- Amounts are whole cents. A charge is positive. A payment or credit is negative. A home's balance is
  the sum of its lines.
- Lines are never edited or deleted. A mistake is fixed with a reversal line that points at the first
  line. Both stay visible.
- Each form carries a one-time mark. Sending the same form twice posts once.
- "Past due" is the part of the balance that is not covered by charges with a later due date.
- Until step 3, the treasurer records each payment by hand. Owners see a how-to-pay note the board
  can edit.
- The ledger table already has a place for a processor payment ID, with a rule that the same ID can
  never post twice. Step 3 will use it.

### Code map

- `services/acadia-data/`: the data service, its Docker file, and its tests.
- `lib/acadia-portal/db.ts`: talks to the data service.
- `lib/acadia-portal/schema.ts`: the tables. Add a new numbered step to change them.
- `lib/acadia-portal/auth.ts`: links, sessions, the admin key.
- `lib/acadia-portal/data.ts`: read queries for the pages.
- `app/Acadia/portal/actions.ts`: every change. Each action checks who is signed in first.
- `app/Acadia/portal/(app)/`: the signed-in pages.
- `components/acadia/portal-app/`: shared parts for those pages.
- `scripts/acadia-portal/e2e.py`: a browser walk-through that checks the access rules.

### Tests

```
node --test services/acadia-data/test.mjs
```

For the full walk-through, start the data service and the site on your own computer with made-up
keys, then run `scripts/acadia-portal/e2e.py`. The steps are at the top of that file. Never point it
at the real records. It adds test homes and payments.

## Needed before step 3

- A Stripe account opened by the association, paying out to the association's bank account
- Board approval, and a decision on who pays the processing fee
- Stripe test keys placed in Vercel by a board member, never in chat or in code
- A decision on a dedicated Acadia domain
- An attorney's view on keeping association records on a board member's own hardware, and on what
  happens to them when the board changes
