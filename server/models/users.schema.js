const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  // Basic details
  name: {
    type: String,
    required: true,
  },
  identifier: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  securityAnswer: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["User", "Seller", "Admin", "Blocked"],
    default: "User",
  },

  // Subscription details
  status: {
    type: String,
    enum: ["Inactive", "Active", "Pending", "Suspended"],
    default: "Inactive",
  },
  subscriptionStart: {
    type: Date,
  },
  subscriptionEnd: {
    type: Date,
  },
  subscriptionType: {
    type: String,
    enum: ["Free", "Premium"],
    default: "Premium",
  },

  // Balance details
  balance: {
    type: Number,
    default: 0,
  },
  withdrawals: {
    type: Number,
    default: 0,
  },

  // Referral details
  referralCode: {
    type: String,
    unique: true,
  },
  referredBy: {
    type: String,
  },

  // Profile details
  businessName: {
    type: String,
  },
  photo: {
    type: String,
  },
  gender: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

const users = mongoose.model("users", userSchema);

module.exports = users;
