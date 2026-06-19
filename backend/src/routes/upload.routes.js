const router = require("express").Router();
const ctrl = require("../controllers/upload.controller");
const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

/**
 * @swagger
 * tags:
 *   name: Upload
 */

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload an image to Cloudinary (admin only)
 *     tags: [Upload]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201: { description: Image uploaded }
 */
router.post("/image", authenticate, authorize("ADMIN"), upload.single("image"), ctrl.uploadImage);

module.exports = router;
