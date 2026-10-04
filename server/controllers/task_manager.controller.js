const mongoose = require("mongoose");
const taskManager = require("../models/task_manager.schema");

const getAllTasks = async (req, res) => {
  const { packId } = req.query;
  const query = {};

  if (packId && String(packId).trim()) {
    if (!mongoose.Types.ObjectId.isValid(packId)) {
      return res.status(400).json({ message: "Invalid pack id!" });
    }

    query.packId = packId;
  }

  try {
    const data = await taskManager
      .find(query)
      .populate("packId", "name category")
      .sort({ addedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data,
      message: "Tasks fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await taskManager
      .findById(id)
      .populate("packId", "name category")
      .lean();

    if (!data) {
      return res.status(404).json({ message: "Task not found!" });
    }

    return res.status(200).json({
      success: true,
      data,
      message: "Task fetched successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

const addTask = async (req, res) => {
  const data = req.body;

  try {
    const newTask = new taskManager(data);
    await newTask.save();

    return res.status(200).json({ message: "New Task Added!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const existingTask = await taskManager.findById(id).lean();

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found!" });
    }

    const updatedDocs = {
      $set: {
        ...data,
      },
    };

    await taskManager.findByIdAndUpdate(id, updatedDocs, {
      runValidators: true,
      new: true,
    });

    return res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await taskManager.findById(id).lean();

    if (!data) {
      return res.status(404).json({ message: "Task Not Found!" });
    }

    await taskManager.findByIdAndDelete(id);
    return res.status(200).json({ message: "Successfully Deleted Task!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
};
