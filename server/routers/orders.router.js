const router = require("express").Router();

// Import Middlewares
const { verifyToken, verifyAdminOrEmployee } = require("../middlewares/auth.middleware");

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

router.get("/", verifyToken, verifyAdminOrEmployee, getAllOrders);

router.get("/statistics", orderStatistic);

router.get("/my-orders", verifyToken, getMyOrders);

router.get("/track", getTrackOrder);

router.get("/:id", getOrderById);

router.post("/", verifyToken, postNewOrder);

router.put("/delivery-status/:id", verifyToken, updateDeliveryStatus);

router.put(
  "/delivery-payment-status/:id",
  verifyToken,
  verifyAdminOrEmployee,
  updateDeliveryPaymentStatus,
);

router.patch("/courier-info/:id", verifyToken, verifyAdminOrEmployee, updateCourierInfo);

router.delete("/:id", verifyToken, verifyAdminOrEmployee, deleteAnOrder);

module.exports = router;
