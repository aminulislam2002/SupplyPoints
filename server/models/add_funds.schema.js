const mongoose = require("mongoose");
const purchases = require("./promotion_purchases.schema");
const { Schema } = mongoose;

const addFundsSchema = new Schema({
  identifier: { type: String, required: true, trim: true, lowercase: true },
  sellerName: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 1 },
  transactionId: { type: String, required: true }, // Unique transaction ID from ClickPay
  gateway: {
    type: String,
    enum: ["BKASH", "NAGAD", "ROCKET"],
    required: true,
  },
  purpose: {
    type: String,
    enum: ["Deposit", "Account"],
    default: "Deposit",
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  channel: {
    type: String,
    enum: ["StarPay", "ClickPay", "Manual"],
    default: "Manual",
  },
  addedAt: { type: Date, default: Date.now },
});

addFundsSchema.index({ addedAt: -1 });
addFundsSchema.index({ identifier: 1, addedAt: -1 });
addFundsSchema.index({ status: 1 });
addFundsSchema.index({ gateway: 1 });
addFundsSchema.index({ transactionId: "text" });

const addFunds = mongoose.model("add_funds", addFundsSchema);

module.exports = addFunds;
