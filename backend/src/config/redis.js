const { createClient } = require("redis");
const { REDIS_URL } = require("./env");
const logger = require("../utils/logger");

let redisClient = null;
let connected = false;

// Only create a Redis client if REDIS_URL is set — graceful degradation when absent
if (REDIS_URL) {
  redisClient = createClient({ url: REDIS_URL });
  redisClient.on("error", (err) => logger.error(`Redis error: ${err.message}`));
  redisClient.on("connect", () => logger.info("Redis connected"));
} else {
  logger.warn("REDIS_URL not set — caching disabled");
}

async function connectRedis() {
  if (!REDIS_URL || !redisClient) {
    logger.info("Redis skipped (REDIS_URL not configured)");
    return null;
  }
  if (!connected) {
    try {
      await redisClient.connect();
      connected = true;
    } catch (err) {
      logger.error(`Redis connection failed: ${err.message}`);
      // Don't throw — backend continues without cache
    }
  }
  return redisClient;
}

async function cacheGet(key) {
  try {
    if (!connected || !redisClient) return null;
    const val = await redisClient.get(key);
    return val ? JSON.parse(val) : null;
  } catch (err) {
    logger.warn(`Cache get failed for ${key}: ${err.message}`);
    return null;
  }
}

async function cacheSet(key, value, ttlSeconds = 300) {
  try {
    if (!connected || !redisClient) return;
    await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (err) {
    logger.warn(`Cache set failed for ${key}: ${err.message}`);
  }
}

async function cacheDelPattern(pattern) {
  try {
    if (!connected || !redisClient) return;
    for await (const key of redisClient.scanIterator({ MATCH: pattern, COUNT: 100 })) {
      await redisClient.del(key);
    }
  } catch (err) {
    logger.warn(`Cache invalidation failed for ${pattern}: ${err.message}`);
  }
}

module.exports = { redisClient, connectRedis, cacheGet, cacheSet, cacheDelPattern };
