const router = require("express").Router();
const ctrl = require("../controllers/exam.controller");
const validate = require("../middleware/validate");
const { authenticate, authorize } = require("../middleware/auth");
const v = require("../validations/exam.validation");

/**
 * @swagger
 * tags:
 *   name: Exams
 */

/**
 * @swagger
 * /api/exams:
 *   get:
 *     summary: List exams
 *     tags: [Exams]
 *     responses:
 *       200: { description: List of exams }
 */
router.get("/", validate(v.listExams), ctrl.listExams);

/**
 * @swagger
 * /api/exams/{id}:
 *   get:
 *     summary: Get exam by id or slug
 *     tags: [Exams]
 *     responses:
 *       200: { description: Exam detail }
 */
router.get("/:id", validate(v.idParam), ctrl.getExam);

/**
 * @swagger
 * /api/exams:
 *   post:
 *     summary: Create an exam (admin only)
 *     tags: [Exams]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Exam created }
 */
router.post("/", authenticate, authorize("ADMIN"), validate(v.createExam), ctrl.createExam);

module.exports = router;
