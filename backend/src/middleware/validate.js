const ApiError = require("../utils/ApiError");

// Generic Zod-based validator middleware.
// schema: { body?: ZodSchema, query?: ZodSchema, params?: ZodSchema }
const validate = (schema) => (req, res, next) => {
  try {
    if (schema.body) req.body = schema.body.parse(req.body);
    if (schema.query) req.query = schema.query.parse(req.query);
    if (schema.params) req.params = schema.params.parse(req.params);
    next();
  } catch (err) {
    const details = err.issues
      ? err.issues.map((i) => ({ path: i.path.join("."), message: i.message }))
      : err.message;
    next(ApiError.badRequest("Validation failed", details));
  }
};

module.exports = validate;
