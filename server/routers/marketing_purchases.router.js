const express = require("express");
const router = express.Router();

const {
  getAllMarketingPurchases,
  getMyMarketingPurchases,
  getAlreadyPurchasedPackIds,
  createMarketingPurchase,
  deleteMarketingPurchase,
} = require("../controllers/marketing_purchases.controller");

const { verifyToken, verifyAdminOrEmployee } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, verifyAdminOrEmployee, getAllMarketingPurchases);

router.get("/my-purchases", verifyToken, getMyMarketingPurchases);

router.get("/already-purchased", verifyToken, getAlreadyPurchasedPackIds);

router.post("/", verifyToken, createMarketingPurchase);

router.delete("/:id", verifyToken, verifyAdminOrEmployee, deleteMarketingPurchase);

module.exports = router;
