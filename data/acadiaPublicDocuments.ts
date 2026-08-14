import type { RelatedDocument } from "@/types/acadia";

export type AcadiaPublicDocument = RelatedDocument & {
  redactions: string[];
};

export const juneProjectUpdate: AcadiaPublicDocument = {
  title: "June 25, 2026 Project Update",
  href: "/acadia-documents/june-25-2026-project-update.docx",
  fileType: "DOCX",
  statusLabel: "Historical working update",
  note:
    "Retained for context. The later Urban Tree Doctor assessment supersedes its assumption that four trees could not be preserved. Personal names are redacted.",
  redactions: ["Two personal names", "Document author and edit-history metadata"]
};

export const actionTreeOpinion: AcadiaPublicDocument = {
  title: "Action Environmental Tree Opinion",
  href: "/acadia-documents/ace-tree-opinion.docx",
  fileType: "DOCX",
  statusLabel: "Vendor opinion",
  note:
    "A vendor's professional opinion and service proposal, not an independent board finding. Personal name and direct mobile number are redacted.",
  redactions: ["Recipient and representative names", "Direct mobile number", "Document metadata"]
};

export const landscapeEstimate: AcadiaPublicDocument = {
  title: "Action Environmental Landscape Estimate 1555",
  href: "/acadia-documents/aec-landscape-estimate-all-acadia.pdf",
  fileType: "PDF",
  statusLabel: "Expired estimate",
  note:
    "Dated June 16, 2026 with a 30-day validity period. Scope and prices remain visible; the HOA address, private quote link, direct phone, and payment contact are redacted.",
  redactions: [
    "Residential HOA mailing address",
    "Private online quote link",
    "Direct phone number",
    "Payment contact"
  ]
};

export const augustMeetingAgenda: AcadiaPublicDocument = {
  title: "August 13, 2026 HOA Meeting Agenda",
  href: "/acadia-documents/august-13-2026-meeting-agenda.docx",
  fileType: "DOCX",
  statusLabel: "Agenda, not adopted decisions",
  note:
    "Shows items scheduled for discussion or a possible vote. Names, house numbers, and access codes are redacted.",
  redactions: ["Personal names", "Two house numbers", "Current and former access codes", "Document metadata"]
};

export const communityReminders: AcadiaPublicDocument = {
  title: "Acadia Estates Homeowner Reminders",
  href: "/acadia-documents/acadia-estates-community-reminders.docx",
  fileType: "DOCX",
  statusLabel: "Historical / Under review",
  note:
    "Published unchanged for transparency. Some enforcement and parking language requires current board and legal confirmation before it is treated as binding guidance.",
  redactions: ["Document author and edit-history metadata only"]
};

export const urbanTreeDoctorScope: AcadiaPublicDocument = {
  title: "Urban Tree Doctor Assessment and Scope of Work",
  href: "/acadia-documents/urban-tree-doctor-scope-of-work.pdf",
  fileType: "PDF",
  statusLabel: "Professional assessment / Redacted",
  note:
    "All tree findings, recommendations, and prices remain visible. House numbers are replaced with consistent anonymous residence labels.",
  redactions: ["Individual house numbers, replaced consistently with R01-R31"]
};

export const greenrockIrrigationEstimate: AcadiaPublicDocument = {
  title: "GreenRock Irrigation Repair Estimate 2312",
  href: "/acadia-documents/greenrock-irrigation-estimate-2312.pdf",
  fileType: "PDF",
  statusLabel: "Estimate / Diagnosis pending",
  note:
    "The quoted scope and $465 price remain visible. The affected house number is replaced with an anonymous residence label.",
  redactions: ["Affected house number, replaced with R01"]
};

export const acadiaPublicDocuments: AcadiaPublicDocument[] = [
  augustMeetingAgenda,
  juneProjectUpdate,
  urbanTreeDoctorScope,
  actionTreeOpinion,
  landscapeEstimate,
  greenrockIrrigationEstimate,
  communityReminders
];
