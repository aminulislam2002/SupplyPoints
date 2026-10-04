const router = require("express").Router();

// Import Middlewares
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

const {
  getAllOrders,
  orderStatistic,
  getMyOrders,
  getOrderById,
  getTrackOrder,
  postNewOrder,
  updateDeliveryStatus,
  updateDeliveryPaymentStatus,
  updateCourierInfo,
  deleteAnOrder,
} = require("../controllers/orders.controller");

router.get("/", verifyToken, verifyAdmin, getAllOrders);

router.get("/statistics", orderStatistic);

router.get("/my-orders", verifyToken, getMyOrders);

router.get("/track", getTrackOrder);

router.get("/:id", getOrderById);

router.post("/", verifyToken, postNewOrder);

router.put("/delivery-status/:id", verifyToken, updateDeliveryStatus);

router.put(
  "/delivery-payment-status/:id",
  verifyToken,
  verifyAdmin,
  updateDeliveryPaymentStatus,
);

router.patch("/courier-info/:id", verifyToken, verifyAdmin, updateCourierInfo);

router.delete("/:id", verifyToken, verifyAdmin, deleteAnOrder);

module.exports = router;
