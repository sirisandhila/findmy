const { z } = require("zod");

const createReview = {
  body: z.object({
    collegeId: z.string().uuid(),
    rating: z.coerce.number().min(1).max(5),
    comment: z.string().min(5).max(2000),
  }),
};

const listByCollege = {
  params: z.object({ collegeId: z.string().uuid() }),
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(1).max(50).optional().default(10),
  }),
};

const idParam = {
  params: z.object({ id: z.string().uuid() }),
};

module.exports = { createReview, listByCollege, idParam };
