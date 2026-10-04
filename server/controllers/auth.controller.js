const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const users = require("../models/users.schema");
const tokens = require("../models/tokens.schema");

const { createAccessToken, createRefreshToken } = require("../config/jwt");

const normalizeAnswer = (answer) => {
  return answer
    .toLowerCase() // lowercase
    .trim() // first/last space remove
    .replace(/\s+/g, ""); // all spaces removed
};

// Logged-In User
const loggedIn = async (req, res) => {
  try {
    const role = req?.user?.role;
    const identifier = req?.user?.identifier;

    const user = await users
      .findOne({ identifier, role })
      .select("-password -securityAnswer -__v")
      .lean();

    if (user) {
      return res.status(200).json({
        user: {
          ...user,
          isImpersonated: req.user.isImpersonated || false,
          impersonatedBy: req.user.impersonatedBy || null,
        },
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// User Sign-Up
const signUp = async (req, res) => {
  try {
    const {
      name,
      identifier,
      businessName,
      gender,
      password,
      securityAnswer,
      referredBy,
    } = req.body;

    // Check if user already exists
    const existingUser = await users.findOne({ identifier: identifier }).lean();
    if (existingUser) {
      return res.status(409).json({
        isValid: false,
        message: "Sorry! User already exists.",
        navigateTo: "/auth/sign-in",
      });
    }

    bcrypt.genSalt(10, async (err, salt) => {
      const hashedPass = await bcrypt.hash(password, salt);
      const hashedSecurityAnswer = await bcrypt.hash(
        normalizeAnswer(securityAnswer),
        salt,
      );

      // Update user's role and status
      const subscriptionStart = new Date();
      const subscriptionEnd = new Date();
      // 1 year subscription
      subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);

      const referralCode = Math.random()
        .toString(36)
        .substring(2, 12)
        .toUpperCase();

      const data = {
        name,
        identifier,
        businessName,
        gender,
        password: hashedPass,
        securityAnswer: hashedSecurityAnswer,
        referralCode,
        referredBy: referredBy || null,
        // Free 1-year subscription for new users
        // subscriptionStart,
        // subscriptionEnd,
        // role: "Seller",
        // status: "Active",
        // subscriptionType: "Free",
      };

      await users.create(data);

      res.status(201).json({
        isValid: true,
        message: `Congratulations ${name}! Please Sign In.`,
        navigateTo: "/auth/sign-in",
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// User Sign-In
const signIn = async (req, res) => {
  // User Credentials
  const { identifier, password } = req.body;

  // Clear previous token from cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  try {
    const existingUser = await users.findOne({ identifier });

    if (!existingUser) {
      return res.status(404).json({
        isValid: false,
        message: "User does not exist, Please Sign Up",
        navigateTo: "/auth/sign-up",
      });
    }

    // Delete old token from DB
    await tokens.deleteMany({ identifier: identifier });

    if (existingUser.isBlocked) {
      return res.status(403).json({
        isValid: false,
        message: "Your account has been blocked. Please contact support.",
        navigateTo: "/",
      });
    }

    // Password Matching
    const isMatching = await bcrypt.compare(password, existingUser?.password);

    if (!isMatching) {
      return res.status(401).json({
        isValid: false,
        message: "Incorrect password. Please try again.",
        navigateTo: "/auth/sign-in",
      });
    }

    const user = {
      identifier: existingUser.identifier,
      role: existingUser.role,
      status: existingUser.status,
    };

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Save refresh token in DB
    await tokens.create({
      token: refreshToken,
      identifier,
    });

    const updatedDoc = {
      $set: { lastLogin: Date.now() },
    };

    await users.findByIdAndUpdate({ _id: existingUser?._id }, updatedDoc, {
      new: true,
      runValidators: true,
    });

    // Send Response with Cookie
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge:
          parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN) * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        isValid: true,
        message: "Welcome! " + existingUser.name,
        navigateTo: "/",
        accessToken,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Impersonated Sign-In
const impersonated = async (req, res) => {
  const { userIdentifier } = req.body;

  try {
    // Check requested user is Admin
    if (req?.user?.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized Access!" });
    }

    // Find User to Sign-In as User
    const user = await users.findOne({
      identifier: userIdentifier,
      isBlocked: false,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const impersonatedUserData = {
      identifier: user.identifier,
      role: user.role,
      status: user.status,
      isImpersonated: true,
      impersonatedBy: req?.user?.identifier,
    };

    // Create Token for User
    const token = createAccessToken(impersonatedUserData);

    // Send token
    res.json({ accessToken: token });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Change Password by Admin
const changePassByAdmin = async (req, res) => {
  try {
    const { identifier, newPassword } = req.body;

    if (!identifier || !newPassword) {
      return res.status(400).json({
        isValid: false,
        message: "Identifier এবং নতুন পাসওয়ার্ড প্রয়োজন।",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        isValid: false,
        message: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
      });
    }

    const existingUser = await users.findOne({ identifier });

    if (!existingUser) {
      return res.status(403).json({
        isValid: false,
        message: "দুঃখিত! ব্যবহারকারী বিদ্যমান নেই।",
        navigateTo: "",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(newPassword, salt);

    await users.findOneAndUpdate(
      { identifier },
      {
        $set: {
          password: hashedPass,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      isValid: true,
      message: "সফল! পাসওয়ার্ড পরিবর্তন করা হয়েছে।",
      navigateTo: "",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      isValid: false,
      message: "সার্ভার সমস্যা হয়েছে",
    });
  }
};

// Forgot-Pass
const forgot = async (req, res) => {
  try {
    const { identifier, securityAnswer } = req.body;
    const existingUser = await users.findOne({ identifier: identifier }).lean();

    if (!existingUser) {
      return res.status(404).json({
        isValid: false,
        message: "User does not exist, Please Sign Up",
        navigateTo: "/auth/sign-up",
      });
    }

    const isMatching = await bcrypt.compare(
      normalizeAnswer(securityAnswer),
      existingUser?.securityAnswer,
    );

    if (!isMatching) {
      return res.status(404).json({
        isValid: false,
        message: "Your security answer is incorrect.",
        navigateTo: "/auth/forgot-pass",
      });
    }

    const user = {
      identifier: existingUser.identifier,
      role: existingUser.role,
    };

    const token = jwt.sign(user, process.env.PASS_RESET_TOKEN, {
      expiresIn: `${process.env.PASS_RESET_TOKEN_EXPIRES_IN}m`,
    });

    res
      .cookie("resetPass", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: process.env.PASS_RESET_TOKEN_EXPIRES_IN * 60 * 1000,
      })
      .status(201)
      .json({
        isValid: true,
        message: "Excellent! Security answer matched.",
        navigateTo: "/auth/reset-pass",
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Reset Pass
const reset = async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.cookies.resetPass;

    jwt.verify(token, process.env.PASS_RESET_TOKEN, async (err, decoded) => {
      if (err === "TokenExpiredError") {
        return res.status(403).json({ message: "Try Again!" });
      } else if (err) {
        return res.status(403).json({ message: "Access Denied!" });
      }

      // Find User
      const existingUser = await users.findOne({
        identifier: decoded?.identifier,
      });

      if (!existingUser) {
        return res.status(403).json({
          isValid: false,
          message: "Sorry! You are not authorized.",
          navigateTo: "/auth/sign-up",
        });
      }

      bcrypt.genSalt(10, async (err, salt) => {
        const hashedPass = await bcrypt.hash(password, salt);

        const changedPass = {
          $set: { password: hashedPass },
        };

        const response = await users.findOneAndUpdate(
          { identifier: decoded?.identifier },
          changedPass,
          { new: true, runValidators: true },
        );

        res
          .clearCookie("resetPass", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 0,
          })
          .status(201)
          .json({
            isValid: true,
            message: "Success! Password has been changed. Please Sign In.",
            navigateTo: "/auth/sign-in",
          });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Change Pass
const change = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const identifier = req?.user?.identifier;

    // Find User
    const existingUser = await users.findOne({ identifier });

    if (!existingUser) {
      return res.status(403).json({
        isValid: false,
        message: "Sorry! You are not authorized.",
        navigateTo: "/auth/sign-up/123456",
      });
    }

    // Password Matching
    const isMatching = await bcrypt.compare(
      currentPassword,
      existingUser?.password,
    );

    if (!isMatching) {
      return res.status(401).json({
        isValid: false,
        message: "Current password is incorrect.",
        navigateTo: "/auth/change-pass",
      });
    }

    // Change New Password
    bcrypt.genSalt(10, async (err, salt) => {
      const hashedPass = await bcrypt.hash(newPassword, salt);

      const changedPassDoc = {
        $set: { password: hashedPass },
      };

      await users.findOneAndUpdate({ identifier }, changedPassDoc, {
        new: true,
        runValidators: true,
      });

      res.status(201).json({
        isValid: true,
        message: "Success! Password has been changed.",
        navigateTo: "/",
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logged-Out User
const logOut = async (req, res) => {
  const identifier = req?.user?.identifier;

  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await tokens.deleteOne({ token: refreshToken });
    }

    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 0,
      })
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Exit Impersonation
const exitImpersonation = async (req, res) => {
  try {
    // Check if user is currently impersonating
    if (!req.user.isImpersonated || !req.user.impersonatedBy) {
      return res.status(400).json({
        message: "Not currently impersonating any user",
      });
    }

    // Find the admin user
    const adminUser = await users.findOne({
      identifier: req.user.impersonatedBy,
      role: "Admin",
    });

    if (!adminUser) {
      return res.status(404).json({
        message: "Admin user not found",
      });
    }

    if (adminUser.isBlocked) {
      return res.status(403).json({
        message: "Admin account has been blocked",
      });
    }

    // Create new access token for admin
    const adminUserData = {
      identifier: adminUser.identifier,
      role: adminUser.role,
      status: adminUser.status,
    };

    const newAccessToken = createAccessToken(adminUserData);

    // Send response with admin access token and redirect to admin dashboard
    res.status(200).json({
      message: `Welcome back, ${adminUser.name}!`,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Refresh Token
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken)
      return res.status(401).json({ message: "No token provided" });

    // Blacklist or not allowed
    const isExist = await tokens.findOne({ token: refreshToken });
    if (!isExist) return res.status(403).json({ message: "Invalid token" });

    // Verify Token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, user) => {
      if (err) return res.status(403).json({ message: "Token expired" });

      const { exp, iat, ...userData } = user;

      const newAccessToken = createAccessToken(userData);
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
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
};
