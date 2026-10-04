const milestone = require("../models/milestones.schema");

// Get all milestone with optional filtering
const getAllMilestone = async (req, res) => {
  const { currentPage, limitPerPage } = req.query;

  const query = {};

  const totalMilestones = await milestone.countDocuments(query);
  const page = parseInt(currentPage) || 0;
  const limit = parseInt(limitPerPage) || totalMilestones;
  const skip = page * limit;

  try {
    const data = await milestone
      .find(query)
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      data,
      totalMilestones,
      hasMore: skip + data?.length < totalMilestones,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Get a single milestone by ID
const getMilestoneById = async (req, res) => {
  const { id } = req.params;

  try {
    const milestoneData = await milestone.findById(id).lean();

    if (!milestoneData) {
      return res.status(404).json({ message: "Milestone not found!" });
    }

    return res.status(200).json({ data: milestoneData });
  } catch (error) {
    console.error("Error fetching milestone:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Add new milestone
const addMilestone = async (req, res) => {
  const data = req.body;

  try {
    const milestoneData = new milestone(data);
    await milestoneData.save();

    return res.status(200).json({ message: "New Milestone Added!" });
  } catch (error) {
    console.error("Error adding milestone:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Update milestone
const updateMilestone = async (req, res) => {
  const { id } = req.params;
  const milestoneData = req.body;

  try {
    const existingMilestone = await milestone.findById(id).lean();

    if (!existingMilestone) {
      return res.status(404).json({ message: "Milestone not found!" });
    }

    const updatedDocs = {
      $set: {
        ...milestoneData,
      },
    };

    await milestone.findByIdAndUpdate(id, updatedDocs, {
      runValidators: true,
      new: true,
    });

    return res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    console.error("Error updating milestone:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Delete a milestone
const deleteMilestone = async (req, res) => {
  const { id } = req.params;

  try {
    const milestoneData = await milestone.findById(id).lean();

    if (!milestoneData)
      return res.status(404).json({ message: "Milestone Not Found!" });

    await milestone.findByIdAndDelete(id);
    return res.status(200).json({ message: "Successfully Deleted Milestone!" });
  } catch (error) {
    console.error("Error deleting milestone:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getAllMilestone,
  getMilestoneById,
  addMilestone,
  updateMilestone,
  deleteMilestone,
};
