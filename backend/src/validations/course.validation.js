const { z } = require("zod");

const listCourses = {
  query: z.object({
    collegeId: z.string().uuid().optional(),
    stream: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
  }),
};

const createCourse = {
  body: z.object({
    collegeId: z.string().uuid(),
    name: z.string().min(2),
    duration: z.string().min(1),
    fees: z.coerce.number().nonnegative(),
    eligibility: z.string().optional(),
    seats: z.coerce.number().int().optional(),
    stream: z.string().optional(),
  }),
};

const idParam = { params: z.object({ id: z.string().uuid() }) };

module.exports = { listCourses, createCourse, idParam };
