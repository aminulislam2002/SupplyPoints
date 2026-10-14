const express = require("express");
const router = express.Router();

const {
  getAllPurchases,
  getMyPurchases,
  createPurchase,
  deletePurchase,
} = require("../controllers/promotion_purchases.controller");

const { verifyToken, verifyAdminOrEmployee } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, verifyAdminOrEmployee, getAllPurchases);

router.get("/my-purchases", verifyToken, getMyPurchases);

router.post("/", verifyToken, createPurchase);

router.delete("/:id", verifyToken, verifyAdminOrEmployee, deletePurchase);

module.exports = router;
