// Content for /Acadia/savings.
//
// Everything about PayHOA below was read from PayHOA's public pricing and features pages on the
// date in PAYHOA_REVIEWED. Prices change, so re-check them before a board vote and update the date.

export const SAVINGS_REVIEWED = "November 12, 2026";
export const PAYHOA_REVIEWED = "November 12, 2026";
export const PAYHOA_PRICING_URL = "https://www.payhoa.com/pricing";
export const PAYHOA_FEATURES_URL = "https://www.payhoa.com/features";

export type PayhoaPlan = {
  label: string;
  minHomes: number;
  maxHomes: number;
  /** Monthly price when billed once a year. */
  annualBillingMonthly: number;
  /** Monthly price when billed month to month. */
  monthToMonth: number;
};

export const payhoaPlans: PayhoaPlan[] = [
  { label: "1 to 25 homes", minHomes: 1, maxHomes: 25, annualBillingMonthly: 49, monthToMonth: 54 },
  { label: "26 to 50 homes", minHomes: 26, maxHomes: 50, annualBillingMonthly: 59, monthToMonth: 65 }
];

export const payhoaFees = {
  bankPayment: 2.45,
  cardPercent: 3.5,
  cardFixed: 0.5,
  mailedLetterFirstClass: 1.25,
  mailedVendorCheck: 2,
  aiAddOnMonthlySmallestPlan: 24.5
};

export function payhoaPlanForHomes(homes: number) {
  return payhoaPlans.find((plan) => homes >= plan.minHomes && homes <= plan.maxHomes);
}

export const payhoaIncluded: { title: string; items: string[] }[] = [
  {
    title: "Dues and payments",
    items: [
      "Recurring and one-time invoices for every home",
      "Online payment by bank transfer or card, plus autopay",
      "Automatic late fees on the schedule the board sets",
      "Checks and cash can still be recorded at no fee"
    ]
  },
  {
    title: "Books and banking",
    items: [
      "Bank connection, syncing, and reconciliation",
      "Budgets and more than 40 reports",
      "Vendor bills with scanning and approval steps",
      "Vendor payments and check printing"
    ]
  },
  {
    title: "Owner services",
    items: [
      "A private portal for each homeowner",
      "Request forms with approval steps, including architectural requests",
      "Violation tracking and letters",
      "Document storage, calendar, and amenity booking"
    ]
  },
  {
    title: "Communication",
    items: [
      "Unlimited emails, texts, and phone calls to owners",
      "Mailed letters through USPS for a per-letter fee",
      "Message boards, surveys, and online voting",
      "Resale documents prepared from the association's records"
    ]
  }
];

export type SavingsProposal = {
  number: number;
  title: string;
  projectId: string;
  summary: string;
  howItWorks: string[];
  stillPayFor: string;
  watchFor: string;
};

