const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");
const { cacheDelPattern } = require("../config/redis");

async function recalculateCollegeRating(collegeId) {
  const agg = await prisma.review.aggregate({
    where: { collegeId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.college.update({
    where: { id: collegeId },
    data: {
      rating: agg._avg.rating || 0,
      reviewCount: agg._count.rating,
    },
  });
}

async function createReview(userId, { collegeId, rating, comment }) {
  const college = await prisma.college.findUnique({ where: { id: collegeId } });
  if (!college) throw ApiError.notFound("College not found");

  const existing = await prisma.review.findUnique({
    where: { userId_collegeId: { userId, collegeId } },
  });
  if (existing) throw ApiError.conflict("You have already reviewed this college");

  const review = await prisma.review.create({
    data: { userId, collegeId, rating, comment },
    include: { user: { select: { id: true, name: true, profileImage: true } } },
  });

  await recalculateCollegeRating(collegeId);
  await cacheDelPattern(`college:detail:*`);
  await cacheDelPattern("colleges:list:*");

  return review;
}

async function listByCollege(collegeId, page, pageSize) {
  const [items, totalCount] = await Promise.all([
    prisma.review.findMany({
      where: { collegeId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { user: { select: { id: true, name: true, profileImage: true } } },
    }),
    prisma.review.count({ where: { collegeId } }),
  ]);

  return {
    items,
    pagination: { page, pageSize, totalCount, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)) },
  };
}

async function deleteReview(reviewId, requestingUser) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw ApiError.notFound("Review not found");

  if (review.userId !== requestingUser.id && requestingUser.role !== "ADMIN") {
    throw ApiError.forbidden("You can only delete your own reviews");
  }

  await prisma.review.delete({ where: { id: reviewId } });
  await recalculateCollegeRating(review.collegeId);
  await cacheDelPattern(`college:detail:*`);
  await cacheDelPattern("colleges:list:*");
}

module.exports = { createReview, listByCollege, deleteReview };
