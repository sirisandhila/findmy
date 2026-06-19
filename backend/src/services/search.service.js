const prisma = require("../config/db");
const { cacheGet, cacheSet } = require("../config/redis");

async function globalSearch(q, limit = 10) {
  if (!q || !q.trim()) return { colleges: [], courses: [], exams: [] };

  const cacheKey = `search:global:${q}:${limit}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const [colleges, courses, exams] = await Promise.all([
    prisma.college.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
          { state: { contains: q, mode: "insensitive" } },
          { stream: { contains: q, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { rating: "desc" },
    }),
    prisma.course.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      take: limit,
      include: { college: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.exam.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      take: limit,
    }),
  ]);

  const result = { colleges, courses, exams };
  await cacheSet(cacheKey, result, 120);
  return result;
}

async function logSearch(userId, query) {
  if (!query || !query.trim()) return;
  await prisma.searchLog.create({ data: { userId: userId || null, query } }).catch(() => {});
}

async function popularSearches(limit = 10) {
  const cacheKey = `search:popular:${limit}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const grouped = await prisma.searchLog.groupBy({
    by: ["query"],
    _count: { query: true },
    orderBy: { _count: { query: "desc" } },
    take: limit,
  });

  const result = grouped.map((g) => ({ query: g.query, count: g._count.query }));
  await cacheSet(cacheKey, result, 600);
  return result;
}

module.exports = { globalSearch, logSearch, popularSearches };
