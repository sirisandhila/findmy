const router = require("express").Router();
const ctrl = require("../controllers/search.controller");
const { optionalAuthenticate } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Full-text search across colleges, courses, and exams
 */

/**
 * @swagger
 * /api/search/popular:
 *   get:
 *     summary: Popular search queries
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Popular searches }
 */
// IMPORTANT: /popular MUST be declared before any dynamic /:param route
// to prevent Express routing it to the wrong handler.
router.get("/popular", ctrl.popularSearches);

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Global search across colleges, courses, exams
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Search results }
 */
router.get("/", optionalAuthenticate, ctrl.globalSearch);

module.exports = router;
