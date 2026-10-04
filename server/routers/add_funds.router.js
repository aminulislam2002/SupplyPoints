const express = require("express");
const router = express.Router();

const {
  getAllAddFundsRequests,
  getMyAddFundsRequests,
  createAddFundsRequest,
  createPaymentsRequest,
  handleManualCallback,
  handleClickPayCallback,
  handleStarPayCallback,
} = require("../controllers/add_funds.controller");

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, verifyAdmin, getAllAddFundsRequests);

router.get("/my-requests", verifyToken, getMyAddFundsRequests);

router.post("/", verifyToken, createAddFundsRequest);

router.post("/payments", verifyToken, createPaymentsRequest);

router.post("/callback/clickpay", handleClickPayCallback);

router.post("/callback/starpay", handleStarPayCallback);

router.post(
  "/callback/manual/:id",
  verifyToken,
  verifyAdmin,
  handleManualCallback,
);

module.exports = router;
