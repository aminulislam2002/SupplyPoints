const express = require("express");
const router = express.Router();

const {
  allMarketingPacks,
  getMarketingPackById,
  addMarketingPack,
  updateMarketingPack,
  deleteMarketingPack,
} = require("../controllers/marketing_packs.controller");

const upload = require("../middlewares/multer.middleware");
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", allMarketingPacks);

router.get("/:id", getMarketingPackById);

router.post(
  "/add-pack",
  upload.single("image"),
  verifyToken,
  verifyAdmin,
  addMarketingPack,
);

router.put(
  "/update-pack/:id",
  upload.single("image"),
  verifyToken,
  verifyAdmin,
  updateMarketingPack,
);

router.delete("/:id", verifyToken, verifyAdmin, deleteMarketingPack);

module.exports = router;
