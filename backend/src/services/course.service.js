const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");
const { cacheDelPattern } = require("../config/redis");

async function listCourses({ collegeId, stream, page, pageSize }) {
  const where = {
    ...(collegeId ? { collegeId } : {}),
    ...(stream ? { stream: { equals: stream, mode: "insensitive" } } : {}),
  };
  const [items, totalCount] = await Promise.all([
    prisma.course.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { college: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.course.count({ where }),
  ]);
  return {
    items,
    pagination: { page, pageSize, totalCount, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)) },
  };
}

async function getCourseById(id) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: { college: true },
  });
  if (!course) throw ApiError.notFound("Course not found");
  return course;
}

async function createCourse(data) {
  const college = await prisma.college.findUnique({ where: { id: data.collegeId } });
  if (!college) throw ApiError.notFound("College not found");

  const course = await prisma.course.create({ data });
  await prisma.college.update({
    where: { id: data.collegeId },
    data: { courseCount: { increment: 1 } },
  });
  await cacheDelPattern("college:detail:*");
  return course;
}

module.exports = { listCourses, getCourseById, createCourse };
