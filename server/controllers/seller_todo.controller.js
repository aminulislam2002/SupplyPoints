const fs = require("fs");
const mongoose = require("mongoose");

const users = require("../models/users.schema");
const taskManager = require("../models/task_manager.schema");
const sellerLogs = require("../models/seller_logs.schema");
const marketingPurchases = require("../models/marketing_purchases.schema");
const submittedTasks = require("../models/submitted_tasks.schema");

const getLocalDayBounds = () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );

  return { startOfDay, endOfDay };
};

const getLocalDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const removeUploadedFiles = (files = []) => {
  files.forEach((file) => {
    if (!file?.path) return;

    fs.unlink(file.path, (err) => {
      if (err?.code === "ENOENT") {
        console.warn("Uploaded proof image not found for deletion!");
      } else if (err) {
        console.error("Error deleting uploaded proof image:", err);
      }
    });
  });
};

const getMyTodoList = async (req, res) => {
  const identifier = req?.user?.identifier;

  try {
    const activePurchases = await marketingPurchases
      .find({
        identifier,
        status: "Activated",
        expiredAt: { $gte: new Date() },
      })
      .sort({ purchasedAt: -1 })
      .lean();

    if (!activePurchases?.length) {
      return res.status(200).json({ success: true, data: [] });
    }

    const purchaseByPackId = new Map();

    activePurchases.forEach((purchase) => {
      const key = String(purchase?.packId);

      if (!purchaseByPackId.has(key)) {
        purchaseByPackId.set(key, purchase);
      }
    });

    const uniquePackIds = Array.from(purchaseByPackId.keys()).map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    const tasks = await taskManager
      .find({ packId: { $in: uniquePackIds } })
      .sort({ addedAt: -1 })
      .lean();

    if (!tasks?.length) {
      return res.status(200).json({ success: true, data: [] });
    }

    const todayKey = getLocalDateKey();
    const todaySubmissions = await submittedTasks
      .find({
        identifier,
        dateKey: todayKey,
        taskId: { $in: tasks.map((task) => task._id) },
      })
      .select("taskId submittedAt")
      .lean();

    const submittedTaskIdSet = new Set(
      todaySubmissions.map((item) => String(item?.taskId)),
    );

    const data = tasks.map((task) => {
      const packKey = String(task?.packId);
      const purchase = purchaseByPackId.get(packKey);
      const isCompletedToday = submittedTaskIdSet.has(String(task?._id));

      return {
        _id: task?._id,
        packId: task?.packId,
        packName: purchase?.packName || "N/A",
        taskValue: purchase?.taskValue || 0,
        taskUrl: task?.taskUrl,
        description: task?.description,
        isCompletedToday,
      };
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

const getMyTodoTaskById = async (req, res) => {
  const { taskId } = req.params;
  const identifier = req?.user?.identifier;

  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Valid taskId is required!" });
  }

  try {
    const task = await taskManager.findById(taskId).lean();

    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }

    const purchase = await marketingPurchases
      .findOne({
        identifier,
        packId: task.packId,
        status: "Activated",
        expiredAt: { $gte: new Date() },
      })
      .sort({ purchasedAt: -1 })
      .lean();

    if (!purchase) {
      return res.status(403).json({ message: "Task access denied!" });
    }

    const todayKey = getLocalDateKey();
    const todaySubmission = await submittedTasks
      .findOne({
        identifier,
        taskId: task._id,
        dateKey: todayKey,
      })
      .select("_id submittedAt")
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        _id: task?._id,
        packId: task?.packId,
        packName: purchase?.packName || "N/A",
        taskValue: purchase?.taskValue || 0,
        taskUrl: task?.taskUrl,
        description: task?.description,
        isCompletedToday: Boolean(todaySubmission),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

const submitTodoTask = async (req, res) => {
  const { taskId } = req.params;
  const identifier = req?.user?.identifier;
  const files = req.files || [];

  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    removeUploadedFiles(files);
    return res.status(400).json({ message: "Valid taskId is required!" });
  }

  if (!files?.length) {
    return res
      .status(400)
      .json({ message: "At least one proof image is required!" });
  }

  try {
    const task = await taskManager.findById(taskId).lean();

    if (!task) {
      removeUploadedFiles(files);
      return res.status(404).json({ message: "Task not found!" });
    }

    const [seller, purchase] = await Promise.all([
      users.findOne({ identifier }).lean(),
      marketingPurchases
        .findOne({
          identifier,
          packId: task.packId,
          status: "Activated",
          expiredAt: { $gte: new Date() },
        })
        .sort({ purchasedAt: -1 })
        .lean(),
    ]);

    if (!seller) {
      removeUploadedFiles(files);
      return res.status(404).json({ message: "Seller not found!" });
    }

    if (!purchase) {
      removeUploadedFiles(files);
      return res.status(403).json({ message: "Task access denied!" });
    }

    const { startOfDay, endOfDay } = getLocalDayBounds();
    const isAlreadySubmittedToday = await submittedTasks.findOne({
      identifier,
      taskId: task._id,
      submittedAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (isAlreadySubmittedToday) {
      removeUploadedFiles(files);
      return res.status(400).json({
        message:
          "You already completed this task today. Please try again after 12:00 AM.",
      });
    }

    const proofImages = files.map((file) => `/images/tasks/${file.filename}`);

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const duplicateTask = await submittedTasks
          .findOne({
            identifier,
            taskId: task._id,
            dateKey: getLocalDateKey(),
          })
          .session(session);

        if (duplicateTask) {
          throw new Error("TASK_ALREADY_SUBMITTED");
        }

        const updatedSeller = await users.findOneAndUpdate(
          { identifier },
          { $inc: { balance: purchase.taskValue } },
          { new: true, session },
        );

        if (!updatedSeller) {
          throw new Error("SELLER_NOT_FOUND");
        }

        await submittedTasks.create(
          [
            {
              identifier: seller.identifier,
              sellerName: seller.name,
              taskId: task._id,
              packId: purchase.packId,
              packName: purchase.packName,
              taskUrl: task.taskUrl,
              description: task.description,
              taskValue: purchase.taskValue,
              images: proofImages,
              dateKey: getLocalDateKey(),
            },
          ],
          { session },
        );

        const sellerLogData = {
          identifier: seller.identifier,
          title: "Task Completed Reward Added!",
          description: `Task reward added successfully for ${purchase.packName}. Amount: ${purchase.taskValue} TK.`,
          amount: purchase.taskValue,
          balanceBefore: updatedSeller.balance - purchase.taskValue,
          balanceAfter: updatedSeller.balance,
          transactionType: "Credit",
        };

        await sellerLogs.create([sellerLogData], { session });
      });
    } finally {
      await session.endSession();
    }

    return res.status(200).json({
      message: "Task submitted successfully! Reward added to your balance.",
      data: {
        taskId: task._id,
        packId: purchase.packId,
        taskValue: purchase.taskValue,
      },
    });
  } catch (error) {
    removeUploadedFiles(files);

    if (error?.message === "TASK_ALREADY_SUBMITTED") {
      return res.status(400).json({
        message:
          "You already completed this task today. Please try again after 12:00 AM.",
      });
    }

    if (error?.message === "SELLER_NOT_FOUND") {
      return res.status(404).json({ message: "Seller not found!" });
    }

    if (error?.code === 11000) {
      return res.status(400).json({
        message:
          "You already completed this task today. Please try again after 12:00 AM.",
      });
    }

    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

const getAllSubmittedTasks = async (req, res) => {
  const { currentPage, limitPerPage, status, searchQuery } = req.query;
  const query = {};

  if (status) {
    query.status = status;
  }

  if (searchQuery) {
    const regex = new RegExp(searchQuery, "i");
    query.$or = [
      { sellerName: { $regex: regex } },
      { identifier: { $regex: regex } },
      { packName: { $regex: regex } },
    ];
  }

  try {
    const totalSubmittedTasks = await submittedTasks.countDocuments(query);
    const page = parseInt(currentPage) || 0;
    const limit = parseInt(limitPerPage) || totalSubmittedTasks;
    const skip = page * limit;

    const data = await submittedTasks
      .find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      data,
      totalSubmittedTasks,
      hasMore: skip + data?.length < totalSubmittedTasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

const updateSubmittedTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const reviewerIdentifier = req?.user?.identifier;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ message: "Valid submitted task id is required!" });
  }

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status!" });
  }

  try {
    const existingTask = await submittedTasks.findById(id).lean();

    if (!existingTask) {
      return res.status(404).json({ message: "Submitted task not found!" });
    }

    if (existingTask.status && existingTask.status !== "Pending") {
      return res.status(400).json({
        message: `This task has already been ${existingTask.status.toLowerCase()}.`,
      });
    }

    if (status === "Rejected") {
      const session = await mongoose.startSession();

      try {
        await session.withTransaction(async () => {
          const submittedTask = await submittedTasks
            .findById(id)
            .session(session);

          if (!submittedTask) {
            throw new Error("SUBMITTED_TASK_NOT_FOUND");
          }

          if (submittedTask.status !== "Pending") {
            throw new Error("TASK_STATUS_ALREADY_UPDATED");
          }

          const updatedSeller = await users.findOneAndUpdate(
            {
              identifier: submittedTask.identifier,
              balance: { $gte: submittedTask.taskValue },
            },
            {
              $inc: { balance: -submittedTask.taskValue },
            },
            { new: true, session },
          );

          if (!updatedSeller) {
            throw new Error("INSUFFICIENT_BALANCE");
          }

          submittedTask.status = "Rejected";
          submittedTask.reviewedBy = reviewerIdentifier || "admin";
          submittedTask.reviewedAt = new Date();
          await submittedTask.save({ session, validateModifiedOnly: true });

          const sellerLogData = {
            identifier: submittedTask.identifier,
            title: "Task Submission Rejected!",
            description: `Your submitted task for ${submittedTask.packName} has been rejected. Reward reversed: ${submittedTask.taskValue} TK.`,
            amount: submittedTask.taskValue,
            balanceBefore: updatedSeller.balance + submittedTask.taskValue,
            balanceAfter: updatedSeller.balance,
            transactionType: "Debit",
          };

          await sellerLogs.create([sellerLogData], { session });
        });
      } finally {
        await session.endSession();
      }
    } else {
      await submittedTasks.findByIdAndUpdate(
        id,
        {
          $set: {
            status,
            reviewedBy: reviewerIdentifier || "admin",
            reviewedAt: new Date(),
          },
        },
        { runValidators: true },
      );
    }

    return res.status(200).json({
      message:
        status === "Approved"
          ? "Submitted task approved successfully!"
          : "Submitted task rejected successfully!",
    });
  } catch (error) {
    if (error?.message === "SUBMITTED_TASK_NOT_FOUND") {
      return res.status(404).json({ message: "Submitted task not found!" });
    }

    if (error?.message === "TASK_STATUS_ALREADY_UPDATED") {
      return res.status(400).json({
        message: "This task has already been reviewed.",
      });
    }

    if (error?.message === "INSUFFICIENT_BALANCE") {
      return res.status(400).json({
        message: "Seller has insufficient balance to reverse this task reward!",
      });
    }

    console.log(error);
    return res.status(503).json({ message: "Internal Server Error!" });
  }
};

module.exports = {
  getMyTodoList,
  getMyTodoTaskById,
  submitTodoTask,
  getAllSubmittedTasks,
  updateSubmittedTaskStatus,
};
