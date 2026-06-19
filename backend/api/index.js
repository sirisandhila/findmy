/**
 * Vercel Serverless Entry Point
 *
 * Vercel invokes this module on every cold start. We export the Express app
 * and kick off a background init (DB connect + Redis connect) so the first
 * request isn't blocked. Prisma auto-connects lazily on the first query if
 * the explicit $connect hasn't resolved yet, so this is safe.
 */
const app = require("../src/app");
const prisma = require("../src/config/db");
const { connectRedis } = require("../src/config/redis");
const logger = require("../src/utils/logger");

let initialised = false;

async function init() {
  if (initialised) return;
  initialised = true;

  // Connect Prisma
  try {
    await prisma.$connect();
    logger.info("Database connected");
  } catch (err) {
    // Prisma will retry on first query — don't abort cold start
    logger.error(`DB connect failed at cold start: ${err.message}`);
  }

  // Connect Redis (connectRedis handles its own errors gracefully)
  try {
    await connectRedis();
  } catch (err) {
    // connectRedis swallows errors internally; this is an extra safety net
    logger.warn(`Redis init error: ${err.message}`);
  }
}

// Fire-and-forget — errors are logged, never unhandled
init().catch((err) => logger.error(`Cold-start init error: ${err.message}`));

// Export the Express app as a Vercel serverless function
module.exports = app;
