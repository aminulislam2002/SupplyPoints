const platformProfits = require("../models/platform_profits.schema");

// Get my logs - Seller Dashboard
const getAllLogs = async (req, res) => {
  const { currentPage, limitPerPage, purpose } = req.query;

  const query = {};

  if (purpose) {
    query.purpose = {
      $regex: new RegExp(purpose, "i"),
    };
  }

  const totalLogs = await platformProfits.countDocuments(query); // Total Logs Count
  const page = parseInt(currentPage) || 0; // Default page 0
  const limit = parseInt(limitPerPage) || totalLogs; // Default limit all logs
  const skip = page * limit;

  try {
    const logsData = await platformProfits
      .find(query)
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      data: logsData,
      totalLogs,
      hasMore: skip + logsData?.length < totalLogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getAllLogs,
};
