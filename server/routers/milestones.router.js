const express = require("express");
const router = express.Router();
const {
  getAllMilestone,
  getMilestoneById,
  addMilestone,
  updateMilestone,
  deleteMilestone,
} = require("../controllers/milestones.controller");

const { verifyToken, verifyAdminOrEmployee } = require("../middlewares/auth.middleware");

router.get("/", getAllMilestone);

router.get("/:id", getMilestoneById);

router.post("/", verifyToken, verifyAdminOrEmployee, addMilestone);

router.put("/:id", verifyToken, verifyAdminOrEmployee, updateMilestone);

router.delete("/:id", verifyToken, verifyAdminOrEmployee, deleteMilestone);

module.exports = router;
