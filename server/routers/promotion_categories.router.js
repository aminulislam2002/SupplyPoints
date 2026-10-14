const express = require("express");
const router = express.Router();

const {
  allPromotionCategories,
  getPromotionCategoryById,
  addPromotionCategory,
  updatePromotionCategory,
  deletePromotionCategory,
} = require("../controllers/promotion_categories.controller");

const upload = require("../middlewares/multer.middleware");
const { verifyToken, verifyAdminOrEmployee } = require("../middlewares/auth.middleware");

router.get("/", allPromotionCategories);

router.get("/:id", getPromotionCategoryById);

router.post(
  "/add-category",
  upload.single("image"),
  verifyToken,
  verifyAdminOrEmployee,
  addPromotionCategory,
);

router.put(
  "/update-category/:id",
  upload.single("image"),
  verifyToken,
  verifyAdminOrEmployee,
  updatePromotionCategory,
);

router.delete("/:id", verifyToken, verifyAdminOrEmployee, deletePromotionCategory);

module.exports = router;
