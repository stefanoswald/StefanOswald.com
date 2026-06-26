export type ProjectStatus =
  | "Proposed"
  | "Researching"
  | "Quoted"
  | "Attorney Review"
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
};

export type ProjectVoteCounts = {
  up: number;
  down: number;
  net: number;
};
