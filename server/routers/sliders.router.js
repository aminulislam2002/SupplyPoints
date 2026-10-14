const router = require("express").Router();

const {
  getAllSlider,
  getSliderById,
  addSlider,
  updateSlider,
  deleteSlider,
} = require("../controllers/sliders.controller");

const upload = require("../middlewares/multer.middleware");
const { verifyToken, verifyAdminOrEmployee } = require("../middlewares/auth.middleware");

router.get("/", getAllSlider);

router.get("/:id", getSliderById);

router.post("/add-slider", upload.single("image"), verifyToken, verifyAdminOrEmployee, addSlider);

router.put(
  "/update-slider/:id",
  upload.single("image"),
  verifyToken,
  verifyAdminOrEmployee,
  updateSlider
);

router.delete("/:id", verifyToken, verifyAdminOrEmployee, deleteSlider);

module.exports = router;
