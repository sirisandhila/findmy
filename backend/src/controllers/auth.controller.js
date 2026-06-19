const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/apiResponse");
const authService = require("../services/auth.service");

const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  success(res, 201, result);
});

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  success(res, 200, result);
});

const refresh = catchAsync(async (req, res) => {
  const result = await authService.refreshTokens(req.body.refreshToken);
  success(res, 200, result);
});

const logout = catchAsync(async (req, res) => {
  // Stateless JWT: logout is handled client-side by discarding tokens.
  // If a token blacklist/redis session store is desired, add it here.
  success(res, 200, { message: "Logged out successfully" });
});

const me = catchAsync(async (req, res) => {
  success(res, 200, req.user);
});

module.exports = { register, login, refresh, logout, me };