export const savingsProposals: SavingsProposal[] = [
  {
    number: 1,
    title: "Use software in place of a management company",
    projectId: "self-management-software",
    summary:
      "The association would end its outside management contract. HOA software would handle the routine work, and board volunteers would handle decisions.",
    howItWorks: [
      "Software sends invoices, takes online payments, runs autopay, and keeps each home's ledger.",
      "The bank account syncs to the books, so the treasurer reviews the month instead of typing it in.",
      "Owners get a portal for balances, receipts, requests, and documents.",
      "The document helper on this site answers routine questions with page links."
    ],
    stillPayFor: "The software subscription, online payment fees if the association absorbs them, and postage for mailed notices.",
    watchFor:
      "The work does not disappear. It moves to software and to volunteers. Each duty needs a named owner and a backup."
  },
  {
    number: 2,
    title: "Pay the attorney to review, not to draft",
    projectId: "professional-review-model",
    summary:
      "AI tools would prepare first drafts of routine legal documents from the association's own governing documents. A licensed Florida attorney would review, correct, and approve each one before it is used.",
    howItWorks: [
      "AI drafts routine items such as notices, policy language, resolutions, and vendor contract summaries.",
      "The attorney receives the draft with the source pages it relies on.",
      "The attorney corrects it and approves the final version in writing.",
      "Liens, collections, lawsuits, and changes to recorded documents stay attorney-led from the start."
    ],
    stillPayFor:
      "The attorney's judgment and accountability. The association pays for the review and sign-off, not for hours of first-draft typing.",
    watchFor:
      "An attorney is accountable only for work they agree to stand behind. The engagement letter must say the attorney reviewed and approved the final document."
  },
  {
    number: 3,
    title: "Pay the CPA to verify and file, not to prepare",
    projectId: "professional-review-model",
    summary:
      "The software would keep the books all year. AI tools would assemble the year-end report and tax package. A CPA would verify the numbers, sign, and file.",
    howItWorks: [
      "Bank-synced books are reconciled every month, so year end starts clean.",
      "AI assembles the year-end report, the tax return workpapers, and the vendor 1099 list.",
      "The CPA tests the numbers against bank records, then signs and files the return.",
      "If the law or the governing documents ever require compiled, reviewed, or audited statements, the CPA does that work in full."
    ],
    stillPayFor:
      "The CPA's verification, signature, and filing. The association pays less for data entry and cleanup.",
    watchFor:
      "A CPA who signs a return is responsible for it and will do their own checks. Savings depend on how clean the books are."
  }
];

export const dutyMap: { duty: string; underManagement: string; proposed: string }[] = [
  {
    duty: "Bill assessments and collect payments",
    underManagement: "Management company",
    proposed: "Software sends invoices and takes online payments and autopay. Checks are still accepted."
  },
  {
    duty: "Late notices and late fees",
    underManagement: "Management company",
    proposed: "Software applies the board's adopted policy the same way for every home."
  },
  {
    duty: "Bookkeeping and bank reconciliation",
    underManagement: "Management company",
    proposed: "Software with bank sync. The treasurer reviews each month. The CPA verifies at year end."
  },
  {
    duty: "Paying vendors",
    underManagement: "Management company",
    proposed: "Bills are entered in the software. Two board members approve each payment."
  },
  {
    duty: "Routine owner questions",
    underManagement: "Management company",
    proposed: "The document helper answers with page links. The board answers the rest."
  },
  {
    duty: "Meeting notices, agendas, and minutes",
    underManagement: "Management company",
    proposed: "AI drafts from a template. The secretary checks it and sends it through the software."
  },
  {
    duty: "Architectural and maintenance requests",
    underManagement: "Management company",
    proposed: "Online forms with a status tracker. The board decides."
  },
  {
    duty: "Covenant violations",
    underManagement: "Management company",
    proposed: "Tracked in the software. The board decides. The attorney is involved before fines or legal steps."
  },
  {
    duty: "Estoppel letters and resale documents",
    underManagement: "Management company",
    proposed: "Software prepares them from the records. A board officer reviews and signs."
  },
  {
    duty: "Official records and records requests",
    underManagement: "Management company",
    proposed: "Records live in the software and on this site. The secretary answers requests."
  },
  {
    duty: "Legal documents",
    underManagement: "Attorney drafts",
    proposed: "AI drafts routine items. The attorney reviews and approves. The attorney leads anything involving liens, collections, lawsuits, or recorded amendments."
  },
  {
    duty: "Tax return and year-end financial report",
    underManagement: "CPA prepares",
    proposed: "Software and AI prepare the package. The CPA verifies, signs, and files."
  },
  {
    duty: "Insurance renewals and state filings",
    underManagement: "Management company",
    proposed: "A shared board calendar with reminders. The treasurer or secretary files."
  }
];

