import "server-only";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;

const hitsByKey = new Map<string, number[]>();

/**
 * Best-effort, in-memory rate limit — good enough for a single-instance MVP.
 * It does not share state across serverless instances, so it stops being
 * a real guarantee once the app scales horizontally. Swap for Upstash Redis
 * (env vars already reserved in .env.example) before that happens.
 */
export async function checkRateLimit(key: string): Promise<boolean> {
  const now = Date.now();
  const recentHits = (hitsByKey.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recentHits.length >= MAX_REQUESTS_PER_WINDOW) {
    hitsByKey.set(key, recentHits);
    return false;
  }

  recentHits.push(now);
  hitsByKey.set(key, recentHits);
  return true;
}
