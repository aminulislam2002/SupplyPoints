const mongoose = require("mongoose");
const { Schema } = mongoose;

const promotionCategoriesSchema = new Schema({
  name: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

promotionCategoriesSchema.index({ createdAt: -1 });

const promotionCategories = mongoose.model(
  "promotion_categories",
  promotionCategoriesSchema,
  "promotion_categories",
);

module.exports = promotionCategories;
