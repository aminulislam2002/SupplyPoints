const express = require("express");
const router = express.Router();

const { getAllLogs } = require("../controllers/platform_profits.controller");
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, verifyAdmin, getAllLogs);

module.exports = router;
