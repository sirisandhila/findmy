const { PrismaClient } = require("@prisma/client");
const logger = require("../utils/logger");

// Singleton pattern: prevent multiple PrismaClient instances in serverless hot reloads
const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: [
      { emit: "event", level: "error" },
      { emit: "event", level: "warn" },
      ...(process.env.NODE_ENV === "development"
        ? [{ emit: "event", level: "query" }]
        : []),
    ],
  });

prisma.$on("error", (e) => logger.error(`Prisma error: ${e.message}`));
prisma.$on("warn", (e) => logger.warn(`Prisma warn: ${e.message}`));
if (process.env.NODE_ENV === "development") {
  prisma.$on("query", (e) =>
    logger.debug(`${e.query} -- ${e.params} (${e.duration}ms)`)
  );
}

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

module.exports = prisma;
