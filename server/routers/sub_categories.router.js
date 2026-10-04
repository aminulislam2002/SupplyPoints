const express = require("express");
const router = express.Router();
const {
  allCategories,
  getSubCategoryById,
  getSubCategoriesByCategoryId,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/sub_categories.controller");

const upload = require("../middlewares/multer.middleware");
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", allCategories);

router.get("/category/:categoryId", getSubCategoriesByCategoryId);

router.get("/id/:id", getSubCategoryById);

router.post(
  "/add-sub-category",
  upload.single("image"),
  verifyToken,
  verifyAdmin,
  addSubCategory
);

router.put(
  "/update-sub-category/:id",
  upload.single("image"),
  verifyToken,
  verifyAdmin,
  updateSubCategory
);

router.delete("/:id", verifyToken, verifyAdmin, deleteSubCategory);

module.exports = router;
