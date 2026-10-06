const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.path.includes("/add-slider")) {
      cb(null, "images/sliders");
    } else if (req.path.includes("/update-slider")) {
      cb(null, "images/sliders");
    } else if (req.path.includes("/add-product")) {
      cb(null, "images/products");
    } else if (req.path.includes("/update-product")) {
      cb(null, "images/products");
    } else if (req.path.includes("/add-sub-category")) {
      cb(null, "images/categories");
    } else if (req.path.includes("/update-sub-category")) {
      cb(null, "images/categories");
    } else if (
      req.baseUrl.includes("/categories") &&
      (req.path.includes("/add-category") ||
        req.path.includes("/update-category"))
    ) {
      cb(null, "images/categories");
    } else if (
      req.baseUrl.includes("/promotion-categories") &&
      req.path.includes("/add-category")
    ) {
      cb(null, "images/promotions");
    } else if (
      req.baseUrl.includes("/promotion-categories") &&
      req.path.includes("/update-category")
    ) {
      cb(null, "images/promotions");
    } else if (req.path.includes("/add-pack")) {
      cb(null, "images/promotions");
    } else if (req.path.includes("/update-pack")) {
      cb(null, "images/promotions");
    } else if (req.path.includes("/profile")) {
      cb(null, "images/users");
    } else if (req.path.includes("/submit-task")) {
      cb(null, "images/tasks");
    } else {
      cb(null, "images/others");
    }
  },

  filename(req, file, cb) {
    const ext = path.extname(file.originalname);

    const baseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, "-");

    const time = Date.now();
    const hash = crypto.randomBytes(6).toString("hex");

    cb(null, `${baseName}-${time}-${hash}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
