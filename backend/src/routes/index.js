const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/colleges", require("./college.routes"));
router.use("/courses", require("./course.routes"));
router.use("/exams", require("./exam.routes"));
router.use("/reviews", require("./review.routes"));
router.use("/saved", require("./saved.routes"));
router.use("/applications", require("./application.routes"));
router.use("/admin", require("./admin.routes"));
router.use("/search", require("./search.routes"));
router.use("/upload", require("./upload.routes"));

module.exports = router;
