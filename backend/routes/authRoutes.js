const express = require("express");
const router = express.Router();

const {
  loginUser,
  sendOtp,
  verifyOtp,
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
} = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);

router.post("/forgot-password", sendResetOtp);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
