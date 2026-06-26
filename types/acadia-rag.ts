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

export type AcadiaChatAnswer = {
  answer: string;
  details?: string;
  confidence: AcadiaConfidence;
  confidenceReason?: string;
  citations: AcadiaChatCitation[];
  debug?: AcadiaChatDebug;
};
