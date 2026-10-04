const express = require("express");
const router = express.Router();

const {
  getMyTodoList,
  getMyTodoTaskById,
  submitTodoTask,
  getAllSubmittedTasks,
  updateSubmittedTaskStatus,
} = require("../controllers/seller_todo.controller");

const upload = require("../middlewares/multer.middleware");

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/my-tasks", verifyToken, getMyTodoList);

router.get("/my-task/:taskId", verifyToken, getMyTodoTaskById);

router.post(
  "/submit-task/:taskId",
  verifyToken,
  upload.array("images", 10),
  submitTodoTask,
);

router.get("/submitted-tasks", verifyToken, verifyAdmin, getAllSubmittedTasks);

router.put(
  "/submitted-tasks/:id",
  verifyToken,
  verifyAdmin,
  updateSubmittedTaskStatus,
);

module.exports = router;
