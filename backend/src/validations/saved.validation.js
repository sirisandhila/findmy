const { z } = require("zod");

const saveCollege = {
  body: z.object({ collegeId: z.string().uuid() }),
};

const collegeIdParam = {
  params: z.object({ collegeId: z.string().uuid() }),
};

module.exports = { saveCollege, collegeIdParam };
