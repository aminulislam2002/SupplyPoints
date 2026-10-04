const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const accessToken = req?.headers?.authorization
    ?.split(" ")[1]
    ?.replace(/"/g, "");

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized Access!" });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden Access!" });
    }

    req.user = decoded;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized Access!" });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Forbidden Access!" });
  }
  next();
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
