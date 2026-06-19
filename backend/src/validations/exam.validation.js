const { z } = require("zod");

const listExams = {
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
  }),
};

const createExam = {
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    examDate: z.coerce.date().optional(),
    registrationDate: z.coerce.date().optional(),
  }),
};

const idParam = { params: z.object({ id: z.string().min(1) }) };

module.exports = { listExams, createExam, idParam };
