const express = require("express");
const router = express.Router();

const {
  getMyLogs,
  deleteALog,
} = require("../controllers/seller_logs.controller");
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, getMyLogs);

router.delete("/:id", verifyToken, verifyAdmin, deleteALog);

module.exports = router;
