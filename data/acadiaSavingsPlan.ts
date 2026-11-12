// Content for /Acadia/savings.
//
// The plan shown on the site is Acadia's own owner portal, built into this site. PayHOA is the
// off-the-shelf product it is measured against.
//
// Everything about PayHOA below was read from PayHOA's public pricing and features pages on the
// date in PAYHOA_REVIEWED. Payment processor rates are Stripe's published US rates as reported on
// the date in PROCESSOR_REVIEWED. Prices change, so re-check them before a board vote.

export const SAVINGS_REVIEWED = "November 12, 2026";
export const PAYHOA_REVIEWED = "November 12, 2026";
export const PAYHOA_PRICING_URL = "https://www.payhoa.com/pricing";
export const PAYHOA_FEATURES_URL = "https://www.payhoa.com/features";
export const PROCESSOR_REVIEWED = "November 12, 2026";
export const PROCESSOR_PRICING_URL = "https://stripe.com/pricing";

/** Stripe's published US rates. A payment processor like this would move the money for Acadia's own portal. */
export const processorFees = {
  bankPercent: 0.8,
  bankCap: 5,
  cardPercent: 2.9,
  cardFixed: 0.3
};

export function processorBankFee(amount: number) {
  if (amount <= 0) return 0;
  return Math.min(Math.round(amount * processorFees.bankPercent) / 100, processorFees.bankCap);
}

export function processorCardFee(amount: number) {
  if (amount <= 0) return 0;
  return Math.round(amount * processorFees.cardPercent + processorFees.cardFixed * 100) / 100;
}

/**
 * A planning estimate, not a quote: the AI document helper, email sending, and hosting for a
 * 32-home portal. Replace it with real usage once the portal has run for a few months.
 */
export const portalRunningCostEstimate = 150;

// Acadia Estates figures. The dollar amounts come from the proposed 2027 budget that the board
// emailed to every homeowner on November 8, 2026, ahead of the November 12 budget meeting.
// The 2026 amounts are the adopted 2026 budget shown beside it in the board's budget workbook.
// If the adopted 2027 budget differs, update these numbers and the BUDGET_SOURCE line.
export const BUDGET_SOURCE = "Proposed 2027 budget, sent to homeowners November 8, 2026";

export const acadiaBudget = {
  homes: 32,
  /** Dues are billed quarterly. */
  duesPaymentsPerYear: 4 as const,
  proposed2027: {
    /** The management company's base fee: $200 a month. */
    managementFee: 2400,
    /** Base fee plus the postage, printing, office supply, and other admin charges billed through it. */
    managementCompanyTotal: 3948,
    legalFees: 2040,
    legalFeeReimbursements: 1200,
    taxPreparation: 1400,
    /** $345 a month, billed quarterly. */
    quarterlyDues: 1035
  },
  budget2026: {
    managementFee: 2400,
    legalFees: 1000,
    taxReturn: 1250
  }
};

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

export type ComparisonStatus = "live" | "planned" | "later" | "no" | "yes" | "partial" | "unlisted";

/**
 * Acadia's own portal next to PayHOA. "unlisted" means the feature was not found on PayHOA's
 * features or pricing pages on PAYHOA_REVIEWED. The table is meant to be fair: it includes the
 * places where PayHOA is ahead.
 */
export const portalComparison: {
  feature: string;
  acadia: { status: ComparisonStatus; label: string };
  payhoa: { status: ComparisonStatus; label: string };
}[] = [
  {
    feature: "Answers from the governing documents, with page links",
    acadia: { status: "live", label: "Live today" },
    payhoa: { status: "partial", label: "AI add-on for the board, at extra cost" }
  },
  {
    feature: "Open project tracker with sources and homeowner feedback",
    acadia: { status: "live", label: "Live today" },
    payhoa: { status: "partial", label: "Surveys and voting only" }
  },
  {
    feature: "Pay online by bank transfer or card",
    acadia: { status: "planned", label: "Planned" },
    payhoa: { status: "yes", label: "Included" }
  },
  {
    feature: "Autopay with a spending limit",
    acadia: { status: "planned", label: "Planned" },
    payhoa: { status: "yes", label: "Included" }
  },
  {
    feature: "Automatic late fees on the board's schedule",
    acadia: { status: "planned", label: "Planned" },
    payhoa: { status: "yes", label: "Included" }
  },
  {
    feature: "Ledger, receipts, and statements for each home",
    acadia: { status: "planned", label: "Planned" },
    payhoa: { status: "yes", label: "Included" }
  },
  {
    feature: "Requests with a step-by-step status tracker",
    acadia: { status: "planned", label: "Planned" },
    payhoa: { status: "yes", label: "Included" }
  },
  {
    feature: "Documents, calendar, and announcements",
    acadia: { status: "planned", label: "Planned" },
    payhoa: { status: "yes", label: "Included" }
  },
  {
    feature: "Two-person approval on every vendor bill",
    acadia: { status: "planned", label: "Planned" },
    payhoa: { status: "yes", label: "Approval steps included" }
  },
  {
    feature: "Where each dollar goes, shown to every owner",
    acadia: { status: "planned", label: "Planned" },
    payhoa: { status: "unlisted", label: "Not listed" }
  },
  {
    feature: "Private payment plan requests",
    acadia: { status: "planned", label: "Planned" },
    payhoa: { status: "unlisted", label: "Not listed" }
  },
  {
    feature: "AI drafts routed to attorney or CPA review",
    acadia: { status: "planned", label: "Planned" },
    payhoa: { status: "unlisted", label: "Not listed" }
  },
  {
    feature: "Bank sync and reconciliation",
    acadia: { status: "later", label: "Later phase" },
    payhoa: { status: "yes", label: "Included" }
  },
  {
    feature: "Mailed letters and check printing",
    acadia: { status: "no", label: "Not planned" },
    payhoa: { status: "yes", label: "Included, letters at a fee" }
  },
  {
    feature: "Subscription",
    acadia: { status: "live", label: "None" },
    payhoa: { status: "partial", label: "$59 a month at 32 homes" }
  },
  {
    feature: "Fee on a bank payment",
    acadia: { status: "partial", label: "0.8%, capped at $5" },
    payhoa: { status: "yes", label: "$2.45 flat" }
  },
  {
    feature: "Fee on a card payment",
    acadia: { status: "live", label: "2.9% plus $0.30" },
    payhoa: { status: "partial", label: "3.5% plus $0.50" }
  }
];

