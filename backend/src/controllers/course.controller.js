const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/apiResponse");
const courseService = require("../services/course.service");

const listCourses = catchAsync(async (req, res) => {
  const { items, pagination } = await courseService.listCourses(req.query);
  success(res, 200, items, pagination);
});

const getCourse = catchAsync(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);
  success(res, 200, course);
});

const createCourse = catchAsync(async (req, res) => {
  const course = await courseService.createCourse(req.body);
  success(res, 201, course);
});

module.exports = { listCourses, getCourse, createCourse };
