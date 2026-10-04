const express = require("express");
const router = express.Router();
const {
  getAllMilestone,
  getMilestoneById,
  addMilestone,
  updateMilestone,
  deleteMilestone,
} = require("../controllers/milestones.controller");

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", getAllMilestone);

router.get("/:id", getMilestoneById);

router.post("/", verifyToken, verifyAdmin, addMilestone);

router.put("/:id", verifyToken, verifyAdmin, updateMilestone);

router.delete("/:id", verifyToken, verifyAdmin, deleteMilestone);

module.exports = router;
