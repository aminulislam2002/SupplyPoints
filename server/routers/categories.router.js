const express = require("express");
const router = express.Router();
const {
  allCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories.controller");

const upload = require("../middlewares/multer.middleware");
const { verifyToken, verifyAdminOrEmployee } = require("../middlewares/auth.middleware");

router.get("/", allCategories);

router.get("/:id", getCategoryById);

router.post(
  "/add-category",
  upload.single("image"),
  verifyToken,
  verifyAdminOrEmployee,
  addCategory,
);

router.put(
  "/update-category/:id",
  upload.single("image"),
  verifyToken,
  verifyAdminOrEmployee,
  updateCategory,
);

router.delete("/:id", verifyToken, verifyAdminOrEmployee, deleteCategory);

module.exports = router;
