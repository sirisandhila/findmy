const winston = require("winston");

const { NODE_ENV } = process.env;

// Production-safe logger: console only (no filesystem writes for Vercel/serverless)
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      NODE_ENV !== "production"
        ? winston.format.colorize()
        : winston.format.uncolorize(),
      winston.format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level}]: ${stack || message}`;
      })
    ),
  }),
];

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports,
});

module.exports = logger;
