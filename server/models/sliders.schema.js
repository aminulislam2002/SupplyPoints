const mongoose = require("mongoose");
const { Schema } = mongoose;

const slidersSchema = new Schema({
  image: { type: String, required: true },
  position: { type: String },
  link: { type: String },
  addedAt: { type: Date, default: Date.now },
});

const sliders = mongoose.model("sliders", slidersSchema);
module.exports = sliders;
