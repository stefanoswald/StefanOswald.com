#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const questionsPath = path.join(root, "data/acadiaRagEvalQuestions.json");
const outputPath = path.join(root, "tmp/acadia-rag/evaluation-report.json");
const apiUrl = process.env.ACADIA_RAG_EVAL_URL || "http://localhost:3000/api/acadia/chat";
const debugToken = process.env.ACADIA_RAG_DEBUG_TOKEN;
const questions = JSON.parse(await fs.readFile(questionsPath, "utf8"));
const results = [];

if (!debugToken) {
  throw new Error("ACADIA_RAG_DEBUG_TOKEN is required so evaluation can inspect retrieved chunks.");
}

for (const item of questions) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-acadia-debug-token": debugToken
    },
    body: JSON.stringify({ question: item.question })
  });
  const payload = await response.json();
  const finalText = (payload.debug?.finalChunks || [])
    .map((chunk) => `${chunk.documentName} Page ${chunk.page}\n${chunk.text}`)
    .join("\n\n");
  const retrievedText = (payload.debug?.retrievedChunks || [])
    .map((chunk) => `${chunk.documentName} Page ${chunk.page}\n${chunk.text}`)
    .join("\n\n");
  const expectedTerms = item.expectedTerms || [];
  const finalHits = countTermHits(expectedTerms, finalText);
  const retrievedHits = countTermHits(expectedTerms, retrievedText);
  const precision = expectedTerms.length ? finalHits / expectedTerms.length : 0;
  const recall = expectedTerms.length ? retrievedHits / expectedTerms.length : 0;

  results.push({
    category: item.category,
    question: item.question,
    expectedTerms,
    answer: payload.answer,
    confidence: payload.confidence,
    precision,
    recall,
    citations: payload.citations,
    retrievedChunks: payload.debug?.retrievedChunks || [],
    finalChunks: payload.debug?.finalChunks || []
  });

  console.log(`${item.category}: ${item.question}`);
  console.log(`precision=${precision.toFixed(2)} recall=${recall.toFixed(2)} confidence=${payload.confidence}`);
  console.log("");
}

const summary = {
  questionCount: results.length,
  averagePrecision: average(results.map((result) => result.precision)),
  averageRecall: average(results.map((result) => result.recall)),
  passingPrecision: results.filter((result) => result.precision >= 0.95).length / results.length,
  passingRecall: results.filter((result) => result.recall >= 0.95).length / results.length,
  failingQuestions: results
    .filter((result) => result.precision < 0.95 || result.recall < 0.95)
    .map((result) => ({
      category: result.category,
      question: result.question,
      precision: result.precision,
      recall: result.recall
    }))
};

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify({ summary, results }, null, 2));
console.log(JSON.stringify(summary, null, 2));
console.log(`Wrote ${outputPath}`);

function countTermHits(terms, value) {
  const normalized = value.toLowerCase();
  return terms.filter((term) => normalized.includes(term.toLowerCase())).length;
}

function average(values) {
  if (!values.length) {
    return 0;
  }

  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(3));
}
