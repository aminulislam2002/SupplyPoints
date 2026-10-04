const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskManagerSchema = new Schema({
  packId: {
    type: Schema.Types.ObjectId,
    ref: "marketing_packs",
    required: true,
  },
  taskUrl: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  addedAt: { type: Date, default: Date.now },
});

taskManagerSchema.index({ packId: 1, addedAt: -1 });

const taskManager = mongoose.model(
  "task_manager",
  taskManagerSchema,
  "task_manager",
);

module.exports = taskManager;
