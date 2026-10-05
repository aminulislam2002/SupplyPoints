const fs = require("fs");

const users = require("../models/users.schema");
const tokens = require("../models/tokens.schema");
const sellerLogs = require("../models/seller_logs.schema");
const platform = require("../models/platform.schema");

//  Get all users
const allUsers = async (req, res) => {
  const {
    currentPage,
    limitPerPage,
    searchQuery,
    role,
    reqFreeActivation,
    sortQuery,
  } = req.query;

  const query = {};
  const sort = {};

  if (searchQuery) {
    query.$or = [
      { identifier: { $regex: new RegExp(searchQuery, "i") } },
      { name: { $regex: new RegExp(searchQuery, "i") } },
      { referralCode: { $regex: new RegExp(searchQuery, "i") } },
      { referredBy: { $regex: new RegExp(searchQuery, "i") } },
    ];
  }

  if (role) {
    query.role = role;
  }

  if (reqFreeActivation && reqFreeActivation === "true") {
    query.subscriptionType = "Free";
    query.status = "Inactive";
  }

  switch (sortQuery) {
    case "newest":
      sort.createdAt = -1;
      break;
    case "oldest":
      sort.createdAt = 1;
      break;
    case "A-Z":
      sort.name = 1;
      break;
    case "Z-A":
      sort.name = -1;
      break;
    default:
      sort.createdAt = -1;
      break;
  }

  const totalUsers = await users.countDocuments(query); // Total Users Count
  const page = parseInt(currentPage) || 0; // Default page 0
  const limit = parseInt(limitPerPage) || totalUsers; // Default limit all users
  const skip = page * limit;

  try {
    const usersData = await users
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean() // Get plain JS objects
      .select("-password -securityAnswer"); // Exclude sensitive fields

    return res.status(200).json({
      data: usersData,
      totalUsers,
      hasMore: skip + usersData?.length < totalUsers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Get user by it's id
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await users
      .findById(id)
      .lean()
      .select("-password -securityAnswer");
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }
    return res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Get current logged user role from cookie
const getUserRole = async (req, res) => {
  try {
    const role = req?.user?.role; // From token, safe

    return res.status(200).json({
      success: true,
      role,
      isUser: role === "User",
      isAdmin: role === "Admin",
      isSeller: role === "Seller",
      isBlocked: role === "Blocked",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Get current logged user status from cookie
const getUserStatus = async (req, res) => {
  try {
    const status = req?.user?.status; // From token, safe

    return res.status(200).json({
      success: true,
      status,
      isInactive: status === "Inactive",
      isActive: status === "Active",
      isPending: status === "Pending",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Get my referral users
const getMyReferrals = async (req, res) => {
  const { referralCode } = req.params;

  try {
    const referralUsers = await users
      .find({ referredBy: referralCode })
      .select("-password -securityAnswer")
      .lean();

    return res.status(200).json({ data: referralUsers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "সার্ভার সমস্যা হয়েছে!" });
  }
};

// Increase/Decrease user balance
const updateBalance = async (req, res) => {
  const { amount, option } = req.body;
  const { id } = req.params;

  if ((amount && !option) || (option && !amount)) {
    {
      return res.status(400).json({ message: "Invalid Option or Amount!" });
    }
  }

  try {
    const user = await users.findById(id).lean();

    if (!user) {
      return res.status(400).json({ message: "User Not Found!" });
    }

    // Keep balance same by default
    const requestedAmount = parseFloat(amount) || 0;
    const userCurrentBalance = parseFloat(user?.balance) || 0;
    let newBalance = userCurrentBalance;

    // Handle balance changes based on option
    if (option && amount) {
      if (option === "Increase") {
        newBalance = userCurrentBalance + requestedAmount;
      } else if (option === "Decrease") {
        newBalance = userCurrentBalance - requestedAmount;
      }
    }

    const updatedDocs = {
      $set: {
        balance: Number(newBalance),
      },
    };

    await users.findByIdAndUpdate(id, updatedDocs, {
      new: true,
      runValidators: true,
    });

    // Create earning log for admin balance update
    if (option && amount) {
      const logAmount =
        option === "Increase" ? requestedAmount : -requestedAmount;

      const sellerLog = {
        identifier: user?.identifier,
        title: `Balance ${option}!`,
        description: `Your balance has been ${option === "Increase" ? "increased" : "decreased"} by ${requestedAmount} BDT. New balance: ${newBalance} BDT.`,
        amount: logAmount,
        balanceBefore: userCurrentBalance,
        balanceAfter: newBalance,
        transactionType: option === "Increase" ? "Credit" : "Debit",
      };

      const newSellerLog = new sellerLogs(sellerLog);
      await newSellerLog.save();
    }

    return res.status(200).json({
      message: `Successfully ${
        option === "Increase" ? "increased" : "decreased"
      }: ${newBalance}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Update a single user role
const updateRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req?.body;

  try {
    const user = await users.findById(id).lean();

    if (!user) {
      return res.status(400).json({ message: "User Not Found!" });
    }

    let devices = user.devices;
    let isBlocked = role === "Blocked";
    if (!user.isBlocked) {
      // If blocking, clear all devices
      devices = [];
    }

    const updatedDocs = {
      $set: {
        role,
        isBlocked,
        devices,
      },
    };

    await users.findByIdAndUpdate(id, updatedDocs, {
      new: true,
      runValidators: true,
    });

    await tokens.deleteMany({ identifier: user.identifier });

    return res
      .status(200)
      .json({ message: `Role updated to ${role} from ${user?.role}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Update user status - Active & role - Seller
const updateStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await users.findById(id).lean();

    if (!user) {
      return res.status(400).json({ message: "User Not Found!" });
    }

    const referredBy = user?.referredBy;

    // Referral bonus logic
    if (referredBy) {
      const referrer = await users.findOne({ referralCode: referredBy }).lean();

      const platformSettings = await platform.findOne().lean();

      if (referrer) {
        const bonusAmount = platformSettings.referralReward || 0; // Use referral bonus from platform settings
        await users.updateOne(
          { referralCode: referredBy },
          { $inc: { balance: bonusAmount } },
        );

        // Seller earning log
        const sellerLog = {
          identifier: referrer?.identifier,
          title: "Referral Reward!",
          description: `Referral reward credited for a successful referral. 
Referred user: ${referrer.identifier}. 
Reward amount: ${bonusAmount} TK.`,
          amount: bonusAmount,
          balanceBefore: referrer.balance,
          balanceAfter: referrer.balance + bonusAmount,
          transactionType: "Credit",
        };

        const newSellerLog = new sellerLogs(sellerLog);
        await newSellerLog.save();
      }
    }

    // Update user's role and status
    const subscriptionStart = new Date();
    const subscriptionEnd = new Date();
    // 1 year subscription
    subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);

    const updatedDocs = {
      $set: {
        status: "Active",
        role: "Seller",
        subscriptionType: "Free",
        subscriptionStart,
        subscriptionEnd,
      },
    };

    await users.findByIdAndUpdate(id, updatedDocs, {
      new: true,
      runValidators: true,
    });

    return res
      .status(200)
      .json({ message: `Status updated to Active & Role updated to Seller` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Update subscription type - Free
const subscriptionType = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await users.findById(id).lean();

    if (!user) {
      return res.status(400).json({ message: "User Not Found!" });
    }

    const updatedDocs = {
      $set: {
        subscriptionType: "Free",
      },
    };

    await users.findByIdAndUpdate(id, updatedDocs, {
      new: true,
      runValidators: true,
    });

    return res
      .status(200)
      .json({ message: `Status updated to Active & Role updated to Seller` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Update user profile details
const updateProfile = async (req, res) => {
  const profileData = req.body;
  const identifier = req?.user?.identifier;
  const file = req.file;

  try {
    const user = await users.findOne({ identifier }).lean();

    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    let photo = user.photo;

    if (file) {
      photo = `/images/users/${file.filename}`;

      // delete old image file if exists
      if (user?.photo) {
        fs.unlink(`.${user.photo}`, (err) => {
          if (err?.code === "ENOENT") {
            console.warn("User photo not found for deletion!");
          } else if (err) {
            console.error("Error deleting old user photo:", err);
          }
        });
      }
    }

    const updatedDocs = {
      $set: {
        ...profileData,
        photo,
      },
    };

    await users.findByIdAndUpdate(user._id, updatedDocs, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ message: "Profile updated successfully!" });
  } catch (error) {
    // Delete the newly uploaded file in case of error
    if (file) {
      fs.unlink(file.path, (unlinkErr) => {
        if (unlinkErr)
          console.error("Error deleting uploaded image:", unlinkErr);
      });
    }

    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Delete an user by id
const deleteAnUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await users.findById(id).lean();

    if (!user) {
      return res.status(404).json({ message: "SORRY! User Not Found." });
    }

    await users.findByIdAndDelete(id);

    await tokens.deleteMany({ identifier: user.identifier });

    return res
      .status(200)
      .json({ message: `Successfully Deleted ${user.name}!` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  allUsers,
  getUserById,
  getUserRole,
  getUserStatus,
  getMyReferrals,
  updateRole,
  updateBalance,
  updateStatus,
  subscriptionType,
  updateProfile,
  deleteAnUser,
};
