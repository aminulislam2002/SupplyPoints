const sellerLogs = require("../models/seller_logs.schema");

// Get my logs - Seller Dashboard
const getMyLogs = async (req, res) => {
  const { currentPage, limitPerPage, transactionType } = req.query;

  const identifier = req?.user?.identifier;
  const query = {};

  if (identifier) {
    query.identifier = {
      $regex: new RegExp(identifier, "i"),
    };
  }

  if (transactionType) {
    query.transactionType = {
      $regex: new RegExp(transactionType, "i"),
    };
  }

  const totalLogs = await sellerLogs.countDocuments(query); // Total Logs Count
  const page = parseInt(currentPage) || 0; // Default page 0
  const limit = parseInt(limitPerPage) || totalLogs; // Default limit all logs
  const skip = page * limit;

  try {
    const logsData = await sellerLogs
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

// Delete a log
const deleteALog = async (req, res) => {
  const { id } = req.params;

  try {
    await sellerLogs.findByIdAndDelete(id);

    return res.status(200).json({ message: "Successfully Deleted A Log!" });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getMyLogs,
  deleteALog,
};
