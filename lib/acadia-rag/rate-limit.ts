// A small in-memory limit on chat questions, to keep one visitor or a script from running up the
// API bill. It lives in the memory of a single server instance, so it is a speed bump, not a wall.
// The real backstop is a monthly spend limit on the API key in the Claude Console.

const WINDOW_MS = 5 * 60 * 1000;
const MAX_PER_VISITOR = Number(process.env.ACADIA_CHAT_MAX_PER_5_MIN || 8);
const MAX_PER_DAY = Number(process.env.ACADIA_CHAT_MAX_PER_DAY || 300);

const visitorHits = new Map<string, number[]>();
let dayStart = Date.now();
let dayCount = 0;

export function checkChatRateLimit(visitorKey: string, now = Date.now()): { allowed: boolean; reason?: string } {
  if (now - dayStart > 24 * 60 * 60 * 1000) {
    dayStart = now;
    dayCount = 0;
  }

  if (dayCount >= MAX_PER_DAY) {
    return { allowed: false, reason: "The document helper has reached its daily limit. Please try again tomorrow." };
  }

  const recent = (visitorHits.get(visitorKey) || []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_PER_VISITOR) {
    visitorHits.set(visitorKey, recent);
    return { allowed: false, reason: "That is a lot of questions in a short time. Please wait a few minutes and try again." };
  }

  recent.push(now);
  visitorHits.set(visitorKey, recent);
  dayCount += 1;

  // Keep the map from growing forever.
  if (visitorHits.size > 2000) {
    for (const [key, times] of visitorHits) {
      if (!times.some((time) => now - time < WINDOW_MS)) visitorHits.delete(key);
    }
  }

  return { allowed: true };
}

export function visitorKeyFromRequest(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  return forwarded.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
}
