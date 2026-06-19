const { z } = require("zod");

const CollegeType = z.enum(["GOVERNMENT", "PRIVATE", "DEEMED"]);

const listColleges = {
  query: z.object({
    q: z.string().optional(),
    stream: z.string().optional(), // comma separated
    state: z.string().optional(), // comma separated
    city: z.string().optional(),
    type: z.string().optional(), // comma separated
    maxFees: z.coerce.number().optional(),
    minFees: z.coerce.number().optional(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    course: z.string().optional(),
    sort: z
      .enum(["ranking", "rating", "fees-low", "fees-high", "popular", "newest"])
      .optional()
      .default("ranking"),
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
  }),
};

const createCollege = {
  body: z.object({
    name: z.string().min(2),
    shortName: z.string().optional(),
    description: z.string().optional(),
    location: z.string().min(2),
    city: z.string().min(2),
    state: z.string().min(2),
    stream: z.string().min(2),
    ranking: z.coerce.number().int().optional(),
    rankingBody: z.string().optional(),
    fees: z.coerce.number().nonnegative(),
    feesLabel: z.string().optional(),
    placementPercentage: z.coerce.number().min(0).max(100).optional(),
    averagePackage: z.coerce.number().optional(),
    highestPackage: z.coerce.number().optional(),
    establishedYear: z.coerce.number().int().optional(),
    type: CollegeType.optional(),
    accreditation: z.string().optional(),
    accredited: z.string().optional(),
    website: z.string().url().optional(),
    images: z.array(z.string()).optional(),
    exams: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
  }),
};

const updateCollege = {
  params: z.object({ id: z.string().uuid() }),
  body: createCollege.body.partial(),
};

const idParam = {
  params: z.object({ id: z.string().min(1) }),
};

module.exports = { listColleges, createCollege, updateCollege, idParam };
