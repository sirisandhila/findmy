const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/apiResponse");
const savedService = require("../services/saved.service");

const saveCollege = catchAsync(async (req, res) => {
  const saved = await savedService.saveCollege(req.user.id, req.body.collegeId);
  success(res, 201, saved);
});

const unsaveCollege = catchAsync(async (req, res) => {
  await savedService.unsaveCollege(req.user.id, req.params.collegeId);
  success(res, 200, { message: "Removed from saved colleges" });
});

const listSaved = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 10;
  const { items, pagination } = await savedService.listSaved(req.user.id, page, pageSize);
  success(res, 200, items, pagination);
});

module.exports = { saveCollege, unsaveCollege, listSaved };
