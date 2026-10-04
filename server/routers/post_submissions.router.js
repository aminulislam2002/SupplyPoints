const express = require("express");
const router = express.Router();

const {
  getAllSubmissions,
  getMySubmissions,
  createSubmission,
  approveSubmission,
  rejectSubmission,
} = require("../controllers/post_submissions.controller");

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, verifyAdmin, getAllSubmissions);
router.get("/my-submissions", verifyToken, getMySubmissions);
router.post("/", verifyToken, createSubmission);
router.put("/approve/:id", verifyToken, verifyAdmin, approveSubmission);
router.put("/reject/:id", verifyToken, verifyAdmin, rejectSubmission);

module.exports = router;
