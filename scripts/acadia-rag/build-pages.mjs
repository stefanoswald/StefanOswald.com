#!/usr/bin/env node
// Builds data/acadiaDocumentPages.json from data/acadiaOcrIndex.json.
//
// The OCR index holds every page of the governing documents plus search vectors.
// The Claude document helper only needs the page text, so this script keeps the
// text and drops the rest. Run it again after the OCR index is rebuilt:
//
//   npm run acadia:rag:pages
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const inputPath = path.join(root, "data/acadiaOcrIndex.json");
const outputPath = path.join(root, "data/acadiaDocumentPages.json");

// Reading order for the helper: the Acadia documents first, then the Formosa Gardens master set.
const DOCUMENT_ORDER = [
  "acadia-estates-by-laws-exhibit-b",
  "acadia-estates-articles-of-incorporation-exhibit-a",
  "amendment-to-acadia-estates-2003",
  "exhibit-a",
  "wyndham-pointe-declaration",
  "articles-of-incorporation-wp-2002",
  "master-declaration-covenants-easements-restrictions",
  "amendment-to-master-declaration",
  "by-laws-fgm",
  "plat-book-document"
];

const index = JSON.parse(await fs.readFile(inputPath, "utf8"));

const pages = index.chunks
  .map((chunk) => ({
    id: chunk.id,
    documentId: chunk.documentId,
    documentTitle: chunk.documentTitle,
    href: chunk.href,
    page: chunk.page,
    text: tidy(chunk.text)
  }))
  .filter((page) => page.text.length > 0)
  .sort((a, b) => {
    const orderA = orderOf(a.documentId);
    const orderB = orderOf(b.documentId);
    return orderA === orderB ? a.page - b.page : orderA - orderB;
  });

await fs.writeFile(
  outputPath,
  `${JSON.stringify({ generatedAt: index.generatedAt, ocrEngine: index.ocrEngine, pages })}\n`
);

const characters = pages.reduce((total, page) => total + page.text.length, 0);
console.log(`Wrote ${pages.length} pages (${characters.toLocaleString()} characters) to ${outputPath}`);

function orderOf(documentId) {
  const position = DOCUMENT_ORDER.indexOf(documentId);
  return position === -1 ? DOCUMENT_ORDER.length : position;
}

function tidy(text) {
  return String(text || "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