export const safeguards: { title: string; text: string }[] = [
  {
    title: "Two people on every payment",
    text: "No single person can pay a vendor alone. A second board member approves each payment, and a second officer has read-only access to the bank account."
  },
  {
    title: "Books checked every month",
    text: "The bank account is reconciled monthly and the summary is shared with the full board. Year end should hold no surprises."
  },
  {
    title: "A person checks every AI draft",
    text: "AI can be wrong. Nothing it drafts is used until a board member checks it. Legal documents wait for the attorney. Tax filings wait for the CPA."
  },
  {
    title: "Review in writing",
    text: "A professional's insurance backs the work they agree to review. Each engagement letter must say what was reviewed and approved."
  },
  {
    title: "Private data stays private",
    text: "Owner balances and contact details stay inside the HOA software. They are not posted on this site and are not entered into public AI tools."
  },
  {
    title: "Insurance confirmed first",
    text: "Before any change, the board confirms that the crime and directors and officers policies cover a self-managed board and volunteers who handle funds."
  }
];

export const floridaNotes: { title: string; text: string; sourceLabel: string; sourceHref: string }[] = [
  {
    title: "A manager is optional",
    text: "Florida licenses community association managers who are paid to manage associations above a set size. The state licensing agency says the law does not require a board to hire one. A volunteer board may manage its own association.",
    sourceLabel: "Florida DBPR, community association manager questions",
    sourceHref: "https://www2.myfloridalicense.com/?p=8272"
  },
  {
    title: "The year-end report depends on revenue",
    text: "Under section 720.303(7), an association with less than $150,000 in yearly revenue prepares a report of cash receipts and expenditures. Compiled, reviewed, or audited statements start at higher revenue levels. Governing documents can require more.",
    sourceLabel: "Becker, summary of section 720.303(7)",
    sourceHref: "https://beckerlawyers.com/2024-legislature-makes-significant-hoa-changes-news-press/"
  },
  {
    title: "There is a tax return made for associations",
    text: "A homeowners association that meets the IRS tests can choose Form 1120-H, which leaves owner dues and assessments out of taxable income. An association may file Form 1120-H or Form 1120, whichever results in the lower tax.",
    sourceLabel: "IRS, Instructions for Form 1120-H",
    sourceHref: "https://www.irs.gov/instructions/i1120h"
  },
  {
    title: "Florida lawyers may work with AI",
    text: "Florida Bar Ethics Opinion 24-1 says lawyers may use generative AI if they protect client confidentiality, check the work, and bill fairly. The lawyer stays responsible for the result.",
    sourceLabel: "The Florida Bar, Ethics Opinion 24-1 announcement",
    sourceHref:
      "https://www.floridabar.org/the-florida-bar-news/board-of-governors-adopts-ethics-guidelines-for-generative-ai-use/"
  }
];

export const otherSavings: { projectId: string; title: string; note: string }[] = [
  {
    projectId: "landscaping-contract-review",
    title: "Landscaping contract",
    note: "Two proposals are reported at $4,250 and $3,700 per month. Scopes still need to be compared line by line."
  },
  {
    projectId: "security-cameras",
    title: "Camera support",
    note: "The current service agreement is $260 per month. Pay-as-needed support and lower-cost internet options are under review."
  },
  {
    projectId: "irrigation-repair-monitoring",
    title: "Irrigation repair",
    note: "A $465 estimate blames damaged control wire. A field observation points to a valve instead. Settling the cause first avoids paying for the wrong repair."
  },
  {
    projectId: "pest-control",
    title: "Pest control",
    note: "Two proposals for the same wider program list different prices. They need to be reconciled before any decision."
  },
  {
    projectId: "insurance-review",
    title: "Insurance",
    note: "Coverage schedules and limits are being clarified. No confirmed premium savings are published yet."
  }
];

export const savingsOpenQuestions = [
  "What does the association pay today for management, legal work, and tax preparation?",
  "What notice period or exit fee is in the management contract?",
  "What will the attorney and the CPA charge for review-only work?",
  "Which board member will own each duty, and who is the backup?",
  "Do the association's insurers set any conditions for a self-managed board?"
];
