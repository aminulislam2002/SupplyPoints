const rules = require("../models/rules.schema");

// Get all rules with optional filtering
const getAllRules = async (req, res) => {
  const { currentPage, limitPerPage } = req.query;

  const query = {};

  const totalRules = await rules.countDocuments(query);
  const page = parseInt(currentPage) || 0;
  const limit = parseInt(limitPerPage) || totalRules;
  const skip = page * limit;

  try {
    const data = await rules
      .find(query)
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      data,
      totalRules,
      hasMore: skip + data?.length < totalRules,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Get a single rule by ID
const getRuleById = async (req, res) => {
  const { id } = req.params;

  try {
    const ruleData = await rules.findById(id).lean();

    if (!ruleData) {
      return res.status(404).json({ message: "Rule not found!" });
    }

    return res.status(200).json({ data: ruleData });
  } catch (error) {
    console.error("Error fetching rule:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Add new rule
const addRule = async (req, res) => {
  const data = req.body;

  try {
    const ruleData = new rules(data);
    await ruleData.save();

    return res.status(200).json({ message: "New Rule Added!" });
  } catch (error) {
    console.error("Error adding rule:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Update rule
const updateRule = async (req, res) => {
  const { id } = req.params;
  const ruleData = req.body;

  try {
    const existingRule = await rules.findById(id).lean();

    if (!existingRule) {
      return res.status(404).json({ message: "Rule not found!" });
    }

    const updatedDocs = {
      $set: {
        ...ruleData,
        addedAt: new Date(),
      },
    };

    await rules.findByIdAndUpdate(id, updatedDocs, {
      runValidators: true,
      new: true,
    });

    return res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    console.error("Error updating rule:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Delete a rule
const deleteRule = async (req, res) => {
  const { id } = req.params;

  try {
    const ruleData = await rules.findById(id).lean();

    if (!ruleData) return res.status(404).json({ message: "Rule Not Found!" });

    await rules.findByIdAndDelete(id);
    return res.status(200).json({ message: "Successfully Deleted Rule!" });
  } catch (error) {
    console.error("Error deleting rule:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getAllRules,
  getRuleById,
  addRule,
  updateRule,
  deleteRule,
};
