# Acadia HOA document helper

The helper answers homeowner questions from the governing documents and the current HOA items.
The browser sends only the question and the last few turns of the chat to the server.
The browser never downloads the document text.

There are two engines. The route picks one by checking for `ANTHROPIC_API_KEY`.

| Engine | When it runs | What it needs |
| --- | --- | --- |
| Claude, no database (preferred) | `ANTHROPIC_API_KEY` is set | One API key |
| OpenAI + Supabase (older) | `ANTHROPIC_API_KEY` is not set | OpenAI key, Supabase project, pgvector index |

## Claude engine (no database)

The governing documents are only 144 pages. That is small enough to hand to the model whole, so
there is nothing to index and nothing to keep running.

1. `data/acadiaDocumentPages.json` holds the OCR text of every page. It ships with the site.
2. `lib/acadia-rag/corpus.ts` joins those pages with the current HOA items from `data/acadiaProjects.ts`.
3. `lib/acadia-rag/claude.ts` sends that text to Claude with prompt caching turned on.
4. Claude must answer through a `give_answer` tool. The tool returns the answer, a confidence level,
   and the page IDs it relied on. Page IDs that do not exist are dropped before the reply is shown.
5. An answer with no valid page behind it is always shown as Low confidence.

### Setup

Add one environment variable in Vercel (Project, Settings, Environment Variables), then redeploy:

- `ANTHROPIC_API_KEY`

Optional settings:

| Variable | Default | What it does |
| --- | --- | --- |
| `ACADIA_CHAT_MODEL` | `claude-sonnet-5-5` | Model that answers. `claude-haiku-5-5` is cheaper. |
| `ACADIA_CHAT_CONTEXT` | `full` | `full` sends every page. `search` sends only the best-matching pages. |
| `ACADIA_CHAT_SEARCH_PAGES` | `36` | Pages sent in `search` mode. |
| `ACADIA_CHAT_CACHE_TTL` | `5m` | Set to `1h` to keep the cache warm longer. Costs more per cache write. |
| `ACADIA_CHAT_MAX_PER_5_MIN` | `8` | Questions one visitor may ask in five minutes. |
| `ACADIA_CHAT_MAX_PER_DAY` | `300` | Questions per server instance per day. |
| `ACADIA_RAG_DEBUG_TOKEN` | none | Send it as `x-acadia-debug-token` to see the model and token usage. |

### Cost

The full document set with the HOA items is about 460,000 characters, or roughly 115,000 tokens. Prices below use the
Claude API price list as read on November 12, 2026. Check the current list before relying on them.

| Setting | First question after a quiet spell | Follow-up within the cache window |
| --- | --- | --- |
| `full` + `claude-sonnet-5-5` (default) | about 25 to 30 cents | about 1 to 2 cents |
| `full` + `claude-haiku-5-5` | about 6 to 8 cents | under 1 cent |
| `search` + `claude-sonnet-5-5` | about 7 cents | about 7 cents |
| `search` + `claude-haiku-5-5` | under 1 cent | under 1 cent |

`full` gives the best answers because the model sees every page and can notice when two documents
disagree. `search` is cheaper but can miss a page that uses different words than the question.

### Protect the API key

The chat endpoint is public, so anyone can send it questions.

- Set a monthly spend limit on the key in the Claude Console. This is the real backstop.
- The built-in rate limit (`lib/acadia-rag/rate-limit.ts`) lives in server memory. It slows down
  abuse but does not stop a determined script.
- Never put the key in a `NEXT_PUBLIC_` variable or in the repository.

### Updating the documents

When a governing document is added or replaced:

1. Rebuild the OCR index: `python3 scripts/build-acadia-ocr-index.py`
2. Rebuild the page file: `npm run acadia:rag:pages`
3. Commit `data/acadiaDocumentPages.json` and deploy.

HOA items update on their own, because the helper reads `data/acadiaProjects.ts` directly.

## Older engine (OpenAI + Supabase)

This path still works and is used until `ANTHROPIC_API_KEY` is set. Once the Claude engine is live
and checked, the Supabase document tables and the OpenAI key are no longer needed for the helper.
Project votes still use Supabase. See `docs/acadia-voting.md`.

### Runtime environment

- `OPENAI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ACADIA_RAG_DEBUG_TOKEN`

Optional overrides:

- `ACADIA_EMBEDDING_MODEL`, defaults to `text-embedding-3-small`
- `ACADIA_ANSWER_MODEL`, defaults to `gpt-5-mini`
- `ACADIA_RETRIEVAL_LIMIT`, defaults to `20`
- `ACADIA_FINAL_CHUNK_LIMIT`, defaults to `6`

### Supabase setup

Run the SQL in `supabase/acadia-rag.sql` in the Supabase SQL editor.
It creates:

- `acadia_documents`
- `acadia_document_chunks`
- pgvector HNSW index
- keyword-search index
- `match_acadia_chunks` RPC function

### Indexing flow

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

### Evaluation

Start the local app, then run:

```bash
npm run dev
npm run acadia:rag:evaluate
```

The evaluator calls the debug API, captures retrieved chunks, final chunks, citations, answer, and confidence.
It writes a report to `tmp/acadia-rag/evaluation-report.json`.
It measures retrieval, so it applies to the older engine only. The Claude engine has no retrieval
step in `full` mode. Check it by asking the questions in `data/acadiaRagEvalQuestions.json` and
reading the cited pages.

### Debug mode

Send the `x-acadia-debug-token` header with the value of `ACADIA_RAG_DEBUG_TOKEN`.
On the older engine the API will include:

- user question
- rewritten query
- retrieved chunks
- re-ranked order
- final chunks sent to the LLM
- prompt sent to the LLM
- final confidence score

The public browser UI only shows the debug panel when the server returns debug data.
