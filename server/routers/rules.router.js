const express = require("express");
const router = express.Router();
const {
  getAllRules,
  getRuleById,
  addRule,
  updateRule,
  deleteRule,
} = require("../controllers/rules.controller");

const { verifyToken, verifyAdminOrEmployee } = require("../middlewares/auth.middleware");

router.get("/", getAllRules);

router.get("/:id", getRuleById);

router.post("/", verifyToken, verifyAdminOrEmployee, addRule);

router.put("/:id", verifyToken, verifyAdminOrEmployee, updateRule);

router.delete("/:id", verifyToken, verifyAdminOrEmployee, deleteRule);

module.exports = router;
