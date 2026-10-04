const mongoose = require("mongoose");
const { Schema } = mongoose;

const marketingPacksSchema = new Schema({
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ["FREE", "Regular", "Standard", "Premium"],
  },
  name: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  taskValue: { type: Number, required: true, min: 0 },
  taskQty: { type: Number, required: true, min: 1 },
  description: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  durationDays: { type: Number, required: true, min: 1 },
  createdAt: { type: Date, default: Date.now },
});

marketingPacksSchema.index({ category: 1, createdAt: -1 });
marketingPacksSchema.index({ price: 1 });

const marketingPacks = mongoose.model(
  "marketing_packs",
  marketingPacksSchema,
  "marketing_packs",
);

module.exports = marketingPacks;
