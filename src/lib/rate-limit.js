const attemptsMap = new Map();

/**
 * In-memory sliding-window rate limiter
 * @param {string} key - Identifier (e.g. IP or email)
 * @param {number} maxAttempts - Max allowed requests within window
 * @param {number} windowMs - Window duration in milliseconds (default: 15 min)
 * @returns {{ allowed: boolean, remaining: number, retryAfter: number }}
 */
export function checkRateLimit(key, maxAttempts = 10, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const record = attemptsMap.get(key) || [];

  // Filter out expired timestamps
  const validTimestamps = record.filter((timestamp) => now - timestamp < windowMs);

  if (validTimestamps.length >= maxAttempts) {
    const oldest = validTimestamps[0];
    const retryAfter = Math.ceil((windowMs - (now - oldest)) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfter,
    };
  }

  validTimestamps.push(now);
  attemptsMap.set(key, validTimestamps);

  // Periodic cleanup if map grows large
  if (attemptsMap.size > 2000) {
    for (const [k, timestamps] of attemptsMap.entries()) {
      const active = timestamps.filter((t) => now - t < windowMs);
      if (active.length === 0) {
        attemptsMap.delete(k);
      } else {
        attemptsMap.set(k, active);
      }
    }
  }

  return {
    allowed: true,
    remaining: maxAttempts - validTimestamps.length,
    retryAfter: 0,
  };
}

export function resetRateLimit(key) {
  attemptsMap.delete(key);
}
