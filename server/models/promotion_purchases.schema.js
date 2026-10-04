const mongoose = require("mongoose");
const { Schema } = mongoose;

const purchasesSchema = new Schema({
  identifier: { type: String, required: true, trim: true, lowercase: true },
  sellerName: { type: String, required: true, trim: true },
  packId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "promotion_packs",
    required: true,
  },
  packName: { type: String, required: true, trim: true },
  packTitle: { type: String, required: true, trim: true },
  promotionLink: { type: String, required: true, trim: true },
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

purchasesSchema.index({ identifier: 1, addedAt: -1 });
purchasesSchema.index({ status: 1, expiredAt: 1 });
purchasesSchema.index({ packId: 1 });

const purchases = mongoose.model("promotion_purchases", purchasesSchema);

module.exports = purchases;
