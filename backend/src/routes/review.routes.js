const router = require("express").Router();
const ctrl = require("../controllers/review.controller");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const v = require("../validations/review.validation");

/**
 * @swagger
 * tags:
 *   name: Reviews
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a review for a college
 *     tags: [Reviews]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Review created }
 */
router.post("/", authenticate, validate(v.createReview), ctrl.createReview);

/**
 * @swagger
 * /api/reviews/{collegeId}:
 *   get:
 *     summary: List reviews for a college
 *     tags: [Reviews]
 *     responses:
 *       200: { description: List of reviews }
 */
router.get("/:collegeId", validate(v.listByCollege), ctrl.listByCollege);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review (owner or admin)
 *     tags: [Reviews]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Review deleted }
 */
router.delete("/:id", authenticate, validate(v.idParam), ctrl.deleteReview);

module.exports = router;
