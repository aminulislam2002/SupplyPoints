const mongoose = require("mongoose");
const { Schema } = mongoose;

const platformSchema = new Schema({
  platformName: { type: String },
  emailAddress: { type: String },
  supportEmail: { type: String },
  ordersEmail: { type: String },
  returnEmail: { type: String },
  phoneNumber: { type: String },
  whatsappNumber: { type: String },
  address: { type: String },
  googleMap: { type: String },

  // Financial Settings
  paymentGateway: {
    type: String,
    enum: ["StarPay", "ClickPay", "Manual"],
    default: "Manual",
  },

  accountActivationFee: { type: Number, default: 0 },
  bkashNumber: { type: String },
  nagadNumber: { type: String },
  rocketNumber: { type: String },
  insideDeliveryCharge: { type: Number, default: 0 },
  outsideDeliveryCharge: { type: Number, default: 0 },
  referralReward: { type: Number, default: 0 },
  minWithdrawalLimit: { type: Number, default: 0 },
  minDepositLimit: { type: Number, default: 0 },
  depositBonusPer: { type: Number, default: 0 }, // Percentage
  referralDepositBonusPer: { type: Number, default: 0 }, // Percentage
  referralOrderBonusPer: { type: Number, default: 0 }, // Percentage

  packagingCharge: { type: Number, default: 0 },
  codCharge: { type: Number, default: 0 }, // Percentage

  // Social Media Links
  facebook: { type: String },
  instagram: { type: String },
  twitter: { type: String },
  linkedin: { type: String },
  youtube: { type: String },
  telegram: { type: String },
  telegramChannel: { type: String },
  telegramSupport: { type: String },
  telegramGroup: { type: String },

  // Business Information
  notice: { type: String },
  description: { type: String },
  ourStory: { type: String },
  ourMission: { type: String },
  ourVision: { type: String },
  marqueeText: { type: String },
  youtubeVideo: { type: String },
  resellingYoutube: { type: String },
  promotionYoutube: { type: String },
  marketingYoutube: { type: String },

  // Additional Contact
  alternativePhone: { type: String },
  SellerSupportEmail: { type: String },

  // SEO & Meta
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },

  // Other Settings
  currency: { type: String, default: "BDT" },
  language: { type: String, default: "en" },
  timezone: { type: String, default: "Asia/Dhaka" },

  addedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const platform = mongoose.model("platform", platformSchema);

module.exports = platform;
