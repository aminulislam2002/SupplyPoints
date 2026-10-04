const mongoose = require("mongoose");
const { Schema } = mongoose;

const rulesSchema = new Schema({
  rule: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});

const rules = mongoose.model("rules", rulesSchema);

module.exports = rules;
