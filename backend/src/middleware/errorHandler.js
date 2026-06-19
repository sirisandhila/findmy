const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");
const { NODE_ENV } = require("../config/env");

function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

function errorConverter(err, req, res, next) {
  let error = err;
  if (!(error instanceof ApiError)) {
    // Prisma known errors
    if (error.code === "P2002") {
      error = ApiError.conflict(
        `Duplicate value for field(s): ${(error.meta && error.meta.target) || "unknown"}`
      );
    } else if (error.code === "P2025") {
      error = ApiError.notFound("Record not found");
    } else if (error.name === "ValidationError" || error.name === "ZodError") {
      error = ApiError.badRequest("Validation failed", error.errors || error.issues);
    } else {
      const statusCode = error.statusCode || 500;
      error = new ApiError(statusCode, error.message || "Internal server error");
    }
  }
  next(error);
}

function errorHandler(err, req, res, next) {
  const { statusCode = 500, message, details } = err;

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${message}`, { stack: err.stack });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
}

module.exports = { notFoundHandler, errorConverter, errorHandler };
