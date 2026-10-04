const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSubmissionsSchema = new Schema({
  identifier: { type: String, required: true, trim: true, lowercase: true },
  sellerName: { type: String, required: true, trim: true },
  platform: { type: String, required: true, trim: true },
  postLink: { type: String, required: true, trim: true },
  note: { type: String },
  status: {
    type: String,
    enum: ["In Review", "Approved", "Reject"],
    default: "In Review",
  },
  amount: { type: Number, default: 0 },
  approvedBy: { type: String },
  approvedAt: { type: Date },
  addedAt: { type: Date, default: Date.now },
});

postSubmissionsSchema.index({ identifier: 1, addedAt: -1 });
postSubmissionsSchema.index({ status: 1, addedAt: -1 });

const postSubmissions = mongoose.model(
  "post_submissions",
  postSubmissionsSchema,
);

module.exports = postSubmissions;
