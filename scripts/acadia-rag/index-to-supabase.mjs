#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const inputPath = path.join(root, "tmp/acadia-rag/chunks.json");
const embeddingModel = process.env.ACADIA_EMBEDDING_MODEL || "text-embedding-3-small";
const openAiApiKey = requiredEnv("OPENAI_API_KEY");
const supabaseUrl = requiredEnv("SUPABASE_URL").replace(/\/$/, "");
const supabaseServiceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");

const payload = JSON.parse(await fs.readFile(inputPath, "utf8"));

await upsertDocuments(payload.documents);

for (const batch of batches(payload.chunks, 24)) {
  const embeddings = await embedBatch(batch.map((chunk) => embeddingInput(chunk)));
  const rows = batch.map((chunk, index) => ({
    chunk_id: chunk.chunkId,
    document_id: chunk.documentId,
    document_name: chunk.documentName,
    href: chunk.href,
    page_number: chunk.page,
    article: chunk.article,
    section: chunk.section,
    subsection: chunk.subsection,
    content: chunk.text,
    token_count: chunk.tokenCount,
    ocr_quality: chunk.ocrQuality,
    ocr_warnings: chunk.ocrWarnings,
    embedding: `[${embeddings[index].join(",")}]`
  }));

  await supabaseFetch("/rest/v1/acadia_document_chunks", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates"
    },
    body: JSON.stringify(rows)
  });
  console.log(`Indexed ${Math.min(payload.chunks.length, payload.chunks.indexOf(batch.at(-1)) + 1)} / ${payload.chunks.length}`);
}

console.log("Acadia RAG index uploaded to Supabase.");

async function upsertDocuments(documents) {
  const rows = documents.map((document) => ({
    document_id: document.documentId,
    document_name: document.documentName,
    file_name: document.fileName,
    href: document.href,
    checksum: document.checksum,
    page_count: document.pageCount
  }));

  await supabaseFetch("/rest/v1/acadia_documents", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates"
    },
    body: JSON.stringify(rows)
  });
}

async function embedBatch(inputs) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: embeddingModel,
      input: inputs
    })
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || "OpenAI embedding request failed.");
  }

  return result.data.map((item) => item.embedding);
}

async function supabaseFetch(endpoint, init) {
  const response = await fetch(`${supabaseUrl}${endpoint}`, {
    ...init,
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      ...init.headers
    }
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${await response.text()}`);
  }
}

function embeddingInput(chunk) {
  return [
    chunk.documentName,
    chunk.article,
    chunk.section,
    chunk.subsection,
    `Page ${chunk.page}`,
    chunk.text
  ]
    .filter(Boolean)
    .join("\n");
}

function batches(items, size) {
  const result = [];

  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }

  return result;
}

function requiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}
