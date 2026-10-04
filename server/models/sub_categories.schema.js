const mongoose = require("mongoose");
const { Schema } = mongoose;

const subCategoriesSchema = new Schema({
  name: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  image: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

subCategoriesSchema.index({ createdAt: -1 }); // Ex: New to Old

const subCategories = mongoose.model("subCategories", subCategoriesSchema);

module.exports = subCategories;
