const express = require("express");
const router = express.Router();
const {
  getAllRules,
  getRuleById,
  addRule,
  updateRule,
  deleteRule,
} = require("../controllers/rules.controller");

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", getAllRules);

router.get("/:id", getRuleById);

router.post("/", verifyToken, verifyAdmin, addRule);

router.put("/:id", verifyToken, verifyAdmin, updateRule);

router.delete("/:id", verifyToken, verifyAdmin, deleteRule);

module.exports = router;
