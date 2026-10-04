const mongoose = require("mongoose");
const { Schema } = mongoose;

const marketingPurchasesSchema = new Schema({
  identifier: { type: String, required: true, trim: true, lowercase: true },
  sellerName: { type: String, required: true, trim: true },
  packId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "marketing_packs",
    required: true,
  },
  packName: { type: String, required: true, trim: true },
  packTitle: { type: String, required: true, trim: true },
  taskValue: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 },
  durationDays: { type: Number, required: true, min: 1 },
  purchasedAt: { type: Date, required: true },
  expiredAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Activated", "Deactivated"],
    default: "Activated",
  },
  addedAt: { type: Date, default: Date.now },
});

marketingPurchasesSchema.index({ identifier: 1, addedAt: -1 });
marketingPurchasesSchema.index({ status: 1, expiredAt: 1 });
marketingPurchasesSchema.index({ packId: 1 });

const marketingPurchases = mongoose.model(
  "marketing_purchases",
  marketingPurchasesSchema,
);

module.exports = marketingPurchases;
