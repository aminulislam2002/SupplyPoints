const mongoose = require("mongoose");
const { Schema } = mongoose;

const ordersSchema = new Schema({
  identifier: { type: String, required: true },
  sellerName: { type: String, required: true },
  sellerCurBal: { type: Number, required: true },

  customerInfo: {
    name: { type: String, required: true },
    number: { type: String, required: true },
    zilla: { type: String, required: true },
    thana: { type: String, required: true },
    address: { type: String, required: true },
    message: { type: String },
  },

  productsPrice: { type: Number, required: true },
  resellerPrice: { type: Number, required: true },
  totalProfit: { type: Number, required: true },
  advanceAmount: { type: Number, default: 0 },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      title: { type: String, required: true },
      productCode: { type: String, required: true },
      thumbnail: { type: String, required: true },
      price: { type: Number, required: true },
      resellerPrice: { type: Number, required: true },
      profit: { type: Number, required: true },
      selectedQuantity: { type: Number, required: true },
      selectedColor: { type: String },
      selectedSize: { type: String },
    },
  ],

  deliveryInfo: {
    deliveryArea: { type: String, required: true },
    deliveryCharge: { type: Number, required: true },
    packagingCharge: { type: Number, required: true },
    codCharge: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    courierTracking: { type: String },
    courierMessage: { type: String },
    platformCode: { type: String },
  },

  deliveryPaymentInfo: {
    gateway: { type: String },
    txnId: { type: String },
    amount: { type: Number },
  },

  deliveryStatus: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
      "Out of Stock",
    ],
    default: "Pending",
  },

  deliveryPaymentMethod: {
    type: String,
    enum: ["Balance", "Manual", "COD"],
    required: true,
  },

  deliveryPaymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Unpaid"],
    default: "Unpaid",
  },

  orderId: { type: String, required: true, unique: true },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

ordersSchema.index({ addedAt: -1 }); // addedAt in descending order. Ex: New to Old
ordersSchema.index({ orderId: 1 }); // Order ID exact match index
ordersSchema.index({ identifier: 1 }); // Identifier search index
ordersSchema.index({ "customerInfo.number": 1 }); // Customer phone number index
ordersSchema.index({ deliveryStatus: 1, deliveryPaymentStatus: 1 }); // Delivery Status | Delivery Status + Payment Status
ordersSchema.index({
  "customerInfo.name": "text",
  identifier: "text",
}); // Text Index for name search only

const orders = mongoose.model("orders", ordersSchema);

module.exports = orders;
