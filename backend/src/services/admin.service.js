const prisma = require("../config/db");

async function listUsers({ page, pageSize, role }) {
  const where = role ? { role } : {};
  const [items, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, profileImage: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);
  return {
    items,
    pagination: { page, pageSize, totalCount, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)) },
  };
}

async function getAnalytics() {
  const [
    totalUsers,
    totalColleges,
    totalReviews,
    totalApplications,
    applicationsByStatus,
    topColleges,
    recentSignups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.college.count(),
    prisma.review.count(),
    prisma.application.count(),
    prisma.application.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.college.findMany({ orderBy: { viewCount: "desc" }, take: 5, select: { id: true, name: true, viewCount: true, rating: true } }),
    prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }),
  ]);

  return {
    totals: { users: totalUsers, colleges: totalColleges, reviews: totalReviews, applications: totalApplications },
    applicationsByStatus: applicationsByStatus.map((a) => ({ status: a.status, count: a._count.status })),
    topColleges,
    recentSignups30d: recentSignups,
  };
}

async function listCollegesAdmin({ page, pageSize }) {
  const [items, totalCount] = await Promise.all([
    prisma.college.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.college.count(),
  ]);
  return {
    items,
    pagination: { page, pageSize, totalCount, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)) },
  };
}

module.exports = { listUsers, getAnalytics, listCollegesAdmin };
