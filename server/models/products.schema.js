const mongoose = require("mongoose");
const { Schema } = mongoose;

const productsSchema = new Schema({
  title: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
  price: { type: Number, required: true },
  profit: { type: Number, required: true },
  suggestedPrice: { type: Number, required: true },
  sellingPrice: { type: Number },
  quantity: { type: Number, default: 100 },
  sold: { type: Number, default: 0 },
  availability: {
    type: String,
    enum: ["In Stock", "Out of Stock", "Limited Stock"],
    default: "In Stock",
  },
  thumbnail: { type: String, required: true },
  photos: { type: [String] },
  colors: { type: [String] },
  sizes: { type: [String] },
  reviews: { type: [String] },
  ratings: { type: Number, default: 0 },
  descriptions: { type: String },
  notes: { type: String },
  isVerified: { type: Boolean, default: false },
  productCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  sold: { type: Number, default: 0 },
});

productsSchema.index({ createdAt: -1 }); // CreatedAt in descending order. Ex: New to Old
productsSchema.index({ price: 1 }); // Price in ascending order. Ex: 10, 20, 30
productsSchema.index({ sold: -1 }); // Sold in descending order. Ex: 30, 20, 10
productsSchema.index({ productCode: 1 }); // Product Code Index
productsSchema.index({ category: 1, subCategory: 1 }); // Category | Category + SubCategory
productsSchema.index({ title: "text", descriptions: "text" }); // Text Index for Search

const products = mongoose.model("products", productsSchema);

module.exports = products;
