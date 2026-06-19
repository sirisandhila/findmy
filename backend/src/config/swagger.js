const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

// Use __dirname-relative path so it works both locally and in Vercel serverless
const routesGlob = path.join(__dirname, "../routes/*.js");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CollegeKampus API",
      version: "1.0.0",
      description:
        "Production backend for the CollegeKampus college discovery platform: " +
        "search, filters, saved colleges, reviews, applications, and admin management.",
    },
    servers: [{ url: "/api", description: "API base path" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [routesGlob],
};

module.exports = swaggerJsdoc(options);
