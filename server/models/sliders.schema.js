const mongoose = require("mongoose");
const { Schema } = mongoose;

const slidersSchema = new Schema({
  image: { type: String, required: true },
  link: { type: String, required: false },
  addedAt: { type: Date, default: Date.now },
});

const sliders = mongoose.model("sliders", slidersSchema);
module.exports = sliders;
