const mongoose = require("mongoose");
const { Schema } = mongoose;

const promotionPacksSchema = new Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "promotion_categories",
    required: true,
  },
  name: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  durationDays: { type: Number, required: true, min: 1 },
  createdAt: { type: Date, default: Date.now },
});

promotionPacksSchema.index({ category: 1, createdAt: -1 });
promotionPacksSchema.index({ price: 1 });

const promotionPacks = mongoose.model(
  "promotion_packs",
  promotionPacksSchema,
  "promotion_packs",
);

module.exports = promotionPacks;
