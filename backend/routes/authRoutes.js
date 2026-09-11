const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    verifyOTP,
    forgotPassword,
    resetPassword,
    getUsers
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const { admin } = require("../middleware/adminMiddleware");
const authRateLimit = require("../middleware/authRateLimit");


// Register user
router.post("/register", authRateLimit, registerUser);


// Login user
router.post("/login", authRateLimit, loginUser);


// Verify OTP
router.post("/verify-email", authRateLimit, verifyOTP);

// Password reset
router.post("/forgot-password", authRateLimit, forgotPassword);
router.post("/reset-password/:token", authRateLimit, resetPassword);


// Get all users
router.get("/users", protect, admin, getUsers);


module.exports = router;