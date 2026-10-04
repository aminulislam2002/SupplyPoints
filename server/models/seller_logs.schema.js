const mongoose = require("mongoose");
const { Schema } = mongoose;

const sellerLogsSchema = new Schema({
  identifier: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, default: 0 },
  balanceBefore: { type: Number, default: 0 },
  balanceAfter: { type: Number, default: 0 },
  transactionType: { type: String, enum: ["Credit", "Debit"], required: true },
  addedAt: { type: Date, default: Date.now },
});

sellerLogsSchema.index({ addedAt: -1 }); // addedAt in descending order. Ex: New to Old
sellerLogsSchema.index({ identifier: 1 });

const sellerLogs = mongoose.model("sellerLog", sellerLogsSchema);

module.exports = sellerLogs;
