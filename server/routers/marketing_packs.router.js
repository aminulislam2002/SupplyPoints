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
const { verifyToken, verifyAdminOrEmployee } = require("../middlewares/auth.middleware");

router.get("/", allMarketingPacks);

router.get("/:id", getMarketingPackById);

router.post(
  "/add-pack",
  upload.single("image"),
  verifyToken,
  verifyAdminOrEmployee,
  addMarketingPack,
);

router.put(
  "/update-pack/:id",
  upload.single("image"),
  verifyToken,
  verifyAdminOrEmployee,
  updateMarketingPack,
);

router.delete("/:id", verifyToken, verifyAdminOrEmployee, deleteMarketingPack);

module.exports = router;
