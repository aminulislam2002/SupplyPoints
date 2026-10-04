const express = require("express");
const router = express.Router();
const {
  getAllFaq,
  getFaqById,
  addFaq,
  updateFaq,
  deleteFaq,
} = require("../controllers/faq.controller");

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", getAllFaq);

router.get("/:id", getFaqById);

router.post("/", verifyToken, verifyAdmin, addFaq);

router.put("/:id", verifyToken, verifyAdmin, updateFaq);

router.delete("/:id", verifyToken, verifyAdmin, deleteFaq);

module.exports = router;
