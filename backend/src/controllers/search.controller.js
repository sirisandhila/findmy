const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/apiResponse");
const searchService = require("../services/search.service");

const globalSearch = catchAsync(async (req, res) => {
  const { q, limit } = req.query;
  const results = await searchService.globalSearch(q, parseInt(limit, 10) || 10);
  searchService.logSearch(req.user ? req.user.id : null, q);
  success(res, 200, results);
});

const popularSearches = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const results = await searchService.popularSearches(limit);
  success(res, 200, results);
});

module.exports = { globalSearch, popularSearches };
