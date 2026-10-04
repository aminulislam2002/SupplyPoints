const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN, {
    expiresIn: `${process.env.ACCESS_TOKEN_EXPIRES_IN}m`,
  });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN, {
    expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN}d`,
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
};
