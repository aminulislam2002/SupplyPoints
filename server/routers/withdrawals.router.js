const express = require("express");
const router = express.Router();
const {
  getAllWithdrawals,
  getMyWithdrawals,
  createWithdrawalRequest,
  updateWithdrawalStatus,
} = require("../controllers/withdrawals.controller");

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, verifyAdmin, getAllWithdrawals);

router.get("/my-withdrawals", verifyToken, getMyWithdrawals);

router.post("/", verifyToken, createWithdrawalRequest);

router.put("/:id", verifyToken, verifyAdmin, updateWithdrawalStatus);

module.exports = router;
