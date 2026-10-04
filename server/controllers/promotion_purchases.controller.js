const mongoose = require("mongoose");

const purchases = require("../models/promotion_purchases.schema");
const users = require("../models/users.schema");
const promotionPacks = require("../models/promotion_packs.schema");
const sellerLogs = require("../models/seller_logs.schema");

const syncExpiredPurchases = async (identifier = null) => {
  const now = new Date();
  const query = {
    status: "Activated",
    expiredAt: { $lte: now },
  };

  if (identifier) {
    query.identifier = identifier;
  }

  await purchases.updateMany(query, {
    $set: { status: "Deactivated" },
  });
};

// Get all purchases - Admin Dashboard
const getAllPurchases = async (req, res) => {
  const { currentPage, limitPerPage, searchQuery, status } = req.query;
  const query = {};

  if (searchQuery) {
    const regex = new RegExp(searchQuery, "i");
    query.$or = [
      { sellerName: { $regex: regex } },
      { identifier: { $regex: regex } },
      { packName: { $regex: regex } },
      { packTitle: { $regex: regex } },
      { promotionLink: { $regex: regex } },
    ];
  }

  if (status) {
    query.status = status;
  }

  try {
    await syncExpiredPurchases();

    const totalPurchases = await purchases.countDocuments(query);
    const page = parseInt(currentPage) || 0;
    const limit = parseInt(limitPerPage) || totalPurchases;
    const skip = page * limit;

    const data = await purchases
      .find(query)
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      data,
      totalPurchases,
      hasMore: skip + data?.length < totalPurchases,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Get my purchases - Seller Dashboard
const getMyPurchases = async (req, res) => {
  const { currentPage, limitPerPage, status } = req.query;
  const identifier = req?.user?.identifier;

  const query = {};

  if (identifier) {
    query.identifier = identifier;
  }

  if (status) {
    query.status = status;
  }

  try {
    await syncExpiredPurchases(identifier);

    const totalPurchases = await purchases.countDocuments(query);
    const page = parseInt(currentPage) || 0;
    const limit = parseInt(limitPerPage) || totalPurchases;
    const skip = page * limit;

    const data = await purchases
      .find(query)
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      data,
      totalPurchases,
      hasMore: skip + data?.length < totalPurchases,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Purchase a promotion pack - Seller Dashboard
const createPurchase = async (req, res) => {
  const { packId, promotionLink } = req.body;
  const identifier = req?.user?.identifier;

  if (!packId || !mongoose.Types.ObjectId.isValid(packId)) {
    return res.status(400).json({ message: "Valid packId is required!" });
  }

  if (!promotionLink || !String(promotionLink).trim()) {
    return res.status(400).json({ message: "Promotion link is required!" });
  }

  try {
    const [seller, pack] = await Promise.all([
      users.findOne({ identifier }).lean(),
      promotionPacks.findById(packId).lean(),
    ]);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found!" });
    }

    if (!pack) {
      return res.status(404).json({ message: "Promotion pack not found!" });
    }

    if (pack.price > seller.balance) {
      return res.status(400).json({ message: "Insufficient balance!" });
    }

    const updatedSeller = await users.findOneAndUpdate(
      {
        identifier,
        balance: { $gte: pack.price },
      },
      {
        $inc: { balance: -pack.price },
      },
      { new: true },
    );

    if (!updatedSeller) {
      return res.status(400).json({ message: "Insufficient balance!" });
    }

    const purchasedAt = new Date();
    const expiredAt = new Date(purchasedAt);
    expiredAt.setDate(expiredAt.getDate() + pack.durationDays);

    const purchaseData = {
      identifier: seller.identifier,
      sellerName: seller.name,
      packId: pack._id,
      packName: pack.name,
      packTitle: pack.title,
      promotionLink: String(promotionLink).trim(),
      amount: pack.price,
      durationDays: pack.durationDays,
      purchasedAt,
      expiredAt,
      status: "Activated",
    };

    await purchases.create(purchaseData);

    const sellerLogData = {
      identifier: seller.identifier,
      title: `Pack Purchase Success!`,
      description: `Your ${pack.title} package has been purchased successfully. Amount: ${pack.price} TK. Duration: ${pack.durationDays} days.`,
      amount: pack.price,
      balanceBefore: updatedSeller.balance + pack.price,
      balanceAfter: updatedSeller.balance,
      transactionType: "Debit",
    };

    await Promise.all([sellerLogs.create(sellerLogData)]);

    return res.status(200).json({
      message: "Promotion pack purchased successfully!",
      data: {
        packId: pack._id,
        purchasedAt,
        expiredAt,
        status: "Activated",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Delete a purchase - Admin Dashboard
const deletePurchase = async (req, res) => {
  const { id } = req.params;

  try {
    const purchase = await purchases.findById(id).lean();

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found!" });
    }

    await purchases.findByIdAndDelete(id);

    return res.status(200).json({ message: "Purchase deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getAllPurchases,
  getMyPurchases,
  createPurchase,
  deletePurchase,
};
