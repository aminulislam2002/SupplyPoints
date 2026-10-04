const mongoose = require("mongoose");
const { Schema } = mongoose;

const withdrawalsSchema = new Schema({
  identifier: { type: String, required: true },
  sellerName: { type: String, required: true },
  payMethod: {
    type: String,
    enum: ["Bkash", "Nagad", "Rocket"],
    required: true,
  },
  account: { type: String, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  addedAt: { type: Date, default: Date.now },
});

withdrawalsSchema.index({ addedAt: -1 });
withdrawalsSchema.index({ identifier: 1 });
withdrawalsSchema.index({ status: 1 });

const withdrawals = mongoose.model("withdrawals", withdrawalsSchema);

module.exports = withdrawals;
