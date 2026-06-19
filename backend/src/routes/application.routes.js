const router = require("express").Router();
const ctrl = require("../controllers/application.controller");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const v = require("../validations/application.validation");

/**
 * @swagger
 * tags:
 *   name: Applications
 */

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Apply to a college
 *     tags: [Applications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Application created }
 */
router.post("/", authenticate, validate(v.createApplication), ctrl.createApplication);

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: List applications (own, or all if admin)
 *     tags: [Applications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of applications }
 */
router.get("/", authenticate, validate(v.listApplications), ctrl.listApplications);

/**
 * @swagger
 * /api/applications/{id}:
 *   put:
 *     summary: Update application status/notes
 *     tags: [Applications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Application updated }
 */
router.put("/:id", authenticate, validate(v.updateApplication), ctrl.updateApplication);

module.exports = router;
