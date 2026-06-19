const { z } = require("zod");

const register = {
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(100),
  }),
};

const login = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
};

const refresh = {
  body: z.object({
    refreshToken: z.string().min(1),
  }),
};

module.exports = { register, login, refresh };
