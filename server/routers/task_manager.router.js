const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
} = require("../controllers/task_manager.controller");

const { verifyToken, verifyAdminOrEmployee } = require("../middlewares/auth.middleware");

router.get("/", getAllTasks);

router.get("/:id", getTaskById);

router.post("/", verifyToken, verifyAdminOrEmployee, addTask);

router.put("/:id", verifyToken, verifyAdminOrEmployee, updateTask);

router.delete("/:id", verifyToken, verifyAdminOrEmployee, deleteTask);

module.exports = router;
