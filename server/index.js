const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");

const PORT = process.env.PORT || 5000;

// Import Routes
const usersRouter = require("./routers/users.router");
const categoriesRouter = require("./routers/categories.router");
const subCategoriesRouter = require("./routers/sub_categories.router");
const productsRouter = require("./routers/products.router");
const ordersRouter = require("./routers/orders.router");
const faqRouter = require("./routers/faq.router");
const rulesRouter = require("./routers/rules.router");
const slidersRouter = require("./routers/sliders.router");
const milestonesRouter = require("./routers/milestones.router");
const platformRouter = require("./routers/platform.router");
const sellerLogsRouter = require("./routers/seller_logs.router");
const platformProfitsRouter = require("./routers/platform_profits.router");
const withdrawalsRouter = require("./routers/withdrawals.router");
const promotionCategoriesRouter = require("./routers/promotion_categories.router");
const promotionPacksRouter = require("./routers/promotion_packs.router");
const marketingPacksRouter = require("./routers/marketing_packs.router");
const promotionPurchasesRouter = require("./routers/promotion_purchases.router");
const marketingPurchasesRouter = require("./routers/marketing_purchases.router");
const addFundsRouter = require("./routers/add_funds.router");
const taskManagerRouter = require("./routers/task_manager.router");
const sellerTodoRouter = require("./routers/seller_todo.router");
const postSubmissionsRouter = require("./routers/post_submissions.router");

const { taskScheduler } = require("./tasks/task.scheduler");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("trust proxy", true);

const allowedOrigins = [
  "http://localhost:5173",
  "https://supplypoints.shop",
  "https://www.supplypoints.shop",
];

// CORS Configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser tools like Postman (origin = undefined)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);

const rootDir = path.resolve();

app.use(
  "/images",
  express.static(path.join(rootDir, "images"), {
    maxAge: "365d", // 1 year cache
    immutable: true,
  }),
);

// DB Connection
console.time("Connected to MongoDB");
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.timeEnd("Connected to MongoDB");
    // Start daily task reset scheduler after successful DB connection
    try {
      taskScheduler();
    } catch (e) {
      console.error("Failed to start Task Reset scheduler:", e);
    }
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Server Running Successfully!");
});

app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/sub-categories", subCategoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/faqs", faqRouter);
app.use("/api/rules", rulesRouter);
app.use("/api/sliders", slidersRouter);
app.use("/api/milestones", milestonesRouter);
app.use("/api/platform", platformRouter);
app.use("/api/seller-logs", sellerLogsRouter);
app.use("/api/platform-profits", platformProfitsRouter);
app.use("/api/withdrawals", withdrawalsRouter);
app.use("/api/promotion-categories", promotionCategoriesRouter);
app.use("/api/promotion-packs", promotionPacksRouter);
app.use("/api/marketing-packs", marketingPacksRouter);
app.use("/api/promotion-purchases", promotionPurchasesRouter);
app.use("/api/marketing-purchases", marketingPurchasesRouter);
app.use("/api/add-funds", addFundsRouter);
app.use("/api/task-manager", taskManagerRouter);
app.use("/api/seller-todo", sellerTodoRouter);
app.use("/api/post-submissions", postSubmissionsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
