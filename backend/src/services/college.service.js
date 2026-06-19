const prisma = require("../config/db");
const ApiError = require("../utils/ApiError");
const slugify = require("../utils/slugify");
const { cacheGet, cacheSet, cacheDelPattern } = require("../config/redis");

function csvToArray(v) {
  return v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

function buildOrderBy(sort) {
  switch (sort) {
    case "rating":
      return [{ rating: "desc" }];
    case "fees-low":
      return [{ fees: "asc" }];
    case "fees-high":
      return [{ fees: "desc" }];
    case "popular":
      return [{ viewCount: "desc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    case "ranking":
    default:
      return [{ ranking: "asc" }];
  }
}

async function listColleges(query) {
  const {
    q,
    stream,
    state,
    city,
    type,
    maxFees,
    minFees,
    minRating,
    course,
    sort,
    page,
    pageSize,
  } = query;

  const cacheKey = `colleges:list:${JSON.stringify(query)}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const streams = csvToArray(stream);
  const states = csvToArray(state);
  const types = csvToArray(type).map((t) => t.toUpperCase());

  const where = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { location: { contains: q, mode: "insensitive" } },
              { stream: { contains: q, mode: "insensitive" } },
              { city: { contains: q, mode: "insensitive" } },
              { exams: { has: q } },
            ],
          }
        : {},
      streams.length ? { stream: { in: streams } } : {},
      states.length ? { state: { in: states } } : {},
      types.length ? { type: { in: types } } : {},
      city ? { city: { equals: city, mode: "insensitive" } } : {},
      maxFees !== undefined ? { fees: { lte: maxFees } } : {},
      minFees !== undefined ? { fees: { gte: minFees } } : {},
      minRating !== undefined ? { rating: { gte: minRating } } : {},
      course
        ? { courses: { some: { name: { contains: course, mode: "insensitive" } } } }
        : {},
    ],
  };

  const [items, totalCount] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy: buildOrderBy(sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.college.count({ where }),
  ]);

  const result = {
    items,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    },
  };

  await cacheSet(cacheKey, result, 120);
  return result;
}

async function getCollegeById(idOrSlug) {
  const cacheKey = `college:detail:${idOrSlug}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const college = await prisma.college.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: {
      courses: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { id: true, name: true, profileImage: true } } },
      },
    },
  });
  if (!college) throw ApiError.notFound("College not found");

  await cacheSet(cacheKey, college, 300);
  return college;
}

async function incrementViewCount(id) {
  await prisma.college.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {});
}

async function createCollege(data) {
  const slug = await uniqueSlug(data.name);
  const college = await prisma.college.create({
    data: {
      ...data,
      slug,
      type: data.type || "PRIVATE",
    },
  });
  await cacheDelPattern("colleges:list:*");
  return college;
}

async function uniqueSlug(name) {
  const base = slugify(name);
  let slug = base;
  let counter = 1;
  while (await prisma.college.findUnique({ where: { slug } })) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

async function updateCollege(id, data) {
  const exists = await prisma.college.findUnique({ where: { id } });
  if (!exists) throw ApiError.notFound("College not found");

  const college = await prisma.college.update({ where: { id }, data });
  await cacheDelPattern("colleges:list:*");
  await cacheDelPattern(`college:detail:*`);
  return college;
}

async function deleteCollege(id) {
  const exists = await prisma.college.findUnique({ where: { id } });
  if (!exists) throw ApiError.notFound("College not found");
  await prisma.college.delete({ where: { id } });
  await cacheDelPattern("colleges:list:*");
  await cacheDelPattern(`college:detail:*`);
}

async function getTrending(limit = 10) {
  const cacheKey = `colleges:trending:${limit}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const items = await prisma.college.findMany({
    orderBy: [{ viewCount: "desc" }, { rating: "desc" }],
    take: limit,
  });
  await cacheSet(cacheKey, items, 600);
  return items;
}

async function getRecommendations(userId, limit = 10) {
  // Simple content-based recommendation: based on streams of saved/applied colleges
  const saved = await prisma.savedCollege.findMany({
    where: { userId },
    include: { college: { select: { stream: true, state: true } } },
  });

  if (saved.length === 0) {
    return getTrending(limit);
  }

  const streams = [...new Set(saved.map((s) => s.college.stream))];
  const excludeIds = saved.map((s) => s.collegeId);

  const items = await prisma.college.findMany({
    where: {
      stream: { in: streams },
      id: { notIn: excludeIds },
    },
    orderBy: [{ rating: "desc" }, { ranking: "asc" }],
    take: limit,
  });

  if (items.length < limit) {
    const more = await prisma.college.findMany({
      where: { id: { notIn: [...excludeIds, ...items.map((i) => i.id)] } },
      orderBy: { rating: "desc" },
      take: limit - items.length,
    });
    return [...items, ...more];
  }

  return items;
}

async function compareColleges(ids) {
  const items = await prisma.college.findMany({
    where: { id: { in: ids } },
    include: { courses: true },
  });
  return items;
}

module.exports = {
  listColleges,
  getCollegeById,
  incrementViewCount,
  createCollege,
  updateCollege,
  deleteCollege,
  getTrending,
  getRecommendations,
  compareColleges,
};
