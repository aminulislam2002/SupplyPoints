const express = require("express");
const router = express.Router();
const {
  getAllFaq,
  getFaqById,
  addFaq,
  updateFaq,
  deleteFaq,
} = require("../controllers/faq.controller");

const { verifyToken, verifyAdminOrEmployee } = require("../middlewares/auth.middleware");

router.get("/", getAllFaq);

router.get("/:id", getFaqById);

router.post("/", verifyToken, verifyAdminOrEmployee, addFaq);

router.put("/:id", verifyToken, verifyAdminOrEmployee, updateFaq);

router.delete("/:id", verifyToken, verifyAdminOrEmployee, deleteFaq);

module.exports = router;
