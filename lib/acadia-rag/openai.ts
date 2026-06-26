import { ACADIA_ANSWER_MODEL, ACADIA_EMBEDDING_MODEL, getRequiredServerEnv } from "./config";

type OpenAIEmbeddingResponse = {
  data?: Array<{ embedding: number[] }>;
  error?: { message?: string };
};

type OpenAIResponseOutput = {
  type?: string;
  content?: Array<{ type?: string; text?: string }>;
};

type OpenAIResponsesResponse = {
  output?: OpenAIResponseOutput[];
  output_text?: string;
  error?: { message?: string };
};

export async function embedText(input: string) {
  const apiKey = getRequiredServerEnv("OPENAI_API_KEY");
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: ACADIA_EMBEDDING_MODEL,
      input
    })
  });
  const payload = (await response.json()) as OpenAIEmbeddingResponse;

  if (!response.ok || !payload.data?.[0]?.embedding) {
    throw new Error(payload.error?.message || "OpenAI embedding request failed.");
  }

  return payload.data[0].embedding;
}

export async function generateGroundedAnswer(prompt: string) {
  const apiKey = getRequiredServerEnv("OPENAI_API_KEY");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: ACADIA_ANSWER_MODEL,
      input: prompt,
      temperature: 0
    })
  });
  const payload = (await response.json()) as OpenAIResponsesResponse;

  if (!response.ok) {
    throw new Error(payload.error?.message || "OpenAI answer request failed.");
  }

  return payload.output_text || extractOutputText(payload) || "";
}

function extractOutputText(payload: OpenAIResponsesResponse) {
  return payload.output
    ?.flatMap((item) => item.content || [])
    .filter((content) => content.type === "output_text" || content.text)
    .map((content) => content.text || "")
    .join("\n")
    .trim();
}
