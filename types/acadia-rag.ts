export type AcadiaConfidence = "High" | "Medium" | "Low";

export type AcadiaChatCitation = {
  chunkId: string;
  documentName: string;
  href: string;
  page: number;
  article?: string | null;
  section?: string | null;
  subsection?: string | null;
};

export type AcadiaRetrievedChunk = {
  chunkId: string;
  documentId: string;
  documentName: string;
  href: string;
  page: number;
  article?: string | null;
  section?: string | null;
  subsection?: string | null;
  text: string;
  ocrQuality: "good" | "review" | "poor";
  semanticScore: number;
  keywordScore: number;
  rerankScore: number;
};

export type AcadiaChatDebug = {
  userQuestion: string;
  rewrittenQuery: string;
  retrievedChunks: AcadiaRetrievedChunk[];
  finalChunks: AcadiaRetrievedChunk[];
  prompt: string;
  confidenceScore: number;
};

/** One rule from the documents that bears on the question, in plain English, with the page it came from. */
export type AcadiaChatRule = {
  /** Where the rule is, for example "Master Declaration, Section 92". */
  where: string;
  /** What the rule says, in plain English, with the few key words quoted. */
  says: string;
  citation?: AcadiaChatCitation;
};

/**
 * How the documents relate to the question:
 * - direct: the documents address it by name
 * - general_rule: it is not named, but a general rule covers it
 * - not_covered: nothing in the documents bears on it
 * - off_topic: the question is not about Acadia Estates
 */
export type AcadiaAnswerBasis = "direct" | "general_rule" | "not_covered" | "off_topic";

export type AcadiaChatAnswer = {
  answer: string;
  rules?: AcadiaChatRule[];
  nextStep?: string;
  basis?: AcadiaAnswerBasis;
  details?: string;
  confidence: AcadiaConfidence;
  confidenceReason?: string;
  citations: AcadiaChatCitation[];
  debug?: AcadiaChatDebug;
};
