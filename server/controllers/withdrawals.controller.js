const withdrawals = require("../models/withdrawals.schema");
const users = require("../models/users.schema");
const sellerLogs = require("../models/seller_logs.schema");

// Get all withdrawals - Admin Route
const getAllWithdrawals = async (req, res) => {
  const { currentPage, limitPerPage, status, searchQuery } = req.query;

  const query = {};

  if (searchQuery) {
    query.$or = [
      { sellerName: { $regex: new RegExp(searchQuery, "i") } },
      { identifier: { $regex: new RegExp(searchQuery, "i") } },
      { account: { $regex: new RegExp(searchQuery, "i") } },
    ];
  }

  if (status) {
    query.status = status;
  }

  const totalWithdrawals = await withdrawals.countDocuments(query);
  const page = parseInt(currentPage) || 0;
  const limit = parseInt(limitPerPage) || totalWithdrawals;
  const skip = page * limit;

  try {
    const data = await withdrawals
      .find(query)
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      data,
      totalWithdrawals,
      hasMore: skip + data?.length < totalWithdrawals,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Get my withdrawals - Seller Route
const getMyWithdrawals = async (req, res) => {
  const { currentPage, limitPerPage, status } = req.query;
  const identifier = req?.user?.identifier;

  const query = {};

  if (identifier) {
    query.identifier = identifier;
  }

  if (status) {
    query.status = status;
  }

  const totalWithdrawals = await withdrawals.countDocuments(query);
  const page = parseInt(currentPage) || 0;
  const limit = parseInt(limitPerPage) || totalWithdrawals;
  const skip = page * limit;

  try {
    const data = await withdrawals
      .find(query)
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      data,
      totalWithdrawals,
      hasMore: skip + data?.length < totalWithdrawals,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Create withdrawal request - Seller Route
const createWithdrawalRequest = async (req, res) => {
  const { payMethod, account, amount } = req.body;
  const identifier = req?.user?.identifier;

  try {
    const seller = await users.findOne({ identifier }).lean();

    if (!seller) {
      return res.status(404).json({ message: "Seller not found!" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid withdrawal amount!" });
    }

    if (amount > seller.balance) {
      return res.status(400).json({ message: "Insufficient balance!" });
    }

    const withdrawalExists = await withdrawals.findOne({
      identifier,
      status: "Pending",
    });

    if (withdrawalExists) {
      return res.status(400).json({
        message: "You already have a pending withdrawal request!",
      });
    }

    const withdrawalData = {
      identifier,
      sellerName: seller.name,
      payMethod,
      account,
      amount,
    };

    const withdrawal = new withdrawals(withdrawalData);
    await withdrawal.save();

    return res
      .status(200)
      .json({ message: "Withdrawal request submitted successfully!" });
  } catch (error) {
    console.error("Error creating withdrawal request:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Update withdrawal status - Admin Route
const updateWithdrawalStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const withdrawal = await withdrawals.findById(id);

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal request not found!" });
    }

    if (withdrawal.status !== "Pending") {
      return res.status(400).json({
        message: `This withdrawal request has already been ${withdrawal.status.toLowerCase()}.`,
      });
    }

    if (status === "Approved") {
      const seller = await users.findOne({ identifier: withdrawal.identifier });

      if (!seller) {
        return res.status(404).json({ message: "Seller not found!" });
      }

      if (withdrawal.amount > seller.balance) {
        return res.status(400).json({
          message: "Seller has insufficient balance for this withdrawal!",
        });
      }

      const updatedSeller = await users.findOneAndUpdate(
        { identifier: withdrawal.identifier },
        {
          $inc: { balance: -withdrawal.amount, withdrawals: withdrawal.amount },
        },
        { new: true },
      );

      await withdrawals.findByIdAndUpdate(
        id,
        { $set: { status: "Approved" } },
        { runValidators: true },
      );

      const sellerLog = {
        identifier: withdrawal.identifier,
        title: `Withdrawal Approved!`,
        description: `Your withdrawal request of ${withdrawal.amount} TK has been approved. Payment method: ${withdrawal.payMethod}, Account: ${withdrawal.account}.`,
        amount: withdrawal.amount,
        balanceBefore: updatedSeller.balance + withdrawal.amount,
        balanceAfter: updatedSeller.balance,
        transactionType: "Debit",
      };

      const newSellerLog = new sellerLogs(sellerLog);
      await newSellerLog.save();

      return res
        .status(200)
        .json({ message: "Withdrawal approved successfully!" });
    } else if (status === "Rejected") {
      await withdrawals.findByIdAndUpdate(
        id,
        { $set: { status: "Rejected" } },
        { runValidators: true },
      );

      return res
        .status(200)
        .json({ message: "Withdrawal rejected successfully!" });
    } else {
      return res.status(400).json({ message: "Invalid status!" });
    }
  } catch (error) {
    console.error("Error updating withdrawal status:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getAllWithdrawals,
  getMyWithdrawals,
  createWithdrawalRequest,
  updateWithdrawalStatus,
};
