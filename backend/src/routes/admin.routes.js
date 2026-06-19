const router = require("express").Router();
const ctrl = require("../controllers/admin.controller");
const { authenticate, authorize } = require("../middleware/auth");

router.use(authenticate, authorize("ADMIN"));

/**
 * @swagger
 * tags:
 *   name: Admin
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: List all users (admin only)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of users }
 */
router.get("/users", ctrl.listUsers);

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     summary: Platform analytics (admin only)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Analytics data }
 */
router.get("/analytics", ctrl.analytics);

/**
 * @swagger
 * /api/admin/colleges:
 *   get:
 *     summary: List all colleges for admin management
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of colleges }
 */
router.get("/colleges", ctrl.listColleges);

module.exports = router;
