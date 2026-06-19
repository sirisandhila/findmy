const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");

async function saveCollege(userId, collegeId) {
  const college = await prisma.college.findUnique({ where: { id: collegeId } });
  if (!college) throw ApiError.notFound("College not found");

  const existing = await prisma.savedCollege.findUnique({
    where: { userId_collegeId: { userId, collegeId } },
  });
  if (existing) throw ApiError.conflict("College already saved");

  return prisma.savedCollege.create({ data: { userId, collegeId } });
}

async function unsaveCollege(userId, collegeId) {
  const existing = await prisma.savedCollege.findUnique({
    where: { userId_collegeId: { userId, collegeId } },
  });
  if (!existing) throw ApiError.notFound("Saved college not found");
  await prisma.savedCollege.delete({ where: { userId_collegeId: { userId, collegeId } } });
}

async function listSaved(userId, page = 1, pageSize = 10) {
  const [items, totalCount] = await Promise.all([
    prisma.savedCollege.findMany({
      where: { userId },
      include: { college: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.savedCollege.count({ where: { userId } }),
  ]);

  return {
    items: items.map((i) => i.college),
    pagination: { page, pageSize, totalCount, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)) },
  };
}

module.exports = { saveCollege, unsaveCollege, listSaved };
