const express = require("express");
const router = express.Router();
const {
  getPlatformInfo,
  getStatistics,
  updatePlatformInfo,
} = require("../controllers/platform.controller");

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

// Get platform information (public route)
router.get("/", getPlatformInfo);

// Get statistics (public route)
router.get("/statistics", getStatistics);

// Update platform information (admin only)
router.put("/", verifyToken, verifyAdmin, updatePlatformInfo);

module.exports = router;
