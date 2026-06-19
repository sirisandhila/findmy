const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");
const slugify = require("../utils/slugify");

async function listExams({ page, pageSize }) {
  const [items, totalCount] = await Promise.all([
    prisma.exam.findMany({
      orderBy: { examDate: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.exam.count(),
  ]);
  return {
    items,
    pagination: { page, pageSize, totalCount, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)) },
  };
}

async function getExamById(idOrSlug) {
  const exam = await prisma.exam.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: { collegeExams: { include: { college: true } } },
  });
  if (!exam) throw ApiError.notFound("Exam not found");
  return exam;
}

async function createExam(data) {
  const slug = slugify(data.name);
  return prisma.exam.create({ data: { ...data, slug } });
}

module.exports = { listExams, getExamById, createExam };
