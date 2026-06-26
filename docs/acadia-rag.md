# Acadia HOA RAG

The Acadia document helper is designed to answer only from the HOA governing documents.
The browser sends only the homeowner question to the server.
The browser does not download the OCR text, embeddings, or document index.

## Runtime Environment

Set these locally and in Vercel:

- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ACADIA_RAG_DEBUG_TOKEN`

Optional overrides:

- `ACADIA_EMBEDDING_MODEL`, defaults to `text-embedding-3-large`
- `ACADIA_ANSWER_MODEL`, defaults to `gpt-5-mini`
- `ACADIA_RETRIEVAL_LIMIT`, defaults to `20`
- `ACADIA_FINAL_CHUNK_LIMIT`, defaults to `6`

## Supabase Setup

Run the SQL in `supabase/acadia-rag.sql` in the Supabase SQL editor.
It creates:

- `acadia_documents`
- `acadia_document_chunks`
- pgvector HNSW index
- keyword-search index
- `match_acadia_chunks` RPC function

## Indexing Flow

1. Prepare OCR and logical chunks:

   ```bash
   npm run acadia:rag:prepare
   ```

2. Review `tmp/acadia-rag/chunks.json`.
   Chunks with `ocrQuality` of `review` or `poor` should be checked before relying on them.
   Poor OCR chunks are stored for audit but excluded from retrieval.

3. Generate embeddings and upload to Supabase:

   ```bash
   npm run acadia:rag:index
   ```

## Evaluation

Start the local app, then run:

```bash
npm run dev
npm run acadia:rag:evaluate
```

The evaluator calls the debug API, captures retrieved chunks, final chunks, citations, answer, and confidence.
It writes a report to `tmp/acadia-rag/evaluation-report.json`.

Do not consider the chatbot production-complete until retrieval precision and recall are at or above 95%.

## Debug Mode

Send the `x-acadia-debug-token` header with the value of `ACADIA_RAG_DEBUG_TOKEN`.
The API will include:

- user question
- rewritten query
- retrieved chunks
- re-ranked order
- final chunks sent to the LLM
- prompt sent to the LLM
- final confidence score

The public browser UI only shows the debug panel when the server returns debug data.
