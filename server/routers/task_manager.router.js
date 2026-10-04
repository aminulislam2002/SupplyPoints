const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
} = require("../controllers/task_manager.controller");

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", getAllTasks);

router.get("/:id", getTaskById);

router.post("/", verifyToken, verifyAdmin, addTask);

router.put("/:id", verifyToken, verifyAdmin, updateTask);

router.delete("/:id", verifyToken, verifyAdmin, deleteTask);

module.exports = router;
