export const ACADIA_EMBEDDING_MODEL =
  process.env.ACADIA_EMBEDDING_MODEL || "text-embedding-3-small";

export const ACADIA_ANSWER_MODEL =
  process.env.ACADIA_ANSWER_MODEL || "gpt-5-mini";

export const ACADIA_RETRIEVAL_LIMIT = Number(process.env.ACADIA_RETRIEVAL_LIMIT || 20);
export const ACADIA_FINAL_CHUNK_LIMIT = Number(process.env.ACADIA_FINAL_CHUNK_LIMIT || 6);

export function getRequiredServerEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

export function isDebugAllowed(request: Request) {
  const debugToken = process.env.ACADIA_RAG_DEBUG_TOKEN;

  if (!debugToken) {
    return false;
  }

  return request.headers.get("x-acadia-debug-token") === debugToken;
}
