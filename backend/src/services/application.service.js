const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");

async function createApplication(userId, { collegeId, notes }) {
  const college = await prisma.college.findUnique({ where: { id: collegeId } });
  if (!college) throw ApiError.notFound("College not found");

  const existing = await prisma.application.findFirst({ where: { userId, collegeId } });
  if (existing) throw ApiError.conflict("You have already applied to this college");

  return prisma.application.create({
    data: { userId, collegeId, notes },
    include: { college: true },
  });
}

async function listApplications(userId, role, { status, page, pageSize }) {
  const where = role === "ADMIN" ? {} : { userId };
  if (status) where.status = status;

  const [items, totalCount] = await Promise.all([
    prisma.application.findMany({
      where,
      include: { college: true, user: { select: { id: true, name: true, email: true } } },
      orderBy: { appliedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.application.count({ where }),
  ]);

  return {
    items,
    pagination: { page, pageSize, totalCount, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)) },
  };
}

async function updateApplication(id, requestingUser, data) {
  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) throw ApiError.notFound("Application not found");

  const isOwner = application.userId === requestingUser.id;
  const isAdmin = requestingUser.role === "ADMIN";
  if (!isOwner && !isAdmin) throw ApiError.forbidden("Not allowed to update this application");

  // Students may only withdraw or edit notes; only admins may set review statuses
  if (!isAdmin && data.status && data.status !== "WITHDRAWN") {
    throw ApiError.forbidden("Only admins can update application status");
  }

  return prisma.application.update({ where: { id }, data });
}

module.exports = { createApplication, listApplications, updateApplication };
