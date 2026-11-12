// Made-up data for the owner portal preview at /Acadia/portal.
//
// IMPORTANT: nothing in this file is real. No real homeowner, balance, bank account, vendor amount,
// or budget figure appears here. Keep it that way. The preview must never be mistaken for the
// association's actual records. The only real numbers on the page are PayHOA's published fees,
// which come from data/acadiaSavingsPlan.ts.

export const sampleOwner = {
  name: "Sample Homeowner",
  home: "Sample home, Lot 00",
  email: "owner@example.com"
};

export const sampleAssessment = {
  label: "Q1 2027 assessment",
  amount: 450,
  frequency: "Quarterly",
  dueDate: "January 1, 2027",
  postedDate: "Nov 1, 2026"
};

export type LedgerEntry = {
  id: string;
  date: string;
  description: string;
  charge?: number;
  payment?: number;
  receipt?: string;
};

// Oldest first. The running balance is worked out when the table is drawn.
export const sampleLedger: LedgerEntry[] = [
  { id: "c-2026-q2", date: "Mar 1, 2026", description: "Q2 2026 assessment", charge: 450 },
  { id: "p-2026-q2", date: "Apr 1, 2026", description: "Payment by check", payment: 450, receipt: "R-1042" },
  { id: "c-2026-q3", date: "Jun 1, 2026", description: "Q3 2026 assessment", charge: 450 },
  { id: "p-2026-q3", date: "Jul 1, 2026", description: "Payment by bank transfer", payment: 450, receipt: "R-1107" },
  { id: "c-2026-q4", date: "Sep 1, 2026", description: "Q4 2026 assessment", charge: 450 },
  { id: "p-2026-q4", date: "Oct 1, 2026", description: "Autopay by bank transfer", payment: 450, receipt: "R-1163" },
  { id: "c-2027-q1", date: "Nov 1, 2026", description: "Q1 2027 assessment, due Jan 1, 2027", charge: 450 }
];

export type PaymentMethodId = "bank" | "card";

export const samplePaymentMethods: { id: PaymentMethodId; label: string; detail: string }[] = [
  { id: "bank", label: "Bank account", detail: "Sample Bank, ending 0000" },
  { id: "card", label: "Debit or credit card", detail: "Sample card, ending 0000" }
];

export type RequestStatus = "Submitted" | "Board review" | "Scheduled" | "Approved" | "Complete";

export type OwnerRequest = {
  id: string;
  kind: string;
  title: string;
  submitted: string;
  status: RequestStatus;
  steps: { label: string; done: boolean; current?: boolean }[];
  note: string;
};

export const sampleRequests: OwnerRequest[] = [
  {
    id: "req-1",
    kind: "Architectural change",
    title: "Exterior paint color change",
    submitted: "Nov 3, 2026",
    status: "Board review",
    steps: [
      { label: "Submitted", done: true },
      { label: "Application complete", done: true },
      { label: "Board review", done: false, current: true },
      { label: "Decision", done: false }
    ],
    note: "Color samples received. The board reviews requests at its next meeting."
  },
  {
    id: "req-2",
    kind: "Common-area repair",
    title: "Street light out near the entrance",
    submitted: "Oct 21, 2026",
    status: "Scheduled",
    steps: [
      { label: "Submitted", done: true },
      { label: "Assigned", done: true },
      { label: "Scheduled", done: false, current: true },
      { label: "Complete", done: false }
    ],
    note: "Reported to the utility. A repair visit is on the calendar."
  }
];

export const requestKinds = [
  "Architectural change",
  "Common-area repair",
  "Gate access",
  "Question for the board"
];

export const sampleAnnouncements = [
  {
    title: "Annual meeting notice",
    date: "Nov 8, 2026",
    text: "The notice and agenda are posted under Documents. Owners on email delivery also received a copy."
  },
  {
    title: "Irrigation repair visit",
    date: "Nov 2, 2026",
    text: "A vendor will be working near the entrance on the scheduled morning. Sprinklers may run for testing."
  }
];

