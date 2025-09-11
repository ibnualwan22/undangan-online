import { kv } from "@vercel/kv"

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export async function rateLimit(
  identifier: string,
  limit = 5,
  window: number = 60 * 1000, // 1 minute in milliseconds
): Promise<RateLimitResult> {
  const key = `rate_limit:${identifier}`
  const now = Date.now()
  const windowStart = now - window

  try {
    // Get current requests in the time window
    const requests = await kv.zrangebyscore(key, windowStart, now)
    const currentCount = requests.length

    if (currentCount >= limit) {
      // Get the oldest request to calculate reset time
      const oldestRequest = await kv.zrange(key, 0, 0, { withScores: true })
      const resetTime = oldestRequest.length > 0 ? (oldestRequest[1] as number) + window : now + window

      return {
        success: false,
        limit,
        remaining: 0,
        reset: resetTime,
      }
    }

    // Add current request
    await kv.zadd(key, { score: now, member: `${now}-${Math.random()}` })

    // Clean up old requests and set expiration
    await kv.zremrangebyscore(key, 0, windowStart)
    await kv.expire(key, Math.ceil(window / 1000))

    return {
      success: true,
      limit,
      remaining: limit - currentCount - 1,
      reset: now + window,
    }
  } catch (error) {
    console.error("Rate limiting error:", error)
    // If rate limiting fails, allow the request
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + window,
    }
  }
}

export function getRateLimitHeaders(result: RateLimitResult) {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  }
}
