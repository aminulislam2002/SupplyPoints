const platform = require("../models/platform.schema");
const users = require("../models/users.schema");
const categories = require("../models/categories.schema");
const products = require("../models/products.schema");
const orders = require("../models/orders.schema");

// Get products, categories, orders, and users counts
const getStatistics = async (req, res) => {
  try {
    // Total counts
    const productsCount = await products.countDocuments();
    const categoriesCount = await categories.countDocuments();
    const ordersCount = await orders.countDocuments();
    const usersCount = await users.countDocuments();

    // Products count by availability
    const inStockCount = await products.countDocuments({
      availability: "In Stock",
    });
    const outOfStockCount = await products.countDocuments({
      availability: "Out of Stock",
    });
    const limitedStockCount = await products.countDocuments({
      availability: "Limited Stock",
    });

    // Orders count by delivery status
    const pendingOrdersCount = await orders.countDocuments({
      deliveryStatus: "Pending",
    });
    const confirmedOrdersCount = await orders.countDocuments({
      deliveryStatus: "Confirmed",
    });
    const shippedOrdersCount = await orders.countDocuments({
      deliveryStatus: "Shipped",
    });
    const deliveredOrdersCount = await orders.countDocuments({
      deliveryStatus: "Delivered",
    });
    const cancelledOrdersCount = await orders.countDocuments({
      deliveryStatus: "Cancelled",
    });

    return res.status(200).json({
      data: {
        products: {
          total: productsCount,
          inStock: inStockCount,
          outOfStock: outOfStockCount,
          limitedStock: limitedStockCount,
        },
        categories: categoriesCount,
        orders: {
          total: ordersCount,
          pending: pendingOrdersCount,
          confirmed: confirmedOrdersCount,
          shipped: shippedOrdersCount,
          delivered: deliveredOrdersCount,
          cancelled: cancelledOrdersCount,
        },
        users: usersCount,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Get platform information (always returns the first document)
const getPlatformInfo = async (req, res) => {
  try {
    // Find the first document in the collection
    const platformInfo = await platform.findOne().lean();

    if (!platformInfo) {
      return res
        .status(404)
        .json({ message: "Platform information not found!" });
    }

    return res.status(200).json({ data: platformInfo });
  } catch (error) {
    console.error("Error fetching platform info:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Update platform information (updates or creates the first document)
const updatePlatformInfo = async (req, res) => {
  const data = req.body;

  try {
    // Find the first document
    const existingPlatform = await platform.findOne();

    if (existingPlatform) {
      // Update existing document
      const updatedDocs = {
        ...data,
      };

      await platform.findByIdAndUpdate(existingPlatform._id, updatedDocs, {
        runValidators: true,
        new: true,
      });

      return res
        .status(200)
        .json({ message: "Platform information updated successfully!" });
    } else {
      // Create new document if none exists
      const platformData = new platform({
        ...data,
      });
      await platformData.save();

      return res
        .status(200)
        .json({ message: "Platform information created successfully!" });
    }
  } catch (error) {
    console.error("Error updating platform info:", error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getPlatformInfo,
  getStatistics,
  updatePlatformInfo,
};
