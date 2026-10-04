const mongoose = require("mongoose");
const { Schema } = mongoose;

const submittedTasksSchema = new Schema({
  identifier: { type: String, required: true, trim: true, lowercase: true },
  sellerName: { type: String, required: true, trim: true },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "task_manager",
    required: true,
  },
  packId: {
    type: Schema.Types.ObjectId,
    ref: "marketing_packs",
    required: true,
  },
  packName: { type: String, required: true, trim: true },
  taskUrl: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  taskValue: { type: Number, required: true, min: 0 },
  images: [{ type: String, required: true }],
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  reviewedBy: { type: String, trim: true, lowercase: true },
  reviewedAt: { type: Date },
  dateKey: { type: String, required: true, trim: true },
  submittedAt: { type: Date, default: Date.now },
});

submittedTasksSchema.index({ identifier: 1, submittedAt: -1 });
submittedTasksSchema.index({ packId: 1, submittedAt: -1 });
submittedTasksSchema.index({ status: 1, submittedAt: -1 });
submittedTasksSchema.index(
  { taskId: 1, dateKey: 1, identifier: 1 },
  { unique: true },
);

const submittedTasks = mongoose.model(
  "submitted_tasks",
  submittedTasksSchema,
  "submitted_tasks",
);

module.exports = submittedTasks;
