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

const { verifyToken, verifyAdminOrEmployee } = require("../middlewares/auth.middleware");

router.get("/my-tasks", verifyToken, getMyTodoList);

router.get("/my-task/:taskId", verifyToken, getMyTodoTaskById);

router.post(
  "/submit-task/:taskId",
  verifyToken,
  upload.array("images", 10),
  submitTodoTask,
);

router.get("/submitted-tasks", verifyToken, verifyAdminOrEmployee, getAllSubmittedTasks);

router.put(
  "/submitted-tasks/:id",
  verifyToken,
  verifyAdminOrEmployee,
  updateSubmittedTaskStatus,
);

module.exports = router;