export type SavingsProposal = {
  number: number;
  title: string;
  projectId: string;
  /** What the budget shows for this cost today. */
  budgetLine: string;
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
    budgetLine:
      "The proposed 2027 budget lists $3,948 for the management company. That is a $200 monthly fee plus postage, printing, supplies, and other admin charges.",
    summary:
      "The association would end its outside management contract. An owner portal built into this site would handle the routine work, and board volunteers would handle decisions.",
    howItWorks: [
      "The portal sends invoices, takes online payments, runs autopay, and keeps each home's ledger.",
      "Owners sign in to see balances, receipts, requests, and documents.",
      "The treasurer reviews the books each month and exports them for the CPA.",
      "The document helper on this site answers routine questions with page links."
    ],
    stillPayFor:
      "Payment processing fees if the association absorbs them, a small running cost for the portal, and postage for mailed notices.",
    watchFor:
      "The work does not disappear. It moves to the portal and to volunteers. Each duty needs a named owner and a backup, and so does the portal itself."
  },
  {
    number: 2,
    title: "Pay the attorney to review, not to draft",
    projectId: "professional-review-model",
    budgetLine:
      "The proposed 2027 budget lists $2,040 for legal fees. The 2026 budget listed $1,000. The 2027 budget also expects $1,200 in legal fee reimbursements.",
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
    budgetLine:
      "The proposed 2027 budget lists $1,400 for tax preparation. The 2026 budget listed $1,250.",
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
    proposed: "The portal sends invoices and takes online payments and autopay. Checks are still accepted."
  },
  {
    duty: "Late notices and late fees",
    underManagement: "Management company",
    proposed: "The portal applies the board's adopted policy the same way for every home."
  },
  {
    duty: "Bookkeeping and bank reconciliation",
    underManagement: "Management company",
    proposed: "The portal keeps the ledger. The treasurer checks it against the bank each month. The CPA verifies at year end."
  },
  {
    duty: "Paying vendors",
    underManagement: "Management company",
    proposed: "Bills are entered in the portal. Two board members approve each payment."
  },
  {
    duty: "Routine owner questions",
    underManagement: "Management company",
    proposed: "The document helper answers with page links. The board answers the rest."
  },
  {
    duty: "Meeting notices, agendas, and minutes",
    underManagement: "Management company",
    proposed: "AI drafts from a template. The secretary checks it and sends it through the portal."
  },
  {
    duty: "Architectural and maintenance requests",
    underManagement: "Management company",
    proposed: "Online forms with a status tracker. The board decides."
  },
  {
    duty: "Covenant violations",
    underManagement: "Management company",
    proposed: "Tracked in the portal. The board decides. The attorney is involved before fines or legal steps."
  },
  {
    duty: "Estoppel letters and resale documents",
    underManagement: "Management company",
    proposed: "The portal prepares them from the records. A board officer reviews and signs."
  },
  {
    duty: "Official records and records requests",
    underManagement: "Management company",
    proposed: "Records live in the portal and on this site. The secretary answers requests."
  },
  {
    duty: "Legal documents",
    underManagement: "Attorney drafts",
    proposed: "AI drafts routine items. The attorney reviews and approves. The attorney leads anything involving liens, collections, lawsuits, or recorded amendments."
  },
  {
    duty: "Tax return and year-end financial report",
    underManagement: "CPA prepares",
    proposed: "The portal and AI prepare the package. The CPA verifies, signs, and files."
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
    text: "Owner balances and contact details stay behind each owner's sign-in. They are never shown on public pages and are not entered into public AI tools. Card and bank numbers go straight to the payment processor."
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
  "What notice period or exit fee is in the management contract?",
  "How much of the postage, printing, and admin cost would remain after the change?",
  "What will the attorney and the CPA charge for review-only work?",
  "Which board member will own each duty, and who is the backup?",
  "Who keeps the portal running if the volunteer who built it steps away?",
  "Do the association's insurers set any conditions for a self-managed board?"
];
