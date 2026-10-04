const mongoose = require("mongoose");
const { Schema } = mongoose;

const milestonesSchema = new Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  descriptions: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});

const milestones = mongoose.model("milestones", milestonesSchema);

module.exports = milestones;
