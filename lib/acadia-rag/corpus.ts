// The text the Claude document helper reads.
//
// There is no database here. The governing documents are only 144 pages, so their text ships with
// the site in data/acadiaDocumentPages.json. Current project records come from data/acadiaProjects.ts.
// Rebuild the pages file with `npm run acadia:rag:pages` after the OCR index changes.
import pagesFile from "@/data/acadiaDocumentPages.json";
import { acadiaProjects } from "@/data/acadiaProjects";
import { expandQuery, tokenize } from "./text";

export type AcadiaSource = {
  id: string;
  kind: "page" | "project";
  documentId: string;
  documentName: string;
  href: string;
  page: number;
  text: string;
};

type PageRecord = {
  id: string;
  documentId: string;
  documentTitle: string;
  href: string;
  page: number;
  text: string;
};

const pageSources: AcadiaSource[] = (pagesFile.pages as PageRecord[]).map((page) => ({
  id: page.id,
  kind: "page",
  documentId: page.documentId,
  documentName: page.documentTitle,
  href: page.href,
  page: page.page,
  text: page.text
}));

const projectSources: AcadiaSource[] = acadiaProjects.map((project) => ({
  id: `project-${project.id}`,
  kind: "project",
  documentId: "current-hoa-items",
  documentName: `Current HOA item: ${project.title}`,
  href: `/Acadia/projects/${project.id}`,
  page: 0,
  text: [
    `Title: ${project.title}`,
    `Status: ${project.status}`,
    `Last reviewed: ${project.lastReviewed || "not stated"}`,
    `Summary: ${project.fullDescription}`,
    `Cost: ${project.estimatedCost}`,
    `Timeline: ${project.estimatedTimeline}`,
    `Board notes: ${project.boardNotes}`,
    project.vendorQuoteNotes ? `Vendor notes: ${project.vendorQuoteNotes}` : "",
    project.openQuestions?.length ? `Open questions: ${project.openQuestions.join(" ")}` : ""
  ]
    .filter(Boolean)
    .join("\n")
}));

export const acadiaSources: AcadiaSource[] = [...pageSources, ...projectSources];

const sourceById = new Map(acadiaSources.map((source) => [source.id, source]));

export function getAcadiaSource(id: string) {
  return sourceById.get(id);
}

/** Every governing-document page and every project record, as one block of text for the model. */
export function buildFullContext() {
  return formatSources(acadiaSources);
}

/**
 * A smaller block for "search" mode: the pages that best match the question, plus every project
 * record. Project records are short, so they are always included.
 */
export function buildSearchContext(question: string, pageLimit: number) {
  const pages = searchPages(question, pageLimit);
  return formatSources([...pages, ...projectSources]);
}

function formatSources(sources: AcadiaSource[]) {
  const parts: string[] = [];
  let openDocument = "";

  for (const source of sources) {
    if (source.kind === "page") {
      if (source.documentId !== openDocument) {
        if (openDocument) parts.push("</document>");
        parts.push(`<document title="${escapeAttribute(source.documentName)}">`);
        openDocument = source.documentId;
      }
      parts.push(`<page id="${source.id}" number="${source.page}">\n${source.text}\n</page>`);
    } else {
      if (openDocument) {
        parts.push("</document>");
        openDocument = "";
      }
      parts.push(`<hoa_item id="${source.id}">\n${source.text}\n</hoa_item>`);
    }
  }

  if (openDocument) parts.push("</document>");
  return parts.join("\n");
}

function escapeAttribute(value: string) {
  return value.replace(/&/g, "and").replace(/"/g, "'");
}

// ---- Keyword search (BM25) over the 144 pages. Used only in "search" mode. ----

type IndexedPage = { source: AcadiaSource; termCounts: Map<string, number>; length: number };

let pageIndex: { pages: IndexedPage[]; documentFrequency: Map<string, number>; averageLength: number } | null =
  null;

function getPageIndex() {
  if (pageIndex) return pageIndex;

  const documentFrequency = new Map<string, number>();
  const pages = pageSources.map((source) => {
    const terms = tokenize(`${source.documentName} ${source.text}`);
    const termCounts = new Map<string, number>();
    for (const term of terms) termCounts.set(term, (termCounts.get(term) || 0) + 1);
    for (const term of termCounts.keys()) documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1);
    return { source, termCounts, length: terms.length };
  });
  const averageLength = pages.reduce((total, page) => total + page.length, 0) / Math.max(pages.length, 1);

  pageIndex = { pages, documentFrequency, averageLength };
  return pageIndex;
}

export function searchPages(question: string, limit: number): AcadiaSource[] {
  const { pages, documentFrequency, averageLength } = getPageIndex();
  const queryTerms = Array.from(new Set(tokenize(expandQuery(question))));
  const k1 = 1.4;
  const b = 0.75;

  const scored = pages
    .map((page) => {
      let score = 0;
      for (const term of queryTerms) {
        const count = page.termCounts.get(term);
        if (!count) continue;
        const frequency = documentFrequency.get(term) || 0;
        const idf = Math.log(1 + (pages.length - frequency + 0.5) / (frequency + 0.5));
        score += (idf * (count * (k1 + 1))) / (count + k1 * (1 - b + (b * page.length) / averageLength));
      }
      return { page, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.page.source);

  // Hand the pages over in reading order so neighbouring pages stay together.
  const order = new Map(pageSources.map((source, position) => [source.id, position]));
  return scored.sort((a, b) => (order.get(a.id) || 0) - (order.get(b.id) || 0));
}
