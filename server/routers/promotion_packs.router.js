const express = require("express");
const router = express.Router();

const {
  allPromotionPacks,
  getPromotionPackById,
  addPromotionPack,
  updatePromotionPack,
  deletePromotionPack,
} = require("../controllers/promotion_packs.controller");

const upload = require("../middlewares/multer.middleware");
const { verifyToken, verifyAdminOrEmployee } = require("../middlewares/auth.middleware");

router.get("/", allPromotionPacks);

router.get("/:id", getPromotionPackById);

router.post(
  "/add-pack",
  upload.single("image"),
  verifyToken,
  verifyAdminOrEmployee,
  addPromotionPack,
);

router.put(
  "/update-pack/:id",
  upload.single("image"),
  verifyToken,
  verifyAdminOrEmployee,
  updatePromotionPack,
);

router.delete("/:id", verifyToken, verifyAdminOrEmployee, deletePromotionPack);

module.exports = router;
