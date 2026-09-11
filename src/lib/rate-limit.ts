/**
 * A small in-memory rate limiter for the public API routes.
 *
 * It protects a single server instance from casual abuse. When the project
 * moves to multiple servers this should be swapped for a shared store
 * (for example Supabase or Redis) — the function signature stays the same.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 10_000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

export function rateLimit(
  key: string,
  limit = 30,
  windowSeconds = 60,
): RateLimitResult {
  const now = Date.now();

  // Cheap cleanup so the map cannot grow without bound.
  if (buckets.size > MAX_TRACKED_KEYS) {
    for (const [k, v] of buckets) {
      if (v.resetAt <= now) buckets.delete(k);
    }
    if (buckets.size > MAX_TRACKED_KEYS) buckets.clear();
  }

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: limit - 1, resetInSeconds: windowSeconds };
  }

  existing.count += 1;
  const resetInSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  return {
    allowed: existing.count <= limit,
    remaining: Math.max(0, limit - existing.count),
    resetInSeconds,
  };
}

/**
 * Best-effort client identifier.
 * Only used for rate limiting and never stored or logged.
 */
export function clientKey(request: Request): string {
  const headers = request.headers;
  const forwarded = headers.get('x-forwarded-for');
  const ip =
    forwarded?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown';
  return ip;
}
