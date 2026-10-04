const mongoose = require("mongoose");

const marketingPurchases = require("../models/marketing_purchases.schema");
const users = require("../models/users.schema");
const marketingPacks = require("../models/marketing_packs.schema");
const sellerLogs = require("../models/seller_logs.schema");

const SPECIAL_REPURCHASE_WINDOW_START = new Date(2026, 8, 5, 0, 0, 0, 0);
const SPECIAL_REPURCHASE_WINDOW_END = new Date(2026, 8, 15, 23, 59, 59, 999);

const isSpecialRepurchaseWindowActive = (checkDate = new Date()) => {
  return (
    checkDate >= SPECIAL_REPURCHASE_WINDOW_START &&
    checkDate <= SPECIAL_REPURCHASE_WINDOW_END
  );
};

const syncExpiredMarketingPurchases = async (identifier = null) => {
  const now = new Date();
  const query = {
    status: "Activated",
    expiredAt: { $lte: now },
  };

  if (identifier) {
    query.identifier = identifier;
  }

  await marketingPurchases.updateMany(query, {
    $set: { status: "Deactivated" },
  });
};

const getAllMarketingPurchases = async (req, res) => {
  const { currentPage, limitPerPage, searchQuery, status } = req.query;
  const query = {};

  if (searchQuery) {
    const regex = new RegExp(searchQuery, "i");
    query.$or = [
      { sellerName: { $regex: regex } },
      { identifier: { $regex: regex } },
      { packName: { $regex: regex } },
      { packTitle: { $regex: regex } },
    ];
  }

  if (status) {
    query.status = status;
  }

  try {
    await syncExpiredMarketingPurchases();

    const totalPurchases = await marketingPurchases.countDocuments(query);
    const page = parseInt(currentPage) || 0;
    const limit = parseInt(limitPerPage) || totalPurchases;
    const skip = page * limit;

    const data = await marketingPurchases
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

const getMyMarketingPurchases = async (req, res) => {
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
    await syncExpiredMarketingPurchases(identifier);

    const totalPurchases = await marketingPurchases.countDocuments(query);
    const page = parseInt(currentPage) || 0;
    const limit = parseInt(limitPerPage) || totalPurchases;
    const skip = page * limit;

    const data = await marketingPurchases
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

const getAlreadyPurchasedPackIds = async (req, res) => {
  try {
    const identifier = req?.user?.identifier;

    if (!identifier) {
      return res.status(401).json({ message: "Unauthorized Access!" });
    }

    const owned = await marketingPurchases.find({ identifier }).lean();
    const specialRepurchaseWindowActive = isSpecialRepurchaseWindowActive();
    const alreadyRepurchasedInWindow = specialRepurchaseWindowActive
      ? new Set(
          owned
            .filter((purchase) => {
              const purchasedAt = purchase?.purchasedAt
                ? new Date(purchase.purchasedAt)
                : null;

              return (
                purchasedAt &&
                purchasedAt >= SPECIAL_REPURCHASE_WINDOW_START &&
                purchasedAt <= SPECIAL_REPURCHASE_WINDOW_END
              );
            })
            .map((purchase) => purchase?.packId?.toString())
            .filter(Boolean),
        )
      : new Set();

    const allowedRepurchasePackIds = specialRepurchaseWindowActive
      ? new Set(
          owned
            .filter(
              (purchase) =>
                purchase?.status === "Deactivated" &&
                !alreadyRepurchasedInWindow.has(purchase?.packId?.toString()),
            )
            .map((purchase) => purchase?.packId?.toString())
            .filter(Boolean),
        )
      : new Set();

    const countMap = {};

    owned.forEach((p) => {
      const id = p.packId?.toString();
      if (!id) return;
      countMap[id] = (countMap[id] || 0) + 1;
    });

    const packIds = [];

    for (const packId of Object.keys(countMap)) {
      const pack = await marketingPacks.findById(packId).lean();

      if (!pack) continue;

      const isAlreadyPurchased = countMap[packId] >= 1;
      const isSpecialException = allowedRepurchasePackIds.has(packId);

      if (isAlreadyPurchased && !isSpecialException) {
        packIds.push(packId);
      }
    }

    return res.status(200).json({
      isValid: true,
      data: packIds,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

const createMarketingPurchase = async (req, res) => {
  const { packId } = req.body;
  const identifier = req?.user?.identifier;

  if (!packId || !mongoose.Types.ObjectId.isValid(packId)) {
    return res.status(400).json({ message: "Valid packId is required!" });
  }

  try {
    const [seller, pack] = await Promise.all([
      users.findOne({ identifier }).lean(),
      marketingPacks.findById(packId).lean(),
    ]);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found!" });
    }

    if (!pack) {
      return res.status(404).json({ message: "Marketing pack not found!" });
    }

    if (pack.price > seller.balance) {
      return res.status(400).json({ message: "Insufficient balance!" });
    }

    const existingActivePurchase = await marketingPurchases.findOne({
      identifier,
      packId,
      status: "Activated",
    });

    const previousPurchase = await marketingPurchases
      .findOne({
        identifier,
        packId,
      })
      .sort({ purchasedAt: -1 });

    const specialRepurchaseWindowActive = isSpecialRepurchaseWindowActive();
    const priorDeactivatedPurchase = await marketingPurchases
      .findOne({
        identifier,
        packId,
        status: "Deactivated",
      })
      .sort({ purchasedAt: -1 });

    const existingSpecialRepurchaseThisWindow = specialRepurchaseWindowActive
      ? await marketingPurchases.findOne({
          identifier,
          packId,
          purchasedAt: {
            $gte: SPECIAL_REPURCHASE_WINDOW_START,
            $lte: SPECIAL_REPURCHASE_WINDOW_END,
          },
        })
      : null;

    if (existingActivePurchase) {
      return res.status(400).json({
        message: "You already have an active purchase for this pack!",
      });
    }

    if (
      previousPurchase &&
      (!specialRepurchaseWindowActive || !priorDeactivatedPurchase)
    ) {
      return res.status(400).json({
        message:
          "This pack has already been purchased before. Re-purchase is allowed only during the special August 2026 window.",
      });
    }

    if (existingSpecialRepurchaseThisWindow) {
      return res.status(400).json({
        message:
          "This pack has already been repurchased once in the special August 2026 window.",
      });
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
      taskValue: pack.taskValue,
      amount: pack.price,
      durationDays: pack.durationDays,
      purchasedAt,
      expiredAt,
      status: "Activated",
    };

    await marketingPurchases.create(purchaseData);

    const sellerLogData = {
      identifier: seller.identifier,
      title: `Marketing Pack Purchase Success!`,
      description: `Your ${pack.title} package has been purchased successfully. Amount: ${pack.price} TK. Duration: ${pack.durationDays} days.`,
      amount: pack.price,
      balanceBefore: updatedSeller.balance + pack.price,
      balanceAfter: updatedSeller.balance,
      transactionType: "Debit",
    };

    await Promise.all([sellerLogs.create(sellerLogData)]);

    return res.status(200).json({
      message: "Marketing pack purchased successfully!",
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

const deleteMarketingPurchase = async (req, res) => {
  const { id } = req.params;

  try {
    const purchase = await marketingPurchases.findById(id).lean();

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found!" });
    }

    await marketingPurchases.findByIdAndDelete(id);

    return res.status(200).json({ message: "Purchase deleted successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getAllMarketingPurchases,
  getMyMarketingPurchases,
  getAlreadyPurchasedPackIds,
  createMarketingPurchase,
  deleteMarketingPurchase,
};