export const sampleCalendar = [
  { date: "Dec 10", label: "Board meeting", detail: "Open to all owners" },
  { date: "Jan 1", label: "Q1 assessment due", detail: "Autopay runs on this date" },
  { date: "Jan 15", label: "Grace period ends", detail: "Under the late-fee policy the board adopts" }
];

export const sampleBudgetShares = [
  { label: "Landscaping", percent: 46, color: "bg-acadia-leaf" },
  { label: "Reserves", percent: 14, color: "bg-acadia-gold" },
  { label: "Security and gate", percent: 11, color: "bg-acadia-ink" },
  { label: "Utilities", percent: 9, color: "bg-cyan-600" },
  { label: "Pest control", percent: 8, color: "bg-acadia-moss" },
  { label: "Insurance", percent: 6, color: "bg-purple-500" },
  { label: "Admin and software", percent: 6, color: "bg-slate-400" }
];

// ---- Board view ----

export const sampleCollections = {
  homes: 40,
  homesPaid: 37,
  homesOnAutopay: 26,
  billed: 18000,
  collected: 16650,
  pastDue: [
    { home: "Sample home A", amount: 450, daysLate: 12, bucket: "1 to 30 days" },
    { home: "Sample home B", amount: 450, daysLate: 41, bucket: "31 to 60 days" },
    { home: "Sample home C", amount: 450, daysLate: 74, bucket: "61 to 90 days" }
  ]
};

export const sampleBank = {
  operating: 24310.52,
  reserve: 61870,
  lastSync: "Today, 6:02 AM",
  toReview: 2
};

export const sampleBudgetLines = [
  { label: "Landscaping", budget: 48000, actual: 40150 },
  { label: "Utilities", budget: 7200, actual: 6340 },
  { label: "Pest control", budget: 6500, actual: 5885 },
  { label: "Security and gate", budget: 5000, actual: 4420 },
  { label: "Admin and software", budget: 4000, actual: 2950 },
  { label: "Insurance", budget: 3900, actual: 3889 }
];

export type SampleBill = { id: string; vendor: string; memo: string; amount: number; approvals: number };

export const sampleBills: SampleBill[] = [
  { id: "bill-1", vendor: "Landscape vendor", memo: "November service", amount: 3650, approvals: 1 },
  { id: "bill-2", vendor: "Pest control vendor", memo: "November service", amount: 540, approvals: 0 },
  { id: "bill-3", vendor: "Camera service vendor", memo: "November service", amount: 255, approvals: 2 }
];

export type DraftReview = "Board" | "Attorney" | "CPA";

export const sampleDrafts: { id: string; title: string; basis: string; reviewer: string; review: DraftReview }[] = [
  {
    id: "draft-1",
    title: "Late notice for Sample home B",
    basis: "Drafted from the adopted collection policy and the owner ledger.",
    reviewer: "Treasurer checks, then sends",
    review: "Board"
  },
  {
    id: "draft-2",
    title: "Annual meeting notice and agenda",
    basis: "Drafted from the bylaws notice rules and last year's agenda.",
    reviewer: "Secretary checks, then sends",
    review: "Board"
  },
  {
    id: "draft-3",
    title: "Resolution on fence replacement",
    basis: "Drafted from the declaration and board notes, with page references.",
    reviewer: "Attorney must review before use",
    review: "Attorney"
  },
  {
    id: "draft-4",
    title: "Year-end tax package",
    basis: "Assembled from reconciled books and bank records.",
    reviewer: "CPA must verify before filing",
    review: "CPA"
  }
];

export const sampleDeadlines = [
  { label: "Budget meeting notice", when: "In 9 days", owner: "Secretary" },
  { label: "Insurance renewal review", when: "In 24 days", owner: "Treasurer" },
  { label: "Year-end books to CPA", when: "In 65 days", owner: "Treasurer" },
  { label: "State annual report", when: "In 96 days", owner: "Secretary" }
];
