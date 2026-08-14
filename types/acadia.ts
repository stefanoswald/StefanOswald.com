export type ProjectStatus =
  | "Proposed"
  | "Researching"
  | "Quoted"
  | "Attorney Review"
  | "Negotiating"
  | "Approved"
  | "In Progress"
  | "Complete";

export type VoteType = "up" | "down";

export type Vote = {
  projectId: string;
  houseNumber: number;
  voteType: VoteType;
  timestamp: string;
};

export type RelatedDocument = {
  title: string;
  href: string;
  fileType: "DOCX" | "PDF";
  statusLabel?: string;
  note?: string;
};

export type SourceStatus = "Verified" | "Estimate" | "Pending" | "Historical";

export type ProjectSourceNote = {
  title: string;
  sourceType:
    | "Board record"
    | "Vendor information"
    | "Professional assessment"
    | "Community feedback"
    | "Public agency";
  date: string;
  status: SourceStatus;
  summary: string;
  href?: string;
};

export type CommunityFeedbackItem = {
  text: string;
  source: "Facebook community discussion" | "Homeowner correspondence";
  date: string;
  format: "Direct excerpt" | "Summary";
  redactionNote?: string;
};

export type AcadiaGoverningDocument = RelatedDocument & {
  id: string;
  summary: string;
  topicTags: string[];
};

export type Project = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  status: ProjectStatus;
  estimatedCost: string;
  estimatedTimeline: string;
  boardNotes: string;
  vendorQuoteNotes?: string;
  relatedDocuments?: RelatedDocument[];
  lastReviewed?: string;
  sourceNotes?: ProjectSourceNote[];
  openQuestions?: string[];
  communityFeedback?: CommunityFeedbackItem[];
};

export type ProjectVoteCounts = {
  up: number;
  down: number;
  net: number;
};
