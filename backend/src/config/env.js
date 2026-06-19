require("dotenv").config();

/**
 * Hard-fail for required env vars. Called at module load time so the
 * process exits immediately with a clear message rather than crashing
 * later with a confusing runtime error.
 */
function required(name) {
  const v = process.env[name];
  if (!v) {
    // Use console.error directly — logger may not be initialised yet
    console.error(`[config] FATAL: Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return v;
}

function optional(name, fallback) {
  return process.env[name] ?? fallback;
}

module.exports = {
  NODE_ENV:  optional("NODE_ENV", "development"),
  PORT:      parseInt(optional("PORT", "4000"), 10),

  // ── REQUIRED ────────────────────────────────────────────────────────────────
  DATABASE_URL:        required("DATABASE_URL"),
  JWT_SECRET:          required("JWT_SECRET"),
  JWT_REFRESH_SECRET:  required("JWT_REFRESH_SECRET"),  // Must be explicitly set — no insecure fallback

  // ── OPTIONAL ─────────────────────────────────────────────────────────────────
  JWT_EXPIRES_IN:         optional("JWT_EXPIRES_IN", "7d"),
  JWT_REFRESH_EXPIRES_IN: optional("JWT_REFRESH_EXPIRES_IN", "30d"),

  // null signals redis.js to skip client creation entirely
  REDIS_URL: process.env.REDIS_URL || null,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || null,
  CLOUDINARY_API_KEY:    process.env.CLOUDINARY_API_KEY    || null,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || null,

  CORS_ORIGIN:          optional("CORS_ORIGIN", "http://localhost:3000"),
  RATE_LIMIT_WINDOW_MS: parseInt(optional("RATE_LIMIT_WINDOW_MS", "900000"), 10),
  RATE_LIMIT_MAX:       parseInt(optional("RATE_LIMIT_MAX", "300"), 10),
};
