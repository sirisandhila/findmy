const router = require("express").Router();
const ctrl = require("../controllers/course.controller");
const validate = require("../middleware/validate");
const { authenticate, authorize } = require("../middleware/auth");
const v = require("../validations/course.validation");

/**
 * @swagger
 * tags:
 *   name: Courses
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: List courses
 *     tags: [Courses]
 *     responses:
 *       200: { description: List of courses }
 */
router.get("/", validate(v.listCourses), ctrl.listCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by id
 *     tags: [Courses]
 *     responses:
 *       200: { description: Course detail }
 */
router.get("/:id", validate(v.idParam), ctrl.getCourse);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a course (admin only)
 *     tags: [Courses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Course created }
 */
router.post("/", authenticate, authorize("ADMIN"), validate(v.createCourse), ctrl.createCourse);

module.exports = router;
