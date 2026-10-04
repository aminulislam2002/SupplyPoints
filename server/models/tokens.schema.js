// All Refresh Token related schema and methods
const mongoose = require("mongoose");
const { Schema } = mongoose;

const tokensSchema = new Schema({
  identifier: {
    type: String,
    required: true,
    unique: true,
  },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: process.env.REFRESH_TOKEN_EXPIRES_IN + "d",
  },
});

const tokens = mongoose.model("tokens", tokensSchema);

module.exports = tokens;
