const mongoose = require("mongoose");
const { Schema } = mongoose;

const categoriesSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

categoriesSchema.index({ createdAt: -1 }); // Ex: New to Old

const categories = mongoose.model("categories", categoriesSchema);

module.exports = categories;
