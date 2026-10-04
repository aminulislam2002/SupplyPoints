const axios = require("axios");
const crypto = require("crypto");

const addFunds = require("../models/add_funds.schema");
const users = require("../models/users.schema");
const platform = require("../models/platform.schema");
const platformProfits = require("../models/platform_profits.schema");
const sellerLogs = require("../models/seller_logs.schema");

const { generateSignature } = require("../utils/signature");

const getStarPayApiKey = () => process.env.STARPAY_APP_KEY;
const VERIFY_API = process.env.STARPAY_VERIFY_API;

const getPaymentEmail = (seller, identifier) => {
  if (seller?.email) {
    return seller.email;
  }

  return `${identifier || "customer"}@example.com`;
};

// Get all add funds requests - Admin Dashboard
const getAllAddFundsRequests = async (req, res) => {
  const { currentPage, limitPerPage, searchQuery, status, gateway } = req.query;
  const query = {};

  if (searchQuery) {
    const regex = new RegExp(searchQuery, "i");
    query.$or = [
      { sellerName: { $regex: regex } },
      { identifier: { $regex: regex } },
      { txnId: { $regex: regex } },
    ];
  }

  if (status) {
    query.status = status;
  }

  if (gateway) {
    query.gateway = gateway;
  }

  try {
    const totalRequests = await addFunds.countDocuments(query);
    const page = parseInt(currentPage) || 0;
    const limit = parseInt(limitPerPage) || totalRequests;
    const skip = page * limit;

    const data = await addFunds
      .find(query)
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      data,
      totalRequests,
      hasMore: skip + data?.length < totalRequests,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Get my add funds requests - Seller Dashboard
const getMyAddFundsRequests = async (req, res) => {
  const { currentPage, limitPerPage, status, gateway } = req.query;
  const identifier = req?.user?.identifier;

  const query = {};

  if (identifier) {
    query.identifier = identifier;
  }

  if (status) {
    query.status = status;
  }

  if (gateway) {
    query.gateway = gateway;
  }

  try {
    const totalRequests = await addFunds.countDocuments(query);
    const page = parseInt(currentPage) || 0;
    const limit = parseInt(limitPerPage) || totalRequests;
    const skip = page * limit;

    const data = await addFunds
      .find(query)
      .sort({ addedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      data,
      totalRequests,
      hasMore: skip + data?.length < totalRequests,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

const onlinePaymentGateways = ["ClickPay", "StarPay"];

// Make Payment - active platform gateway
const createAddFundsRequest = async (req, res) => {
  const { amount, gateway, purpose } = req.body;
  const identifier = req?.user?.identifier;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ message: "Invalid add funds amount!" });
  }

  if (!purpose) {
    return res.status(400).json({ message: "Purpose is required!" });
  }

  try {
    const seller = await users.findOne({ identifier }).lean();

    if (!seller) {
      return res.status(404).json({ message: "Seller not found!" });
    }

    const platformSettings = await platform.findOne().lean();
    const activeGateway = platformSettings?.paymentGateway || "Manual";

    if (!onlinePaymentGateways.includes(activeGateway)) {
      return res.status(400).json({
        message: "Active payment gateway is not configured for online payment.",
      });
    }

    const selectedGateway = String(gateway || "BKASH").toUpperCase();

    if (activeGateway === "ClickPay") {
      const payload = {
        amount: String(amount),
        method: selectedGateway,
        phone: identifier || "01712345678",
        name: seller.name || "Test User",
        merchantSerialNo: `T${Date.now()}`,
        remark: "1",
        email: seller.email || "test@gmail.com",
      };

      const path = "/v1/merchant/pay";
      const timestamp = Math.floor(Date.now() / 1000);
      const bodyString = JSON.stringify(payload);
      const signature = generateSignature(path, bodyString, timestamp);

      const response = await axios.post(
        "https://pay.clickpay.lol/v1/merchant/pay",
        bodyString,
        {
          headers: {
            "Content-Type": "application/json",
            "Merchant-Code": "BDT21034",
            Timestamp: String(timestamp),
            Signature: signature,
          },
        },
      );

      if (!response?.data?.data?.payUrl) {
        return res.status(400).json({
          message: "Payment create failed",
        });
      }

      const newDeposit = new addFunds({
        identifier,
        sellerName: seller.name,
        amount: Number(amount),
        transactionId: response.data.data.transactionId,
        gateway: selectedGateway,
        purpose,
        channel: activeGateway,
        status: "Pending",
      });

      await newDeposit.save();

      return res.status(200).json({
        success: true,
        message: "Payment request processed successfully",
        data: response.data.data,
        paymentUrl: response.data.data.payUrl,
      });
    }

    if (activeGateway === "StarPay") {
      const transactionId = crypto
        .randomBytes(10)
        .toString("hex")
        .toLocaleUpperCase();

      const starPayApiKey = getStarPayApiKey();

      if (!starPayApiKey) {
        return res.status(500).json({
          message: "StarPay API key is not configured.",
        });
      }

      const paymentData = {
        cus_name: seller?.name || "Customer",
        cus_email: getPaymentEmail(seller, identifier),
        amount: String(amount),
        success_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        metadata: {
          identifier,
          transactionId,
          purpose,
          gateway: selectedGateway,
          channel: activeGateway,
        },
      };

      const response = await axios.post(
        process.env.STARPAY_BASE_URL,
        paymentData,
        {
          headers: {
            "API-KEY": starPayApiKey,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response?.data?.payment_url)
        return res.status(400).json({
          message: "Payment create failed",
        });

      const newDeposit = new addFunds({
        identifier,
        sellerName: seller.name,
        amount: Number(amount),
        transactionId,
        gateway: selectedGateway,
        purpose,
        channel: activeGateway,
        status: "Pending",
      });

      await newDeposit.save();

      return res.status(200).json({
        success: true,
        message: "Payment created successfully",
        data: response.data,
        paymentUrl: response.data.payment_url,
      });
    }

    return res.status(400).json({
      message: "Unsupported payment gateway.",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Create add funds request - Manual Payment
const createPaymentsRequest = async (req, res) => {
  const { amount, gateway, purpose, transactionId } = req.body;
  const identifier = req?.user?.identifier;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ message: "Invalid add funds amount!" });
  }

  if (!gateway) {
    return res.status(400).json({ message: "Payment gateway is required!" });
  }

  if (!purpose) {
    return res.status(400).json({ message: "Purpose is required!" });
  }

  if (!transactionId) {
    return res.status(400).json({ message: "Transaction ID is required!" });
  }

  try {
    const seller = await users.findOne({ identifier }).lean();

    if (!seller) {
      return res.status(404).json({ message: "Seller not found!" });
    }

    const existingPayment = await addFunds.findOne({ transactionId });

    if (existingPayment) {
      return res
        .status(400)
        .json({ message: "Transaction ID already exists!" });
    }

    const newDeposit = new addFunds({
      identifier,
      sellerName: seller.name,
      amount: Number(amount),
      transactionId,
      gateway,
      purpose,
      status: "Pending",
    });

    await newDeposit.save();

    // If no payment URL found, return the raw response
    return res.status(200).json({
      success: true,
      message: "Payment request processed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

// Callback for "ClickPay" - Verify payment and update records accordingly
const handleClickPayCallback = async (req, res) => {
  try {
    const {
      merchantId,
      merchantSerialNo,
      method,
      amount,
      transactionId,
      payUrl,
      fee,
      status,
    } = req.body;

    // Find the deposit by transaction ID
    const existingDeposit = await addFunds.findOne({ transactionId });

    if (!existingDeposit) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    //  Already approved
    if (existingDeposit.status === "Approved") {
      return res.status(200).json({
        success: true,
        message: "Payment already approved.",
        transactionId,
      });
    }

    const updateInvoiceAndRespond = async (newStatus, message) => {
      const invoiceUpdateDoc = {
        $set: {
          status: newStatus,
        },
      };

      await addFunds.findByIdAndUpdate(existingDeposit._id, invoiceUpdateDoc, {
        runValidators: true,
        new: true,
      });

      return res.status(200).json({
        success: true,
        message: message,
        status: newStatus,
        transactionId: transactionId,
      });
    };

    // Handle different status codes
    switch (status) {
      case "00": // Pending merchant matching
        return updateInvoiceAndRespond(
          "Pending",
          "Payment pending merchant matching",
        );

      case "10": // Awaiting payment
        return updateInvoiceAndRespond("Pending", "Awaiting payment");

      case "11": // Payment in progress
        return updateInvoiceAndRespond("Pending", "Payment in progress");

      case "12": // Payment timeout
        return updateInvoiceAndRespond("Rejected", "Payment timeout");

      case "20": // Payment completed - SUCCESS
        const seller = await users.findOne({
          identifier: existingDeposit.identifier,
        });

        if (!seller) {
          return res.status(404).json({ message: "Seller not found!" });
        }

        const platformSettings = await platform.findOne().lean();

        if (!platformSettings) {
          return res
            .status(500)
            .json({ message: "Platform settings not found!" });
        }

        if (existingDeposit?.purpose === "Account") {
          // Update user's role and status
          const subscriptionStart = new Date();
          const subscriptionEnd = new Date();
          // 1 year subscription
          subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);

          const referredBy = seller?.referredBy;
          // Referral bonus logic
          if (referredBy) {
            const referrer = await users.findOne({ referralCode: referredBy });

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

          await users.updateOne(
            { identifier: existingDeposit.identifier },
            {
              $set: {
                role: "Seller",
                status: "Active",
                subscriptionStart,
                subscriptionEnd,
              },
            },
          );

          await addFunds.findByIdAndUpdate(
            existingDeposit._id,
            {
              $set: {
                status: "Approved",
              },
            },
            { runValidators: true },
          );

          // Platform profit log
          const platformProfit = {
            title: `Subscription Fee!`,
            description: `Subscription fee ${existingDeposit.amount} TK received for 1 year using ${existingDeposit.gateway} TxnID: ${existingDeposit.transactionId}. User: ${existingDeposit?.identifier} (${seller?.name || "Unknown"}).`,
            purpose: "Subscription Fee",
            amount: existingDeposit?.amount,
          };

          // Seller earning log
          const sellerLog = {
            identifier: existingDeposit.identifier,
            title: "Subscription Fee!",
            description: `Subscription fee ${existingDeposit.amount} TK paid for 1 year using ${existingDeposit.gateway} TxnID: ${existingDeposit.transactionId}.`,
            amount: existingDeposit.amount,
            balanceBefore: seller.balance,
            balanceAfter: seller.balance,
            transactionType: "Debit",
          };

          await Promise.all([
            sellerLogs.create(sellerLog),
            platformProfits.create(platformProfit),
          ]);
        } else if (existingDeposit?.purpose === "Deposit") {
          const updatedSeller = await users.findOneAndUpdate(
            { identifier: existingDeposit.identifier },
            { $inc: { balance: existingDeposit.amount } },
            { new: true },
          );

          await addFunds.findByIdAndUpdate(
            existingDeposit._id,
            {
              $set: {
                status: "Approved",
              },
            },
            { runValidators: true },
          );

          const sellerLog = {
            identifier: existingDeposit.identifier,
            title: "Add Funds Approved!",
            description: `Your add funds request of ${existingDeposit.amount} TK has been approved. Gateway: ${existingDeposit.gateway}. TxnID: ${existingDeposit.transactionId}.`,
            amount: existingDeposit.amount,
            balanceBefore: updatedSeller.balance - existingDeposit.amount,
            balanceAfter: updatedSeller.balance,
            transactionType: "Credit",
          };

          const platformProfit = {
            title: "Add Funds Approved!",
            description: `Add funds approved for ${existingDeposit.identifier}. Amount: ${existingDeposit.amount} TK. Gateway: ${existingDeposit.gateway}. TxnID: ${existingDeposit.transactionId}.`,
            amount: existingDeposit.amount,
            purpose: "Add Funds",
          };

          await Promise.all([
            sellerLogs.create(sellerLog),
            platformProfits.create(platformProfit),
          ]);
        } else {
          return res.status(400).json({ message: "Invalid purpose!" });
        }

        return res
          .status(200)
          .json({ message: "Add funds approved successfully!" });

      case "30": // Payment refunded
        return updateInvoiceAndRespond("Rejected", "Payment refunded");

      case "31": // Payment failed
        return updateInvoiceAndRespond("Rejected", "Payment failed");

      default:
        return updateInvoiceAndRespond("Pending", `Unknown status: ${status}`);
    }
  } catch (error) {
    console.error("Payment callback error:", error);
    return res.status(500).json({
      success: false,
      message: "সার্ভার সমস্যা হয়েছে!",
    });
  }
};

// Callback for "StarPay" - Verify payment and update records accordingly
const handleStarPayCallback = async (req, res) => {
  const { transactionId } = req.body;

  try {
    const starPayApiKey = getStarPayApiKey();

    if (!starPayApiKey || !VERIFY_API) {
      return res.status(500).json({
        success: false,
        message: "StarPay verify configuration is not set.",
      });
    }

    // Verify payment from StarPay
    const verifyResponse = await axios.post(
      VERIFY_API,
      {
        transaction_id: transactionId,
      },
      {
        headers: {
          "API-KEY": starPayApiKey,
          "Content-Type": "application/json",
        },
      },
    );

    const data = verifyResponse.data;

    const parsedMetadata =
      typeof data?.metadata === "string"
        ? JSON.parse(data.metadata)
        : data?.metadata || {};

    // Transaction ID from metadata
    const localTransactionId = parsedMetadata?.transactionId;

    if (!localTransactionId) {
      return res.status(400).json({
        success: false,
        message: "Payment যাচাই করা যাচ্ছে না!",
      });
    }

    // Find existing deposit
    const existingDeposit = await addFunds.findOne({
      transactionId: localTransactionId,
    });

    if (!existingDeposit) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Already approved
    if (existingDeposit.status === "Approved") {
      return res.status(200).json({
        success: true,
        message: "Payment already approved.",
        transactionId: localTransactionId,
      });
    }

    // StarPay status mapping
    const paymentStatus =
      data?.status === "COMPLETED"
        ? "Approved"
        : data?.status === "PENDING"
          ? "Pending"
          : "Rejected";

    // Common updater
    const updateInvoiceAndRespond = async (newStatus, message) => {
      await addFunds.findByIdAndUpdate(
        existingDeposit._id,
        {
          $set: {
            status: newStatus,
          },
        },
        {
          runValidators: true,
          new: true,
        },
      );

      return res.status(200).json({
        success: true,
        message,
        status: newStatus,
        transactionId: localTransactionId,
      });
    };

    // Pending payment
    if (paymentStatus === "Pending") {
      return updateInvoiceAndRespond("Pending", "Payment is still pending");
    }

    // Failed / rejected payment
    if (paymentStatus === "Rejected") {
      return updateInvoiceAndRespond("Rejected", "Payment failed or rejected");
    }

    // ---------------- SUCCESS / APPROVED ----------------

    const seller = await users.findOne({
      identifier: existingDeposit.identifier,
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found!",
      });
    }

    const platformSettings = await platform.findOne().lean();

    if (!platformSettings) {
      return res.status(500).json({
        success: false,
        message: "Platform settings not found!",
      });
    }

    // ================= ACCOUNT PURCHASE =================
    if (existingDeposit?.purpose === "Account") {
      // Already seller
      if (seller.role === "Seller") {
        await addFunds.findByIdAndUpdate(
          existingDeposit._id,
          {
            $set: {
              status: "Approved",
            },
          },
          { runValidators: true },
        );
      }

      const subscriptionStart = new Date();

      const subscriptionEnd = new Date();
      subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);

      // Referral reward
      const referredBy = seller?.referredBy;

      if (referredBy) {
        const referrer = await users.findOne({
          referralCode: referredBy,
        });

        if (referrer) {
          const bonusAmount = platformSettings.referralReward || 0;

          await users.updateOne(
            { referralCode: referredBy },
            {
              $inc: {
                balance: bonusAmount,
              },
            },
          );

          // Referrer log
          const referralLog = {
            identifier: referrer?.identifier,
            title: "Referral Reward!",
            description: `Referral reward credited for a successful referral.
Referred user: ${seller.identifier}.
Reward amount: ${bonusAmount} TK.`,
            amount: bonusAmount,
            balanceBefore: referrer.balance,
            balanceAfter: referrer.balance + bonusAmount,
            transactionType: "Credit",
          };

          await sellerLogs.create(referralLog);
        }
      }

      // Update seller role
      await users.updateOne(
        { identifier: existingDeposit.identifier },
        {
          $set: {
            role: "Seller",
            status: "Active",
            subscriptionStart,
            subscriptionEnd,
          },
        },
      );

      // Approve deposit
      await addFunds.findByIdAndUpdate(
        existingDeposit._id,
        {
          $set: {
            status: "Approved",
          },
        },
        { runValidators: true },
      );

      // Platform profit
      const platformProfit = {
        title: "Subscription Fee!",
        description: `Subscription fee ${existingDeposit.amount} TK received for 1 year using ${existingDeposit.gateway} TxnID: ${existingDeposit.transactionId}. User: ${existingDeposit?.identifier} (${seller?.name || "Unknown"}).`,
        purpose: "Subscription Fee",
        amount: existingDeposit.amount,
      };

      // Seller log
      const sellerLog = {
        identifier: existingDeposit.identifier,
        title: "Subscription Fee!",
        description: `Subscription fee ${existingDeposit.amount} TK paid for 1 year using ${existingDeposit.gateway} TxnID: ${existingDeposit.transactionId}.`,
        amount: existingDeposit.amount,
        balanceBefore: seller.balance,
        balanceAfter: seller.balance,
        transactionType: "Debit",
      };

      await Promise.all([
        sellerLogs.create(sellerLog),
        platformProfits.create(platformProfit),
      ]);
    }

    // ================= ADD FUNDS =================
    else if (existingDeposit?.purpose === "Deposit") {
      const updatedSeller = await users.findOneAndUpdate(
        { identifier: existingDeposit.identifier },
        {
          $inc: {
            balance: existingDeposit.amount,
          },
        },
        { new: true },
      );

      // Approve deposit
      await addFunds.findByIdAndUpdate(
        existingDeposit._id,
        {
          $set: {
            status: "Approved",
          },
        },
        { runValidators: true },
      );

      // Seller log
      const sellerLog = {
        identifier: existingDeposit.identifier,
        title: "Add Funds Approved!",
        description: `Your add funds request of ${existingDeposit.amount} TK has been approved. Gateway: ${existingDeposit.gateway}. TxnID: ${existingDeposit.transactionId}.`,
        amount: existingDeposit.amount,
        balanceBefore: updatedSeller.balance - existingDeposit.amount,
        balanceAfter: updatedSeller.balance,
        transactionType: "Credit",
      };

      // Platform profit
      const platformProfit = {
        title: "Add Funds Approved!",
        description: `Add funds approved for ${existingDeposit.identifier}. Amount: ${existingDeposit.amount} TK. Gateway: ${existingDeposit.gateway}. TxnID: ${existingDeposit.transactionId}.`,
        amount: existingDeposit.amount,
        purpose: "Add Funds",
      };

      await Promise.all([
        sellerLogs.create(sellerLog),
        platformProfits.create(platformProfit),
      ]);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid purpose!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Add funds approved successfully!",
    });
  } catch (error) {
    console.error("StarPay callback error:", error);

    return res.status(500).json({
      success: false,
      message: "সার্ভার সমস্যা হয়েছে!",
    });
  }
};

// Callback for "Manual" - Update payment status and records accordingly
const handleManualCallback = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Find the deposit by transaction ID
    const existingDeposit = await addFunds.findOne({ transactionId: id });

    if (!existingDeposit) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    //  Already approved
    if (existingDeposit.status === "Approved") {
      return res.status(200).json({
        success: true,
        message: "Payment already approved.",
        transactionId: existingDeposit.transactionId,
      });
    }

    const updateInvoiceAndRespond = async (newStatus, message) => {
      const invoiceUpdateDoc = {
        $set: {
          status: newStatus,
        },
      };

      await addFunds.findByIdAndUpdate(existingDeposit._id, invoiceUpdateDoc, {
        runValidators: true,
        new: true,
      });

      return res.status(200).json({
        success: true,
        message: message,
        status: newStatus,
        transactionId: existingDeposit.transactionId,
      });
    };

    // Handle different status codes
    switch (status) {
      case "Pending": // Pending merchant matching
        return updateInvoiceAndRespond(
          "Pending",
          "Payment pending merchant matching",
        );

      case "Rejected": // Payment timeout
        return updateInvoiceAndRespond("Rejected", "Payment timeout");

      case "Approved": // Payment completed - SUCCESS
        const seller = await users.findOne({
          identifier: existingDeposit.identifier,
        });

        if (!seller) {
          return res.status(404).json({ message: "Seller not found!" });
        }

        const platformSettings = await platform.findOne().lean();

        if (!platformSettings) {
          return res
            .status(500)
            .json({ message: "Platform settings not found!" });
        }

        if (existingDeposit?.purpose === "Account") {
          // Already a seller
          if (seller.role === "Seller") {
            await addFunds.findByIdAndUpdate(
              existingDeposit._id,
              {
                $set: {
                  status: "Approved",
                },
              },
              { runValidators: true },
            );
          }

          // Update user's role and status
          const subscriptionStart = new Date();
          const subscriptionEnd = new Date();
          // 1 year subscription
          subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);

          const referredBy = seller?.referredBy;
          // Referral bonus logic
          if (referredBy) {
            const referrer = await users.findOne({ referralCode: referredBy });

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

          await users.updateOne(
            { identifier: existingDeposit.identifier },
            {
              $set: {
                role: "Seller",
                status: "Active",
                subscriptionStart,
                subscriptionEnd,
                subscriptionType: "Premium",
              },
            },
          );

          await addFunds.findByIdAndUpdate(
            existingDeposit._id,
            {
              $set: {
                status: "Approved",
              },
            },
            { runValidators: true },
          );

          // Platform profit log
          const platformProfit = {
            title: `Subscription Fee!`,
            description: `Subscription fee ${existingDeposit.amount} TK received for 1 year using ${existingDeposit.gateway} TxnID: ${existingDeposit.transactionId}. User: ${existingDeposit?.identifier} (${seller?.name || "Unknown"}).`,
            purpose: "Subscription Fee",
            amount: existingDeposit?.amount,
          };

          // Seller earning log
          const sellerLog = {
            identifier: existingDeposit.identifier,
            title: "Subscription Fee!",
            description: `Subscription fee ${existingDeposit.amount} TK paid for 1 year using ${existingDeposit.gateway} TxnID: ${existingDeposit.transactionId}.`,
            amount: existingDeposit.amount,
            balanceBefore: seller.balance,
            balanceAfter: seller.balance,
            transactionType: "Debit",
          };

          await Promise.all([
            sellerLogs.create(sellerLog),
            platformProfits.create(platformProfit),
          ]);
        } else if (existingDeposit?.purpose === "Deposit") {
          const depositBonusPer = platformSettings.depositBonusPer || 0;
          const depositBonusAmount =
            (existingDeposit?.amount * depositBonusPer) / 100;

          const updatedSellerAmount =
            existingDeposit?.amount + depositBonusAmount;

          const updatedSeller = await users.findOneAndUpdate(
            { identifier: existingDeposit.identifier },
            { $inc: { balance: updatedSellerAmount } },
            { new: true },
          );

          const referer = await users.findOne({
            referralCode: seller?.referredBy,
          });

          if (referer) {
            const referralDepositBonusPer =
              platformSettings.referralDepositBonusPer || 0;
            const referralBonusAmount =
              (existingDeposit?.amount * referralDepositBonusPer) / 100;

            const updatedReferer = await users.findOneAndUpdate(
              { identifier: referer.identifier },
              { $inc: { balance: referralBonusAmount } },
              { new: true },
            );

            const balanceAfter = updatedReferer.balance;
            const balanceBefore = balanceAfter - referralBonusAmount;

            const refererLog = {
              identifier: referer.identifier,
              title: "Referral Deposit Bonus!",
              description: `Referral deposit bonus credited for a successful referral. Referred user: ${seller.identifier}. Bonus amount: ${referralBonusAmount?.toFixed(2)} TK.`,
              amount: referralBonusAmount,
              balanceBefore: balanceBefore,
              balanceAfter: balanceAfter,
              transactionType: "Credit",
            };

            await sellerLogs.create(refererLog);
          }

          await addFunds.findByIdAndUpdate(
            existingDeposit._id,
            {
              $set: {
                status: "Approved",
              },
            },
            { runValidators: true },
          );

          const sellerLog = {
            identifier: existingDeposit.identifier,
            title: "Add Funds Approved!",
            description: `Your add funds request of ${existingDeposit?.amount} TK has been approved. Gateway: ${existingDeposit?.gateway}. TxnID: ${existingDeposit?.transactionId}.`,
            amount: existingDeposit?.amount,
            balanceBefore: updatedSeller.balance - existingDeposit?.amount,
            balanceAfter: updatedSeller.balance,
            transactionType: "Credit",
          };

          const platformProfit = {
            title: "Add Funds Approved!",
            description: `Add funds approved for ${existingDeposit.identifier}. Amount: ${existingDeposit?.amount} TK. Gateway: ${existingDeposit?.gateway}. TxnID: ${existingDeposit?.transactionId}.`,
            amount: existingDeposit?.amount,
            purpose: "Add Funds",
          };

          await Promise.all([
            sellerLogs.create(sellerLog),
            platformProfits.create(platformProfit),
          ]);
        } else {
          return res.status(400).json({ message: "Invalid purpose!" });
        }

        return res
          .status(200)
          .json({ message: "Add funds approved successfully!" });

      default:
        return updateInvoiceAndRespond("Pending", `Unknown status: ${status}`);
    }
  } catch (error) {
    console.error("Payment callback error:", error);
    return res.status(500).json({
      success: false,
      message: "সার্ভার সমস্যা হয়েছে!",
    });
  }
};

module.exports = {
  getAllAddFundsRequests,
  getMyAddFundsRequests,
  createAddFundsRequest,
  createPaymentsRequest,
  handleManualCallback,
  handleClickPayCallback,
  handleStarPayCallback,
};
