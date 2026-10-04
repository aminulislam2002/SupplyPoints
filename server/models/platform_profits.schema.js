const mongoose = require("mongoose");
const { Schema } = mongoose;

const platformProfitsSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, default: 0 },
  purpose: {
    type: String,
    enum: ["Order Profit", "Subscription Fee", "Add Funds"],
    required: true,
  },
  addedAt: { type: Date, default: Date.now },
});

const platformProfits = mongoose.model("platformProfit", platformProfitsSchema);

module.exports = platformProfits;
