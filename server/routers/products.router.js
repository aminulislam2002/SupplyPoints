const router = require("express").Router();

// Import Controllers
const {
  getProductsOnDashboard,
  getProductsOnDisplay,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require("../controllers/products.controller");

const upload = require("../middlewares/multer.middleware");
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

router.get("/", getProductsOnDashboard);

router.get("/on-display", getProductsOnDisplay);

router.get("/search", searchProducts);

router.get("/by-id/:id", getProductById);

const productFields = [
  { name: "thumbnail", maxCount: 1 },
  { name: "photos", maxCount: 20 },
];

router.post(
  "/add-product",
  upload.fields(productFields),
  verifyToken,
  verifyAdmin,
  addProduct,
);

router.put(
  "/update-product/:id",
  upload.fields(productFields),
  verifyToken,
  verifyAdmin,
  updateProduct,
);

router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

module.exports = router;
