const router = require("express").Router();
const ctrl = require("../controllers/college.controller");
const validate = require("../middleware/validate");
const { authenticate, authorize } = require("../middleware/auth");
const v = require("../validations/college.validation");

/**
 * @swagger
 * tags:
 *   name: Colleges
 *   description: College discovery, search, filter, CRUD
 */

/**
 * @swagger
 * /api/colleges:
 *   get:
 *     summary: List/search/filter colleges
 *     tags: [Colleges]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: stream
 *         schema: { type: string }
 *         description: Comma separated streams
 *       - in: query
 *         name: state
 *         schema: { type: string }
 *         description: Comma separated states
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *         description: Comma separated types (GOVERNMENT,PRIVATE,DEEMED)
 *       - in: query
 *         name: maxFees
 *         schema: { type: number }
 *       - in: query
 *         name: minRating
 *         schema: { type: number }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [ranking, rating, fees-low, fees-high, popular, newest] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of colleges }
 */
router.get("/", validate(v.listColleges), ctrl.listColleges);

/**
 * @swagger
 * /api/colleges/trending:
 *   get:
 *     summary: Get trending colleges
 *     tags: [Colleges]
 *     responses:
 *       200: { description: Trending colleges }
 */
router.get("/trending", ctrl.trending);

/**
 * @swagger
 * /api/colleges/compare:
 *   get:
 *     summary: Compare 2-4 colleges by id
 *     tags: [Colleges]
 *     parameters:
 *       - in: query
 *         name: ids
 *         schema: { type: string }
 *         description: Comma separated college ids
 *     responses:
 *       200: { description: Colleges compared }
 */
router.get("/compare", ctrl.compare);

/**
 * @swagger
 * /api/colleges/recommendations:
 *   get:
 *     summary: Get personalized college recommendations
 *     tags: [Colleges]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Recommended colleges }
 */
router.get("/recommendations", authenticate, ctrl.recommendations);

/**
 * @swagger
 * /api/colleges/{id}:
 *   get:
 *     summary: Get a single college by id or slug
 *     tags: [Colleges]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: College detail }
 *       404: { description: Not found }
 */
router.get("/:id", validate(v.idParam), ctrl.getCollege);

/**
 * @swagger
 * /api/colleges:
 *   post:
 *     summary: Create a college (admin only)
 *     tags: [Colleges]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: College created }
 */
router.post("/", authenticate, authorize("ADMIN"), validate(v.createCollege), ctrl.createCollege);

/**
 * @swagger
 * /api/colleges/{id}:
 *   put:
 *     summary: Update a college (admin only)
 *     tags: [Colleges]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: College updated }
 */
router.put("/:id", authenticate, authorize("ADMIN"), validate(v.updateCollege), ctrl.updateCollege);

/**
 * @swagger
 * /api/colleges/{id}:
 *   delete:
 *     summary: Delete a college (admin only)
 *     tags: [Colleges]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: College deleted }
 */
router.delete("/:id", authenticate, authorize("ADMIN"), validate(v.idParam), ctrl.deleteCollege);

module.exports = router;
