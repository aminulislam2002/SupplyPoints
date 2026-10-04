const router = require("express").Router();

const upload = require("../middlewares/multer.middleware");
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

const {
  loggedIn,
  signUp,
  signIn,
  impersonated,
  exitImpersonation,
  changePassByAdmin,
  forgot,
  reset,
  change,
  logOut,
  refresh,
} = require("../controllers/auth.controller");

const {
  allUsers,
  getUserById,
  getUserRole,
  getUserStatus,
  updateRole,
  updateStatus,
  subscriptionType,
  updateProfile,
  deleteAnUser,
  updateBalance,
} = require("../controllers/users.controller");

// Users routes
router.get("/all", verifyToken, verifyAdmin, allUsers);

router.get("/id/:id", verifyToken, verifyAdmin, getUserById);

router.get("/role", verifyToken, getUserRole);

router.get("/status", verifyToken, getUserStatus);

router.put("/role/:id", verifyToken, verifyAdmin, updateRole);

router.put("/status/:id", verifyToken, verifyAdmin, updateStatus);

router.put("/subscription-type/:id", verifyToken, subscriptionType);

router.put("/profile", verifyToken, upload.single("image"), updateProfile);

router.put("/balance/:id", verifyToken, verifyAdmin, updateBalance);

router.delete("/:id", verifyToken, verifyAdmin, deleteAnUser);

// Authentication routes
router.get("/me", verifyToken, loggedIn);

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/impersonate", verifyToken, verifyAdmin, impersonated);

router.post("/exit-impersonation", verifyToken, exitImpersonation);

router.put(
  "/change-by-admin",
  verifyToken,
  verifyAdmin,
  changePassByAdmin,
);

router.post("/forgot", forgot);

router.put("/reset", reset);

router.put("/change", verifyToken, change);

router.post("/logout", verifyToken, logOut);

router.post("/refresh", refresh);

module.exports = router;
