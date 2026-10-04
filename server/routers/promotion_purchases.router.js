const express = require("express");
const router = express.Router();

const {
  getAllPurchases,
  getMyPurchases,
  createPurchase,
  deletePurchase,
} = require("../controllers/promotion_purchases.controller");

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, verifyAdmin, getAllPurchases);

router.get("/my-purchases", verifyToken, getMyPurchases);

router.post("/", verifyToken, createPurchase);

router.delete("/:id", verifyToken, verifyAdmin, deletePurchase);

module.exports = router;
