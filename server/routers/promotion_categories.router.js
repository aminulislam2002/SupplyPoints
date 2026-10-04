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
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", allPromotionCategories);

router.get("/:id", getPromotionCategoryById);

router.post(
  "/add-category",
  upload.single("image"),
  verifyToken,
  verifyAdmin,
  addPromotionCategory,
);

router.put(
  "/update-category/:id",
  upload.single("image"),
  verifyToken,
  verifyAdmin,
  updatePromotionCategory,
);

router.delete("/:id", verifyToken, verifyAdmin, deletePromotionCategory);

module.exports = router;
