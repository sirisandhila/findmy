const { z } = require("zod");

const createApplication = {
  body: z.object({
    collegeId: z.string().uuid(),
    notes: z.string().max(2000).optional(),
  }),
};

const updateApplication = {
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    status: z
      .enum(["PENDING", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED", "WITHDRAWN"])
      .optional(),
    notes: z.string().max(2000).optional(),
  }),
};

const listApplications = {
  query: z.object({
    status: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(1).max(50).optional().default(10),
  }),
};

module.exports = { createApplication, updateApplication, listApplications };
