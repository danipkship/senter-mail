import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env
// Get them free at https://upstash.com
function makeRedis() {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

let _authLimiter:  Ratelimit | null = null;
let _apiLimiter:   Ratelimit | null = null;

function getAuthLimiter() {
  if (_authLimiter) return _authLimiter;
  const redis = makeRedis();
  if (!redis) return null;
  _authLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "rl:auth",
  });
  return _authLimiter;
}

function getApiLimiter() {
  if (_apiLimiter) return _apiLimiter;
  const redis = makeRedis();
  if (!redis) return null;
  _apiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    prefix: "rl:api",
  });
  return _apiLimiter;
}

export async function checkAuthRateLimit(ip: string) {
  const limiter = getAuthLimiter();
  if (!limiter) return { success: true }; // fallback: allow if Redis not configured
  return limiter.limit(ip);
}

export async function checkApiRateLimit(ip: string) {
  const limiter = getApiLimiter();
  if (!limiter) return { success: true };
  return limiter.limit(ip);
}
