const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { verifyAccessToken } = require("../utils/jwt");
const prisma = require("../config/db");

const authenticate = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Authentication token missing");
  }
  const token = header.split(" ")[1];

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    throw ApiError.unauthorized("Invalid or expired token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw ApiError.unauthorized("User no longer exists");

  req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
  next();
});

// Doesn't fail if no token, but attaches user if present (for optional personalization)
const optionalAuthenticate = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return next();
  const token = header.split(" ")[1];
  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (user) req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
  } catch (err) {
    // ignore invalid token for optional auth
  }
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return next(ApiError.unauthorized());
  if (!roles.includes(req.user.role)) {
    return next(ApiError.forbidden("You do not have permission to perform this action"));
  }
  next();
};

module.exports = { authenticate, optionalAuthenticate, authorize };
