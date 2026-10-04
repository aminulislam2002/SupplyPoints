const mongoose = require("mongoose");
const { Schema } = mongoose;

const faqSchema = new Schema({
  category: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: false },
  addedAt: { type: Date, default: Date.now },
});

const faq = mongoose.model("faq", faqSchema);

module.exports = faq;
