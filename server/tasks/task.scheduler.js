const cron = require("node-cron");
const marketingPurchases = require("../models/marketing_purchases.schema");

const taskScheduler = () => {
  try {
    cron.schedule("0 0 * * *", async () => {
      console.log("running a task every day at midnight (12:00 AM)");
      const currentDate = new Date();
      const startOfToday = new Date(currentDate.setHours(0, 0, 0, 0));
      const startOfYesterday = new Date(startOfToday);
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);

      await marketingPurchases
        .updateMany(
          { expiredAt: { $lt: currentDate }, status: "Activated" },
          { $set: { status: "Deactivated" } },
        )
        .then((res) => {
          console.log(
            "Expired purchases updated successfully:",
            res.modifiedCount,
          );
        })
        .catch((err) => {
          console.error("Error updating expired purchases:", err);
        });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  taskScheduler,
};
