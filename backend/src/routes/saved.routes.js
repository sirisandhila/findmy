const router = require("express").Router();
const ctrl = require("../controllers/saved.controller");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const v = require("../validations/saved.validation");

/**
 * @swagger
 * tags:
 *   name: SavedColleges
 */

/**
 * @swagger
 * /api/saved:
 *   post:
 *     summary: Save a college
 *     tags: [SavedColleges]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: College saved }
 */
router.post("/", authenticate, validate(v.saveCollege), ctrl.saveCollege);

/**
 * @swagger
 * /api/saved/{collegeId}:
 *   delete:
 *     summary: Remove a saved college
 *     tags: [SavedColleges]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Removed }
 */
router.delete("/:collegeId", authenticate, validate(v.collegeIdParam), ctrl.unsaveCollege);

/**
 * @swagger
 * /api/saved:
 *   get:
 *     summary: List current user's saved colleges
 *     tags: [SavedColleges]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of saved colleges }
 */
router.get("/", authenticate, ctrl.listSaved);

module.exports = router;
