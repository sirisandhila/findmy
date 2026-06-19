const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/apiResponse");
const collegeService = require("../services/college.service");
const ApiError = require("../utils/ApiError");

const listColleges = catchAsync(async (req, res) => {
  const { items, pagination } = await collegeService.listColleges(req.query);
  success(res, 200, items, pagination);
});

const getCollege = catchAsync(async (req, res) => {
  const college = await collegeService.getCollegeById(req.params.id);
  collegeService.incrementViewCount(college.id);
  success(res, 200, college);
});

const createCollege = catchAsync(async (req, res) => {
  const college = await collegeService.createCollege(req.body);
  success(res, 201, college);
});

const updateCollege = catchAsync(async (req, res) => {
  const college = await collegeService.updateCollege(req.params.id, req.body);
  success(res, 200, college);
});

const deleteCollege = catchAsync(async (req, res) => {
  await collegeService.deleteCollege(req.params.id);
  success(res, 200, { message: "College deleted" });
});

const trending = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const items = await collegeService.getTrending(limit);
  success(res, 200, items);
});

const recommendations = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const items = await collegeService.getRecommendations(req.user.id, limit);
  success(res, 200, items);
});

const compare = catchAsync(async (req, res) => {
  const ids = (req.query.ids || "").split(",").filter(Boolean);
  if (ids.length < 2) throw ApiError.badRequest("Provide at least 2 college ids to compare");
  if (ids.length > 4) throw ApiError.badRequest("You can compare up to 4 colleges at a time");
  const items = await collegeService.compareColleges(ids);
  success(res, 200, items);
});

module.exports = {
  listColleges,
  getCollege,
  createCollege,
  updateCollege,
  deleteCollege,
  trending,
  recommendations,
  compare,
};
