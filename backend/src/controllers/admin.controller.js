const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/apiResponse");
const adminService = require("../services/admin.service");

const listUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 20;
  const { items, pagination } = await adminService.listUsers({ page, pageSize, role: req.query.role });
  success(res, 200, items, pagination);
});

const analytics = catchAsync(async (req, res) => {
  const data = await adminService.getAnalytics();
  success(res, 200, data);
});

const listColleges = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.pageSize, 10) || 20;
  const { items, pagination } = await adminService.listCollegesAdmin({ page, pageSize });
  success(res, 200, items, pagination);
});

module.exports = { listUsers, analytics, listColleges };
