const express = require("express");
const router = express.Router();

const {
  getAllSubmissions,
  getMySubmissions,
  createSubmission,
  approveSubmission,
  rejectSubmission,
} = require("../controllers/post_submissions.controller");

const { verifyToken, verifyAdminOrEmployee } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, verifyAdminOrEmployee, getAllSubmissions);
router.get("/my-submissions", verifyToken, getMySubmissions);
router.post("/", verifyToken, createSubmission);
router.put("/approve/:id", verifyToken, verifyAdminOrEmployee, approveSubmission);
router.put("/reject/:id", verifyToken, verifyAdminOrEmployee, rejectSubmission);

module.exports = router;
