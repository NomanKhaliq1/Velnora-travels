import "server-only";

// In-memory, per server process. Good enough for a single Node instance;
// swap for Redis or similar if the site ever runs on several instances.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function allowRequest(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

export function clearRequests(key: string) {
  buckets.delete(key);
}
