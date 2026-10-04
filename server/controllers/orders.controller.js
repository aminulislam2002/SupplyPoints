const orders = require("../models/orders.schema");
const products = require("../models/products.schema");
const users = require("../models/users.schema");
const platform = require("../models/platform.schema");
const platformProfits = require("../models/platform_profits.schema");
const sellerLogs = require("../models/seller_logs.schema");

// Get all order - Admin Dashboard
const getAllOrders = async (req, res) => {
  const {
    currentPage,
    limitPerPage,
    searchQuery,
    deliveryStatus,
    deliveryPaymentStatus,
    sortQuery,
  } = req.query;

  const query = {};
  const sort = {};

  const trimmedSearch = (searchQuery || "").trim();
  let useTextSearch = false;

  // Only start search when input length >= 2
  const isOnlyNumber = /^\d+$/.test(trimmedSearch);

  if (isOnlyNumber) {
    // Search in orderId, identifier (mobile), and customerInfo.number (mobile)
    query.$or = [
      { orderId: { $regex: trimmedSearch, $options: "i" } },
      { identifier: { $regex: trimmedSearch, $options: "i" } },
      { "customerInfo.number": { $regex: trimmedSearch, $options: "i" } },
    ];
  } else if (trimmedSearch.length >= 3) {
    query.$text = { $search: trimmedSearch };
    useTextSearch = true;
  }

  if (deliveryStatus) {
    query.deliveryStatus = deliveryStatus;
  }

  if (deliveryPaymentStatus) {
    query.deliveryPaymentStatus = deliveryPaymentStatus;
  }

  switch (sortQuery) {
    case "added_desc":
      sort.addedAt = -1;
      break;
    case "added_asc":
      sort.addedAt = 1;
      break;
    case "total_desc":
      sort.totalCost = -1;
      break;
    case "total_asc":
      sort.totalCost = 1;
      break;
    default:
      sort.addedAt = -1;
  }

  // Pagination
  const totalOrders = await orders.countDocuments(query);
  const page = Math.max(0, parseInt(currentPage, 10) || 0); // 0-based page
  const limit = Math.min(
    100,
    Math.max(1, parseInt(limitPerPage, 10) || Math.min(12, totalOrders || 12)),
  );
  const skip = page * limit;

  try {
    let cursor = orders.find(query).select({
      _id: 1,
      identifier: 1,
      sellerName: 1,
      sellerCurBal: 1,
      orderId: 1,
      "customerInfo.name": 1,
      "customerInfo.number": 1,
      "deliveryPaymentInfo.gateway": 1,
      "deliveryPaymentInfo.txnId": 1,
      "deliveryPaymentInfo.amount": 1,
      "deliveryInfo.courierTracking": 1,
      "deliveryInfo.courierMessage": 1,
      "deliveryInfo.paymentMethod": 1,
      "deliveryInfo.deliveryCharge": 1,
      "deliveryInfo.platformCode": 1,
      resellerPrice: 1,
      advanceAmount: 1,
      deliveryStatus: 1,
      deliveryPaymentMethod: 1,
      deliveryPaymentStatus: 1,
      addedAt: 1,
    });

    if (useTextSearch) {
      cursor = cursor.select({ score: { $meta: "textScore" } });
    }

    cursor = cursor.sort(sort).skip(skip).limit(limit).lean();

    const ordersList = await cursor;

    return res.status(200).json({
      totalOrders,
      data: ordersList,
      hasMore: skip + ordersList?.length < totalOrders,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Get orders statistics
const orderStatistic = async (req, res) => {
  try {
    const [result] = await orders
      .aggregate([
        {
          $facet: {
            counts: [
              {
                $group: {
                  _id: "$deliveryStatus",
                  count: { $sum: 1 },
                  totalPrice: { $sum: "$totalPrice" },
                },
              },
            ],
            totalOrders: [{ $count: "count" }],
          },
        },
      ])
      .toArray();

    const counts = result.counts;
    const totalOrders = result.totalOrders[0]?.count || 0;

    // Helper to get count and price by status
    const getStatusData = (statusArray) => {
      let count = 0;
      let price = 0;
      for (const item of counts) {
        if (statusArray.includes(item._id)) {
          count += item.count;
          price += item.totalPrice;
        }
      }
      return { count, price };
    };

    const { count: pendingOrders, price: pendingOrdersPrice } = getStatusData([
      "Pending",
    ]);
    const { count: runningOrders, price: runningOrdersPrice } = getStatusData([
      "Confirmed",
      "Shipping",
    ]);
    const { count: deliveredOrders, price: deliveredOrdersPrice } =
      getStatusData(["Delivered"]);
    const { count: cancelledOrders, price: cancelledOrdersPrice } =
      getStatusData(["Cancelled"]);
    const { count: returnOrders, price: returnOrdersPrice } = getStatusData([
      "Return",
    ]);

    // Total Price
    const totalOrdersPrice = counts.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    // Percentages
    const deliveredPercentage = (deliveredOrders / totalOrders) * 100 || 0;
    const cancelledPercentage = (cancelledOrders / totalOrders) * 100 || 0;
    const returnPercentage = (returnOrders / totalOrders) * 100 || 0;

    // Final response
    res.json({
      totalOrders,
      totalOrdersPrice,

      pendingOrders,
      pendingOrdersPrice,

      runningOrders,
      runningOrdersPrice,

      deliveredOrders,
      deliveredPercentage,
      deliveredOrdersPrice,

      cancelledOrders,
      cancelledOrdersPrice,
      cancelledPercentage,

      returnOrders,
      returnOrdersPrice,
      returnPercentage,
    });
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    res.status(500).json({ error: "Failed to fetch order statistics" });
  }
};

// Get my orders - Seller Dashboard
const getMyOrders = async (req, res) => {
  const { currentPage, limitPerPage, deliveryStatus, searchQuery, sortQuery } =
    req.query;

  const identifier = req?.user?.identifier;
  const query = {};
  const sort = {};

  if (searchQuery) {
    query.$or = [
      { "SellerInfo.name": { $regex: new RegExp(searchQuery, "i") } },
      { "SellerInfo.number": { $regex: new RegExp(searchQuery, "i") } },
      { "products.title": { $regex: new RegExp(searchQuery, "i") } },
      { orderId: { $regex: new RegExp(searchQuery, "i") } },
    ];
  }

  if (identifier) {
    query.identifier = {
      $regex: new RegExp(identifier, "i"),
    };
  }

  if (deliveryStatus) {
    query.deliveryStatus = deliveryStatus;
  }

  switch (sortQuery) {
    case "added_desc":
      sort.addedAt = -1;
      break;
    case "added_asc":
      sort.addedAt = 1;
      break;
    case "total_desc":
      sort.totalCost = -1;
      break;
    case "total_asc":
      sort.totalCost = 1;
      break;
    default:
      sort.addedAt = -1;
  }

  const totalOrders = await orders.countDocuments(query); // Total Orders Count
  const page = parseInt(currentPage) || 0; // Default page 0
  const limit = parseInt(limitPerPage) || totalOrders; // Default limit all orders
  const skip = page * limit;

  try {
    const ordersData = await orders
      .find(query)
      .select({
        _id: 1,
        orderId: 1,
        deliveryStatus: 1,
        productsPrice: 1,
        resellerPrice: 1,
        totalProfit: 1,
        addedAt: 1,
        "products.thumbnail": 1,
        "products.title": 1,
        "products.productCode": 1,
        "products.selectedQuantity": 1,
        "products.resellerPrice": 1,
        "deliveryInfo.courierTracking": 1,
        "deliveryInfo.courierMessage": 1,
        "deliveryInfo.paymentMethod": 1,
        "deliveryInfo.deliveryCharge": 1,
        advanceAmount: 1,
        deliveryPaymentMethod: 1,
        deliveryPaymentStatus: 1,
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      data: ordersData,
      totalOrders,
      hasMore: skip + ordersData?.length < totalOrders,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Get a order by its ID
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await orders.findById(id).lean();

    return res.status(200).json({ data: order });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Get a order by tracking
const getTrackOrder = async (req, res) => {
  const { orderId, phoneNumber } = req.query;

  try {
    const query = {};

    if (orderId) {
      query.orderId = orderId;
    }

    if (phoneNumber) {
      query["SellerInfo.number"] = phoneNumber;
    }

    const order = await orders.findOne(query).lean();

    return res.status(200).json({ data: order });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Post new order
const postNewOrder = async (req, res) => {
  const data = req.body;

  try {
    const identifier = req?.user?.identifier;

    const seller = await users.findOne({ identifier }).lean();

    if (!seller) {
      return res.status(400).json({ message: "Seller Not Found!" });
    }

    if (data.deliveryPaymentMethod === "COD") {
      // Cash On Delivery - no upfront payment needed
    } else if (data.deliveryPaymentMethod === "Balance") {
      // Deduct advance amount from balance
      await users.findOneAndUpdate(
        { identifier: identifier },
        { $inc: { balance: -data.balanceDeducted } },
        { new: true },
      );
    } else if (data.deliveryPaymentMethod === "Manual") {
      // Do nothing, manual payment to be handled later
    } else {
      return res.status(400).json({ message: "Invalid payment method." });
    }

    const orderId = Math.floor(1000000 + Math.random() * 900000);

    const orderInfo = {
      ...data,
      orderId: Number(orderId),
      identifier,
      sellerName: seller?.businessName || seller?.name || "Unknown Seller",
      sellerCurBal: seller?.balance,
    };

    const order = new orders(orderInfo);
    await order.save();

    if (data.deliveryPaymentMethod === "Balance") {
      // Seller earning log
      const sellerLog = {
        identifier: identifier,
        title: `Delivery Charge!`,
        description: `Delivery charge ${data.balanceDeducted} TK deducted from balance. 
                    Order ID: ${order.orderId}.`,
        amount: data.balanceDeducted,
        balanceBefore: seller.balance,
        balanceAfter: seller.balance - data.balanceDeducted,
        transactionType: "Debit",
      };

      const newSellerLog = new sellerLogs(sellerLog);
      await newSellerLog.save();
    }

    return res.status(200).json({ message: "Order Successful. Thank You!" });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Update order delivery status
const updateDeliveryStatus = async (req, res) => {
  const { deliveryStatus } = req.body;
  const { id } = req.params;

  try {
    const order = await orders.findById(id);

    if (!order) {
      return res.status(400).json({ message: "Order Data Not Found!" });
    }

    if (order.deliveryStatus === deliveryStatus) {
      return res
        .status(200)
        .json({ message: "Delivery status already set to this value." });
    }

    // Apply side-effects only for certain statuses
    switch (deliveryStatus) {
      case "Confirmed":
        // Only change deliveryStatus
        break;

      case "Shipped":
        // Only change deliveryStatus
        break;

      case "Cancelled":
        // Only change deliveryStatus
        break;

      case "Returned":
        // Only change deliveryStatus
        break;

      case "Out of Stock":
        // Only change deliveryStatus
        break;

      case "Delivered":
        let totalAdminProfit = 0;
        let totalProductsCount = 0;

        // Update products quantity and sold count
        for (const product of order?.products) {
          const selectedQuantity = parseFloat(product?.selectedQuantity); // From Order

          // Find the actual product to get the current quantity
          const existingProduct = await products.findById(product.productId);

          if (!existingProduct) {
            return res.status(400).json({
              message: `Product with ID ${product.productId} not found.`,
            });
          }

          let productQuantity = existingProduct?.quantity;
          let productAvailability = existingProduct?.availability;

          if (selectedQuantity > productQuantity) {
            return res.status(400).json({
              message: `Not enough stock for product ${existingProduct?.title}. Available: ${productQuantity}, Requested: ${selectedQuantity}`,
            });
          }

          // ✅ Platform Profit calculation
          const profitPerUnit = Number(existingProduct.profit || 0);
          const productProfit = profitPerUnit * selectedQuantity;

          totalAdminProfit += productProfit;
          totalProductsCount += selectedQuantity;

          // Update product quantity and sold count
          const newQuantity = productQuantity - selectedQuantity;
          const newTotalSold = (existingProduct?.sold || 0) + selectedQuantity;

          if (newQuantity <= 0) {
            productAvailability = "Out of Stock";
          } else if (newQuantity <= 5) {
            productAvailability = "Limited Stock";
          } else {
            productAvailability = "In Stock";
          }

          await products.findByIdAndUpdate(
            { _id: product.productId },
            {
              $set: {
                quantity: newQuantity,
                sold: newTotalSold,
                availability: productAvailability,
              },
            },
            {
              runValidators: true,
            },
          );
        }

        const seller = await users.findOne({ identifier: order.identifier });

        if (!seller) {
          return res.status(404).json({ message: "Seller not found!" });
        }

        const sellerTotalProfit = order.totalProfit || 0;

        //  Add seller profit to their balance
        const updatedSeller = await users.findOneAndUpdate(
          { identifier: order.identifier },
          { $inc: { balance: sellerTotalProfit } },
          { new: true },
        );

        const referer = await users.findOne({
          referralCode: seller?.referredBy,
        });

        if (referer) {
          const platformSettings = await platform.findOne().lean();

          const referralOrderBonusPer =
            platformSettings.referralOrderBonusPer || 0;
          const referralBonusAmount =
            (sellerTotalProfit * referralOrderBonusPer) / 100;

          const updatedReferer = await users.findOneAndUpdate(
            { identifier: referer.identifier },
            { $inc: { balance: referralBonusAmount } },
            { new: true },
          );

          const balanceAfter = updatedReferer.balance;
          const balanceBefore = balanceAfter - referralBonusAmount;

          const refererLog = {
            identifier: referer.identifier,
            title: "Referral Order Bonus!",
            description: `Referral order bonus credited for a successful referral. Referred user: ${seller.identifier}. Bonus amount: ${referralBonusAmount?.toFixed(2)} TK.`,
            amount: referralBonusAmount,
            balanceBefore: balanceBefore,
            balanceAfter: balanceAfter,
            transactionType: "Credit",
          };

          await sellerLogs.create(refererLog);
        }

        // Platform profit log
        const platformProfit = {
          title: `Order Profit!`,
          description: `Order has been delivered successfully. 
                      Platform profit earned: ${totalAdminProfit} TK. 
                      Seller ID: ${seller?.identifier}. 
                      Order ID: ${order.orderId}.`,
          purpose: "Order Profit",
          amount: totalAdminProfit,
        };

        const newPlatformProfit = new platformProfits(platformProfit);
        await newPlatformProfit.save();

        // Seller earning log
        const sellerLog = {
          identifier: order.identifier,
          title: `Order Profit!`,
          description: `Your order has been delivered successfully. 
                      Product Price: ${order?.productsPrice} TK, 
                      Selling Price: ${order?.resellerPrice} TK. 
                      You earned a profit of ${order.totalProfit} TK. 
                      Order ID: ${order.orderId}.`,
          amount: order.totalProfit,
          balanceBefore: updatedSeller.balance - order.totalProfit,
          balanceAfter: updatedSeller.balance,
          transactionType: "Credit",
        };

        const newSellerLog = new sellerLogs(sellerLog);
        await newSellerLog.save();

        break;

      default:
        return res.status(400).json({ message: "Invalid delivery status." });
    }

    const updatedDocs = {
      $set: {
        deliveryStatus: deliveryStatus,
      },
    };

    await orders.findByIdAndUpdate(id, updatedDocs, { runValidators: true });

    return res.status(200).json({
      message: `Make ${deliveryStatus} From ${order?.deliveryStatus}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Update order payment status
const updateDeliveryPaymentStatus = async (req, res) => {
  const { deliveryPaymentStatus } = req.body;
  const { id } = req.params;

  try {
    const order = await orders.findById(id);

    if (!order) {
      return res.status(400).json({ message: "Order Data Not Found!" });
    }

    const seller = await users.findOne({ identifier: order.identifier });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found!" });
    }

    const updatedDocs = {
      $set: {
        deliveryPaymentStatus,
      },
    };

    await orders.updateOne({ _id: id }, updatedDocs, {
      runValidators: true,
      new: true,
    });

    // Seller earning log
    const sellerLog = {
      identifier: order.identifier,
      title: `Delivery Charge!`,
      description: `Delivery charge ${order?.deliveryPaymentInfo?.amount} TK paid manually via ${order?.deliveryPaymentInfo?.gateway}. 
                    TxnID : ${order?.deliveryPaymentInfo?.txnId}. 
                    Order ID: ${order.orderId}.`,
      amount: order?.deliveryPaymentInfo?.amount,
      balanceBefore: seller.balance,
      balanceAfter: seller.balance,
      transactionType: "Debit",
    };

    const newSellerLog = new sellerLogs(sellerLog);
    await newSellerLog.save();

    return res.status(200).json({
      message: `Make ${deliveryPaymentStatus} From ${order?.deliveryPaymentStatus}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Update order courier tracking info
const updateCourierInfo = async (req, res) => {
  const { id } = req.params;
  const { courierTracking, courierMessage, platformCode } = req.body;

  try {
    const order = await orders.findById(id).select({ _id: 1 }).lean();

    if (!order) {
      return res.status(400).json({ message: "Order Data Not Found!" });
    }

    const updateSet = {
      ...(courierTracking && {
        "deliveryInfo.courierTracking": courierTracking,
      }),
      ...(courierMessage && { "deliveryInfo.courierMessage": courierMessage }),
      ...(platformCode && { "deliveryInfo.platformCode": platformCode }),
    };

    await orders.updateOne(
      { _id: id },
      {
        $set: updateSet,
      },
      {
        runValidators: true,
      },
    );

    return res.status(200).json({
      message: "Courier info updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Delete an order
const deleteAnOrder = async (req, res) => {
  const { id } = req.params;

  try {
    await orders.findByIdAndDelete(id);

    return res.status(200).json({ message: "Successfully Deleted An Order!" });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getAllOrders,
  orderStatistic,
  getMyOrders,
  getOrderById,
  getTrackOrder,
  postNewOrder,
  updateDeliveryStatus,
  updateDeliveryPaymentStatus,
  updateCourierInfo,
  deleteAnOrder,
};
