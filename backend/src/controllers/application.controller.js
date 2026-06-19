const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/apiResponse");
const applicationService = require("../services/application.service");

const createApplication = catchAsync(async (req, res) => {
  const application = await applicationService.createApplication(req.user.id, req.body);
  success(res, 201, application);
});

const listApplications = catchAsync(async (req, res) => {
  const { items, pagination } = await applicationService.listApplications(
    req.user.id,
    req.user.role,
    req.query
  );
  success(res, 200, items, pagination);
});

const updateApplication = catchAsync(async (req, res) => {
  const application = await applicationService.updateApplication(req.params.id, req.user, req.body);
  success(res, 200, application);
});

module.exports = { createApplication, listApplications, updateApplication };
