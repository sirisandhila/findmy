const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/apiResponse");
const reviewService = require("../services/review.service");

const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.body);
  success(res, 201, review);
});

const listByCollege = catchAsync(async (req, res) => {
  // Coerce to integers — req.query values are always strings from HTTP.
  // The Zod schema (validate middleware) has already parsed them, but
  // this controller also handles direct calls without that middleware,
  // so we defensively parseInt here to prevent NaN in skip/take.
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const { items, pagination } = await reviewService.listByCollege(
    req.params.collegeId,
    page,
    pageSize
  );
  success(res, 200, items, pagination);
});

const deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReview(req.params.id, req.user);
  success(res, 200, { message: "Review deleted" });
});

module.exports = { createReview, listByCollege, deleteReview };
