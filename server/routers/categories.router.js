const express = require("express");
const router = express.Router();
const {
  allCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories.controller");

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", allCategories);

router.get("/:id", getCategoryById);

router.post("/add-category", verifyToken, verifyAdmin, addCategory);

router.put("/update-category/:id", verifyToken, verifyAdmin, updateCategory);

router.delete("/:id", verifyToken, verifyAdmin, deleteCategory);

module.exports = router;
