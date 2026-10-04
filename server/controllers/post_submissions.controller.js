const mongoose = require("mongoose");

const postSubmissions = require("../models/post_submissions.schema");
const users = require("../models/users.schema");
const sellerLogs = require("../models/seller_logs.schema");

// Get all submissions - Admin
const getAllSubmissions = async (req, res) => {
  const { currentPage, limitPerPage, status } = req.query;
  const query = {};

  if (status) query.status = status;

  try {
    const total = await postSubmissions.countDocuments(query);
    const page = parseInt(currentPage) || 0;
    const limit = parseInt(limitPerPage) || total;
    const skip = page * limit;

    const data = await postSubmissions
      .find(query)
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res
      .status(200)
      .json({
        data,
        totalSubmissions: total,
        hasMore: skip + data.length < total,
      });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Get my submissions - Seller
const getMySubmissions = async (req, res) => {
  const { currentPage, limitPerPage, status } = req.query;
  const identifier = req?.user?.identifier;
  const query = {};

  if (identifier) query.identifier = identifier;
  if (status) query.status = status;

  try {
    const total = await postSubmissions.countDocuments(query);
    const page = parseInt(currentPage) || 0;
    const limit = parseInt(limitPerPage) || total;
    const skip = page * limit;

    const data = await postSubmissions
      .find(query)
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res
      .status(200)
      .json({
        data,
        totalSubmissions: total,
        hasMore: skip + data.length < total,
      });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Create submission - Seller
const createSubmission = async (req, res) => {
  const { platform, postLink, note } = req.body;
  const identifier = req?.user?.identifier;

  if (!platform || !String(platform).trim()) {
    return res.status(400).json({ message: "Platform is required!" });
  }

  if (!postLink || !String(postLink).trim()) {
    return res.status(400).json({ message: "Post link is required!" });
  }

  try {
    const seller = await users.findOne({ identifier }).lean();
    if (!seller) return res.status(404).json({ message: "Seller not found!" });

    const submissionData = {
      identifier: seller.identifier,
      sellerName: seller.name,
      platform: String(platform).trim(),
      postLink: String(postLink).trim(),
      note: note ? String(note).trim() : "",
      status: "In Review",
    };

    await postSubmissions.create(submissionData);

    return res.status(200).json({ message: "Post submitted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Approve submission - Admin
const approveSubmission = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  const adminIdentifier = req?.user?.identifier || "admin";

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Valid id is required!" });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Valid amount is required for approval!" });
  }

  try {
    const submission = await postSubmissions.findById(id).lean();
    if (!submission)
      return res.status(404).json({ message: "Submission not found!" });
    if (submission.status === "Approved")
      return res.status(400).json({ message: "Already approved!" });

    // Credit seller balance
    const updatedSeller = await users.findOneAndUpdate(
      { identifier: submission.identifier },
      { $inc: { balance: amount } },
      { new: true },
    );

    if (!updatedSeller)
      return res
        .status(404)
        .json({ message: "Seller not found for balance update!" });

    const sellerLogData = {
      identifier: submission.identifier,
      title: `Post Approved: ${submission.platform}`,
      description: `Your submitted post has been approved. Amount credited: ${amount} TK.`,
      amount,
      balanceBefore: updatedSeller.balance - amount,
      balanceAfter: updatedSeller.balance,
      transactionType: "Credit",
    };

    await Promise.all([
      postSubmissions.findByIdAndUpdate(id, {
        $set: {
          status: "Approved",
          amount,
          approvedBy: adminIdentifier,
          approvedAt: new Date(),
        },
      }),
      sellerLogs.create(sellerLogData),
    ]);

    return res
      .status(200)
      .json({ message: "Submission approved and amount credited." });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Reject submission - Admin
const rejectSubmission = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Valid id is required!" });
  }

  try {
    const submission = await postSubmissions.findById(id).lean();
    if (!submission)
      return res.status(404).json({ message: "Submission not found!" });
    if (submission.status === "Approved")
      return res.status(400).json({ message: "Already approved!" });

    await postSubmissions.findByIdAndUpdate(id, { $set: { status: "Reject" } });

    return res.status(200).json({ message: "Submission rejected." });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getAllSubmissions,
  getMySubmissions,
  createSubmission,
  approveSubmission,
  rejectSubmission,
};
