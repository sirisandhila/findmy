const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const swaggerUi = require("swagger-ui-express");
const morgan = require("morgan");

const { CORS_ORIGIN, NODE_ENV } = require("./config/env");
const swaggerSpec = require("./config/swagger");
const routes = require("./routes");
const { apiLimiter } = require("./middleware/rateLimiter");
const {
  notFoundHandler,
  errorConverter,
  errorHandler,
} = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const app = express();

// Trust proxy (required on Vercel and most PaaS)
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// CORS — support comma-separated origins
app.use(
  cors({
    origin: CORS_ORIGIN.split(",").map((o) => o.trim()),
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression
app.use(compression());

// HTTP request logging (skip in test)
if (NODE_ENV !== "test") {
  app.use(
    morgan("combined", {
      stream: { write: (msg) => logger.info(msg.trim()) },
    })
  );
}

// Rate limiting on all API routes
app.use("/api", apiLimiter);

// Health check
app.get("/health", (req, res) =>
  res.status(200).json({ status: "ok", uptime: process.uptime() })
);

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));

// API routes
app.use("/api", routes);

// 404 handler
app.use(notFoundHandler);

// Error pipeline
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
