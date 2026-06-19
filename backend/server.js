// Local development server — NOT used on Vercel (api/index.js is the entry point)
const app = require("./src/app");
const { PORT, NODE_ENV } = require("./src/config/env");
const { connectRedis } = require("./src/config/redis");
const prisma = require("./src/config/db");
const logger = require("./src/utils/logger");

async function start() {
  try {
    await connectRedis();
    await prisma.$connect();
    logger.info("Database connected");

    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
      logger.info(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received: closing server gracefully`);
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (reason) => {
      logger.error(`Unhandled Rejection: ${reason}`);
    });

    process.on("uncaughtException", (err) => {
      logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
      process.exit(1);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

start();
