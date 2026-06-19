const catchAsync = require("../utils/catchAsync");
const { success } = require("../utils/apiResponse");
const examService = require("../services/exam.service");

const listExams = catchAsync(async (req, res) => {
  const { items, pagination } = await examService.listExams(req.query);
  success(res, 200, items, pagination);
});

const getExam = catchAsync(async (req, res) => {
  const exam = await examService.getExamById(req.params.id);
  success(res, 200, exam);
});

const createExam = catchAsync(async (req, res) => {
  const exam = await examService.createExam(req.body);
  success(res, 201, exam);
});

module.exports = { listExams, getExam, createExam };
